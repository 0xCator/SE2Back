const db = require("../models");

exports.login = async (req, res) => {
    try {
        const currentUsername = req.params.username;
        const currentPassword = req.params.password;

        const result = await db.users.findOne(
            {username: currentUsername, 
            password: currentPassword},
            '_id userType');
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.notificationsToken = async (req, res) => {
    try {
        const username = req.params.username;
        const token = req.params.token;
        const options = {new: true};
        const result = await db.users.findOneAndUpdate(
            {username: username},
            {$set: {notificationsToken: token}},
            options);
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

function sendNotification(to, title, body) {
    const key = "AAAAjkN85Zc:APA91bHdfNQYLTIRTSwe_SlBZd4MTr9WP6TGBdp98PuQh8oa8z_CgnXYQkShWU1EOjxNOBtxtwHXIeMH6xo8UNvs06IOZaGc4uKGmeD7Zfi7eQ8w-Bc54qqlcImYGu8U-f09uQ4HEG6z";
    const notification = { 
        title: title,
        body: body,
        click_action: 'http://localhost:4200/user/patient'
    };
    fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
        Authorization: 'key='+ key,
        'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            notification: notification,
            to: to,
        }),
    }).then(response => response.json())
    .catch(error => {
        console.log("Error sending notification");
    })

}

exports.notify = async function notify(username , title, body) {
    try {

        const notification = {
            title: title,
            body: body
        }
        const result = await db.users.findOne(
            {username: username},
            'notificationsToken');

        if (result) {
            await db.users.findOneAndUpdate(
                {username: username},
                {$push: {notifications: notification}}
            );
            sendNotification(result.notificationsToken, title, body);
        }
    }catch (error) {
    }
}

exports.sendNotification = async (req, res) => {
    try {
        const username = req.body.username;

        const title = req.body.title;
        const body = req.body.body;
        const notification = {
            title: title,
            body: body 
        }
        const result = await db.users.findOne(
            {username: username},
            'notificationsToken');

        if (result) {
            await db.users.findOneAndUpdate(
                {username: username},
                {$push: {notifications: notification}}
            );
            sendNotification(result.notificationsToken, title, body);
        }
        res.json(result);
    }catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

function UnpairBracelet(braceletID) {
    const b =JSON.parse(`{"braceletId": "${braceletID}"}`);

    fetch('http://localhost:1337/api/unpair/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(b),
    }).then(response => response)
}

exports.pair = async (req, res) => {
    try {
        const currentToken = req.body.token;
        const braceletID = req.body.braceletID;
        const options = {new: true};
        const result = await db.users.findOne(
            {'patientData.token': currentToken},
            '_id'
        );
        
        if (result) {
            const currentBracelet = await db.users.findOne(result._id, 'patientData.pairedBracelet');
            if (currentBracelet.patientData.pairedBracelet !== "-1" && currentBracelet.patientData.pairedBracelet !== braceletID) {
                UnpairBracelet(currentBracelet.patientData.pairedBracelet);
            }
            await db.users.findByIdAndUpdate(result._id, 
                {$set: {'patientData.pairedBracelet': braceletID}}, 
                options);
        }else{
            UnpairBracelet(braceletID);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

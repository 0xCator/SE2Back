const db = require("../models");
require('dotenv').config({path: '../../.env'});
const { EmailClient } = require("@azure/communication-email");


const connectionString = process.env.CONN_STR;
const emailClient = new EmailClient(connectionString);

exports.sendEmail = async function sendEmail(email, subject, text) {
    const POLLER_WAIT_TIME = 10
    try {
        const message = {
            senderAddress:process.env.EMAIL,
            content: {
                subject: subject,
                plainText: text,
            },
            recipients: {
                to: [
                    {
                        address: email,
                        displayName: "Customer Name",
                    },
                ],
            },
        };

        const poller = await emailClient.beginSend(message);

        if (!poller.getOperationState().isStarted) {
            throw "Poller was not started."
        }

        let timeElapsed = 0;
        while(!poller.isDone()) {
            poller.poll();

            await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
            timeElapsed += 10;

            if(timeElapsed > 18 * POLLER_WAIT_TIME) {
                throw "Polling timed out.";
            }
        }

    } catch (e) {
        console.log(e);
    }
}

exports.email = async (req, res) => {
    try {
        const email = req.body.email;
        const subject = req.body.subject;
        const text = req.body.text;
        this.sendEmail(email, subject, text)
        res.json({message: "Email sent"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

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
    const key = process.env.API_KEY;
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
        console.log(error);
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

exports.UnpairBracelet = async function UnpairBracelet(braceletID) {
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
                this.UnpairBracelet(currentBracelet.patientData.pairedBracelet);
            }
            await db.users.findByIdAndUpdate(result._id, 
                {$set: {'patientData.pairedBracelet': braceletID}}, 
                options);
        }else{
            this.UnpairBracelet(braceletID);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

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
        const currentBracelet = await db.users.findOne(result._id, 'patientData.pairedBracelet');
        if (currentBracelet.patientData.pairedBracelet !== "-1" && currentBracelet.patientData.pairedBracelet !== braceletID) {
            UnpairBracelet(currentBracelet.patientData.pairedBracelet);
        }
        if (result) {
            await db.users.findByIdAndUpdate(result._id, 
                {$set: {'patientData.pairedBracelet': braceletID}}, 
                options);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

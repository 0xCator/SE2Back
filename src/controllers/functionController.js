const db = require("../models");

exports.login = async (req, res) => {
    try {
        const currentUsername = req.body.username;
        const currentPassword = req.body.password;

        const result = await db.users.findOne(
            {username: currentUsername, 
            password: currentPassword},
            '_id userType');
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

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
            await db.users.findByIdAndUpdate(result._id, 
                {$set: {'patientData.pairedBracelet': braceletID}}, 
                options);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
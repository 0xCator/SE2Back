const db = require('../models');
const Users = db.users;

exports.getRelative= async function getRelativePatients(username) {
    try {
        const result = await Users.findOne({username: username}, 'patientData.relatives');
        return result.patientData.relatives;
    } catch (error) {
        return null;
    }
}

exports.findAll = async (req,res) => {
    try {
        const data = await Users.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

    exports.findAllPatients = async (req,res) => {
        try {
            const data = await Users.find({userType: 2});
            res.json(data);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

exports.getUsername = async function getUsername(userID) {
    try {
        const data = await Users.findById(userID, 'username');
        return data.username;
    } catch (error) {
        return null;
    }
}

exports.findUser = async function (username){
    try {
        const data = await Users.findOne({username: username});
        return data;
    } catch (error) {
        return null;
    }
}

exports.findOne = async (req,res) => {
    try {
        const data = await Users.findById(req.params.userID);
        res.json(data)
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

exports.findByUsername = async (req, res) => {
    try {
        const data = await Users.findOne({username : req.params.username});
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.create = async (req,res) => {
    const entryData = {};
    for (const key of Object.keys(req.body)){
        if (req.body[key] !== '') {
            entryData[key] = req.body[key];
        }
    }
    const data = new Users(entryData);

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.updateMedHistory = async (req,res) => {
    try {
        const newMedicalHistory = req.body.medicalHistory;
        const id = req.params.userID;
        const options = {new: true};
        const update = {}

        const result = await Users.findByIdAndUpdate(id, {$set: {
            'patientData.medicalHistory': newMedicalHistory}}, options);
        
            res.send(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.updateReadings = async (req,res) => {
    try {
        const newReadings = {
            heartRate: req.body.heartRate,
            bloodPressure: req.body.bloodPressure,
            location: req.body.location
        }

        const newState = req.body.state;
        const id = req.params.userID;
        const options = {new: true};

        const result = await Users.findByIdAndUpdate(id,
            {$set: {'patientData.patientReadings':newReadings,
            'patientData.state':newState}},
             options);
        
            res.send(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.addRelative = async (req,res) => {
    try {
        const relativeUsername = req.body.relativeUsername;
        const id = req.params.userID;
        const options = {new: true};

        const result = await Users.findByIdAndUpdate(id, 
            {$push: {'patientData.relatives':relativeUsername}},
             options);

        const res2 = await Users.findOneAndUpdate({username: relativeUsername},
            {$push: {'relativeData.assignedPatients': id}}, options);
        
        res.send(res2);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.removeRelative = async (req,res) => {
    try {
        const relativeUsername = req.body.relativeUsername;
        const id = req.params.userID;
        const options = {new: true};

        const result = await Users.findByIdAndUpdate(id, 
            {$pull: {'patientData.relatives':relativeUsername}},
             options);

        const res2 = await Users.findOneAndUpdate({username: relativeUsername},
        {$pull: {'relativeData.assignedPatients': id}}, options);
        
        res.send(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.delete = async (req,res) => {
    try {
        const id = req.params.userID;
        const result = await Users.findByIdAndDelete(id);
        res.send('Deleted user');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

const db = require('../models');
const Users = db.users;

exports.findAll = async (req,res) => {
    try {
        const data = await Users.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
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

exports.addRelative = async (req,res) => {
    try {
        const relativeUsername = req.body.relativeUsername;
        const id = req.params.userID;
        const options = {new: true};

        const result = await Users.findByIdAndUpdate(id, 
            {$push: {'patientData.relatives':relativeUsername}},
             options);
        
        res.send(result);
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
        
        res.send(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.addPatient = async (req,res) => {
    try {
        const patientUsername = req.body.patientUsername;
        const id = req.params.userID;
        const options = {new: true};

        const result = await Users.findByIdAndUpdate(id, 
            {$push: {'relativeData.relatives':patientUsername}},
             options);
        
        res.send(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.removePatient = async (req,res) => {
    try {
        const patientUsername = req.body.patientUsername;
        const id = req.params.userID;
        const options = {new: true};

        const result = await Users.findByIdAndUpdate(id, 
            {$pull: {'relativeData.relatives':patientUsername}},
             options);
        
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
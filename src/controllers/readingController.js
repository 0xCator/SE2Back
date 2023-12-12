const db = require("../models");
const Reading = db.readings;

exports.findAll = async (req,res) => {
    try {
        const data = await Reading.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.findLatest = async (req,res) => {
    try {
        const data = await Reading.find({userID: req.params.userID}).sort({createdAt: -1});
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.findSpecific = async (req,res) => {
    try {
        const data = await Reading.find({userID: req.params.userID}).sort({createdAt: 1});
        res.json(data)
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

exports.create = async (req,res) => {
    const data = new Reading({
        userID: req.body.userID,
        heartRate: req.body.heartRate,
        bloodPressure: req.body.bloodPressure,
        location: req.body.location
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.delete = async (req,res) => {
    try {
        const id = req.params.readingID;
        const result = await Reading.findByIdAndDelete(id);
        res.send('Deleted reading');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteAll = async (req,res) => {
    try {
        const result = await Reading.deleteMany({});
        res.send('deleted all');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}
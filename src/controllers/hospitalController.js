const db = require("../models");
const Hospital = db.hospitals;

exports.findAll = async (req,res) => {
    try {
        const data = await Hospital.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.findOne = async (req,res) => {
    try {
        const data = await Hospital.findById(req.params.hospitalID);
        res.json(data)
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

exports.create = async (req,res) => {
    const data = new Hospital({
        name: req.body.name,
        longitude: req.body.longitude,
        latitude: req.body.latitude
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
        const id = req.params.hospitalID;
        const result = await Hospital.findByIdAndDelete(id);
        res.send('Deleted hospital');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}
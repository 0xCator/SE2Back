const db = require("../models");
const Request = db.requests;

exports.findAll = async (req,res) => {
    try {
        const data = await Request.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.findOne = async (req,res) => {
    try {
        const data = await Request.findById(req.params.reqID);
        res.json(data)
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

exports.create = async (req,res) => {
    const data = new Request({
        userID: req.body.userID,
        requestType: req.body.requestType,
        location: req.body.location,
        carID: req.body.carID
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
        const id = req.params.reqID;
        const result = await Request.findByIdAndDelete(id);
        res.send('Deleted hospital');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}
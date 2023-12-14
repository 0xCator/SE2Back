const db = require("../models");
const Reading = db.readings;
const functionController = require("./functionController");
const userController = require("./userController");


const requestController = require("./requestController");

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
        location: req.body.location,
        readingState: req.body.state
    })
    const username = await userController.getUsername(req.body.userID);
        
    const relatives = await userController.getRelative(username);
    if(req.body.state === 2){
        const err = requestController.sendRequest(req.body.userID, req.body.location);
        if(!err){
            functionController.notify(username, "Request for Ambulance", "Ambulance is on the way");
            for (let i = 0; i < relatives.length; i++) {
                functionController.notify(relatives[i], "Request for Ambulance", `Emergency your relative ${username} is dying`);
            }
        }else{
            functionController.notify(username, "Rest in peace", "No Ambulance Available");
            for (let i = 0; i < relatives.length; i++) {
                functionController.notify(relatives[i], "Nothing we can do", `Good luck in afterlife ${username}`);
            }
        }
    
    }else if(req.body.state === 1){
        functionController.notify(username, "Be careful!", "Your readings were recently unstable!");
        for (let i = 0; i < relatives.length; i++) {
            functionController.notify(relatives[i], "Be careful!", `Your relative ${username}'s readings were recently unstable!`);
        }
    }
        
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
        const result = await Request.deleteMany({});
        res.send('deleted all');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

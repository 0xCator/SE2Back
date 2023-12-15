const db = require("../models");
const Request = db.requests;
const carController = require("./carController");
const userController = require("./userController");
const functionController = require("./functionController");

exports.deleteLastRequest = async function deleteLastRequest(carID) {
    try {
        const data = await Request.findOneAndDelete({carID: carID}).sort({createdAt: -1});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}
exports.sendRequest = async function sendRequest(userId, location ) {
    const car  = await carController.getCar();
    username = await userController.getUsername(userId);
    //check if uer have request or not 
    const r = await Request.findOne({userID: userId})
    if(r != null){
        user  = await userController.findUser(username);
        functionController.notify(username, "Request for Ambulance", "You already have a request");
        await functionController.sendEmail(user.userInfo.email, "Request for Ambulance", "You already have a request");
        return 1;
    }
    const relatives = await userController.getRelative(username);
    if(car == null){
        user  = await userController.findUser(username);
        functionController.notify(username, "Request for Ambulance", "Ambulance is on the way");
        await functionController.sendEmail(user.userInfo.email, "Request for Ambulance", "Ambulance is on the way");
        for (let i = 0; i < relatives.length; i++) {
            rel= await userController.findUser(relatives[i]);
            functionController.notify(relatives[i], "Request for Ambulance", `Emergency your relative ${username} is dying`);
            await functionController.sendEmail(rel.userInfo.email, "Request for Ambulance", `Emergency your relative ${username} is dying`);
        }
        return -1;
    }
    carController.updateCarStatus(car, 1);
    const data = new Request({
        userID: userId, 
        requestType:1 , 
        location: location,
        carID: car, 
    });

    try {
        const dataToSave = await data.save();
        user  = await userController.findUser(username);
        functionController.notify(username, "Request for Ambulance", "Ambulance is on the way");
        await functionController.sendEmail(user.userInfo.email, "Request for Ambulance", "Ambulance is on the way");
        for (let i = 0; i < relatives.length; i++) {
            rel= await userController.findUser(relatives[i]);
            functionController.notify(relatives[i], "Request for Ambulance", `Emergency your relative ${username} is dying`);
            await functionController.sendEmail(rel.userInfo.email, "Request for Ambulance", `Emergency your relative ${username} is dying`);
        }
        return 0;
    } catch (error) {
    }
}
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
    const err = this.sendRequest(req.body.userID, req.body.location);
    if(err === -1){
        res.status(500).json({message: "No car available"});
    }else if(err === 1){
        res.status(500).json({message: "User already have a request"});
    }else{
        res.status(200).json({message: "Request sent"});
    }
}

exports.deleteAll = async (req,res) => {
    try {
        const result = await Request.deleteMany();
        res.send('Deleted all requests');
    } catch(error) {
        res.status(500).json({message: error.message});
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

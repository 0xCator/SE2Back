const db = require("../models");
const Request = db.requests;
const carController = require("./carController");
const userController = require("./userController");
const functionController = require("./functionController");

function stopBracelet(braceletID) {
    const b =JSON.parse(`{"braceletId": "${braceletID}"}`);

    fetch('http://localhost:1337/api/stop/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(b),
    }).then(response => response).catch(error => console.error('Error:', error));
}
exports.deleteLastRequest = async function deleteLastRequest(carID) {
    try {
        const data = await Request.findOneAndDelete({carID: carID}).sort({createdAt: -1});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}
exports.sendRequest = async function sendRequest(userId, location, nearestHospital,reqType) {
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
        functionController.notify(username, "Rest in peace", "No Ambulance Available");
        await functionController.sendEmail(user.userInfo.email, "Rest in peace", "No Ambulance Available");
        for (let i = 0; i < relatives.length; i++) {
            rel= await userController.findUser(relatives[i]);
            functionController.notify(relatives[i], "Nothing we can do", `Good luck in afterlife ${username}`);
            await functionController.sendEmail(rel.userInfo.email, "Nothing we can do", `Good luck in afterlife ${username}`);
        }

        return -1;
    }
    carController.updateCarStatus(car, 1,location, nearestHospital);
    const data = new Request({
        userID: userId, 
        requestType: reqType , 
        location: location,
        carID: car, 
        hospital: {
            name: nearestHospital.name,
            location: {
                longitude: nearestHospital.longitude,
                latitude: nearestHospital.latitude
            }
        }
    });

    try {
        const dataToSave = await data.save();
        user  = await userController.findUser(username);
        stopBracelet(user.patientData.pairedBracelet);
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
    const err = this.sendRequest(req.body.userID, req.body.location, req.body.nearestHospital,0);
    if(err === -1){
        res.status(500).json({message: "No car available"});
    }else if(err === 1){
        res.status(500).json({message: "User already have a request"});
    }else{
        res.status(200).json({message: "Request sent"});
    }
}

exports.getReqByUserId = async (userID) => {
    try {
        const data = await Request.findOne({userID: userID});
        if(data == null){
            return null
        }
        return data._id;
    } catch(error) {
        return null;
    }
}

exports.getReqByCarId = async (carID) => {
    try {
        const data = await Request.findOne({carID: carID});
        if(date == null){
            return null;
        }
        return data._id;
    } catch (error) {
        
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

exports.deleteReq = async (reqID) => {
    try {
        const reqToDelete = await Request.findById(reqID);
        // get car id
        const carID = reqToDelete.carID;

        //change car status 
        carController.updateCarStatus(carID, 0, reqToDelete.location);
        //delete request 
        const result = await Request.findByIdAndDelete(reqID);
    } catch(error) {
    }
}

exports.delete = async (req,res) => {
    try {
        const id = req.params.reqID;
        this.deleteReq(id);
        res.send({message:'Deleted request'});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

const db = require("../models");
const Reading = db.readings;
const Car = db.cars;
const request = db.requests;

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

function getCar(){
    try {
        const data = Car.find();
        for (let i = 0; i < data.length; i++) {
            if(data[i].carStatus === 0){
                return data[i]._id;
            }
        }

        return null;
    }catch(error) {
        res.status(500).json({message: error.message});
    }
}

function  updateCarStatus(carID, status) {
    try {
        const update = {};
        const options = {new: true};
        update['carStatus'] = status;
        const result = Car.findByIdAndUpdate(carID, {$set: update}, options);
        return result;
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}

function sendRequest(userId, location ) {
    const car  =getCar();
    updateCarStatus(car, 1);
    const data = new Request({
        userID: userId, 
        requestType:1 , 
        location: location,
        carID: car, 
    });

    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
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
        
    if(req.body.state === 2){
        sendRequest(req.body.userID, req.body.location);
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
        const result = await Reading.deleteMany({});
        res.send('deleted all');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

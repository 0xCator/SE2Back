const db = require("../models");
const Car = db.cars;
const request = db.requests;

function getLastRequest(userId) {
    try {
        const data = request.find({userID: userId}).sort({createdAt: -1});
        return data[0];
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

exports.idle = async (req, res) => {
    try {
        const id = req.params.userID;
        const lastRequest = getLastRequest(id);
        const carID = lastRequest.carID;
        const update = {};
        const options = {new: true};
        update['carStatus'] = 0;
        result = await Car.findOneAndUpdate(carID, {$set: update}, options);
        res.send(result);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}

exports.findAll = async (req, res) => {
    try {
        const data = await Car.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.findOne = async (req, res) => {
    try{
        const data = await Car.findById(req.params.carID);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.create = async (req, res) => {
    const data = new Car({
        driverName: req.body.driverName,
        licensePlate: req.body.licensePlate,
        carStatus: 0,
        currentLocation: req.body.currentLocation,
        destination: {
            longitude: req.body.currentLocation.longitude,
            latitude: req.body.currentLocation.latitude
        }
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.update = async (req, res) => {
    try {
        const update = {};
        const id = req.params.carID;
        const options = {new: true};
        //Create an object out of the selected update fields
        for (const key of Object.keys(req.body)){
            if (req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }

        const result = await Car.findByIdAndUpdate(id, {$set: update}, options);

        res.send(result);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }

};

exports.delete = async (req, res) => {
    try {
        const id = req.params.carID;
        const result = await Car.findByIdAndDelete(id);
        res.send('Deleted car');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

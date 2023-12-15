const db = require("../models");
const Car = db.cars;
const requestController = require("./requestController");


exports.getCar = async function getCar() {
    try {
        const data = await Car.find();

        for (let i = 0; i < data.length; i++) {
            if(data[i].carStatus === 0){
                return data[i]._id.toString();
            }
        }
        
        return null;
    }catch(error) {
        res.status(400).json({ message: error.message });
    }
}
exports.updateCarDestination = async function updateCarDestination(carID, location) {
    try{
        const update = {destination: location};
        const options = {new: true};
        const result = await Car.findByIdAndUpdate(carID, {$set: update}, options);
        return result;
    }
    catch(error){
    }
}
exports.updateCarLocation = async function updateCarLocation(carID, location) {
    try{
        const update = {currentLocation: location};
        const options = {new: true};
        const result = await Car.findByIdAndUpdate(carID, {$set: update}, options);
        return result;
    }
    catch(error){
    }
}

exports.updateCarStatus = async function updateCarStatus(carID, status, location) {
    try {
        const update = {carStatus: status};
        const options = {new: true};
        const result = await Car.findByIdAndUpdate(carID, {$set: update}, options);
        await updateCarDestination(carID, location);
        if(status !==0){
            setTimeout(async () => {
                const update = {carStatus: 0};
                await Car.findByIdAndUpdate(carID, {$set: update}, options);
                await requestController.deleteLastRequest(carID);
                await updateCarLocation(carID, location);
            }, 5 * 1000 * 60); 
        }

        return result;
    } catch(error) {
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
        // get car request if exists
        const reqID = await requestController.getReqByCarId(id);
        // delete request 
        if(reqID){
            await requestController.deleteReq(reqID);
        }
        // delete car 
        const result = await Car.findByIdAndDelete(id);
        res.send('Deleted car');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

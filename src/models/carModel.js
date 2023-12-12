const mongoose = require('mongoose');

const carModel = new mongoose.Schema({
    driverName: {
        required: true,
        type: String
    },
    licensePlate: {
        required: true,
        type: String
    },
    carStatus: {
        required: true,
        type: Number,
        default: 0 //0: idle, 1: moving
    },
    currentLocation: {
        longitude: {
            required: true,
            type: Number,
        },
        latitude: {
            required: true,
            type: Number,
        }
    },
    destination: {
        longitude: {
            type: Number,
        },
        latitude: {
            type: Number,
        }
    }
}, {timestamps: true});

module.exports = mongoose.model("car",carModel);
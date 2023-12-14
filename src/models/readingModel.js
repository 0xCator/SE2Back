const mongoose = require('mongoose');

const readingModel = new mongoose.Schema({
    userID: {
        required: true,
        type: String,
    },
    readingState: {
        required: true,
        type: Number,
    },
    heartRate: {
        required: true,
        type: Number,
    },
    bloodPressure: {
        systolic: {
            required: true,
            type: Number,
        },
        diastolic: {
            required: true,
            type: Number,
        }
    },
    location: {
        longitude: {
            required: true,
            type: Number,
        },
        latitude: {
            required: true,
            type: Number,
        },
    }
}, {timestamps: true});

module.exports = mongoose.model("reading",readingModel);

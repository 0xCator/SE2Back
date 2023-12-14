const mongoose = require('mongoose');

const requestModel = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    requestType: {
        type: Number,
        required: true
    },
    location: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    }
    ,
    carID: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("request",requestModel);

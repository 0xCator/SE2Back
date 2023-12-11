const mongoose = require('mongoose');

const hospitalModel = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    longitude: {
        required: true,
        type: Number
    },
    latitude: {
        required: true,
        type: Number
    }
});

module.exports = mongoose.model("hospital",hospitalModel);
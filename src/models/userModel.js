const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    //Shared across all users
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    userType: {
        required: true,
        type: Number //0: admin, 1: ambulance manager, 2: user
    },
    //Specific to patient/relative
    userInfo: {
        fullName: {
            type: String
        },
        age: {
            type: Number
        },
        gender: {
            type: String
        },
        email: {
            type: String
        }
    },
    patientData: {
        state: {
            type: Number, //0: normal, 1: warning, 2: critical
            default: 0
        },
        token: {
            type: String
        },
        pairedBracelet: {
            type: String
        },
        medicalHistory: {
            type: String //Must be initiated on creation
        },
        relatives: [{
            type: String
        }]
    },
    relativeData: {
        assignedPatients: [{
            type: String
        }]
    }
}, {timestamps: true});

module.exports = mongoose.model("user",userModel);
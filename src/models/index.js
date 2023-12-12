//Handles the basic database connection
require('dotenv').config();
const mongoString ="mongodb+srv://nexus:pass@cluster0.midobxk.mongodb.net/";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = mongoString;

//Models to import
db.hospitals = require('./hospitalModel');
db.requests = require('./requestModel');
db.readings = require('./readingModel');
db.cars = require('./carModel');
db.users = require('./userModel');

module.exports = db;

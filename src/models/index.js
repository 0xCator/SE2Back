//Handles the basic database connection
require('dotenv').config();
const mongoString = process.env.DATABASE_URL;

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = mongoString;

//Models to import
db.hospitals = require('./hospitalModel');

module.exports = db;
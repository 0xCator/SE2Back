const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Routers importing
const userRouter = require('./src/routes/userRoutes');
const readingRouter = require('./src/routes/readingRoutes');
const carRouter = require('./src/routes/carRoutes');
const hospitalRouter = require('./src/routes/hospitalRoutes');
const requestRouter = require('./src/routes/requestRoutes');
const functionRouter = require('./src/routes/functionRoutes');

var corsOptions = {
    origin: "http://localhost:4200"
};

const app = express();
const mongoose = require('mongoose');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Database connection
const db = require("./src/models");
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//Routers
app.use('/api/users', userRouter);
app.use('/api/readings', readingRouter);
app.use('/api/cars', carRouter);
app.use('/api/hospitals', hospitalRouter);
app.use('/api/requests', requestRouter);
app.use('/api/functions', functionRouter);

app.listen(3000, () => { 
    console.log('Server listening on port 3000'); 
});
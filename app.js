"use strict";

const { mongoose } = require("mongoose");
const uri =
  "mongodb+srv://demo-user:z4GiMpm81E6YvVqa@ssd-0.cfyhveg.mongodb.net/nodeassignment3?retryWrites=true&w=majority";

// set up default mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// store a reference to the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Requirements
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const expressFileUpload = require("express-fileupload")
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load Routers
const indexRouter = require("./routers/indexRouter");
const profilesRouter = require("./routers/profilesRouter");
const apiRouter = require("./routers/apiRouter");

//Create App Server & Port
const port = process.env.PORT || 3000;
const app = express();


// Allow cross origin requests from any port on local machine
app.use(cors({ origin: [/127.0.0.1*/, /localhost*/] }));

//Use Logger, Layouts, & Body Parser
app.use(logger("dev"));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(expressFileUpload())
app.set("layout", "./layouts/full-width");

//Allow Access to Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Set Router Paths
app.use(indexRouter);
app.use("/profiles", profilesRouter);
app.use("/api", apiRouter);

//Set Error Message for Invalid URL
app.all("/*", (req, res) => {
    res.status(404).send("File Not Found");
});

//Activate Server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
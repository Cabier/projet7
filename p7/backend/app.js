const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./routes/User");
const path = require("path");
const uploadRoute = require("./routes/Upload");


const bodyParserErrorHandler = require('express-body-parser-error-handler')
const app = express();
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Parse le body des requetes en json
app.use(bodyParser.json());
// Sécurisation des headers
//app.use(helmet());
app.use("/user", userRoute);
app.use("/upload",uploadRoute);
//app.use("/auth",userRoute);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(bodyParserErrorHandler());
module.exports = app;

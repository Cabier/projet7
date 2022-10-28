require("dotenv").config();
const express = require("express");
const bodyParserErrorHandler = require("express-body-parser-error-handler");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const userRoute = require("./controllers/User");
const uploadRoute = require("./controllers/Upload");
const commentRoute = require("./controllers/Comment");

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParserErrorHandler());
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/upload", uploadRoute);
app.use("/comment", commentRoute);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(helmet({ crossOriginEmbedderPolicy: false }));

module.exports = app;

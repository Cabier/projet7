const mysql = require('mysql2');
require("dotenv/config");
//const connection = mysql.createConnection({//fonction create connection pour se connecter à sa base de données
//console.log(process.env.DB_HOST,"++++++++++++++++++++++++++++++++++++++++++")
const connexion = mysql.createConnection({
  
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});
//console.log("connection",connexion)
module.exports = connexion;
//module.exports = connection;// va exporter ma connection donc je vais pouvoir l'importer dans app

//vérifie les informations d'authentification envoy par le client
const jwt = require("jsonwebtoken");
//on crée le middlrware qui prendra le token envoyé par le client
//et permettra à notre différente route d'en exploité les différentes informations tel que le userid
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.id;
    const admin = decodedToken.admin;
    req.auth = { id, admin } 
   
    console.log("req",req.auth )
    if (req.body.userId && req.body.id !== id) {
      throw "Invalid ID";
    } else {
      next();
    }
  } catch (e) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
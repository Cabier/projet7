const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connexion = require("../database");
const auth = require("../middleware/Auth");
require("dotenv").config();
//router .get return le profil de l'utilisateur
router.get("/profil", auth, async (req, res) => {
  connexion.query(
    "SELECT * FROM users WHERE username = ?",
    [req.auth.username],
    function (err, results) {
      if (err || !results.length) {
        return res.status(404);
      }
      return res.status(200).json(results[0]);
    }
  );
});

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const firstname = req.body.firstName;
  const email = req.body.email;
  const password = req.body.password;
  const hashPassword = await bcrypt.hash(password, 10);
  console.log("hash", hashPassword);
  const isAdmin = req.body.isAdmin;
  connexion.query("SELECT * FROM users;", username, (err, results) => {
    if (err) {
      //console.log(err)
      res.status(404).json({
        message: "Error",
        data: err,
      });

      res.status(200).json({ message: "token", token });
    }

    connexion.query(
      "INSERT INTO users (id,username,firstname,email, hashPassword,isAdmin) VALUES (?,?,?,?,?,?);",
      [results.length, username, firstname, email, hashPassword, isAdmin],
      (err, user) => {
        if (err) {
          res.status(404).json({
            message: "Error",
            data: err,
          });
        }
        res.status(200).json({
          message: "succes",
          data: user,
        });
      }
    );
  });
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connexion.query(
    "SELECT * FROM users WHERE username = ?",
    username,
    (error, results) => {
      if (results.length > 0) {
        bcrypt.compare(
          password,
          results[0].hashPassword,
          function (err, result) {
            if (err) return res.status(500).send({ message: "Error server" });
            if (!result) {
              return res.status(404).json({
                loggedIn: false,
                message: "Invalid Password",
              });
            } else
              return res.status(200).json({
                loggedIn: true,
                message: "Login Successful",
                username,

                token: jwt.sign(
                  { username, admin: results[0].isAdmin },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "24h",
                  }
                ),
              });
          }
        );
      } else {
        return res
          .status(401)
          .send({ loggedIn: false, message: "User doesn't exist", error });
      }
    }
  );
});

router.delete("/desactivateAccount/:id", auth, (req, res) => {
  const id = req.params.id;
  console.log("identifiant", id);
  const sql = "DELETE FROM users WHERE username =? ";
  const sqlParams = [id];
  connexion.query(sql, sqlParams, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    }
    if (req.params.id !== req.auth.admin) {
      res
        .status(401)
        .json({ message: "seul l'administrateur peut supprimer le post" });
    } else {
      res.status(200).json({ message: "Utilisateur supprimé" });
    }
  });
});

module.exports = router;

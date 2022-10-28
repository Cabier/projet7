const express = require("express");
const router = express.Router();
const connexion = require("../database");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/Auth");
// GESTION DES FICHIERS ENTRANTS DANS REQUETES
//diskstorage configure le chemin et le nom de fichier pour les fichiers entrants
var storage = multer.diskStorage({
  //destination indique à multer d'nregistrer les fichiers dans dossier images
  destination: (req, file, cb) => {
    cb(null, "images/uploads");
  },
  //la fonction filename indique à multer d'utiliser le nom d'origine
  filename: (req, file, cb) => {
    const filename = file.originalname.trim();
    cb(null, filename);
  },
});
//upload montre que multer est complètement configuré
var upload = multer({ storage: storage });
//-------------POSTER UN COMMENTAIRE
//single()  crée un middleware qui capture les fichiers d'un certain type (passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré.
router.post("/", upload.single("image"), auth, (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageTitre = req.body.imageTitre;
  const author = req.body.author;
  const dateCreation = req.body.dateCreation;

  connexion.query("SELECT * FROM uploads;", title, (err, results) => {
    if (err) {
      //console.log(err)
      res.status(404).json({
        message: "Error",
        data: err,
      });
      return;
    }
    // ENREGISTER DONNEES DANS BDD SQL
    connexion.query(
      //avec insert into on ajoute un objet à notre table sql(entre parenthèse c'est la liste des colonnes qu'on veut ajouter)
      "INSERT INTO uploads ( title, description, image, author , dateCreation) VALUES (  ? , ? , ?, ? , ?);",
      [title, description, imageTitre, author, dateCreation],
      (err, result) => {
        if (err) {
          console.log("there");
          res.status(404).json({
            message: "Error",
            data: err,
          });
          return;
        }
        res.status(200).json({
          message: "succes",
          data: result,
        });
      }
    );
  });
});
//------------PERMET DE GERER LES IMAGES-----------//
router.get("/Images", function (req, res, next) {
  var options = {
    //path resolve permet de former un chemin de fichier absolu
    //process.cwd() :renvoie le nom du répertoire de travail courant.
    root: path.resolve(process.cwd() + "/images/uploads/"),
  };
  var fileName = req.query.nameImg;

  res.status(200).sendFile(fileName, options, function (err) {
    if (err) next(err);
  });
});
//------------AFFICHER LES UPLOADS--------------
router.get("/", auth, (req, res) => {
  const token = jwt;
  connexion.query("SELECT * FROM uploads", (err, results) => {
    //select permet de récupérer les données d'une table
    if (err) {
      console.log(err);
    } else if (!token) {
      // navigate("/login", { replace: true });
    }
    res.status(200).json({
      data: results,
    });
  });
});
// afficher le profil de l'utilisateur
router.get("/byUser/:username", auth, (req, res) => {
  const userName = req.body.username;

  connexion.query(
    "SELECT * FROM uploads WHERE author = ?;",
    userName,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});
//------------SUPPRIMER UN POST---------------------
router.delete("/delete/:id", auth, (req, res) => {
  const author = req.body.author;
  connexion.query(
    "SELECT * FROM uploads WHERE id = ?",
    [req.params.id],
    function (err, results) {
      if (err || !results.length) {
        return res.status(404).send("error");
      }
      const upload = results[0];
      //verification si admin ou user qui a publié le post
      if (req.auth.admin || upload.author === req.auth.username) {
        connexion.query(
          "DELETE FROM uploads WHERE id =?;",
          [req.params.id],
          (err, results) => {
            if (err) {
              res.status(404).json({ err });
              throw err;
            }
            res.status(200).json(results);
          }
        );
      } else {
        return res.status(403).send("Forbidden");
      }
    }
  );
});
//------------- MODIFIER UN POST------------------
router.put("/modifyPost/:id", auth, (req, res) => {
  const description = req.body.description;

  connexion.query(
    "SELECT * FROM uploads WHERE id = ?",
    [req.params.id],
    function (err, results) {
      if (err || !results.length) {
        return res.status(404).send("error");
      }
      const upload = results[0];

      if (req.auth.admin || upload.author === req.auth.username) {
        connexion.query(
          //update met à jour la table et set la colonne et la valeur à modifier
          "UPDATE uploads SET description =? WHERE id =?;",
          [description, req.params.id],
          (err, results) => {
            if (err) {
              res.status(404).json({ err });
              throw err;
            }

            res.status(200).json(results);
          }
        );
      } else {
        return res.status(403).send("Forbidden");
      }
    }
  );
});
//---------- GESTIONS DES LIKES------------
router.patch("/like", auth, (req, res) => {
  const { postId, userLiking } = req.body;

  const sqlSelect = `SELECT post_Id , userLiking FROM likes WHERE likes.post_Id = ${postId} AND likes.userLiking= '${userLiking}'`;
  const selectPost = `SELECT * from uploads WHERE id = ${postId}`;

  connexion.query(selectPost, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json({ err });
    }

    const post = result[0];

    let likes = post.likes;

    connexion.query(sqlSelect, (err, result) => {
      if (err) {
        console.log(err);
        res.status(404).json({ err });
        throw err;
      }

      if (result.length === 0) {
        likes = likes + 1;
        const sqlInsert = `INSERT INTO likes ( post_Id,userLiking) VALUES ('${postId}', "${userLiking}")`;

        connexion.query(sqlInsert, (err, result) => {
          if (err) {
            console.log(err);
            res.status(404).json({ err });
            throw err;
          }
          //res.status(200).json(result);
          console.log(res);
        });
        //c'est ici que je dois ajouter le like refaire un patch avec like
      } else {
        likes = likes - 1;
        const sqlDelete = `DELETE FROM likes WHERE likes.post_Id = ${postId} AND  likes.userLiking = "${userLiking}"`;
        console.log("sqlDelete", sqlDelete);
        connexion.query(sqlDelete, (err, result) => {
          if (err) {
            console.log(err);
            res.status(404).json(err);
            throw err;
          }
          // res.status(200).json(result);
        });
      }

      const modifyPost = `UPDATE uploads SET likes = ${likes} WHERE id = ${postId}`;

      connexion.query(modifyPost, (err, result) => {
        if (err) {
          console.log(err);
          res.status(404).json({ err });
        }

        res.status(200).json({ message: "likes ok" });
      });
    });
  });
});

module.exports = router;

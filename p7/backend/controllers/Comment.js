const express = require("express");
const router = express.Router();
const connexion = require("../database");
const auth = require("../middleware/Auth")
require("dotenv").config();

router.post("/createComment", auth, (req, res) => {
  const { description, post_id, author, username, firstname } = req.body;
  const sql = `INSERT INTO comments(id,post_id,author,username,firstname,description,create_at,update_at,likes)VALUES(NULL,"${post_id}","${author}","${username}","${firstname}","${description}",CURRENT_TIMESTAMP,CURRENT_TIMESTAMP, '0')`;
  connexion.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
});

router.get("/getAllComments", auth, (req, res) => {
  const postId = req.params.id;
  const sql = `SELECT * FROM comments WHERE comments.post_id = ${postId}`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
});
router.get("/getOneComment", auth, (req, res) => {
  const commentId = req.params.id;
  const sql = `SELECT * FROM comments WHERE comments.id = ${commentId}`;
  connexion.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
});

router.delete("/deleteOneComment", auth, (req, res) => {
  const comment_id = req.params.id;
  const sql = `DELETE FROM comments WHERE comments.id = ${comment_id}`;
  connexion.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
});

module.exports = router;

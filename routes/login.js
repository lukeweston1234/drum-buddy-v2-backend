const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require("../database/queries");
const googleAuth = require("../middlware/googleAuth");

router.post("/", googleAuth, async (req, res) => {
  try {
    const query = `
    INSERT INTO users (email)
    VALUES ($1)
    RETURNING *
    `;
    const { rows } = await db.query(query, [req.email]);
    console.log(rows);
    if (rows) {
      return res.status(201).send("User Added");
    } else {
      return res.status(500).send("Could not add User");
    }
  } catch (error) {
    console.log(error);
    if (error.code == "23505") {
      return res.status(409).send("Account Already Exists");
    }
    return res.status(403).send("Unauthorized");
  }
});

module.exports = router;

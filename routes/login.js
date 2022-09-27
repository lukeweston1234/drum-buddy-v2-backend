const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require("../database/queries");
const googleAuth = require("../middlware/googleAuth");

router.post("/", googleAuth, async (req, res) => {
  try {
    const email = req.body.email;
    const query = `
    SELECT * FROM users 
    WHERE email = $1
    `;
    const { rows } = await db.query(query, [email]);
    if (rows) {
      return res.status(200).json(rows[0]);
    }
  } catch (error) {
    try {
      const email = req.body.email;
      const query = `
      INSERT INTO users (email)
      VALUES ($1)
      RETURNING *
      `;
      const { rows } = await db.query(query, email);
      console.log(rows);
      if (rows) {
        return res.status(201).send("User Added");
      } else {
        return res.status(500).send("Could not add User");
      }
    } catch (error) {
      console.log(error);
      return res.status(403).send("Unauthorized");
    }
  }
});

module.exports = router;

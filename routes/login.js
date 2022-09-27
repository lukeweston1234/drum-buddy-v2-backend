const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require("../database/queries");
const googleAuth = require("../middlware/googleAuth");

router.post("/", googleAuth, async (req, res) => {
  try {
    const email = req.email;
    const query = `
    SELECT * FROM users 
    WHERE email = $1
    `;
    const { rows } = await db.query(query, [email]);
    console.log("Rows One", rows);
    if (rows[0]) {
      return res.status(200).json(rows[0]);
    } else {
      const query2 = `
      INSERT INTO users (email)
      VALUES ($1)
      RETURNING *
      `;
      const { rows2 } = await db.query(query2, [email]);
      console.log("Rows2", rows2);
      if (rows2[0]) {
        return res.status(201).json(rows[0]);
      } else {
        return res.status(500).send("Could not add User");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Could not add or find User");
  }
});

module.exports = router;

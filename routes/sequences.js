const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require("../database/queries");
const googleAuth = require("../middlware/googleAuth");

router.post("/", googleAuth, async (req, res) => {
  try {
    const sequence = req.body;
    const email = req.email;
    const query = `
    INSERT INTO sequences (json_sequence, users.user_id)
    VALUES ($1,
    (SELECT user_id FROM users WHERE users.email = $2)
    ) 
    RETURNING *
    `;
    const { rows } = await db.query(query, [sequence, email]);
    if (rows) {
      return res.status(201).json({ id: rows[0].sequence_id });
    }
    return res
      .status(400)
      .json({ error: "Could not post sequence with given data" });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid Query");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const sequenceID = req.params.id;
    const query = `
    SELECT * FROM sequences
    WHERE sequences.sequence_id = $1
    `;
    const { rows } = await db.query(query, [sequenceID]);
    if (rows) {
      return res.status(200).json(rows[0]);
    }
    return res.status(400).send("Could Not Find Sequence ID");
  } catch (error) {
    console.log(error);
    return res.status(400).send("Could Not Find Sequence ID");
  }
});

module.exports = router;

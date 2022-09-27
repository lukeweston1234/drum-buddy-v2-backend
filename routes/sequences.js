const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require("../database/queries");
const googleAuth = require("../middlware/googleAuth");

router.post("/", googleAuth, async (req, res) => {
  try {
    const sequence = req.body.sequence;
    let name = req.body.sequenceName;
    if (!name) {
      name = "Default";
    }
    const email = req.email;
    const query = `
    INSERT INTO sequences (json_sequence, sequence_name, user_id)
    VALUES ($1, $2,
    (SELECT users.user_id FROM users WHERE users.email = $3)
    )
    RETURNING *
    `;
    const { rows } = await db.query(query, [
      JSON.stringify(sequence),
      name,
      email,
    ]);
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
    SELECT * 
    FROM sequences
    WHERE sequence_id = $1
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

router.get("/users/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const query = `
    SELECT * FROM sequences
    INNER JOIN users 
    ON sequences.user_id = users.user_id
    WHERE sequences.user_id = $1
    `;
    const { rows } = await db.query(query, [userID]);
    if (rows) {
      return res.status(200).json(rows);
    }
    return res.status(400).send("Could Not Find Posts");
  } catch (error) {
    console.log(error);
    return res.status(400).send("Could Not Find User");
  }
});

router.delete("/sequenceID", googleAuth, async (req, res) => {
  try {
    const sequenceID = req.params.sequenceID;
    const email = req.email;
    const query = `
    DELETE 
    FROM sequences
    USING users
    WHERE sequences.sequence_id = $1 AND users.email = $2
    RETURNING * 
    `;
    const { rows } = await db.query(query, [sequenceID, email]);
    if (rows) {
      return res.status(200).send("Sequence Deleted");
    }
    return res.status(400).send("Could not delete sequence");
  } catch (error) {
    console.log(error);
    res.status(500).send("Database error");
  }
});

module.exports = router;

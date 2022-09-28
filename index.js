const express = require("express");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const app = express();

const login = require("./routes/login");

const sequences = require("./routes/sequences");

app.use(cors({ origin: `${CLIENT_URL}` }));

app.listen(PORT);

app.use("/api/login", login);

app.use("/api/sequences", sequences);

console.log(`listening on port ${PORT}`);

console.log(`Traffic open to ${CLIENT_URL}`);

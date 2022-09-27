const express = require("express");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;
const app = express();

const login = require("./routes/login");

const sequences = require("./routes/sequences");

app.use(cors({ origin: "https://drumbuddy.io" }));

app.listen(PORT);

app.use("/api/login", login);

app.use("/api/sequences", sequences);

console.log(`listening on port ${PORT}`);

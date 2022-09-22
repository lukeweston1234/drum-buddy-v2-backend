const express = require("express");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;
const app = express();

const login = require("./routes/login");

const sequences = require("./routes/sequences");

const whiteList = ["http://localhost:3000", "https://drumbuddy.io"];

app.use(cors());
// cors({
//   origin: (origin, callback) => {
//     if (whiteList.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// })
//);

app.listen(PORT);

app.use("/api/login", login);

app.use("/api/sequences", sequences);

console.log(`listening on port ${PORT}`);

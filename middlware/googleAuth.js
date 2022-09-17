require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client();

const googleAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload["email"];
    req.email = email;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send("Could not Authenticate user");
  }
};

module.exports = googleAuth;

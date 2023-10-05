const jwt = require("jsonwebtoken");

function generateToken(id) {
  const payload = { id };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });
}

module.exports = generateToken;

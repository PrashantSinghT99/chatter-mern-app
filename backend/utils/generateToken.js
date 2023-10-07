const jwt = require("jsonwebtoken");

function generateToken(id) {
  const payload = { id };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "2h" });
}

module.exports = generateToken;

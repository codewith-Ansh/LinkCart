const crypto = require("crypto");

function generateSlug() {
  return crypto.randomBytes(3).toString("hex"); // 6 char slug
}

module.exports = generateSlug;
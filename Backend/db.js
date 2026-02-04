const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "linkcart",
  password: "kb",
  port: 5432,
});

module.exports = pool;
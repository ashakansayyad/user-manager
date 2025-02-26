const { Pool } = require("pg");
require("dotenv").config();



const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMilliseconds: 30000,
  connectionTimeoutMilliseconds: 5000,
  client: { socketOptions: { keepAlive: true, keepAliveInitialDelay: 10000 } },
});

pool.connect()
  .then(() => console.log("PostgreSQL Connected Successfully!"))
  .catch((err) => console.error("PostgreSQL Initial Connection Error: ", err));

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle PostgreSQL client:", err.message);
});

pool.on("acquire", (client) => {
  client.on("error", (err) => {
    console.error("Error on acquired client:", err.message);
  });
});

pool.on("connect", () => {
  console.log("New connection established to PostgreSQL");
});

module.exports = pool;
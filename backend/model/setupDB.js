const pool = require("../db"); 


const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE ,
        password VARCHAR(255) , 
        type VARCHAR(50) CHECK (type IN ('child', 'mother', 'father', 'teacher')) NULL
      );
    `);
    console.log("Users Table Created Successfully!");
  } catch (err) {
    console.error("Error Creating Users Table:", err);
  }
};

createTable();
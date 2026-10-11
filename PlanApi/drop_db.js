const mysql = require('mysql2/promise');

async function recreateDb() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root'
    });
    console.log("Connected to MySQL.");
    await connection.query('DROP DATABASE IF EXISTS trip_plan;');
    console.log("Dropped trip_plan.");
    await connection.query('CREATE DATABASE trip_plan;');
    console.log("Created trip_plan.");
    await connection.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

recreateDb();

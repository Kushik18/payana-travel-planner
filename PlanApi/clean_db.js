const mysql = require('mysql2/promise');

async function cleanDb() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'trip_plan'
    });

    console.log("Connected to MySQL.");

    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    console.log("Disabled foreign key checks.");

    await connection.query('TRUNCATE TABLE itinerary;');
    console.log("Truncated itinerary table.");

    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log("Enabled foreign key checks.");

    await connection.end();
    console.log("Database cleanup successful!");
  } catch (err) {
    console.error("Error cleaning database:", err);
  }
}

cleanDb();

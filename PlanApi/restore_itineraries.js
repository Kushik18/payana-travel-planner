const fs = require('fs');
const mysql = require('mysql2/promise');

async function restoreBackup() {
  const data = JSON.parse(fs.readFileSync('db_backup.json', 'utf8'));

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'trip_plan'
  });

  await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
  await connection.query('TRUNCATE TABLE itineraries;');
  
  console.log("Truncated itineraries table.");

  let inserted = 0;
  for (let row of data) {
    try {
      await connection.query(
        `INSERT INTO itineraries (id, category, description, district, image_url, place, trip_with, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.id, row.category, row.description, row.district, row.imageUrl, row.place, row.tripWith, row.latitude, row.longitude]
      );
      inserted++;
    } catch (e) {
      console.error("Error inserting row:", e.message);
    }
  }

  await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
  await connection.end();

  console.log(`Successfully restored ${inserted} rows from db_backup.json.`);
}

restoreBackup().catch(console.error);

const fs = require('fs');

const allPlaces = [
  { "district": "French Polynesia", "place": "Bora Bora", "category": "relaxed", "tripWith": "couple", "latitude": "-16.5004", "longitude": "-151.7415", "description": "Crystal-clear waters and luxurious overwater bungalows." },
  { "district": "Greece", "place": "Santorini", "category": "romantic", "tripWith": "couple", "latitude": "36.3932", "longitude": "25.4615", "description": "Iconic blue-domed churches and stunning sunset views over the Aegean Sea." },
  { "district": "Hawaii, USA", "place": "Maui", "category": "relaxed", "tripWith": "family", "latitude": "20.7984", "longitude": "-156.3319", "description": "Lush valleys, volcanic landscapes, and pristine beaches." },
  { "district": "Japan", "place": "Kyoto", "category": "cultural", "tripWith": "solo", "latitude": "35.0116", "longitude": "135.7681", "description": "Ancient temples, traditional tea houses, and beautiful cherry blossoms." },
  { "district": "Canada", "place": "Banff", "category": "adventurous", "tripWith": "friends", "latitude": "51.1784", "longitude": "-115.5708", "description": "Turquoise glacial lakes and majestic mountain peaks." },
  { "district": "Maldives", "place": "The Maldives", "category": "relaxed", "tripWith": "couple", "latitude": "3.2028", "longitude": "73.2207", "description": "White sand beaches, vibrant coral reefs, and ultimate relaxation." },
  { "district": "Italy", "place": "Amalfi Coast", "category": "romantic", "tripWith": "couple", "latitude": "40.6333", "longitude": "14.6029", "description": "Picturesque cliffside villages and sparkling Mediterranean waters." },
  { "district": "Peru", "place": "Machu Picchu", "category": "cultural", "tripWith": "friends", "latitude": "-13.1631", "longitude": "-72.5450", "description": "The legendary Incan citadel set high in the Andes Mountains." },
  { "district": "Ecuador", "place": "Galapagos Islands", "category": "adventurous", "tripWith": "family", "latitude": "-0.8371", "longitude": "-90.2706", "description": "Unmatched wildlife viewing and unique volcanic landscapes." },
  { "district": "Iceland", "place": "Reykjavik", "category": "adventurous", "tripWith": "friends", "latitude": "64.1466", "longitude": "-21.9426", "description": "Geothermal spas, stunning northern lights, and vibrant culture." }
];

async function seedData() {
  try {
    // 1. Login as Admin
    console.log("Logging in as Admin...");
    const loginRes = await fetch("http://localhost:8080/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin@gmail.com", password: "Admin@123" })
    });
    
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status}`);
    }
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Login successful. Token acquired.");

    // 2. Fetch existing itineraries to avoid exact duplicates
    console.log("Fetching existing itineraries...");
    const existingRes = await fetch("http://localhost:8080/api/itinerary/all");
    const existingData = await existingRes.json();
    const existingPlaceNames = new Set(existingData.map(i => i.place.toLowerCase()));

    // 3. Post new itineraries
    let successCount = 0;
    for (let item of allPlaces) {
      if (existingPlaceNames.has(item.place.toLowerCase())) {
        console.log(`Skipping ${item.place} (Already exists)`);
        continue;
      }
      
      const res = await fetch("http://localhost:8080/api/itinerary/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(item)
      });

      if (res.ok) {
        successCount++;
        console.log(`Added: ${item.place} (${item.district})`);
      } else {
        console.error(`Failed to add: ${item.place} - Status: ${res.status}`);
      }
    }
    console.log(`\n--- Seeding complete. Added ${successCount} new places across all 31 districts. ---`);
  } catch (err) {
    console.error("Error during seeding:", err.message);
  }
}

seedData();

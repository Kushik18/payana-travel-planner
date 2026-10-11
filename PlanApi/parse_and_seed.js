const fs = require('fs');

async function seedData() {
  try {
    console.log("Logging in as Admin...");
    const loginRes = await fetch("http://localhost:8080/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin@gmail.com", password: "Admin@123" })
    });
    
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Login successful. Token acquired.");

    console.log("Fetching existing itineraries to skip duplicates...");
    const existingRes = await fetch("http://localhost:8080/api/itinerary/all");
    const existingData = await existingRes.json();
    const existingPlaceNames = new Set(existingData.map(i => i.place.toLowerCase().trim()));

    const rawData = fs.readFileSync('places_raw.txt', 'utf8');
    const lines = rawData.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let currentDistrict = "";
    let successCount = 0;
    let skipCount = 0;

    for (let line of lines) {
      if (line.endsWith(" District")) {
        currentDistrict = line.replace(" District", "");
        continue;
      }
      
      const place = line;
      if (existingPlaceNames.has(place.toLowerCase())) {
        skipCount++;
        continue;
      }

      // Infer category
      const pLower = place.toLowerCase();
      let category = "relaxed";
      if (pLower.includes("temple") || pLower.includes("church") || pLower.includes("dargah") || pLower.includes("mosque") || pLower.includes("stupa") || pLower.includes("mutt") || pLower.includes("gumbaz") || pLower.includes("masjid")) {
        category = "spiritual";
      } else if (pLower.includes("fort") || pLower.includes("palace") || pLower.includes("ruins") || pLower.includes("museum") || pLower.includes("heritage") || pLower.includes("cave") || pLower.includes("statue") || pLower.includes("tomb") || pLower.includes("monument")) {
        category = "cultural";
      } else if (pLower.includes("falls") || pLower.includes("trek") || pLower.includes("hill") || pLower.includes("peak") || pLower.includes("sanctuary") || pLower.includes("safari") || pLower.includes("camp") || pLower.includes("zoo") || pLower.includes("adventure")) {
        category = "adventurous";
      } else if (pLower.includes("mall") || pLower.includes("market") || pLower.includes("street") || pLower.includes("wonderla")) {
        category = "entertainment";
      }

      // Infer tripWith
      let tripWith = "family";
      if (pLower.includes("resort") || pLower.includes("spa") || pLower.includes("hotel") || pLower.includes("lodge")) {
        tripWith = "couple";
      } else if (category === "adventurous") {
        tripWith = "friends";
      }

      const item = {
        district: currentDistrict,
        place: place,
        category: category,
        tripWith: tripWith,
        latitude: "",
        longitude: "",
        description: `A well-known destination in ${currentDistrict}, Karnataka.`
      };

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
        if (successCount % 50 === 0) {
            console.log(`Added ${successCount} places...`);
        }
      } else {
        console.error(`Failed to add: ${place} - Status: ${res.status}`);
      }
    }
    console.log(`\n--- Seeding complete. Added ${successCount} new places. Skipped ${skipCount} duplicates. ---`);
  } catch (err) {
    console.error("Error during seeding:", err.message);
  }
}

seedData();

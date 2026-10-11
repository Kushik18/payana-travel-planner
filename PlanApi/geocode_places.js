const fs = require('fs');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function geocodeData() {
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

        console.log("Fetching existing itineraries to find missing coordinates...");
        const existingRes = await fetch("http://localhost:8080/api/itinerary/all");
        if (!existingRes.ok) throw new Error("Failed to fetch itineraries.");
        const allPlaces = await existingRes.json();
        
        const placesToGeocode = allPlaces.filter(p => !p.latitude || p.latitude.trim() === "" || !p.longitude || p.longitude.trim() === "");
        console.log(`Found ${placesToGeocode.length} places missing coordinates out of ${allPlaces.length}.`);

        let successCount = 0;
        let notFoundCount = 0;
        let errorCount = 0;

        for (let i = 0; i < placesToGeocode.length; i++) {
            const item = placesToGeocode[i];
            
            // Respect Nominatim rate limits (1 req/sec). We use 1.5s to be safe.
            await delay(1500);
            
            // Clean up place name for better search results
            let queryPlace = item.place.replace(/District/gi, "").trim();
            // Optional: fallback searches if first fails
            const query = `${queryPlace}, ${item.district}, Karnataka, India`;
            const encodedQuery = encodeURIComponent(query);
            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&email=adminpayana@gmail.com`;
            
            try {
                const geoRes = await fetch(nominatimUrl, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept-Language": "en-US,en;q=0.9"
                    }
                });

                if (!geoRes.ok) {
                    console.error(`Nominatim API Error for ${item.place}: ${geoRes.status}`);
                    errorCount++;
                    continue;
                }

                const geoData = await geoRes.json();
                
                if (geoData && geoData.length > 0) {
                    const lat = geoData[0].lat;
                    const lon = geoData[0].lon;
                    
                    item.latitude = lat;
                    item.longitude = lon;
                    
                    // Update in DB
                    const updateRes = await fetch(`http://localhost:8080/api/itinerary/update/${item.id}`, {
                        method: "PUT",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}` 
                        },
                        body: JSON.stringify(item)
                    });

                    if (updateRes.ok) {
                        successCount++;
                        console.log(`[${i+1}/${placesToGeocode.length}] ✅ Geocoded ${item.place}: ${lat}, ${lon}`);
                    } else {
                        console.error(`[${i+1}/${placesToGeocode.length}] ❌ Failed to update DB for ${item.place} - Status: ${updateRes.status}`);
                        errorCount++;
                    }
                } else {
                    console.log(`[${i+1}/${placesToGeocode.length}] ⚠️ Not found on map: ${item.place}`);
                    notFoundCount++;
                }
            } catch (err) {
                console.error(`[${i+1}/${placesToGeocode.length}] ❌ Error processing ${item.place}:`, err.message);
                errorCount++;
            }
        }

        console.log(`\n--- Geocoding Complete ---`);
        console.log(`Total Found & Updated: ${successCount}`);
        console.log(`Not Found on Map: ${notFoundCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (err) {
        console.error("Critical Error:", err.message);
    }
}

geocodeData();

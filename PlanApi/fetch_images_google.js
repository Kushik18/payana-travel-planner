const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchGoogleImages() {
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

        console.log("Fetching existing itineraries...");
        const existingRes = await fetch("http://localhost:8080/api/itinerary/all");
        if (!existingRes.ok) throw new Error("Failed to fetch itineraries.");
        const allPlaces = await existingRes.json();
        
        // Find places that either have NO image, or have the placeholder image
        const placesToUpdate = allPlaces.filter(p => !p.imageUrl || p.imageUrl.trim() === "" || p.imageUrl.includes("picsum.photos") || p.imageUrl.includes("placehold"));
        console.log(`Found ${placesToUpdate.length} places needing original photos out of ${allPlaces.length}.`);

        let successCount = 0;
        let notFoundCount = 0;
        let errorCount = 0;

        for (let i = 0; i < placesToUpdate.length; i++) {
            const item = placesToUpdate[i];
            
            // Respect Google's scrape limits
            await delay(1500);
            
            let queryPlace = item.place.replace(/District/gi, "").trim();
            // Wrap the specific place name in strict quotes to force an exact match, 
            // and explicitly append the exact geographical location
            const searchQuery = `"${queryPlace}" ${item.district} Karnataka India tourism`;
            
            try {
                const res = await GOOGLE_IMG_SCRAP({
                    search: searchQuery,
                    limit: 1
                });

                if (res && res.result && res.result.length > 0) {
                    const imageUrl = res.result[0].url;
                    
                    item.imageUrl = imageUrl;
                    
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
                        console.log(`[${i+1}/${placesToUpdate.length}] ✅ Fetched Original Google Image for ${item.place}`);
                    } else {
                        console.error(`[${i+1}/${placesToUpdate.length}] ❌ Failed to update DB for ${item.place} - Status: ${updateRes.status}`);
                        errorCount++;
                    }
                } else {
                    console.log(`[${i+1}/${placesToUpdate.length}] ⚠️ No image found on Google for: ${item.place}`);
                    notFoundCount++;
                }
            } catch (err) {
                console.error(`[${i+1}/${placesToUpdate.length}] ❌ Error scraping Google for ${item.place}:`, err.message);
                errorCount++;
            }
        }

        console.log(`\n--- Google Image Fetching Complete ---`);
        console.log(`Total Found & Updated: ${successCount}`);
        console.log(`Not Found on Google: ${notFoundCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (err) {
        console.error("Critical Error:", err.message);
    }
}

fetchGoogleImages();

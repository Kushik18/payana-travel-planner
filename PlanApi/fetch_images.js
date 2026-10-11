const fs = require('fs');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchImages() {
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

        console.log("Fetching existing itineraries to find missing images...");
        const existingRes = await fetch("http://localhost:8080/api/itinerary/all");
        if (!existingRes.ok) throw new Error("Failed to fetch itineraries.");
        const allPlaces = await existingRes.json();
        
        const placesMissingImages = allPlaces.filter(p => !p.imageUrl || p.imageUrl.trim() === "");
        console.log(`Found ${placesMissingImages.length} places missing images out of ${allPlaces.length}.`);

        let successCount = 0;
        let notFoundCount = 0;
        let errorCount = 0;

        for (let i = 0; i < placesMissingImages.length; i++) {
            const item = placesMissingImages[i];
            
            // Respect API limits (1 req/sec)
            await delay(1000);
            
            // Clean up place name for better search results
            let queryPlace = item.place.replace(/District/gi, "").trim();
            const encodedQuery = encodeURIComponent(queryPlace);
            const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&generator=search&gsrsearch=${encodedQuery}&gsrlimit=1`;
            
            let retries = 3;
            let success = false;
            
            while (retries > 0 && !success) {
                try {
                    const wikiRes = await fetch(wikiUrl, {
                        headers: {
                            "User-Agent": "PayanaTravelApp/1.0 (contact@payana-app.com)"
                        }
                    });

                    if (wikiRes.status === 429) {
                        console.log(`[${i+1}/${placesMissingImages.length}] ⏳ Rate limited. Retrying in 5 seconds...`);
                        await delay(5000);
                        retries--;
                        continue;
                    }

                    if (!wikiRes.ok) {
                        console.error(`Wiki API Error for ${item.place}: ${wikiRes.status}`);
                        errorCount++;
                        break;
                    }

                    const wikiData = await wikiRes.json();
                    
                    if (wikiData.query && wikiData.query.pages) {
                        const pages = wikiData.query.pages;
                        const pageId = Object.keys(pages)[0];
                        const page = pages[pageId];

                        if (page.original && page.original.source) {
                            const imageUrl = page.original.source;
                            
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
                                console.log(`[${i+1}/${placesMissingImages.length}] ✅ Found image for ${item.place}`);
                            } else {
                                console.error(`[${i+1}/${placesMissingImages.length}] ❌ Failed to update DB for ${item.place} - Status: ${updateRes.status}`);
                                errorCount++;
                            }
                        } else {
                            console.log(`[${i+1}/${placesMissingImages.length}] ⚠️ No image on Wikipedia for: ${item.place}. Using fallback.`);
                            item.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(item.place)}/600/400`;
                            
                            const updateRes = await fetch(`http://localhost:8080/api/itinerary/update/${item.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                                body: JSON.stringify(item)
                            });
                            if (updateRes.ok) successCount++;
                            else errorCount++;
                        }
                    } else {
                        console.log(`[${i+1}/${placesMissingImages.length}] ⚠️ No article on Wikipedia for: ${item.place}. Using fallback.`);
                        item.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(item.place)}/600/400`;
                        
                        const updateRes = await fetch(`http://localhost:8080/api/itinerary/update/${item.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                            body: JSON.stringify(item)
                        });
                        if (updateRes.ok) successCount++;
                        else errorCount++;
                    }
                    success = true;
                } catch (err) {
                    console.error(`[${i+1}/${placesMissingImages.length}] ❌ Error processing ${item.place}:`, err.message);
                    errorCount++;
                    break;
                }
            }
        }

        console.log(`\n--- Image Fetching Complete ---`);
        console.log(`Total Found & Updated: ${successCount}`);
        console.log(`Not Found on Wiki: ${notFoundCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (err) {
        console.error("Critical Error:", err.message);
    }
}

fetchImages();

// Smart Route Intelligence Engine - Core Modules

/**
 * Geocoding Engine
 * Converts district names into coordinate pairs.
 * For MVP, we use a robust dictionary of Karnataka districts.
 */
export const GEO_DB = {
    'Mysuru': { lat: 12.2958, lon: 76.6394, alt: 763 },
    'Coorg': { lat: 12.3375, lon: 75.8069, alt: 1150 },
    'Hassan': { lat: 13.0068, lon: 76.0996, alt: 972 },
    'Chikmagalur': { lat: 13.3161, lon: 75.7720, alt: 1090 },
    'Hampi': { lat: 15.3350, lon: 76.4600, alt: 467 },
    'Gokarna': { lat: 14.5479, lon: 74.3188, alt: 10 },
    'Bengaluru': { lat: 12.9716, lon: 77.5946, alt: 920 },
    'Mangaluru': { lat: 12.9141, lon: 74.8560, alt: 22 },
    'Udupi': { lat: 13.3409, lon: 74.7421, alt: 39 },
    'Hubballi': { lat: 15.3647, lon: 75.1240, alt: 630 },
};

export const getCoordinates = (name) => {
    return GEO_DB[name] || { lat: 13.0, lon: 76.5, alt: 500 }; // Default central karnataka
};

/**
 * Road Routing Engine
 * Integrates with OSRM (Open Source Routing Machine) to get actual road paths,
 * driving distances, and durations.
 */
export const getOSRMRoute = async (lon1, lat1, lon2, lat2) => {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes.length > 0) {
            const route = data.routes[0];
            return {
                distanceKm: route.distance / 1000,
                durationMin: route.duration / 60,
                geometry: route.geometry.coordinates // For Leaflet polyline
            };
        }
        throw new Error('No route found');
    } catch (e) {
        console.error("OSRM Error:", e);
        // Fallback to Haversine if API fails
        const dist = calculateHaversine(lat1, lon1, lat2, lon2);
        return { distanceKm: dist, durationMin: (dist / 50) * 60, geometry: null }; 
    }
};

/**
 * Legacy Haversine Backup
 */
function calculateHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Fuel & Cost Engine
 * Calculates multi-vehicle cost profiles.
 */
export const VEHICLE_PROFILES = {
    car: { mileage: 14, costPerLitre: 102, tollMultiplier: 1.0 },
    suv: { mileage: 10, costPerLitre: 102, tollMultiplier: 1.5 },
    bike: { mileage: 40, costPerLitre: 102, tollMultiplier: 0.2 },
    ev: { mileage: 300, costPerLitre: 20, tollMultiplier: 1.0 } // 300km per full charge (assumed ₹20 per unit)
};

export const calculateCosts = (distanceKm, vehicleType = 'car') => {
    const profile = VEHICLE_PROFILES[vehicleType] || VEHICLE_PROFILES.car;
    const fuelLitres = distanceKm / profile.mileage;
    const fuelCost = fuelLitres * profile.costPerLitre;
    const tollEstimate = distanceKm * 1.5 * profile.tollMultiplier; // roughly ₹1.5 per km for tolls in KN
    
    return {
        fuelLitres: parseFloat(fuelLitres.toFixed(1)),
        fuelCost: Math.round(fuelCost),
        tolls: Math.round(tollEstimate),
        totalCost: Math.round(fuelCost + tollEstimate)
    };
};

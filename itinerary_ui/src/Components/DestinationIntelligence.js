// Destination & Stop Intelligence Database

export const DESTINATION_INTELLIGENCE = {
    'Mysuru': {
        temp: 24,
        rainProb: 5,
        weatherStr: 'Sunny',
        attractions: 18,
        hotels: 210,
        fuelStations: 45,
        hospitals: 12,
        evChargers: 8,
        roadCondition: 'Excellent',
        notes: 'Palace city. Great roads. Moderate traffic.',
        emergency: '108 (Ambulance), 112 (Police)'
    },
    'Coorg': {
        temp: 18,
        rainProb: 75,
        weatherStr: 'Heavy Rain',
        attractions: 12,
        hotels: 146,
        fuelStations: 19,
        hospitals: 4,
        evChargers: 3,
        roadCondition: 'Good (Ghat Sections)',
        notes: 'Expect fog and heavy rain. Drive carefully on curves.',
        emergency: '108 (Ambulance), 112 (Police)'
    },
    'Chikmagalur': {
        temp: 20,
        rainProb: 40,
        weatherStr: 'Cloudy',
        attractions: 15,
        hotels: 120,
        fuelStations: 22,
        hospitals: 5,
        evChargers: 2,
        roadCondition: 'Good',
        notes: 'Coffee estates. Misty mornings.',
        emergency: '108 (Ambulance), 112 (Police)'
    },
    'Gokarna': {
        temp: 31,
        rainProb: 0,
        weatherStr: 'Sunny',
        attractions: 8,
        hotels: 85,
        fuelStations: 10,
        hospitals: 2,
        evChargers: 1,
        roadCondition: 'Average',
        notes: 'Hot and humid. Coastal roads.',
        emergency: '108 (Ambulance), 112 (Police)'
    },
    'Hampi': {
        temp: 34,
        rainProb: 0,
        weatherStr: 'Hot',
        attractions: 25,
        hotels: 60,
        fuelStations: 12,
        hospitals: 3,
        evChargers: 0,
        roadCondition: 'Average',
        notes: 'Very hot during the day. Historical ruins.',
        emergency: '108 (Ambulance), 112 (Police)'
    }
};

/**
 * Risk Engine
 * Calculates a safety score based on weather, time, and road conditions.
 */
export const calculateTripRisk = (stops) => {
    let riskPoints = 0;
    
    stops.forEach(stop => {
        const intel = DESTINATION_INTELLIGENCE[stop.name];
        if (intel) {
            if (intel.rainProb > 60) riskPoints += 2;
            if (intel.roadCondition.includes('Ghat')) riskPoints += 1;
            if (intel.temp > 33) riskPoints += 1;
        }
    });

    const maxPoints = stops.length * 3;
    const score = Math.max(0, 10 - Math.round((riskPoints / maxPoints) * 10));
    
    let label = 'Safe';
    if (score < 5) label = 'High Risk';
    else if (score < 8) label = 'Moderate Risk';

    return { score, label };
};

/**
 * Recommendation Engine (Rules-based AI)
 */
export const generateAIRecommendations = (stops) => {
    const tips = [];
    
    const hasRain = stops.some(s => DESTINATION_INTELLIGENCE[s.name]?.rainProb > 60);
    if (hasRain) tips.push("🌧 Heavy rain expected. Carry rain gear and drive 20% slower.");

    const hasGhats = stops.some(s => DESTINATION_INTELLIGENCE[s.name]?.roadCondition.includes('Ghat'));
    if (hasGhats) tips.push("⛰️ Ghat sections ahead. Fuel up before entering the hills and avoid night driving.");

    const isHot = stops.some(s => DESTINATION_INTELLIGENCE[s.name]?.temp > 32);
    if (isHot) tips.push("☀ High temperatures detected. Ensure your vehicle AC is serviced and carry extra water.");

    if (stops.length > 3) tips.push("⏱ Long journey detected. Plan a 15-minute rest stop every 2 hours.");

    return tips;
};

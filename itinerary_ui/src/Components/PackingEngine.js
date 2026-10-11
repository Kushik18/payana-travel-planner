// PackingEngine.js

// --- DATABASE (Fallback for MVP, live items come from backend) ---

import axiosInstance from '../api/axiosInstance';

export const PACKING_ITEMS = [
  // Essentials
  { id: 'id_card', name: 'National ID / Aadhaar Card', category: 'Essentials', defaultPriority: 'Mandatory', weight: 20, tags: ['id', 'document'] },
  { id: 'cash', name: 'Cash', category: 'Essentials', defaultPriority: 'Mandatory', weight: 50, tags: ['money', 'wallet'] },
  { id: 'phone_charger', name: 'Phone Charger', category: 'Essentials', defaultPriority: 'Mandatory', weight: 100, tags: ['power', 'cable'] },
  { id: 'power_bank', name: 'Power Bank', category: 'Essentials', defaultPriority: 'Recommended', weight: 300, tags: ['power', 'battery'] },
  { id: 'water_bottle', name: 'Reusable Water Bottle', category: 'Essentials', defaultPriority: 'Recommended', weight: 150, tags: ['water', 'drink'] },
  { id: 'sanitizer', name: 'Hand Sanitizer', category: 'Essentials', defaultPriority: 'Recommended', weight: 50, tags: ['health', 'clean'] },
  
  // Health & Safety
  { id: 'first_aid', name: 'First Aid Kit', category: 'Health & Safety', defaultPriority: 'Recommended', weight: 250, tags: ['health', 'medical'] },
  { id: 'meds_pain', name: 'Paracetamol', category: 'Health & Safety', defaultPriority: 'Mandatory', weight: 30, tags: ['health', 'medicine', 'pain'] },
  { id: 'meds_stomach', name: 'Antacids', category: 'Health & Safety', defaultPriority: 'Recommended', weight: 30, tags: ['health', 'medicine', 'digestion'] },
  { id: 'ors', name: 'ORS / Electrolytes', category: 'Health & Safety', defaultPriority: 'Recommended', weight: 50, tags: ['health', 'hydration', 'summer'] },
  { id: 'mosquito_repellent', name: 'Mosquito Repellent', category: 'Health & Safety', defaultPriority: 'Recommended', weight: 100, tags: ['health', 'insects'] },
  { id: 'sunscreen', name: 'Sunscreen SPF 50+', category: 'Health & Safety', defaultPriority: 'Optional', weight: 120, tags: ['health', 'sun', 'summer'] },
  { id: 'leech_socks', name: 'Leech Socks', category: 'Health & Safety', defaultPriority: 'Optional', weight: 80, tags: ['health', 'trekking', 'rain'] },
  
  // Clothing
  { id: 'tshirt', name: 'Lightweight T-Shirts', category: 'Clothing', defaultPriority: 'Mandatory', weight: 150, tags: ['clothes', 'top'] },
  { id: 'pants', name: 'Comfortable Pants/Jeans', category: 'Clothing', defaultPriority: 'Mandatory', weight: 400, tags: ['clothes', 'bottom'] },
  { id: 'underwear', name: 'Innerwear', category: 'Clothing', defaultPriority: 'Mandatory', weight: 50, tags: ['clothes', 'undergarments'] },
  { id: 'socks', name: 'Socks', category: 'Clothing', defaultPriority: 'Mandatory', weight: 40, tags: ['clothes', 'feet'] },
  { id: 'jacket_light', name: 'Light Jacket / Fleece', category: 'Clothing', defaultPriority: 'Optional', weight: 500, tags: ['clothes', 'winter', 'cold'] },
  { id: 'jacket_heavy', name: 'Heavy Winter Jacket', category: 'Clothing', defaultPriority: 'Optional', weight: 1200, tags: ['clothes', 'winter', 'cold'] },
  { id: 'raincoat', name: 'Raincoat / Poncho', category: 'Clothing', defaultPriority: 'Optional', weight: 300, tags: ['clothes', 'rain'] },
  { id: 'swimwear', name: 'Swimwear', category: 'Clothing', defaultPriority: 'Optional', weight: 100, tags: ['clothes', 'swim', 'beach'] },
  { id: 'trek_pants', name: 'Trekking Pants', category: 'Clothing', defaultPriority: 'Optional', weight: 300, tags: ['clothes', 'trek'] },
  { id: 'modest_clothes', name: 'Traditional / Modest Clothes', category: 'Clothing', defaultPriority: 'Optional', weight: 400, tags: ['clothes', 'temple'] },
  { id: 'head_cover', name: 'Head Cover / Scarf', category: 'Clothing', defaultPriority: 'Optional', weight: 80, tags: ['clothes', 'temple', 'head'] },
  
  // Gear & Gadgets
  { id: 'camera', name: 'Camera', category: 'Gear & Gadgets', defaultPriority: 'Optional', weight: 800, tags: ['electronics', 'photo'] },
  { id: 'tripod', name: 'Tripod', category: 'Gear & Gadgets', defaultPriority: 'Optional', weight: 1000, tags: ['electronics', 'photo'] },
  { id: 'headlamp', name: 'Headlamp', category: 'Gear & Gadgets', defaultPriority: 'Optional', weight: 150, tags: ['electronics', 'trek', 'light'] },
  { id: 'trek_pole', name: 'Trekking Pole', category: 'Gear & Gadgets', defaultPriority: 'Optional', weight: 250, tags: ['gear', 'trek'] },
  { id: 'beach_towel', name: 'Beach Towel', category: 'Gear & Gadgets', defaultPriority: 'Optional', weight: 300, tags: ['gear', 'beach', 'swim'] },
  { id: 'quick_dry_towel', name: 'Quick Dry Towel', category: 'Gear & Gadgets', defaultPriority: 'Optional', weight: 150, tags: ['gear', 'swim'] },
  { id: 'umbrella', name: 'Umbrella', category: 'Gear & Gadgets', defaultPriority: 'Optional', weight: 350, tags: ['gear', 'rain'] },
  
  // Documents
  { id: 'tickets', name: 'Travel Tickets', category: 'Documents', defaultPriority: 'Mandatory', weight: 10, tags: ['document', 'flight', 'bus'] },
  { id: 'hotel_booking', name: 'Hotel Bookings', category: 'Documents', defaultPriority: 'Mandatory', weight: 10, tags: ['document', 'stay'] },
];

export const DESTINATION_RULES = [
  { district: 'Coorg', items: [{ id: 'raincoat', priority: 'Mandatory', reason: 'Coorg receives frequent rainfall.' }, { id: 'leech_socks', priority: 'Recommended', reason: 'Essential for trekking in damp coffee estates.' }] },
  { district: 'Bellary', items: [{ id: 'sunscreen', priority: 'Mandatory', reason: 'Bellary gets very hot and sunny.' }, { id: 'ors', priority: 'Recommended', reason: 'To prevent dehydration in the heat.' }] },
  { district: 'Gokarna', items: [{ id: 'beach_towel', priority: 'Mandatory', reason: 'Essential for Gokarna beaches.' }, { id: 'swimwear', priority: 'Recommended', reason: 'For swimming in the ocean.' }] },
  { district: 'Hampi', items: [{ id: 'sunscreen', priority: 'Mandatory', reason: 'Hampi involves a lot of walking under the sun.' }, { id: 'ors', priority: 'Recommended', reason: 'High heat among the ruins requires hydration.' }] },
  { district: 'Mysuru', items: [{ id: 'modest_clothes', priority: 'Recommended', reason: 'Required for entering the palace and Chamundi temple.' }] },
];

export const ACTIVITY_RULES = [
  { activity: 'trek', items: [{ id: 'trek_pants', priority: 'Recommended' }, { id: 'headlamp', priority: 'Recommended' }, { id: 'trek_pole', priority: 'Optional' }] },
  { activity: 'swim', items: [{ id: 'swimwear', priority: 'Mandatory' }, { id: 'quick_dry_towel', priority: 'Recommended' }] },
  { activity: 'temple', items: [{ id: 'modest_clothes', priority: 'Mandatory' }, { id: 'head_cover', priority: 'Recommended' }] },
];

export const WEATHER_RULES = [
  { condition: (w) => w.temp > 30, items: [{ id: 'sunscreen', priority: 'Mandatory' }, { id: 'ors', priority: 'Recommended' }] },
  { condition: (w) => w.temp < 20, items: [{ id: 'jacket_light', priority: 'Recommended' }] },
  { condition: (w) => w.temp < 10, items: [{ id: 'jacket_heavy', priority: 'Mandatory' }] },
  { condition: (w) => w.rainProb > 50, items: [{ id: 'umbrella', priority: 'Recommended' }, { id: 'raincoat', priority: 'Recommended' }] },
];

export const DESTINATION_INTELLIGENCE = {
  'Bellary': { bestTime: 'Oct-Feb', temp: '34°C', emergency: '108', police: '112', languages: 'Kannada, Telugu', atm: 'Good in city, scarce at ruins', notes: 'Expect extreme heat in summer. Carry extra water.' },
  'Coorg': { bestTime: 'Sep-Mar', temp: '22°C', emergency: '108', police: '112', languages: 'Kodava, Kannada', atm: 'Available in Madikeri', notes: 'Roads can be slippery during monsoons.' },
  'Gokarna': { bestTime: 'Oct-Mar', temp: '30°C', emergency: '108', police: '112', languages: 'Kannada, Konkani', atm: 'Limited near beaches', notes: 'Carry cash as network for UPI can be poor near Om Beach.' },
  'Hampi': { bestTime: 'Oct-Feb', temp: '33°C', emergency: '108', police: '112', languages: 'Kannada, English', atm: 'Very limited in Hampi Island (Hippie Island)', notes: 'Start sightseeing early morning to avoid peak sun.' },
  'Mysuru': { bestTime: 'Jul-Feb', temp: '28°C', emergency: '108', police: '112', languages: 'Kannada', atm: 'Excellent', notes: 'Palace is illuminated on Sundays.' },
};

// --- ENGINE LOGIC ---

export async function generatePackingList(tripContext) {
  const { destination, days, weather, activities, travelers } = tripContext;
  let checklist = [];
  let aiTips = [];

  let baseItems = [...PACKING_ITEMS];
  try {
    const res = await axiosInstance.get('/api/packing/items');
    if (res.data && res.data.length > 0) {
      baseItems = res.data;
    }
  } catch(e) {
    console.error("Failed to fetch live packing items", e);
  }

  // Helper to add item
  const addItem = (id, priority, reason, qty = 1, isShared = false) => {
    const baseItem = baseItems.find(i => String(i.id) === String(id) || i.name === id);
    if (!baseItem) return;
    
    const existing = checklist.find(i => i.id === id);
    if (existing) {
      // Upgrade priority if needed
      if (priority === 'Mandatory') existing.priority = 'Mandatory';
      if (reason && !existing.reason) existing.reason = reason;
      // Do not multiply shared items (like power banks, first aid) by travelers
      if (!isShared && travelers > 1) {
          existing.qty = Math.max(existing.qty, qty * travelers);
      }
    } else {
      checklist.push({
        ...baseItem,
        priority: priority || baseItem.defaultPriority,
        reason: reason || '',
        qty: isShared ? qty : qty * travelers,
        checked: false
      });
    }
  };

  // 1. Base Essentials
  addItem('id_card', 'Mandatory', 'Required for hotel check-in', 1, false);
  addItem('cash', 'Recommended', 'For local transport and small shops', 1, true);
  addItem('phone_charger', 'Mandatory', '', 1, false);
  addItem('power_bank', 'Recommended', '', 1, true);
  addItem('water_bottle', 'Recommended', '', 1, false);
  addItem('first_aid', 'Recommended', '', 1, true);
  addItem('meds_pain', 'Mandatory', '', 1, true);
  
  // Base Clothing based on days
  let tshirts = Math.min(days, 7);
  let pants = Math.ceil(days / 2);
  let underwears = Math.min(days, 10);
  let socks = Math.min(days, 10);
  
  addItem('tshirt', 'Mandatory', '', tshirts, false);
  addItem('pants', 'Mandatory', '', pants, false);
  addItem('underwear', 'Mandatory', '', underwears, false);
  addItem('socks', 'Mandatory', '', socks, false);
  
  addItem('tickets', 'Mandatory', '', 1, true);
  addItem('hotel_booking', 'Mandatory', '', 1, true);

  // 2. Destination Rules
  if (destination) {
    const destRule = DESTINATION_RULES.find(d => d.district === destination);
    if (destRule) {
      destRule.items.forEach(i => addItem(i.id, i.priority, i.reason, 1, false));
    }
  }

  // 3. Activity Rules
  if (activities && activities.length > 0) {
    activities.forEach(act => {
      const actRule = ACTIVITY_RULES.find(a => a.activity === act);
      if (actRule) {
        actRule.items.forEach(i => addItem(i.id, i.priority, '', 1, false));
      }
      
      if (act === 'trek') aiTips.push('Trekking selected. Carry trekking shoes and a power bank.');
      if (act === 'swim') aiTips.push('Swimming selected. Don\'t forget quick-dry towels.');
      if (act === 'temple') aiTips.push('Temple visits selected. Consider modest clothing.');
    });
  }

  // 4. Weather Rules
  if (weather) {
    WEATHER_RULES.forEach(rule => {
      if (rule.condition(weather)) {
        rule.items.forEach(i => addItem(i.id, i.priority, 'Weather based suggestion', 1, false));
      }
    });
    
    if (weather.temp > 30) aiTips.push(`Expected temperature is ${weather.temp}°C. Hydrate regularly and use sunscreen.`);
    if (weather.temp < 20) aiTips.push(`Expected temperature is ${weather.temp}°C. Pack a jacket.`);
    if (weather.rainProb > 50) aiTips.push('High chance of rain. Carry an umbrella or raincoat.');
  }

  return { checklist, aiTips };
}

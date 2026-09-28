// Major Indian Cities Database & Spatial Grid Matching Utility

export const MAJOR_INDIAN_CITIES = [
  { name: "Mumbai", state: "Maharashtra", region: "West Coast", lat: 19.0760, lon: 72.8777, keywords: ["bombay", "mumbai city", "suburban mumbai", "maharashtra"] },
  { name: "New Delhi / Delhi", state: "Delhi", region: "North-West", lat: 28.6139, lon: 77.2090, keywords: ["delhi", "ncr", "new delhi", "noida", "gurugram", "gurgaon", "faridabad"] },
  { name: "Bengaluru / Bangalore", state: "Karnataka", region: "Southern Peninsular", lat: 12.9716, lon: 77.5946, keywords: ["bangalore", "bengaluru", "silicon valley", "karnataka"] },
  { name: "Hyderabad", state: "Telangana", region: "Southern Peninsular", lat: 17.3850, lon: 78.4867, keywords: ["hyderabad", "secunderabad", "cyberabad", "telangana"] },
  { name: "Chennai", state: "Tamil Nadu", region: "Southern Peninsular", lat: 13.0827, lon: 80.2707, keywords: ["madras", "chennai", "tamil nadu"] },
  { name: "Kolkata", state: "West Bengal", region: "East Coast & Delta", lat: 22.5726, lon: 88.3639, keywords: ["calcutta", "kolkata", "howrah", "west bengal"] },
  { name: "Ahmedabad", state: "Gujarat", region: "West Coast", lat: 23.0225, lon: 72.5714, keywords: ["ahmedabad", "gandhinagar", "gujarat"] },
  { name: "Pune", state: "Maharashtra", region: "Western Ghats", lat: 18.5204, lon: 73.8567, keywords: ["pune", "pcmc", "maharashtra"] },
  { name: "Jaipur", state: "Rajasthan", region: "North-West", lat: 26.9124, lon: 75.7873, keywords: ["jaipur", "pink city", "rajasthan"] },
  { name: "Lucknow", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 26.8467, lon: 80.9462, keywords: ["lucknow", "up", "uttar pradesh"] },
  { name: "Surat", state: "Gujarat", region: "West Coast", lat: 21.1702, lon: 72.8311, keywords: ["surat", "gujarat"] },
  { name: "Kanpur", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 26.4499, lon: 80.3319, keywords: ["kanpur", "uttar pradesh"] },
  { name: "Nagpur", state: "Maharashtra", region: "Central India", lat: 21.1458, lon: 79.0882, keywords: ["nagpur", "orange city"] },
  { name: "Indore", state: "Madhya Pradesh", region: "Central India", lat: 22.7196, lon: 75.8577, keywords: ["indore", "mp", "madhya pradesh"] },
  { name: "Thane", state: "Maharashtra", region: "West Coast", lat: 19.2183, lon: 72.9781, keywords: ["thane", "mumbai mmr"] },
  { name: "Bhopal", state: "Madhya Pradesh", region: "Central India", lat: 23.2599, lon: 77.4126, keywords: ["bhopal", "madhya pradesh"] },
  { name: "Visakhapatnam", state: "Andhra Pradesh", region: "East Coast & Delta", lat: 17.6868, lon: 83.2185, keywords: ["vizag", "visakhapatnam", "andhra"] },
  { name: "Patna", state: "Bihar", region: "Indo-Gangetic Plain", lat: 25.5941, lon: 85.1376, keywords: ["patna", "bihar"] },
  { name: "Vadodara", state: "Gujarat", region: "West Coast", lat: 22.3072, lon: 73.1812, keywords: ["baroda", "vadodara", "gujarat"] },
  { name: "Ghaziabad", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 28.6692, lon: 77.4538, keywords: ["ghaziabad", "ncr"] },
  { name: "Ludhiana", state: "Punjab", region: "North-West", lat: 30.9010, lon: 75.8573, keywords: ["ludhiana", "punjab"] },
  { name: "Agra", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 27.1767, lon: 78.0081, keywords: ["agra", "taj mahal"] },
  { name: "Nashik", state: "Maharashtra", region: "Western Ghats", lat: 19.9975, lon: 73.7898, keywords: ["nashik", "maharashtra"] },
  { name: "Varanasi", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 25.3176, lon: 82.9739, keywords: ["banaras", "varanasi", "kashi"] },
  { name: "Srinagar", state: "Jammu & Kashmir", region: "Himalayan", lat: 34.0837, lon: 74.7973, keywords: ["srinagar", "kashmir", "j&k"] },
  { name: "Shimla", state: "Himachal Pradesh", region: "Himalayan", lat: 31.1048, lon: 77.1734, keywords: ["shimla", "himachal"] },
  { name: "Dehradun", state: "Uttarakhand", region: "Himalayan", lat: 30.3165, lon: 78.0322, keywords: ["dehradun", "uttarakhand"] },
  { name: "Guwahati", state: "Assam", region: "North-East", lat: 26.1445, lon: 91.7362, keywords: ["guwahati", "dispur", "assam"] },
  { name: "Bhubaneswar", state: "Odisha", region: "East Coast & Delta", lat: 20.2961, lon: 85.8245, keywords: ["bhubaneswar", "cuttack", "odisha"] },
  { name: "Ranchi", state: "Jharkhand", region: "Central India", lat: 23.3441, lon: 85.3096, keywords: ["ranchi", "jharkhand"] },
  { name: "Raipur", state: "Chhattisgarh", region: "Central India", lat: 21.2514, lon: 81.6296, keywords: ["raipur", "chhattisgarh"] },
  { name: "Thiruvananthapuram", state: "Kerala", region: "Western Ghats", lat: 8.5241, lon: 76.9366, keywords: ["trivandrum", "thiruvananthapuram", "kerala"] },
  { name: "Kochi / Cochin", state: "Kerala", region: "West Coast", lat: 9.9312, lon: 76.2673, keywords: ["kochi", "cochin", "ernakulam", "kerala"] },
  { name: "Kozhikode", state: "Kerala", region: "West Coast", lat: 11.2588, lon: 75.7804, keywords: ["calicut", "kozhikode", "kerala"] },
  { name: "Madurai", state: "Tamil Nadu", region: "Southern Peninsular", lat: 9.9252, lon: 78.1198, keywords: ["madurai", "tamil nadu"] },
  { name: "Coimbatore", state: "Tamil Nadu", region: "Western Ghats", lat: 11.0168, lon: 76.9558, keywords: ["coimbatore", "kovai"] },
  { name: "Chandigarh", state: "Punjab / Haryana", region: "North-West", lat: 30.7333, lon: 76.7794, keywords: ["chandigarh", "mohali", "panchkula"] },
  { name: "Panaji / Goa", state: "Goa", region: "West Coast", lat: 15.4909, lon: 73.8278, keywords: ["goa", "panaji", "panjim"] },
  { name: "Imphal", state: "Manipur", region: "North-East", lat: 24.8170, lon: 93.9368, keywords: ["imphal", "manipur"] },
  { name: "Shillong", state: "Meghalaya", region: "North-East", lat: 25.5788, lon: 91.8933, keywords: ["shillong", "meghalaya"] },
  { name: "Aizawl", state: "Mizoram", region: "North-East", lat: 23.7271, lon: 92.7176, keywords: ["aizawl", "mizoram"] },
  { name: "Agartala", state: "Tripura", region: "North-East", lat: 23.8315, lon: 91.2868, keywords: ["agartala", "tripura"] },
  { name: "Gangtok", state: "Sikkim", region: "Himalayan", lat: 27.3389, lon: 88.6065, keywords: ["gangtok", "sikkim"] },
  { name: "Itanagar", state: "Arunachal Pradesh", region: "North-East", lat: 27.0844, lon: 93.6053, keywords: ["itanagar", "arunachal"] },
  { name: "Kohima", state: "Nagaland", region: "North-East", lat: 25.6751, lon: 94.1086, keywords: ["kohima", "nagaland"] },
  { name: "Port Blair", state: "Andaman & Nicobar Island", region: "Islands", lat: 11.6233, lon: 92.7265, keywords: ["port blair", "andaman"] },
  { name: "Jammu", state: "Jammu & Kashmir", region: "Himalayan", lat: 32.7266, lon: 74.8570, keywords: ["jammu"] },
  { name: "Leh", state: "Ladakh", region: "Himalayan", lat: 34.1526, lon: 77.5771, keywords: ["leh", "ladakh"] },
  { name: "Jodhpur", state: "Rajasthan", region: "North-West", lat: 26.2389, lon: 73.0243, keywords: ["jodhpur"] },
  { name: "Udaipur", state: "Rajasthan", region: "North-West", lat: 24.5854, lon: 73.7125, keywords: ["udaipur"] },
  { name: "Jamshedpur", state: "Jharkhand", region: "Central India", lat: 22.8046, lon: 86.2029, keywords: ["jamshedpur", "tatanagar"] },
  { name: "Gwalior", state: "Madhya Pradesh", region: "Central India", lat: 26.2183, lon: 78.1828, keywords: ["gwalior"] },
  { name: "Jabalpur", state: "Madhya Pradesh", region: "Central India", lat: 23.1815, lon: 79.9864, keywords: ["jabalpur"] },
  { name: "Vijayawada", state: "Andhra Pradesh", region: "East Coast & Delta", lat: 16.5062, lon: 80.6480, keywords: ["vijayawada"] },
  { name: "Tiruchirappalli", state: "Tamil Nadu", region: "Southern Peninsular", lat: 10.7905, lon: 78.7047, keywords: ["trichy", "tiruchirappalli"] },
  { name: "Salem", state: "Tamil Nadu", region: "Southern Peninsular", lat: 11.6643, lon: 78.1460, keywords: ["salem"] },
  { name: "Mysuru / Mysore", state: "Karnataka", region: "Southern Peninsular", lat: 12.2958, lon: 76.6394, keywords: ["mysore", "mysuru"] },
  { name: "Mangaluru / Mangalore", state: "Karnataka", region: "West Coast", lat: 12.9141, lon: 74.8560, keywords: ["mangalore", "mangaluru"] },
  { name: "Hubballi-Dharwad", state: "Karnataka", region: "Southern Peninsular", lat: 15.3647, lon: 75.1240, keywords: ["hubli", "hubballi"] },
  { name: "Belagavi / Belgaum", state: "Karnataka", region: "Southern Peninsular", lat: 15.8497, lon: 74.4977, keywords: ["belgaum", "belagavi"] },
  { name: "Amritsar", state: "Punjab", region: "North-West", lat: 31.6340, lon: 74.8723, keywords: ["amritsar"] },
  { name: "Jalandhar", state: "Punjab", region: "North-West", lat: 31.3260, lon: 75.5762, keywords: ["jalandhar"] },
  { name: "Bareilly", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 28.3670, lon: 79.4304, keywords: ["bareilly"] },
  { name: "Aligarh", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 27.8974, lon: 78.0880, keywords: ["aligarh"] },
  { name: "Meerut", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 28.9845, lon: 77.7064, keywords: ["meerut"] },
  { name: "Prayagraj / Allahabad", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 25.4358, lon: 81.8463, keywords: ["allahabad", "prayagraj"] },
  { name: "Gorakhpur", state: "Uttar Pradesh", region: "Indo-Gangetic Plain", lat: 26.7606, lon: 83.3732, keywords: ["gorakhpur"] },
  { name: "Dhanbad", state: "Jharkhand", region: "Central India", lat: 23.7957, lon: 86.4304, keywords: ["dhanbad"] },
  { name: "Siliguri", state: "West Bengal", region: "East Coast & Delta", lat: 26.7271, lon: 88.3953, keywords: ["siliguri"] },
  { name: "Asansol", state: "West Bengal", region: "East Coast & Delta", lat: 23.6889, lon: 86.9661, keywords: ["asansol"] },
  { name: "Rourkela", state: "Odisha", region: "Central India", lat: 22.2604, lon: 84.8536, keywords: ["rourkela"] },
  { name: "Cuttack", state: "Odisha", region: "East Coast & Delta", lat: 20.4625, lon: 85.8828, keywords: ["cuttack"] },
  { name: "Dibrugarh", state: "Assam", region: "North-East", lat: 27.4728, lon: 94.9120, keywords: ["dibrugarh"] },
  { name: "Silchar", state: "Assam", region: "North-East", lat: 24.8333, lon: 92.7789, keywords: ["silchar"] }
];

/**
 * Finds the closest 0.25° grid cell to target lat/lon coordinates.
 */
export function findNearestGridCell(targetLat, targetLon, cells = []) {
  if (!cells || cells.length === 0) return null;
  let minDistance = Infinity;
  let nearestCell = null;

  for (const cell of cells) {
    const lat = Number(cell.latitude);
    const lon = Number(cell.longitude);
    // Distance approximation in degrees (1° ~ 111km)
    const dist = Math.hypot(lat - targetLat, lon - targetLon);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCell = cell;
    }
  }

  const distanceKm = Math.round(minDistance * 111);
  return { nearestCell, distanceKm };
}

/**
 * Intelligent Multi-Criteria Search: Cities, Cell IDs, States & Regions.
 */
export function searchGridDatabase(query, cells = []) {
  if (!query || !query.trim()) {
    // Return top 12 major cities by default if search is empty
    return {
      cities: MAJOR_INDIAN_CITIES.slice(0, 10).map((city) => {
        const match = findNearestGridCell(city.lat, city.lon, cells);
        return {
          type: "city",
          city,
          cell: match?.nearestCell,
          distanceKm: match?.distanceKm,
        };
      }),
      cellMatches: [],
    };
  }

  const q = query.toLowerCase().trim();

  // 1. Search Major Cities
  const cityMatches = MAJOR_INDIAN_CITIES.filter((c) =>
    c.name.toLowerCase().includes(q) ||
    c.state.toLowerCase().includes(q) ||
    c.keywords.some((k) => k.toLowerCase().includes(q))
  ).map((city) => {
    const match = findNearestGridCell(city.lat, city.lon, cells);
    return {
      type: "city",
      city,
      cell: match?.nearestCell,
      distanceKm: match?.distanceKm,
    };
  });

  // 2. Search Direct Grid Cells & States
  const cellMatches = cells
    .filter((cell) => {
      const cellIdStr = String(cell.cell_id).toLowerCase();
      const stateStr = String(cell.state || "").toLowerCase();
      const regionStr = String(cell.region || "").toLowerCase();
      return (
        cellIdStr.includes(q) ||
        stateStr.includes(q) ||
        regionStr.includes(q)
      );
    })
    .slice(0, 25)
    .map((cell) => ({
      type: "cell",
      cell,
    }));

  return {
    cities: cityMatches.slice(0, 15),
    cellMatches: cellMatches.slice(0, 25),
  };
}

// Region Metadata, Multi-Category Mapping & Bounding Box Utilities for India Grid

export const REGION_CATEGORIES = [
  { id: "all", name: "All Regions of India" },
  { id: "southern_peninsula", name: "Southern Peninsula / Southern Peninsular", aliases: ["Southern Peninsular", "Deccan Plateau"], states: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Puducherry"] },
  { id: "southern_coast", name: "Southern Coast & Western Ghats", aliases: ["Western Ghats", "Southern Peninsular", "Eastern Coastal"], states: ["Kerala", "Tamil Nadu", "Goa", "Karnataka", "Andhra Pradesh", "Puducherry"] },
  { id: "western_ghats", name: "Western Ghats & West Coast", aliases: ["Western Ghats"], states: ["Kerala", "Goa", "Karnataka", "Maharashtra"] },
  { id: "eastern_coastal", name: "Eastern Coastal & Delta", aliases: ["Eastern Coastal"], states: ["Tamil Nadu", "Andhra Pradesh", "Odisha", "West Bengal", "Puducherry"] },
  { id: "central_india", name: "Central India & Plateau", aliases: ["Central India", "Deccan Plateau"], states: ["Madhya Pradesh", "Chhattisgarh", "Maharashtra", "Jharkhand"] },
  { id: "indo_gangetic", name: "Northern Plains & Indo-Gangetic", aliases: ["Northern Plains"], states: ["Uttar Pradesh", "Bihar", "West Bengal", "NCT of Delhi", "Punjab", "Haryana"] },
  { id: "northwest_arid", name: "North-West & Arid Region", aliases: ["Northwest Arid"], states: ["Rajasthan", "Gujarat", "Dadara & Nagar Havelli"] },
  { id: "himalayan", name: "Northern Himalayas & Mountainous", aliases: ["Northern Himalayas"], states: ["Jammu & Kashmir", "Ladakh", "Himachal Pradesh", "Uttarakhand", "Sikkim"] },
  { id: "northeast", name: "North-East Region", aliases: ["North-East"], states: ["Assam", "Meghalaya", "Arunachal Pradesh", "Manipur", "Mizoram", "Nagaland", "Tripura"] },
  { id: "islands", name: "Island Territories", aliases: ["Islands"], states: ["Andaman & Nicobar Island"] }
];

/**
 * Checks if a cell belongs to a selected region filter.
 * Supports overlapping multi-region categories (e.g., cell can be part of both Southern Peninsula & Southern Coast).
 */
export function cellMatchesRegion(cell, filterId) {
  if (!filterId || filterId === "all") return true;

  const category = REGION_CATEGORIES.find((r) => r.id === filterId);
  if (!category) {
    // Fallback direct literal comparison if custom filter string passed
    return (
      cell.region === filterId ||
      String(cell.state || "").toLowerCase().includes(filterId.toLowerCase())
    );
  }

  const cellRegion = cell.region || "";
  const cellState = cell.state || "";

  // Check alias match
  if (category.aliases && category.aliases.includes(cellRegion)) {
    return true;
  }

  // Check state match
  if (category.states && category.states.includes(cellState)) {
    return true;
  }

  return false;
}

/**
 * Calculates latitude/longitude bounding box for cells matching a region filter.
 * Returns [[minLat, minLon], [maxLat, maxLon]] or null.
 */
export function getRegionBounds(cells = [], filterId = "all") {
  if (!cells || cells.length === 0 || filterId === "all") return null;

  const matchingCells = cells.filter((c) => cellMatchesRegion(c, filterId));
  if (matchingCells.length === 0) return null;

  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;

  for (const cell of matchingCells) {
    const lat = Number(cell.latitude);
    const lon = Number(cell.longitude);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
    }
  }

  if (minLat === Infinity) return null;

  // Add a small padding buffer in degrees
  const buffer = 0.3;
  return [
    [minLat - buffer, minLon - buffer],
    [maxLat + buffer, maxLon + buffer],
  ];
}

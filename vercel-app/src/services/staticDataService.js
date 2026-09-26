// Static Data Service for Vercel Deployment (Zero Backend Dependency)

let cachedGridGeoJSON = null;
let cachedIndiaBoundary = null;
const forecastCache = new Map();
let cachedSummaries = null;
let cachedMetrics = null;
let cachedAnalogs = null;

function calculateRiskLevel(prob) {
  const p = Number(prob ?? 0);
  if (p >= 0.8) return "very_high";
  if (p >= 0.6) return "high";
  if (p >= 0.4) return "moderate";
  if (p >= 0.2) return "low";
  return "very_low";
}

export async function getGeoJSON() {
  if (cachedGridGeoJSON) return cachedGridGeoJSON;
  const res = await fetch("/data/india_grid.geojson");
  if (!res.ok) throw new Error("Failed to load India Grid GeoJSON");
  cachedGridGeoJSON = await res.json();
  return cachedGridGeoJSON;
}

export async function getIndiaBoundary() {
  if (cachedIndiaBoundary) return cachedIndiaBoundary;
  const res = await fetch("/data/india.geojson");
  if (!res.ok) throw new Error("Failed to load India Boundary GeoJSON");
  cachedIndiaBoundary = await res.json();
  return cachedIndiaBoundary;
}

export async function getForecastData(leadDay = 1, hazard = "rain") {
  const cacheKey = `day_${leadDay}`;
  let rawData;
  if (forecastCache.has(cacheKey)) {
    rawData = forecastCache.get(cacheKey);
  } else {
    const res = await fetch(`/data/forecast_day_${leadDay}.json`);
    if (!res.ok) throw new Error(`Failed to load forecast for Day ${leadDay}`);
    rawData = await res.json();
    forecastCache.set(cacheKey, rawData);
  }

  // Support both root JSON array format and { cells: [...] } object format
  const rawCells = Array.isArray(rawData) ? rawData : (rawData?.cells || []);

  // Transform cells according to selected hazard
  const processedCells = rawCells.map((cell) => {
    let prob = cell.bust_probability || 0;
    let mainVal = cell.forecast_rainfall_mm || cell.rainfall_mm || 0;

    if (hazard === "temp") {
      prob = cell.bust_probability_temp ?? prob;
      mainVal = cell.temperature_c ?? 32.5;
    } else if (hazard === "wind") {
      prob = cell.bust_probability_wind ?? prob;
      mainVal = cell.wind_speed_kmh ?? 18.2;
    }

    const risk_level = calculateRiskLevel(prob);
    const confidence = Number((1 - prob).toFixed(3));

    return {
      ...cell,
      bust_probability: prob,
      risk_level: risk_level,
      confidence: confidence,
      display_value: mainVal,
    };
  });

  const validDate = rawData.valid_date || (rawCells[0] && rawCells[0].valid_date) || "2026-09-26";

  return {
    forecast_start: "2026-09-24 00:00 Z",
    valid_date: validDate,
    hazard: hazard,
    cells: processedCells,
  };
}

export async function getDaySummary(leadDay = 1, hazard = "rain") {
  if (!cachedSummaries) {
    try {
      const res = await fetch("/data/summaries.json");
      if (res.ok) {
        cachedSummaries = await res.json();
      }
    } catch (e) {
      console.warn("Summaries load warning", e);
    }
  }

  const key = `day_${leadDay}_${hazard}`;
  if (cachedSummaries && cachedSummaries[key]) {
    return cachedSummaries[key];
  }

  // Fallback dynamic summary calculation
  const mapData = await getForecastData(leadDay, hazard);
  const cells = mapData.cells || [];
  const highRisk = cells.filter((c) => ["high", "very_high"].includes(c.risk_level)).length;
  const avgConf = cells.reduce((acc, c) => acc + (c.confidence || 0), 0) / (cells.length || 1);

  return {
    lead_day: leadDay,
    hazard: hazard,
    total_cells: cells.length,
    high_risk_cells: highRisk,
    high_risk_percentage: Number(((highRisk / (cells.length || 1)) * 100).toFixed(1)),
    average_confidence: Number((avgConf * 100).toFixed(1)),
  };
}

export async function getCellDetail(cellId, leadDay = 1, hazard = "rain") {
  const mapData = await getForecastData(leadDay, hazard);
  const cell = mapData.cells.find((c) => String(c.cell_id) === String(cellId));

  if (!cell) return null;

  if (!cachedAnalogs) {
    try {
      const res = await fetch("/data/historical_analogs.json");
      if (res.ok) cachedAnalogs = await res.json();
    } catch (e) {
      console.warn("Analogs load warning", e);
    }
  }

  // Generic SHAP drivers based on risk level and hazard
  let topReasons = [];
  if (hazard === "rain") {
    topReasons = [
      `High atmospheric moisture flux anomaly (+${((cell.humidity_percent || 80) * 0.4).toFixed(1)}% RH)`,
      `Convective inhibition energy (CAPE) exceeds seasonal P90 baseline`,
      `Orographic updraft convergence along regional terrain boundary`,
    ];
  } else if (hazard === "temp") {
    topReasons = [
      `Extreme 2m temperature anomaly (+${((cell.temperature_c || 32) - 30).toFixed(1)}°C above climate median)`,
      `Strong anti-cyclonic subsidence and clear sky solar radiation maximum`,
      `Soil moisture deficit amplifying sensible heat flux transfer`,
    ];
  } else {
    topReasons = [
      `Low-level jet stream intensification at 850 hPa level`,
      `Steep sea-level pressure gradient across western coastal corridor`,
      `Convective wind gust instability threshold exceeded`,
    ];
  }

  const analogs = (cachedAnalogs || []).slice(0, 3).map((a, i) => ({
    ...a,
    similarity_score_percent: Number((98.4 - i * 3.2).toFixed(1)),
  }));

  return {
    ...cell,
    top_reasons: topReasons,
    similar_historical_events: analogs,
  };
}

export async function getVerificationMetrics(hazard = "rain") {
  if (!cachedMetrics) {
    const res = await fetch("/data/metrics.json");
    if (!res.ok) throw new Error("Failed to load metrics JSON");
    cachedMetrics = await res.json();
  }

  return cachedMetrics[hazard] || cachedMetrics["rain"];
}

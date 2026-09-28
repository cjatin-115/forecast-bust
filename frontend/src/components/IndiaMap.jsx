import { useEffect, useMemo, useState, useRef } from "react";
import L from "leaflet";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import MapLegend from "./MapLegend";
import { cellMatchesRegion, getRegionBounds } from "../services/regionUtils";
import { Satellite, Globe } from "lucide-react";

function getRiskColor(prob) {
  const p = Number(prob ?? 0);
  if (p < 0.2) return "#10b981"; // Green (Very Low Risk)
  if (p < 0.4) return "#84cc16"; // Lime (Low Risk)
  if (p < 0.6) return "#f59e0b"; // Amber (Moderate Risk)
  if (p < 0.8) return "#f97316"; // Orange (High Risk)
  return "#ef4444"; // Red (Very High Risk)
}

function getRainfallColor(rainfall) {
  const r = Number(rainfall ?? 0);
  if (r < 5) return "#dcfce7";
  if (r < 20) return "#86efac";
  if (r < 50) return "#fde047";
  if (r < 100) return "#fb923c";
  return "#ef4444";
}

function getTempColor(temp) {
  const t = Number(temp ?? 30);
  if (t < 25) return "#93c5fd";
  if (t < 32) return "#fde047";
  if (t < 38) return "#fb923c";
  if (t < 44) return "#ef4444";
  return "#991b1b";
}

function getWindColor(speed) {
  const w = Number(speed ?? 15);
  if (w < 15) return "#ccfbf1";
  if (w < 35) return "#5eead4";
  if (w < 55) return "#0d9488";
  if (w < 75) return "#0f766e";
  return "#115e59";
}

// Controller to handle bounds fit, region zoom-in, and cell flyTo
function MapController({ geoJson, cells, selectedCell, regionFilter }) {
  const map = useMap();
  const initialFitDone = useRef(false);

  // Initial map center fit
  useEffect(() => {
    if (!geoJson || initialFitDone.current) return;
    try {
      const layer = L.geoJSON(geoJson);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [18, 18], maxZoom: 5.2 });
        initialFitDone.current = true;
        requestAnimationFrame(() => map.invalidateSize());
      }
    } catch (e) {
      console.warn("Bounds calculation warning:", e);
    }
  }, [geoJson, map]);

  // Zoom into Selected Region
  useEffect(() => {
    if (!regionFilter || regionFilter === "all") {
      if (initialFitDone.current && !selectedCell && geoJson) {
        try {
          const layer = L.geoJSON(geoJson);
          const bounds = layer.getBounds();
          if (bounds.isValid()) map.flyToBounds(bounds, { padding: [18, 18], duration: 1.0 });
        } catch (e) {}
      }
      return;
    }

    const regionBounds = getRegionBounds(cells, regionFilter);
    if (regionBounds) {
      try {
        map.flyToBounds(regionBounds, {
          padding: [30, 30],
          maxZoom: 6.8,
          duration: 1.2,
        });
      } catch (e) {
        console.warn("Region flyToBounds error:", e);
      }
    }
  }, [regionFilter, cells, geoJson, map, selectedCell]);

  // FlyTo Selected Grid Cell
  useEffect(() => {
    if (!selectedCell?.latitude || !selectedCell?.longitude) return;
    try {
      const lat = Number(selectedCell.latitude);
      const lon = Number(selectedCell.longitude);
      map.flyTo([lat, lon], 7.5, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    } catch (e) {
      console.warn("FlyTo cell warning:", e);
    }
  }, [selectedCell, map]);

  return null;
}

export default function IndiaMap({
  cells = [],
  selectedCell,
  onCellSelect,
  viewMode = "risk",
  hazard = "rain",
  riskFilter = "all",
  regionFilter = "all",
  mapTheme = "satellite",
  setMapTheme,
}) {
  const [gridGeoJson, setGridGeoJson] = useState(null);
  const [indiaBoundary, setIndiaBoundary] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const geoJsonRef = useRef(null);

  // Normalize active theme to either "satellite" or "standard"
  const activeTheme = mapTheme === "standard" ? "standard" : "satellite";

  const toggleTheme = (newTheme) => {
    if (setMapTheme) setMapTheme(newTheme);
  };

  useEffect(() => {
    fetch("/data/india_grid.geojson")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} loading grid`);
        return res.json();
      })
      .then((data) => {
        if (data && data.features) setGridGeoJson(data);
      })
      .catch((err) => {
        console.error("Grid GeoJSON error:", err);
        setFetchError(err.message);
      });

    fetch("/data/india.geojson")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.features) setIndiaBoundary(data);
      })
      .catch((err) => console.warn("India boundary warning:", err));
  }, []);

  const cellDataMap = useMemo(() => {
    return new Map(cells.map((c) => [String(c.cell_id), c]));
  }, [cells]);

  // Translucent Grid Styling so map underneath is visible
  const styleFeature = (feature) => {
    const cellId = feature?.properties?.cell_id;
    const cell = cellDataMap.get(String(cellId));
    const isSelected = selectedCell && String(selectedCell.cell_id) === String(cellId);

    if (!cell) {
      return {
        color: "rgba(255, 255, 255, 0.3)",
        weight: 0.3,
        fillColor: "#e2e8f0",
        fillOpacity: 0.15,
      };
    }

    // Region Filter Matching
    const matchesReg = cellMatchesRegion(cell, regionFilter);

    // Filter dimming
    let baseOpacity = activeTheme === "satellite" ? 0.35 : 0.40;
    if (!matchesReg) {
      baseOpacity = 0.05;
    } else if (riskFilter === "high_risk" && !["high", "very_high"].includes(cell.risk_level)) {
      baseOpacity = 0.05;
    } else if (riskFilter === "moderate_plus" && !["moderate", "high", "very_high"].includes(cell.risk_level)) {
      baseOpacity = 0.05;
    } else if (riskFilter === "very_high" && cell.risk_level !== "very_high") {
      baseOpacity = 0.05;
    }

    let fillColor;
    if (viewMode === "risk") {
      fillColor = getRiskColor(cell.bust_probability);
    } else {
      if (hazard === "temp") fillColor = getTempColor(cell.temperature_c);
      else if (hazard === "wind") fillColor = getWindColor(cell.wind_speed_kmh);
      else fillColor = getRainfallColor(cell.forecast_rainfall_mm || cell.rainfall_mm);
    }

    return {
      color: isSelected ? "#3b82f6" : activeTheme === "satellite" ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 116, 139, 0.4)",
      weight: isSelected ? 2.5 : 0.5,
      fillColor: fillColor,
      fillOpacity: isSelected ? 0.80 : baseOpacity,
    };
  };

  const onEachFeature = (feature, layer) => {
    const cellId = feature?.properties?.cell_id;
    const cell = cellDataMap.get(String(cellId));

    const lat = Number(cell?.latitude ?? feature?.properties?.latitude ?? 0);
    const lon = Number(cell?.longitude ?? feature?.properties?.longitude ?? 0);
    const rainfall = Number(cell?.forecast_rainfall_mm ?? cell?.rainfall_mm ?? 0);
    const temp = Number(cell?.temperature_c ?? 32);
    const wind = Number(cell?.wind_speed_kmh ?? 18);
    const prob = Number(cell?.bust_probability ?? 0);
    const conf = Number(cell?.confidence ?? 1);
    const stateName = cell?.state || feature?.properties?.state || "India Grid";
    const regionName = cell?.region || feature?.properties?.region || "Region";
    const riskLevelStr = (cell?.risk_level || "low").replace("_", " ").toUpperCase();

    const popupHtml = `
      <div class="p-1 min-w-[220px] font-sans text-xs">
        <div class="flex items-center justify-between font-bold text-sm text-slate-900 mb-1 border-b border-slate-100 pb-1">
          <span>${cellId}</span>
          <span class="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
            riskLevelStr.includes("VERY HIGH") ? "bg-red-100 text-red-700" :
            riskLevelStr.includes("HIGH") ? "bg-orange-100 text-orange-700" :
            riskLevelStr.includes("MODERATE") ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          }">${riskLevelStr}</span>
        </div>
        <p class="text-slate-600 font-medium mb-0.5">${stateName}</p>
        <p class="text-[11px] text-blue-600 font-semibold mb-2">${regionName} (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)</p>
        
        <div class="space-y-1.5 border-t border-slate-100 pt-2">
          <div class="flex justify-between items-center"><span class="text-slate-500 font-medium">Bust Probability:</span><span class="font-bold text-slate-900">${(prob * 100).toFixed(1)}%</span></div>
          <div class="flex justify-between items-center"><span class="text-slate-500 font-medium">Model Confidence:</span><span class="font-bold text-emerald-600">${(conf * 100).toFixed(1)}%</span></div>
          <div class="flex justify-between items-center"><span class="text-slate-500 font-medium">Precipitation:</span><span class="font-bold text-blue-600">${rainfall.toFixed(1)} mm</span></div>
          <div class="flex justify-between items-center"><span class="text-slate-500 font-medium">2m Temperature:</span><span class="font-bold text-amber-600">${temp.toFixed(1)} °C</span></div>
          <div class="flex justify-between items-center"><span class="text-slate-500 font-medium">10m Wind Speed:</span><span class="font-bold text-teal-600">${wind.toFixed(1)} km/h</span></div>
        </div>
      </div>
    `;

    layer.bindPopup(popupHtml);

    layer.on({
      click: () => {
        if (cell && onCellSelect) {
          onCellSelect(cell);
        }
      },
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 2.0, color: "#ffffff", fillOpacity: 0.70 });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(styleFeature(feature));
      },
    });
  };

  return (
    <div className="relative h-full w-full min-h-[650px] bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800">
      {fetchError && (
        <div className="absolute top-3 left-3 z-10 bg-red-100 border border-red-300 text-red-700 text-xs px-3 py-1.5 rounded-lg shadow">
          Grid Layer Load Warning: {fetchError}
        </div>
      )}

      {/* FLOATING SATELLITE / STANDARD MAP TOGGLE (z-10 ensures sticky header z-1000 stays above) */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200">
        <button
          onClick={() => toggleTheme("satellite")}
          title="Satellite Map (Esri High-Res Imagery)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTheme === "satellite"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Satellite className="h-3.5 w-3.5 text-blue-400" />
          <span>Satellite View</span>
        </button>
        <button
          onClick={() => toggleTheme("standard")}
          title="Standard OpenStreetMap"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTheme === "standard"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Globe className="h-3.5 w-3.5 text-emerald-500" />
          <span>Standard</span>
        </button>
      </div>

      <MapContainer
        center={[22.5, 79.5]}
        zoom={4.8}
        scrollWheelZoom={true}
        className="h-full w-full min-h-[650px] rounded-2xl z-0"
        style={{ height: "100%", width: "100%", minHeight: "650px" }}
      >
        {/* TILE LAYERS */}
        {activeTheme === "satellite" ? (
          <>
            <TileLayer
              key="satellite-layer"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, USDA, USGS"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              key="satellite-labels"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />
          </>
        ) : (
          <TileLayer
            key="standard-layer"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {/* 1. GRID GeoJSON LAYER */}
        {gridGeoJson && (
          <>
            <GeoJSON
              ref={geoJsonRef}
              key={`grid-${viewMode}-${hazard}-${riskFilter}-${regionFilter}-${activeTheme}-${cells.length}`}
              data={gridGeoJson}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
            <MapController
              geoJson={gridGeoJson}
              cells={cells}
              selectedCell={selectedCell}
              regionFilter={regionFilter}
            />
          </>
        )}

        {/* 2. STATE BOUNDARIES OVERLAY */}
        {indiaBoundary && (
          <GeoJSON
            key={`boundary-${activeTheme}`}
            data={indiaBoundary}
            interactive={false}
            style={{
              color: activeTheme === "satellite" ? "#ffffff" : "#0f172a",
              weight: 1.8,
              fillColor: "transparent",
              fillOpacity: 0,
            }}
          />
        )}
      </MapContainer>

      {/* MAP LEGEND */}
      <MapLegend viewMode={viewMode} hazard={hazard} />
    </div>
  );
}
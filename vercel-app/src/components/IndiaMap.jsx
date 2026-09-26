import { useEffect, useMemo, useState, useRef } from "react";
import L from "leaflet";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import MapLegend from "./MapLegend";
import { getGeoJSON, getIndiaBoundary } from "../services/staticDataService";

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

function MapBoundsController({ geoJson }) {
  const map = useMap();

  useEffect(() => {
    if (!geoJson) return;
    try {
      const layer = L.geoJSON(geoJson);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [18, 18], maxZoom: 5.2 });
        requestAnimationFrame(() => map.invalidateSize());
      }
    } catch (e) {
      console.warn("Bounds calculation warning:", e);
    }
  }, [geoJson, map]);

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
}) {
  const [gridGeoJson, setGridGeoJson] = useState(null);
  const [indiaBoundary, setIndiaBoundary] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const geoJsonRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    getGeoJSON()
      .then((data) => {
        if (isMounted && data && data.features) setGridGeoJson(data);
      })
      .catch((err) => {
        console.error("Grid GeoJSON load error:", err);
        if (isMounted) setFetchError(err.message);
      });

    getIndiaBoundary()
      .then((data) => {
        if (isMounted && data && data.features) setIndiaBoundary(data);
      })
      .catch((err) => console.warn("Boundary load warning:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const cellDataMap = useMemo(() => {
    return new Map(cells.map((c) => [String(c.cell_id), c]));
  }, [cells]);

  const styleFeature = (feature) => {
    const cellId = feature?.properties?.cell_id;
    const cell = cellDataMap.get(String(cellId));
    const isSelected = selectedCell && String(selectedCell.cell_id) === String(cellId);

    if (!cell) {
      return {
        color: "#cbd5e1",
        weight: 0.3,
        fillColor: "#e2e8f0",
        fillOpacity: 0.3,
      };
    }

    // Apply Filter Dimming
    let opacity = mapTheme === "satellite" ? 0.8 : 0.75;
    if (riskFilter === "high_risk" && !["high", "very_high"].includes(cell.risk_level)) {
      opacity = 0.1;
    } else if (riskFilter === "moderate_plus" && !["moderate", "high", "very_high"].includes(cell.risk_level)) {
      opacity = 0.1;
    } else if (riskFilter === "very_high" && cell.risk_level !== "very_high") {
      opacity = 0.1;
    }

    if (regionFilter !== "all" && cell.region !== regionFilter) {
      opacity = 0.1;
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
      color: isSelected ? "#ffffff" : mapTheme === "satellite" ? "#475569" : "#64748b",
      weight: isSelected ? 2.5 : 0.4,
      fillColor: fillColor,
      fillOpacity: opacity,
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
        l.setStyle({ weight: 2.2, color: "#ffffff" });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(styleFeature(feature));
      },
    });
  };

  return (
    <div className="relative h-full w-full min-h-[650px] bg-slate-900 rounded-2xl overflow-hidden">
      {fetchError && (
        <div className="absolute top-3 left-3 z-[1000] bg-red-100 border border-red-300 text-red-700 text-xs px-3 py-1.5 rounded-lg shadow">
          Grid Layer Load Warning: {fetchError}
        </div>
      )}

      <MapContainer
        center={[22.5, 79.5]}
        zoom={4.8}
        scrollWheelZoom={true}
        className="h-full w-full min-h-[650px] rounded-2xl z-0"
        style={{ height: "100%", width: "100%", minHeight: "650px" }}
      >
        {/* SATELLITE VS STANDARD TILE LAYER */}
        {mapTheme === "satellite" ? (
          <TileLayer
            key="satellite-layer"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            key="standard-layer"
            attribution='<a href="https://leafletjs.com/">Leaflet</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {/* 1. GRID GeoJSON LAYER - STABLE KEY PREVENTS UNMOUNTING BLANK SCREEN */}
        {gridGeoJson && (
          <>
            <GeoJSON
              ref={geoJsonRef}
              key={`grid-${viewMode}-${hazard}-${riskFilter}-${regionFilter}-${mapTheme}-${cells.length}`}
              data={gridGeoJson}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
            <MapBoundsController geoJson={gridGeoJson} />
          </>
        )}

        {/* 2. STATE BOUNDARIES OVERLAY - NON-INTERACTIVE */}
        {indiaBoundary && (
          <GeoJSON
            key={`boundary-${mapTheme}`}
            data={indiaBoundary}
            interactive={false}
            style={{
              color: mapTheme === "satellite" ? "#ffffff" : "#0f172a",
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

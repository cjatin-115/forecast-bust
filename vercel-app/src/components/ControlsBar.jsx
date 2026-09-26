import { useState, useEffect } from "react";
import DaySelector from "./DaySelector";
import { Button } from "@/components/ui/button";

export default function ControlsBar({
  hazard,
  setHazard,
  leadDay,
  setLeadDay,
  viewMode,
  setViewMode,
  riskFilter,
  setRiskFilter,
  regionFilter,
  setRegionFilter,
  mapTheme,
  setMapTheme,
  forecastStart,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Playback timer for 10-day loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setLeadDay((prevDay) => (prevDay >= 10 ? 1 : prevDay + 1));
      }, 2000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setLeadDay]);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200 space-y-4">
      {/* ROW 1: HAZARD DOMAIN SELECTOR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Multi-Hazard Target Selector
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Select hazard domain to evaluate dedicated calibrated forecast bust models.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl shrink-0 border border-slate-200/60">
          <button
            onClick={() => setHazard("rain")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              hazard === "rain"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            🌧️ Heavy Rain Busts
          </button>
          <button
            onClick={() => setHazard("temp")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              hazard === "temp"
                ? "bg-white text-amber-700 shadow-sm border border-slate-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            🌡️ Heatwave Temp Busts
          </button>
          <button
            onClick={() => setHazard("wind")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              hazard === "wind"
                ? "bg-white text-teal-700 shadow-sm border border-slate-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            💨 Windstorm Busts
          </button>
        </div>
      </div>

      {/* ROW 2: FORECAST HORIZON & VIEW MODE */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Forecast Horizon & Radar Loop
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Select lead day (1–10) or launch automated 10-day risk progression playback.
            </p>
          </div>

          <Button
            variant={isPlaying ? "destructive" : "outline"}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="ml-2 h-8 text-xs font-bold gap-1.5 cursor-pointer rounded-lg shrink-0 border-slate-300"
          >
            {isPlaying ? "⏸️ Pause Loop" : "▶️ Play 10-Day Loop"}
          </Button>
        </div>

        {/* VIEW MODE TOGGLE */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl shrink-0 border border-slate-200/60">
          <button
            onClick={() => setViewMode("risk")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === "risk"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            🛡️ Bust Risk & Confidence
          </button>
          <button
            onClick={() => setViewMode("field")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === "field"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            {hazard === "temp"
              ? "🌡️ Temperature Field"
              : hazard === "wind"
              ? "💨 Wind Speed Field"
              : "🌧️ Precipitation Forecast"}
          </button>
        </div>
      </div>

      {/* DAY SELECTOR STRIP */}
      <DaySelector
        selectedDay={leadDay}
        onChange={setLeadDay}
        forecastStart={forecastStart}
      />

      {/* ROW 3: QUICK FILTERS & MAP THEME SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-1">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Risk Filter:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer text-xs shadow-xs"
            >
              <option value="all">All Cells (4,651)</option>
              <option value="high_risk">High & Very High Risk</option>
              <option value="moderate_plus">Moderate Risk & Above</option>
              <option value="very_high">Very High Risk Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Region Filter:</span>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer text-xs shadow-xs"
            >
              <option value="all">All Sub-Regions</option>
              <option value="Western Ghats">Western Ghats</option>
              <option value="North-East">North-East</option>
              <option value="Central India">Central India</option>
              <option value="Northern Plains">Northern Plains</option>
              <option value="Deccan Plateau">Deccan Plateau</option>
              <option value="Eastern Coastal">Eastern Coastal</option>
              <option value="Northwest Arid">Northwest Arid</option>
            </select>
          </div>
        </div>

        {/* MAP THEME TOGGLE */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <span className="font-bold text-slate-700">Map Theme:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
            <button
              onClick={() => setMapTheme("satellite")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
                mapTheme === "satellite"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              🛰️ Satellite (Default)
            </button>
            <button
              onClick={() => setMapTheme("standard")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
                mapTheme === "standard"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              🗺️ Standard (Original)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

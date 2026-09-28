import DaySelector from "./DaySelector";
import { REGION_CATEGORIES } from "../services/regionUtils";
import {
  CloudRain,
  Thermometer,
  Wind,
  ShieldAlert,
  Layers,
  Filter,
  Compass,
  Sliders,
} from "lucide-react";

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
  forecastStart,
}) {
  return (
    <section className="rounded-2xl bg-white p-4 sm:p-6 shadow-xs border border-slate-200/80 space-y-5 sm:space-y-6 max-w-full overflow-hidden">
      {/* ROW 1: HAZARD DOMAIN SELECTOR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4 sm:pb-5">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Multi-Hazard Target Selector</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Select hazard domain to evaluate dedicated calibrated forecast bust models.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full lg:w-auto bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setHazard("rain")}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer w-full ${
              hazard === "rain"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <CloudRain className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Heavy Rain</span>
          </button>
          <button
            onClick={() => setHazard("temp")}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer w-full ${
              hazard === "temp"
                ? "bg-white text-amber-700 shadow-sm border border-slate-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Thermometer className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Heatwave Temp</span>
          </button>
          <button
            onClick={() => setHazard("wind")}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer w-full ${
              hazard === "wind"
                ? "bg-white text-teal-700 shadow-sm border border-slate-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Wind className="h-4 w-4 text-teal-600 shrink-0" />
            <span>Windstorm</span>
          </button>
        </div>
      </div>

      {/* ROW 2: FORECAST HORIZON SELECTOR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4 sm:pb-5">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Forecast Horizon Selector
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Select target lead day (Day 1 to 10) to evaluate calibrated bust probabilities.
          </p>
        </div>

        {/* DAY SELECTOR COMPONENT */}
        <DaySelector
          selectedDay={leadDay}
          onChange={setLeadDay}
          forecastStart={forecastStart}
        />
      </div>

      {/* ROW 3: VIEW MODE & REGIONAL/RISK FILTERS */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-1">
        {/* VIEW MODE TOGGLE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            Layer Mode:
          </span>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/60 w-full sm:w-auto">
            <button
              onClick={() => setViewMode("risk")}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer ${
                viewMode === "risk"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Bust Risk & Confidence</span>
            </button>
            <button
              onClick={() => setViewMode("field")}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer ${
                viewMode === "field"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span>NWP Physical Field</span>
            </button>
          </div>
        </div>

        {/* RISK & REGION FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full md:w-auto">
          {/* RISK LEVEL FILTER */}
          <div className="flex items-center gap-1.5 text-xs w-full">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs w-full"
            >
              <option value="all">All Risk Levels</option>
              <option value="high_risk">High & Very High Risk Only</option>
              <option value="moderate_plus">Moderate Risk & Above</option>
              <option value="very_high">Critical Bust Alert Only</option>
            </select>
          </div>

          {/* REGION FILTER */}
          <div className="flex items-center gap-1.5 text-xs w-full">
            <Compass className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs w-full"
            >
              {REGION_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import ControlsBar from "./components/ControlsBar";
import IndiaMap from "./components/IndiaMap";
import GridInfoPanel from "./components/GridInfoPanel";
import SearchCommand from "./components/SearchCommand";
import VerificationModal from "./components/VerificationModal";
import { getForecastData, getDaySummary } from "./services/staticDataService";

export default function App() {
  const [leadDay, setLeadDay] = useState(1);
  const [hazard, setHazard] = useState("rain"); // "rain" | "temp" | "wind"
  const [forecast, setForecast] = useState(null);
  const [summary, setSummary] = useState(null);
  const [cells, setCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Controls & Filters
  const [viewMode, setViewMode] = useState("risk"); // "risk" | "field"
  const [riskFilter, setRiskFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [mapTheme, setMapTheme] = useState("satellite"); // "satellite" | "standard"

  // Modals
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function loadForecast(day, hazardMode = hazard) {
    try {
      setLoading(true);
      setError(null);

      const [mapData, summaryData] = await Promise.all([
        getForecastData(day, hazardMode),
        getDaySummary(day, hazardMode).catch(() => null),
      ]);

      setForecast(mapData);
      setCells(mapData.cells || []);
      setSummary(summaryData);
      setSelectedCell(null);
    } catch (err) {
      console.error("Forecast load error:", err);
      setError(`Failed to load static forecast dataset (${err.message})`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForecast(leadDay, hazard);
  }, [leadDay, hazard]);

  return (
    <div className="min-h-screen bg-slate-100/80 font-sans text-slate-800 flex flex-col antialiased">
      {/* HEADER WITH EXPANDED SEARCH & MANUAL FETCH DATA BUTTON */}
      <Header
        onOpenVerification={() => setShowVerificationModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        forecastStart={forecast?.forecast_start}
        onFetchData={() => loadForecast(leadDay, hazard)}
      />

      {/* MAIN CONTAINER WITH GENEROUS BREATHING SPACE */}
      <main className="mx-auto max-w-[1600px] w-full space-y-7 px-6 lg:px-8 py-8 flex-1">
        {/* TOP KPI STAT CARDS */}
        <StatCards summary={summary} leadDay={leadDay} hazard={hazard} />

        {/* CONTROLS BAR */}
        <ControlsBar
          hazard={hazard}
          setHazard={setHazard}
          leadDay={leadDay}
          setLeadDay={setLeadDay}
          viewMode={viewMode}
          setViewMode={setViewMode}
          riskFilter={riskFilter}
          setRiskFilter={setRiskFilter}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          forecastStart={forecast?.forecast_start}
        />

        {/* ERROR NOTIFICATION */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 shadow-xs flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button
              onClick={() => loadForecast(leadDay, hazard)}
              className="px-3.5 py-1.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 cursor-pointer shadow-2xs transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* MAIN DASHBOARD CONTENT GRID */}
        <section className="grid gap-7 lg:grid-cols-12 items-start">
          {/* MAP DISPLAY CONTAINER (8 COLS ON DESKTOP) */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200 min-h-[650px]">
            <div className="h-[650px] w-full min-h-[650px]">
              {loading ? (
                <div className="flex h-full min-h-[650px] items-center justify-center bg-slate-900/5 backdrop-blur-xs">
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                    <p className="text-xs font-semibold text-slate-600">
                      Loading calibrated 0.25° grid predictions...
                    </p>
                  </div>
                </div>
              ) : (
                <IndiaMap
                  cells={cells}
                  selectedCell={selectedCell}
                  onCellSelect={setSelectedCell}
                  viewMode={viewMode}
                  hazard={hazard}
                  riskFilter={riskFilter}
                  regionFilter={regionFilter}
                  mapTheme={mapTheme}
                  setMapTheme={setMapTheme}
                />
              )}
            </div>
          </div>

          {/* DRILLDOWN SIDE PANEL (4 COLS ON DESKTOP) */}
          <div className="lg:col-span-4 space-y-6">
            <GridInfoPanel
              cell={selectedCell}
              leadDay={leadDay}
              validDate={forecast?.valid_date}
              hazard={hazard}
            />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 font-medium mt-8">
        <p>
          Forecast Guard AI — PS 26079 Operational Reliability Layer (ECMWF IFS 0.25° Grid)
        </p>
      </footer>

      {/* SEARCH COMMAND DIALOG */}
      <SearchCommand
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        cells={cells}
        onSelectCell={(cell) => {
          setSelectedCell(cell);
        }}
      />

      {/* VERIFICATION REPORT MODAL */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </div>
  );
}

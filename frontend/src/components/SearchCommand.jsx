import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { searchGridDatabase } from "../services/searchUtils";
import { Search, Building2, MapPin, Sparkles, Compass, ChevronRight } from "lucide-react";

export default function SearchCommand({ isOpen, onClose, cells = [], onSelectCell }) {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    return searchGridDatabase(query, cells);
  }, [query, cells]);

  const { cities, cellMatches } = searchResults;

  const handleSelect = (cell) => {
    if (cell && onSelectCell) {
      onSelectCell(cell);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
        {/* HEADER */}
        <DialogHeader className="p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <span>Search Cities & Grid Cells</span>
              <p className="text-xs font-normal text-slate-500">
                Type city name (e.g. Mumbai, Delhi, Bengaluru), state, or cell ID
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* INPUT BOX */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search major city (Mumbai, Delhi, Kochi, Kolkata) or Cell ID (CELL_0123)..."
              className="pl-10 bg-slate-50 border-slate-200 text-sm h-10 rounded-xl focus-visible:ring-blue-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-200/60"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* SEARCH RESULTS LIST */}
        <div className="max-h-[420px] overflow-y-auto p-3 space-y-4 divide-y divide-slate-100">
          {/* CITIES SECTION */}
          {cities && cities.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                <span>Major Indian Cities ({cities.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cities.map(({ city, cell, distanceKm }) => (
                  <div
                    key={city.name}
                    onClick={() => handleSelect(cell)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 group shadow-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">
                          {city.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {city.state} • {city.region}
                        </p>
                        {cell && (
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                            <span className="font-mono bg-slate-100 px-1 rounded text-slate-600">
                              {cell.cell_id}
                            </span>
                            {distanceKm != null && (
                              <span>(~{distanceKm} km away)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {cell && (
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge
                          variant={
                            ["high", "very_high"].includes(cell.risk_level)
                              ? "danger"
                              : cell.risk_level === "moderate"
                              ? "warning"
                              : "success"
                          }
                          className="text-[10px] font-bold py-0.5 px-2"
                        >
                          {(Number(cell.bust_probability || 0) * 100).toFixed(0)}% Bust
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GRID CELLS MATCHES SECTION */}
          {cellMatches && cellMatches.length > 0 && (
            <div className="space-y-2 pt-3">
              <div className="flex items-center gap-1.5 px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Compass className="h-3.5 w-3.5 text-emerald-600" />
                <span>Matching 0.25° Grid Cells ({cellMatches.length})</span>
              </div>
              <div className="space-y-1.5">
                {cellMatches.map(({ cell }) => (
                  <div
                    key={cell.cell_id}
                    onClick={() => handleSelect(cell)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-100/80 cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-mono font-bold text-[10px]">
                        ID
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{cell.cell_id}</span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {cell.state || "India"} • {cell.region || "Region"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Lat: {Number(cell.latitude).toFixed(2)}°, Lon: {Number(cell.longitude).toFixed(2)}°
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-600 text-xs">
                        {(Number(cell.bust_probability || 0) * 100).toFixed(0)}% Bust Risk
                      </span>
                      <Badge
                        variant={
                          ["high", "very_high"].includes(cell.risk_level)
                            ? "danger"
                            : cell.risk_level === "moderate"
                            ? "warning"
                            : "success"
                        }
                        className="text-[10px] font-bold uppercase py-0.5 px-2"
                      >
                        {cell.risk_level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {(!cities || cities.length === 0) && (!cellMatches || cellMatches.length === 0) && (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-600 text-sm">No matching cities or grid cells found</p>
              <p className="text-slate-400">Try searching "Mumbai", "Delhi", "Kerala", "Rain", or "CELL_00100"</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

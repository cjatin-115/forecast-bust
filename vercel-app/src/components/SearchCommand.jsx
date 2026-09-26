import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SearchCommand({ isOpen, onClose, cells = [], onSelectCell }) {
  const [query, setQuery] = useState("");

  const filteredCells = useMemo(() => {
    if (!query.trim()) return cells.slice(0, 15);
    const q = query.toLowerCase().trim();
    return cells
      .filter(
        (c) =>
          String(c.cell_id).toLowerCase().includes(q) ||
          String(c.state || "").toLowerCase().includes(q) ||
          String(c.region || "").toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [cells, query]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-100">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🔍 Search Grid Cells & States</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type cell ID (e.g. CELL_1234), state (e.g. Kerala), or region..."
            className="bg-white border-slate-200 text-sm"
          />
        </div>

        <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
          {filteredCells.length > 0 ? (
            filteredCells.map((cell) => (
              <div
                key={cell.cell_id}
                onClick={() => {
                  onSelectCell(cell);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 cursor-pointer transition text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{cell.cell_id}</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {cell.state || "India"} • {cell.region || "Region"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Lat: {Number(cell.latitude).toFixed(2)}°, Lon: {Number(cell.longitude).toFixed(2)}°
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-600">
                    {(Number(cell.bust_probability || 0) * 100).toFixed(0)}% Bust
                  </span>
                  <Badge
                    variant={
                      ["high", "very_high"].includes(cell.risk_level)
                        ? "danger"
                        : cell.risk_level === "moderate"
                        ? "warning"
                        : "success"
                    }
                    className="text-[10px] font-bold uppercase py-0.5"
                  >
                    {cell.risk_level}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching grid cells found for "{query}".
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

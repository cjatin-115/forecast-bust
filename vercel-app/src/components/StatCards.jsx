import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StatCards({ summary, leadDay, hazard }) {
  const hazardLabel = hazard === "temp" ? "Heatwave Temp" : hazard === "wind" ? "Windstorm" : "Rainfall";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* TOTAL CELLS */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Grid Coverage</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">4,651</span>
            <span className="text-xs font-semibold text-slate-500">0.25° GeoJSON</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">ECMWF IFS operational grid</p>
        </CardContent>
      </Card>

      {/* HIGH RISK CELLS */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">High Risk Cells ({hazardLabel})</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">
              {summary ? summary.high_risk_cells : "..."}
            </span>
            <span className="text-xs font-bold text-amber-600">
              {summary ? `${summary.high_risk_percentage}%` : "0%"}
            </span>
          </div>
          <Progress
            value={summary ? summary.high_risk_percentage : 0}
            className="h-1.5 mt-2 bg-amber-100"
          />
        </CardContent>
      </Card>

      {/* DOMAIN CONFIDENCE */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Mean Domain Confidence</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">
              {summary ? `${summary.average_confidence}%` : "..."}
            </span>
            <span className="text-xs font-semibold text-emerald-700">Calibrated</span>
          </div>
          <Progress
            value={summary ? summary.average_confidence : 85}
            className="h-1.5 mt-2 bg-emerald-100"
          />
        </CardContent>
      </Card>

      {/* LEAD TIME & VALIDATION */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Forecast Horizon</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">Day {leadDay}</span>
            <span className="text-xs font-semibold text-blue-600">ECMWF IFS</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Medium-range risk evaluation</p>
        </CardContent>
      </Card>
    </div>
  );
}

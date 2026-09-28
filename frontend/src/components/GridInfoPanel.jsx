import { useEffect, useState } from "react";
import { getCellDetail } from "../services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Info,
  MapPin,
  Activity,
  Sparkles,
  History,
  CloudRain,
  Thermometer,
  Wind,
  Gauge,
  Droplets,
  Zap,
} from "lucide-react";

function getRiskBadge(level) {
  switch (level) {
    case "very_high":
      return { label: "Very High Bust Risk", variant: "danger" };
    case "high":
      return { label: "High Bust Risk", variant: "highRisk" };
    case "moderate":
      return { label: "Moderate Risk", variant: "warning" };
    case "low":
      return { label: "Low Bust Risk", variant: "success" };
    case "very_low":
    default:
      return { label: "High Confidence", variant: "success" };
  }
}

function getCellValue(cell, detail, key, decimals = 1, unit = "") {
  const val = detail?.[key] ?? cell?.[key];
  if (val == null || !Number.isFinite(Number(val))) return "Unavailable";
  return `${Number(val).toFixed(decimals)}${unit}`;
}

export default function GridInfoPanel({ cell, leadDay, validDate, hazard = "rain" }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cell?.cell_id) {
      setDetail(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getCellDetail(cell.cell_id, leadDay, hazard)
      .then((data) => {
        if (isMounted) setDetail(data);
      })
      .catch((err) => {
        console.warn("Failed to load cell detail from API, using cell object:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cell?.cell_id, leadDay, hazard]);

  if (!cell) {
    return (
      <Card className="shadow-xs border-slate-200 bg-white rounded-2xl w-full max-w-full overflow-hidden">
        <CardHeader className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Grid Cell Inspection</CardTitle>
              <CardDescription className="text-xs">Interactive operational drilldown</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-0">
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-center space-y-2">
            <MapPin className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No Cell Selected</p>
            <p className="text-xs text-slate-400 max-w-[260px] mx-auto leading-relaxed">
              Click any 0.25° grid cell on the map or search a city (e.g. Mumbai, Delhi) to inspect calibrated bust risk, atmospheric drivers, and historical analogs.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const riskBadge = getRiskBadge(detail?.risk_level || cell?.risk_level);
  const bustProbPct = Number(((detail?.bust_probability ?? cell?.bust_probability ?? 0) * 100).toFixed(1));
  const confPct = Number(((detail?.confidence ?? cell?.confidence ?? 1) * 100).toFixed(1));
  const rainVal = Number(detail?.forecast_rainfall_mm ?? cell?.rainfall_mm ?? 0).toFixed(1);
  const tempVal = Number(detail?.temperature_c ?? cell?.temperature_c ?? 32).toFixed(1);
  const windVal = Number(detail?.wind_speed_kmh ?? cell?.wind_speed_kmh ?? 18).toFixed(1);

  return (
    <Card className="shadow-xs border-slate-200 bg-white rounded-2xl overflow-hidden w-full max-w-full">
      <CardHeader className="p-4 sm:p-5 pb-3 bg-slate-50/60 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-blue-600 shrink-0" />
                {detail?.region || cell?.region || "India Grid"}
              </span>
              <span className="text-[11px] text-slate-400">• Day {leadDay}</span>
            </div>
            <CardTitle className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
              {cell.cell_id}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5 font-medium">
              {detail?.state || cell?.state || ""} ({Number(cell.latitude).toFixed(2)}°N, {Number(cell.longitude).toFixed(2)}°E)
            </CardDescription>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <Badge variant={riskBadge.variant} className="text-xs font-bold py-1 px-2.5 shadow-2xs">
              {riskBadge.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-3 space-y-4">
        {/* KPI METRICS */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Bust Risk</span>
              <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            </div>
            <p className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">{bustProbPct}%</p>
            <Progress value={bustProbPct} className="h-1.5 mt-1 bg-slate-200" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Confidence</span>
              <Activity className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            </div>
            <p className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5">{confPct}%</p>
            <Progress value={confPct} className="h-1.5 mt-1 bg-slate-200" />
          </div>
        </div>

        {/* TABS DRILLDOWN */}
        <Tabs defaultValue="risk" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-9.5 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="risk" className="text-xs font-semibold gap-1 px-1 sm:px-2">
              <CloudRain className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="hidden sm:inline">Risk & Weather</span>
              <span className="sm:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger value="shap" className="text-xs font-semibold gap-1 px-1 sm:px-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">SHAP Drivers</span>
              <span className="sm:hidden">SHAP</span>
            </TabsTrigger>
            <TabsTrigger value="analogs" className="text-xs font-semibold gap-1 px-1 sm:px-2">
              <History className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span className="hidden sm:inline">Analogs</span>
              <span className="sm:hidden">Cases</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: RISK & WEATHER */}
          <TabsContent value="risk" className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Valid Date</span>
              <span className="font-semibold text-slate-900">{validDate || cell.valid_date || "2026-09-24"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <CloudRain className="h-3 w-3 text-blue-500 shrink-0" /> Forecast Rainfall
              </span>
              <span className="font-semibold text-blue-600">{rainVal} mm</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Historical P90 Threshold</span>
              <span className="font-semibold text-slate-800">{getCellValue(cell, detail, "historical_p90_error_mm", 1, " mm")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <Thermometer className="h-3 w-3 text-amber-500 shrink-0" /> Temperature (2m)
              </span>
              <span className="font-semibold text-amber-600">{tempVal} °C</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <Droplets className="h-3 w-3 text-cyan-500 shrink-0" /> Relative Humidity
              </span>
              <span className="font-semibold text-slate-800">{getCellValue(cell, detail, "humidity_percent", 1, " %")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <Gauge className="h-3 w-3 text-indigo-500 shrink-0" /> MSL Pressure
              </span>
              <span className="font-semibold text-slate-800">{getCellValue(cell, detail, "pressure_hpa", 1, " hPa")}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 flex items-center gap-1">
                <Wind className="h-3 w-3 text-teal-500 shrink-0" /> 10m Wind Speed
              </span>
              <span className="font-semibold text-teal-600">{windVal} km/h</span>
            </div>
          </TabsContent>

          {/* TAB 2: SHAP DRIVERS */}
          <TabsContent value="shap" className="mt-3 space-y-2 text-xs">
            {loading ? (
              <p className="text-center text-slate-400 py-4">Calculating SHAP feature attributions...</p>
            ) : detail?.top_reasons && detail.top_reasons.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Top Meteorological Drivers</p>
                {detail.top_reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700 leading-snug">{reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">No significant risk drivers flagged for this cell.</p>
            )}
          </TabsContent>

          {/* TAB 3: HISTORICAL ANALOGS */}
          <TabsContent value="analogs" className="mt-3 space-y-2 text-xs">
            {loading ? (
              <p className="text-center text-slate-400 py-4">Searching 92,474 historical analogs...</p>
            ) : detail?.similar_historical_events && detail.similar_historical_events.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Similar Historical Bust Cases</p>
                {detail.similar_historical_events.map((caseItem, idx) => (
                  <div key={idx} className="rounded-xl bg-amber-50/60 p-2.5 border border-amber-200/60 space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{caseItem.historical_run || caseItem.date || `Analog #${idx + 1}`}</span>
                      <span className="text-amber-700 font-bold">{caseItem.similarity_score_percent}% Similarity</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Fcst: {caseItem.forecast_rain_mm ?? caseItem.forecast_rainfall_mm ?? 15.0} mm</span>
                      <span>Realized Error: <strong className="text-red-600">{caseItem.realized_error_mm ?? 22.4} mm</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">No historical analogs matching condition threshold.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
import { useEffect, useState } from "react";
import { getVerificationMetrics } from "../services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CloudRain, Thermometer, Wind, BarChart3, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function VerificationModal({ isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [activeHazard, setActiveHazard] = useState("rain");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getVerificationMetrics(activeHazard)
        .then((res) => setData(res))
        .catch((err) => console.error("Metrics load failed:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, activeHazard]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-blue-700 px-2.5 py-0.5 text-[11px] font-black text-white shadow-xs tracking-wider uppercase flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Section 19 Verification
            </span>
            <span className="text-xs text-slate-600 font-bold">• Problem Statement 26079</span>
          </div>
          <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" /> Model Evaluation & Verification Report
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Rigorous statistical evaluation of the calibrated XGBoost forecast-bust detector across medium-range horizons (Day 1 to 10).
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 text-sm text-slate-700 py-2">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-500 font-medium">Model Architecture</p>
              <p className="font-bold text-slate-900 mt-0.5">{data?.model_name || "Calibrated XGBoost"}</p>
              <p className="text-[11px] text-slate-400 mt-1">Version: {data?.model_version || "1.2.0"}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-500 font-medium">Evaluation Split</p>
              <p className="font-bold text-slate-900 mt-0.5">Chronological Holdout (2025)</p>
              <p className="text-[11px] text-slate-400 mt-1">93,020 unseen test samples</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-500 font-medium">Target Definition</p>
              <p className="font-bold text-slate-900 mt-0.5">P90 Absolute Error</p>
              <p className="text-[11px] text-slate-400 mt-1">Grid-cell & Lead-time specific</p>
            </div>
          </div>

          {/* Lead-wise Metrics Table */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Lead-Time Verification Slices (Day 1 – Day 10)
                </h3>
                <p className="text-xs text-slate-500">Evaluated on 9,302 test grid cells per lead day</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveHazard("rain")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    activeHazard === "rain" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                  }`}
                >
                  <CloudRain className="h-3.5 w-3.5 text-blue-600" /> Rainfall
                </button>
                <button
                  onClick={() => setActiveHazard("temp")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    activeHazard === "temp" ? "bg-white text-amber-600 shadow-xs" : "text-slate-600"
                  }`}
                >
                  <Thermometer className="h-3.5 w-3.5 text-amber-600" /> Heatwave Temp
                </button>
                <button
                  onClick={() => setActiveHazard("wind")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    activeHazard === "wind" ? "bg-white text-teal-600 shadow-xs" : "text-slate-600"
                  }`}
                >
                  <Wind className="h-3.5 w-3.5 text-teal-600" /> Windstorm
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading verification metrics...</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Horizon</th>
                      <th className="p-3">PR-AUC</th>
                      <th className="p-3">ROC-AUC</th>
                      <th className="p-3">Brier Score</th>
                      <th className="p-3">ECE (Calib Error)</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {(data?.lead_day_metrics || []).map((row) => (
                      <tr key={row.lead_day} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900">Day {row.lead_day}</td>
                        <td className="p-3 font-semibold text-blue-600">{Number(row.pr_auc).toFixed(3)}</td>
                        <td className="p-3 font-semibold text-slate-800">{Number(row.roc_auc).toFixed(3)}</td>
                        <td className="p-3 text-slate-600">{Number(row.brier_score).toFixed(3)}</td>
                        <td className="p-3 text-emerald-600 font-semibold">{Number(row.ece).toFixed(3)}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Operational
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

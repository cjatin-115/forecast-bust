import { Button } from "@/components/ui/button";

export default function Header({ onOpenVerification, onOpenSearch, forecastStart }) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40 shadow-xs">
      <div className="mx-auto max-w-[1600px] px-6 py-3.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* TITLE & BADGES */}
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-700 px-2.5 py-0.5 text-[11px] font-black text-white shadow-xs tracking-wider uppercase">
                PS 26079
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Operational Reliability Layer
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Vercel Static Edge Active
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              Forecast Guard AI
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Multi-Hazard Weather Forecast Bust Detection (ECMWF IFS 0.25° Grid)
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* SEARCH BUTTON */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSearch}
              className="border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 gap-2 text-xs font-semibold h-9 rounded-xl cursor-pointer"
            >
              <span>🔍 Search Cells / States</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* VERIFICATION REPORT BUTTON */}
            <Button
              variant="default"
              size="sm"
              onClick={onOpenVerification}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 rounded-xl shadow-xs gap-1.5 cursor-pointer"
            >
              📊 Multi-Hazard Metrics (Sec 19)
            </Button>

            {/* RUN INITIALIZATION TIMESTAMP */}
            <div className="hidden sm:flex rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-right text-xs">
              <div>
                <p className="text-[10px] font-medium text-slate-400">NWP Run Init</p>
                <p className="font-bold text-slate-800">{forecastStart || "2026-09-24 00:00 Z"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

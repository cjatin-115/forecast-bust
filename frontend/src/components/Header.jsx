import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  BarChart3,
  ShieldCheck,
  Activity,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";

export default function Header({
  onOpenVerification,
  onOpenSearch,
  forecastStart,
  onFetchData,
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll down, pop-up on scroll up (mobile & browser feature)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 70 && currentScrollY > lastScrollY && !mobileMenuOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  const handleManualFetch = async () => {
    try {
      setIsFetching(true);
      if (onFetchData) {
        await onFetchData();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    } catch (e) {
      console.warn("Fetch data warning:", e);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-[1000] border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 shadow-xs" : "-translate-y-full shadow-none"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        {/* TOP NAVBAR CONTAINER */}
        <div className="flex items-center justify-between gap-3">
          {/* BRAND LOGO & TITLE */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-700 px-2 py-0.5 text-[10px] sm:text-[11px] font-black text-white shadow-xs tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-blue-200" />
                  PS 26079
                </span>
                <span className="hidden sm:inline text-xs font-semibold text-slate-500">
                  Operational Reliability Layer
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Forecast Guard AI
              </h1>
            </div>
          </div>

          {/* DESKTOP SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div
              onClick={onOpenSearch}
              className="relative flex items-center w-full cursor-pointer group"
            >
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
              <Input
                readOnly
                placeholder="Search city (Mumbai, Delhi, Kochi, Kolkata) or Cell ID..."
                className="pl-10 pr-16 bg-slate-50 border-slate-200/90 text-xs h-9.5 rounded-xl group-hover:border-blue-300 group-hover:bg-white shadow-2xs transition-all cursor-pointer font-medium"
              />
              <kbd className="absolute right-3 pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] font-semibold text-slate-500 shadow-2xs">
                <span>⌘</span>K
              </kbd>
            </div>
          </div>

          {/* DESKTOP ACTION BUTTONS */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualFetch}
              disabled={isFetching}
              className="border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-800 gap-2 text-xs font-bold h-9.5 rounded-xl cursor-pointer shadow-2xs transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-blue-600 ${isFetching ? "animate-spin" : ""}`} />
              <span>{isFetching ? "Fetching..." : "Fetch Live Data"}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onOpenVerification}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9.5 rounded-xl shadow-xs gap-2 cursor-pointer transition-all"
            >
              <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Metrics (Sec 19)</span>
            </Button>

            <div className="hidden xl:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-right text-xs">
              <Activity className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <div>
                <p className="text-[9px] font-semibold text-slate-400 leading-none">NWP Run Init</p>
                <p className="font-bold text-slate-800 mt-0.5 leading-none">{forecastStart || "2026-09-24 00:00 Z"}</p>
              </div>
            </div>
          </div>

          {/* MOBILE TOGGLE BUTTONS (SEARCH & HAMBURGER MENU) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              title="Search Cities / Grid Cells"
            >
              <Search className="h-4 w-4 text-blue-600" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE COLLAPSIBLE HAMBURGER DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200/80 space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
            {/* MOBILE SEARCH BAR */}
            <div
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="relative flex items-center cursor-pointer"
            >
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                readOnly
                placeholder="Search city (Mumbai, Delhi, Kochi)..."
                className="pl-10 bg-slate-50 border-slate-200 text-xs h-10 rounded-xl cursor-pointer font-medium"
              />
            </div>

            {/* MOBILE ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleManualFetch();
                  setMobileMenuOpen(false);
                }}
                disabled={isFetching}
                className="border-blue-200 bg-blue-50 text-blue-800 gap-1.5 text-xs font-bold h-10 rounded-xl"
              >
                <RefreshCw className={`h-4 w-4 text-blue-600 ${isFetching ? "animate-spin" : ""}`} />
                <span>Fetch Live Data</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onOpenVerification();
                  setMobileMenuOpen(false);
                }}
                className="bg-slate-900 text-white font-semibold text-xs h-10 rounded-xl gap-1.5"
              >
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                <span>Metrics (Sec 19)</span>
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
              <span className="text-slate-500 font-medium">NWP Run Init:</span>
              <span className="font-bold text-slate-800">{forecastStart || "2026-09-24 00:00 Z"}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

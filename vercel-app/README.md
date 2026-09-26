# Forecast Guard AI (Vercel Standalone Static Edition)

**Problem Statement 26079** — Multi-Hazard Weather Forecast Bust Detection System.

This directory (`vercel-app`) is a zero-backend, 100% static web application pre-packaged for direct deployment to [Vercel](https://vercel.com).

## Highlights & Features

- **Zero Backend Dependency**: Pre-rendered static JSON datasets for all 10 lead days, multi-hazards, SHAP explanations, historical analogs, and verification metrics.
- **Default Satellite View**: Esri World Imagery (0 API key required, NO watermark) with one-click toggle for Standard OpenStreetMap view.
- **Shadcn UI Components**: Clean, attractive, high-contrast light mode UI design using Tailwind CSS and Radix-inspired Shadcn UI primitives (`Card`, `Badge`, `Tabs`, `Progress`, `Dialog`, `Separator`, `Tooltip`, `Input`).
- **0.25° GeoJSON Polygon Grid**: Real square grid cell polygons for India (4,651 cells).
- **Interactive Leaflet Map Popups**: Hover/click popups rendered directly on the map, updating both the popup and the 3-tab inspection side panel cleanly without React unmounting glitches.
- **Multi-Hazard Support**: Dedicated operational modes for Heavy Rain, Heatwave Temperature, and Windstorm.
- **Radar Loop Playback**: Automated 10-day risk progression loop with play/pause controls.
- **Command Palette Search (`⌘K`)**: Fast search across cell IDs, states, and regions.
- **Section 19 Verification Report**: Comprehensive evaluation metrics modal.

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build & Vercel Deployment

```bash
# Production build test
npm run build

# Deploy directly via Vercel CLI
npx vercel
```

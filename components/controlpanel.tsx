"use client"
import { exchangeList } from "@/lib/exchanges"
import { useState } from "react"
interface ControlPanelProps {
  selectedExchange: string | null
  selectedProvider: string
  latencyRange: [number, number]
  showHistorical: boolean
  showRealtime: boolean
  showRegions: boolean
  onExchangeChange: (exchange: string | null) => void
  onProviderChange: (provider: string) => void
  onLatencyRangeChange: (range: [number, number]) => void
  onHistoricalToggle: (show: boolean) => void
  onRealtimeToggle: (show: boolean) => void
  onRegionsToggle: (show: boolean) => void
}
export function ControlPanel({
  selectedExchange,
  selectedProvider,
  latencyRange,
  showHistorical,
  showRealtime,
  showRegions,
  onExchangeChange,
  onProviderChange,
  onLatencyRangeChange,
  onHistoricalToggle,
  onRealtimeToggle,
  onRegionsToggle,
}: ControlPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    exchange: true,
    provider: true,
    latency: true,
    visibility: true,
  })
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }
  return (
    <div className="space-y-3">
      {/* Exchange Selection */}
      <div className="border border-border rounded-lg overflow-hidden bg-card/30">
        <button
          onClick={() => toggleSection("exchange")}
          className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
        >
          <label className="text-xs font-semibold text-muted-foreground cursor-pointer">EXCHANGE</label>
          <svg
            className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.exchange ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        {expandedSections.exchange && (
          <div className="p-3 border-t border-border">
            <select
              aria-label="Select Exchange"
              value={selectedExchange || ""}
              onChange={(e) => onExchangeChange(e.target.value || null)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Exchanges</option>
              {exchangeList.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
            {selectedExchange && <p className="text-xs text-muted-foreground mt-2">Selected: {selectedExchange}</p>}
          </div>
        )}
      </div>
      {/* Cloud Provider Selection */}
      <div className="border border-border rounded-lg overflow-hidden bg-card/30">
        <button
          onClick={() => toggleSection("provider")}
          className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
        >
          <label className="text-xs font-semibold text-muted-foreground cursor-pointer">CLOUD PROVIDER</label>
          <svg
            className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.provider ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        {expandedSections.provider && (
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              {["all", "AWS", "GCP", "Azure"].map((provider) => (
                <button
                  key={provider}
                  onClick={() => onProviderChange(provider)}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    selectedProvider === provider
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                      : "bg-input text-foreground hover:bg-accent border border-border"
                  }`}
                >
                  <span className="text-xs">{provider === "all" ? "All" : provider}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 p-2 bg-input/50 rounded text-xs text-muted-foreground">
              <p>
                Active: <span className="text-primary font-semibold">{selectedProvider.toUpperCase()}</span>
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Latency Range Slider */}
      <div className="border border-border rounded-lg overflow-hidden bg-card/30">
        <button
          onClick={() => toggleSection("latency")}
          className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
        >
          <label className="text-xs font-semibold text-muted-foreground cursor-pointer">LATENCY RANGE</label>
          <svg
            className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.latency ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        {expandedSections.latency && (
          <div className="p-3 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Min: {latencyRange[0]}ms</span>
              <span className="text-xs text-muted-foreground">Max: {latencyRange[1]}ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={latencyRange[0]}
              onChange={(e) => {
                const val = Number.parseInt(e.target.value)
                if (val <= latencyRange[1]) {
                  onLatencyRangeChange([val, latencyRange[1]])
                }
              }}
              title="Minimum latency (ms)"
              aria-label="Minimum latency in milliseconds"
              className="w-full accent-primary"
            />
            <input
              type="range"
              min="0"
              max="500"
              value={latencyRange[1]}
              onChange={(e) => {
                const val = Number.parseInt(e.target.value)
                if (val >= latencyRange[0]) {
                  onLatencyRangeChange([latencyRange[0], val])
                }
              }}
              title="Maximum latency (ms)"
              aria-label="Maximum latency in milliseconds"
              className="w-full accent-primary"
            />
            <div className="h-1 bg-input rounded relative overflow-hidden">
              <div
                className="latency-range-indicator"
                style={{
                  left: `${(latencyRange[0] / 500) * 100}%`,
                  right: `${100 - (latencyRange[1] / 500) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Visibility Toggles */}
      <div className="border border-border rounded-lg overflow-hidden bg-card/30">
        <button
          onClick={() => toggleSection("visibility")}
          className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
        >
          <label className="text-xs font-semibold text-muted-foreground cursor-pointer">VISUALIZATION</label>
          <svg
            className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.visibility ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        {expandedSections.visibility && (
          <div className="p-3 border-t border-border space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-5 h-5">
                <input
                  type="checkbox"
                  checked={showRealtime}
                  onChange={(e) => onRealtimeToggle(e.target.checked)}
                  className="absolute opacity-0 w-5 h-5 cursor-pointer"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all ${
                    showRealtime ? "bg-primary border-primary" : "border-border bg-input group-hover:border-primary"
                  }`}
                >
                  {showRealtime && (
                    <svg
                      className="w-full h-full text-primary-foreground p-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-foreground">Live Connections</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-5 h-5">
                <input
                  type="checkbox"
                  checked={showRegions}
                  onChange={(e) => onRegionsToggle(e.target.checked)}
                  className="absolute opacity-0 w-5 h-5 cursor-pointer"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all ${
                    showRegions ? "bg-primary border-primary" : "border-border bg-input group-hover:border-primary"
                  }`}
                >
                  {showRegions && (
                    <svg
                      className="w-full h-full text-primary-foreground p-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-foreground">Cloud Regions</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-5 h-5">
                <input
                  type="checkbox"
                  checked={showHistorical}
                  onChange={(e) => onHistoricalToggle(e.target.checked)}
                  className="absolute opacity-0 w-5 h-5 cursor-pointer"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all ${
                    showHistorical ? "bg-primary border-primary" : "border-border bg-input group-hover:border-primary"
                  }`}
                >
                  {showHistorical && (
                    <svg
                      className="w-full h-full text-primary-foreground p-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-foreground">Historical Data</span>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
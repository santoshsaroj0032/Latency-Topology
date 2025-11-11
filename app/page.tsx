"use client";

import { useState } from "react";
import { SearchBar } from "@/components/searchbar";
import { ControlPanel } from "@/components/controlpanel";
import { MapViewer } from "@/components/mapviewer";
import { LatencyChart } from "@/components/latencychart";
import { Legend } from "@/components/legend";
import { PerformanceDash } from "@/components/performancedash";
import { RegionInfo } from "@/components/regioninfo";

export default function Home() {
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [latencyRange, setLatencyRange] = useState<[number, number]>([0, 500]);
  const [showHistorical, setShowHistorical] = useState(true);
  const [showRealtime, setShowRealtime] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("24h");
  const [rightTab, setRightTab] = useState<"historical" | "details">(
    "historical"
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-80 bg-card border-r border-border flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold">Latency Topology</h1>
          <p className="text-xs text-muted-foreground">
            Exchange Latency Visualizer
          </p>
        </div>

        <div className="p-4 border-b border-border">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="p-4 border-b border-border space-y-4">
          <ControlPanel
            selectedExchange={selectedExchange}
            selectedProvider={selectedProvider}
            latencyRange={latencyRange}
            showHistorical={showHistorical}
            showRealtime={showRealtime}
            showRegions={showRegions}
            onExchangeChange={setSelectedExchange}
            onProviderChange={setSelectedProvider}
            onLatencyRangeChange={setLatencyRange}
            onHistoricalToggle={setShowHistorical}
            onRealtimeToggle={setShowRealtime}
            onRegionsToggle={setShowRegions}
          />
        </div>

        <div className="p-4 border-b border-border">
          <Legend />
        </div>

        <div className="p-4 flex-1">
          <PerformanceDash />
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col lg:flex-row-reverse">

        {/* 3-D GLOBE */}
        <section className="flex-1 relative">
          <MapViewer
            selectedProvider={selectedProvider}
            latencyRange={latencyRange}
            showRealtime={showRealtime}
            showRegions={showRegions}
            searchQuery={searchQuery}
          />
        </section>
        {/* RIGHT PANEL */}
        <aside className="w-full lg:w-96 bg-card border-l border-border flex flex-col">
          <div className="flex border-b border-border">
            <button
              onClick={() => setRightTab("historical")}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                rightTab === "historical"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Historical
            </button>
            <button
              onClick={() => setRightTab("details")}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                rightTab === "details"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Details
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {rightTab === "historical" ? (
              <LatencyChart
                selectedExchange={selectedExchange}
                timeRange={timeRange}
              />
            ) : (
              <RegionInfo selectedExchange={selectedExchange} />
            )}
          </div>

          {rightTab === "historical" && (
            <div className="p-4 border-t border-border">
              <div className="flex gap-1">
                {(["1h", "24h", "7d", "30d"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-md transition-colors ${
                      timeRange === r
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-accent"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

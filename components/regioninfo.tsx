"use client";

import { cloudRegions } from "@/lib/regions";
import { useRealtimeLatency } from "@/lib/latency-hook";
import { useState } from "react";


interface RegionInfoProps {
  selectedExchange: string | null;
}

export function RegionInfo({ selectedExchange }: RegionInfoProps) {
  const { data: latencyData } = useRealtimeLatency();
  const [sortBy, setSortBy] = useState<"latency" | "uptime" | "load">(
    "latency"
  );

  const regionsWithRealtimeData = cloudRegions.map((region) => {
    const realtimeData = latencyData?.regionalLatencies.find(
      (r) => r.id === region.id
    );
    return {
      ...region,
      latency: realtimeData ? realtimeData.latency : region.avgLatency,
      uptime: realtimeData ? realtimeData.uptime : region.uptime,
      load: realtimeData ? realtimeData.load : region.load,
    };
  });

  // Sort regions based on selected metric
  const sortedRegions = [...regionsWithRealtimeData].sort((a, b) => {
    if (sortBy === "latency") return a.latency - b.latency;
    if (sortBy === "uptime") return b.uptime - a.uptime;
    return a.load - b.load;
  });

  const getStatusColor = (latency: number) => {
    if (latency < 50)
      return "bg-green-500/20 border-green-500/50 text-green-400";
    if (latency < 100)
      return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
    if (latency < 200)
      return "bg-orange-500/20 border-orange-500/50 text-orange-400";
    return "bg-red-500/20 border-red-500/50 text-red-400";
  };

  const getHealthStatus = (uptime: number) => {
    if (uptime >= 99.95) return { label: "Excellent", color: "text-green-400" };
    if (uptime >= 99.9) return { label: "Good", color: "text-yellow-400" };
    return { label: "Degraded", color: "text-orange-400" };
  };

  const getLoadStatus = (load: number) => {
    if (load < 40) return "Low";
    if (load < 70) return "Medium";
    return "High";
  };

  return (
    <div className="w-full h-full p-4 flex flex-col overflow-hidden">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Cloud Regions
        </h3>

        {/* Sort Controls */}
        <div className="flex gap-2 mb-3">
          {(["latency", "uptime", "load"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSortBy(metric)}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                sortBy === metric
                  ? "bg-primary text-primary-foreground"
                  : "bg-input text-muted-foreground hover:bg-accent"
              }`}
            >
              {metric === "latency"
                ? "Latency"
                : metric === "uptime"
                ? "Uptime"
                : "Load"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {sortedRegions.map((region) => {
          const statusColor = getStatusColor(region.latency);
          const health = getHealthStatus(region.uptime);
          const loadStatus = getLoadStatus(region.load);

          return (
            <div
              key={region.id}
              className="p-3 bg-input rounded-md border border-border hover:border-primary/50 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">
                      {region.name}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-muted-foreground">
                      {region.provider}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {region.serverCount} servers
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-md border text-xs font-semibold ${statusColor}`}
                >
                  {region.latency.toFixed(0)}ms
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* Latency Metric */}
                <div className="bg-card/50 rounded p-2">
                  <p className="text-xs text-muted-foreground mb-1">Latency</p>
                  <div className="flex items-end justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {region.latency.toFixed(0)}ms
                    </p>
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <div
                        className="w-6 h-1 bg-primary rounded-full"
                        style={{
                          opacity: Math.max(0.2, 1 - region.latency / 250),
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Uptime Metric */}
                <div className="bg-card/50 rounded p-2">
                  <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                  <div className="flex items-end justify-between">
                    <p className={`text-sm font-semibold ${health.color}`}>
                      {region.uptime.toFixed(2)}%
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {health.label}
                    </span>
                  </div>
                </div>

                {/* Load Metric */}
                <div className="bg-card/50 rounded p-2">
                  <p className="text-xs text-muted-foreground mb-1">Load</p>
                  <div className="flex items-end justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {region.load.toFixed(0)}%
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {loadStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 space-y-1">
                {/* Gradient bar */}
                <div
                  className="load-bar"
                  style={
                    {
                      "--load": `${Math.min(region.load, 100)}%`,
                    } as React.CSSProperties
                  }
                >
                  <div className="load-fill" />
                </div>

                {/* Percentage label */}
                <p className="text-xs text-muted-foreground text-right">
                  Load: {region.load.toFixed(0)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

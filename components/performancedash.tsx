"use client"

import { useRealtimeLatency } from "@/lib/latency-hook"
import { useState } from "react"

export function PerformanceDash() {
  const { data: latencyData } = useRealtimeLatency()
  const [sortMetric, setSortMetric] = useState<"latency" | "jitter">("latency")

  if (!latencyData || latencyData.connections.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">Loading performance data...</p>
      </div>
    )
  }

  const sortedConnections = [...latencyData.connections].sort((a, b) => {
    if (sortMetric === "latency") return a.latency - b.latency
    return a.jitter - b.jitter
  })

  const avgLatency = latencyData.connections.reduce((sum, c) => sum + c.latency, 0) / latencyData.connections.length
  const worstLatency = Math.max(...latencyData.connections.map((c) => c.latency))
  const avgPacketLoss =
    latencyData.connections.reduce((sum, c) => sum + c.packetLoss, 0) / latencyData.connections.length

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2">PERFORMANCE</h3>

        {/* Top Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-input rounded-md p-2 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
            <p className="text-sm font-bold text-primary">{avgLatency.toFixed(1)}ms</p>
          </div>
          <div className="bg-input rounded-md p-2 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Peak Latency</p>
            <p className="text-sm font-bold text-red-400">{worstLatency.toFixed(1)}ms</p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 mb-2">
          {(["latency", "jitter"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSortMetric(metric)}
              className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-all ${
                sortMetric === metric
                  ? "bg-primary text-primary-foreground"
                  : "bg-input text-muted-foreground hover:bg-accent"
              }`}
            >
              {metric === "latency" ? "Latency" : "Jitter"}
            </button>
          ))}
        </div>

        {/* Connection List */}
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {sortedConnections.slice(0, 3).map((conn, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-input rounded border border-border text-xs"
            >
              <span className="text-muted-foreground truncate">{conn.from.split(" - ")[0]}</span>
              <span
                className={`font-semibold ${conn.latency < 100 ? "text-green-400" : conn.latency < 200 ? "text-yellow-400" : "text-red-400"}`}
              >
                {conn.latency.toFixed(0)}ms
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

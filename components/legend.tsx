"use client";

import { useState } from "react";

export function Legend() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
      >
        <h3 className="text-xs font-semibold text-muted-foreground">LEGEND</h3>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {expanded && (
        <div className="p-3 border-t border-border space-y-3">
          {/* Latency Colors */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">
              Latency
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">
                  &lt; 50ms - Excellent
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  50-100ms - Good
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs text-muted-foreground">
                  100-200ms - Fair
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground">
                  &gt; 200ms - Poor
                </span>
              </div>
            </div>
          </div>

          {/* Provider Colors */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">
              Providers
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff9900]" />
                <span className="text-xs text-muted-foreground">AWS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4285f4]" />
                <span className="text-xs text-muted-foreground">GCP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0078d4]" />
                <span className="text-xs text-muted-foreground">Azure</span>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Status</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  Active Connection
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Data Flow</span>
              </div>
            </div>
          </div>

          {/* Filter Tips */}
          <div className="p-2 bg-input/50 rounded">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Tip:</span> Use the latency range
              slider to filter connections by performance threshold.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

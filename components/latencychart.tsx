"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useRealtimeLatency } from "@/lib/latency-hook";
import useSWR from "swr";

interface LatencyChartProps {
  selectedExchange: string | null;
  timeRange: string;
}

interface HistoricalData {
  data: Array<{
    timestamp: string;
    latency: number;
    minLatency: number;
    maxLatency: number;
    avgLatency: number;
    p95Latency: number;
    p99Latency: number;
  }>;
  stats: {
    avgLatency: string;
    minLatency: string;
    maxLatency: string;
    p95Latency: string;
    p99Latency: string;
    trendDirection: string;
    trendPercentage: string;
  };
  timeRange: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function LatencyChart({
  selectedExchange,
  timeRange,
}: LatencyChartProps) {
  const { data: latencyData } = useRealtimeLatency();

  const { data: historicalData } = useSWR<HistoricalData>(
    `/api/latency/history?range=${timeRange}&exchange=${
      selectedExchange || "all"
    }`,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: false,
    }
  );

  // Format data for chart display
  const chartData =
    historicalData?.data.map((point) => ({
      ...point,
      displayTime: formatTime(point.timestamp, timeRange),
    })) || [];

  const avgLatency = historicalData?.stats.avgLatency || "0";
  const minLatency = historicalData?.stats.minLatency || "0";
  const maxLatency = historicalData?.stats.maxLatency || "0";
  const p95Latency = historicalData?.stats.p95Latency || "0";
  const trendDirection = historicalData?.stats.trendDirection || "stable";
  const trendPercentage = historicalData?.stats.trendPercentage || "0";

  return (
    <div className="w-full h-full p-2 flex flex-col">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {selectedExchange || "All Exchanges"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Historical latency data • {timeRange}
            </p>
          </div>
          <div
            className={`text-xs font-semibold ${
              trendDirection === "increasing"
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {trendDirection === "increasing" ? "↑" : "↓"}{" "}
            {Math.abs(Number.parseFloat(trendPercentage)).toFixed(2)}%
          </div>
        </div>
      </div>
      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height="60%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorP95" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffff00" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ffff00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="displayTime"
                stroke="#666"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: "12px" }}
                label={{ value: "ms", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#0ff" }}
                formatter={(value: number) => value.toFixed(2)}
              />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#00ff00"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLatency)"
              />
              <Area
                type="monotone"
                dataKey="p95Latency"
                stroke="#ffff00"
                strokeWidth={1}
                strokeDasharray="5 5"
                fillOpacity={0}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex-1 mt-4 space-y-2 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-input rounded-md p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Average</p>
                <p className="text-sm font-semibold text-foreground">
                  {avgLatency}ms
                </p>
              </div>
              <div className="bg-input rounded-md p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Min</p>
                <p className="text-sm font-semibold text-green-400">
                  {minLatency}ms
                </p>
              </div>
              <div className="bg-input rounded-md p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Max</p>
                <p className="text-sm font-semibold text-red-400">
                  {maxLatency}ms
                </p>
              </div>
              <div className="bg-input rounded-md p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-1">P95</p>
                <p className="text-sm font-semibold text-yellow-400">
                  {p95Latency}ms
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading chart data...</p>
        </div>
      )}
    </div>
  );
}

function formatTime(timestamp: string, timeRange: string): string {
  const date = new Date(timestamp);

  if (timeRange === "1h") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (timeRange === "24h") {
    return date.toLocaleTimeString("en-US", { hour: "2-digit" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

// Historical latency data endpoint
export async function GET(request: Request) {
  const url = new URL(request.url)
  const timeRange = url.searchParams.get("range") || "24h"
  const exchange = url.searchParams.get("exchange")

  // Generate historical data based on time range
  const generateHistoricalData = () => {
    let dataPoints = 24
    let interval = "1h"

    if (timeRange === "1h") {
      dataPoints = 60
      interval = "1m"
    } else if (timeRange === "7d") {
      dataPoints = 7
      interval = "1d"
    } else if (timeRange === "30d") {
      dataPoints = 30
      interval = "1d"
    }

    const data = []
    const now = new Date()

    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now)

      if (timeRange === "1h") {
        timestamp.setMinutes(timestamp.getMinutes() - i)
      } else if (timeRange === "24h") {
        timestamp.setHours(timestamp.getHours() - i)
      } else if (timeRange === "7d") {
        timestamp.setDate(timestamp.getDate() - i)
      } else if (timeRange === "30d") {
        timestamp.setDate(timestamp.getDate() - i)
      }

      // Generate realistic latency variations with trend
      const trend = Math.sin((i / dataPoints) * Math.PI) * 30
      const baseLatency = 60 + trend
      const variance = (Math.random() - 0.5) * 40

      data.push({
        timestamp: timestamp.toISOString(),
        latency: Math.max(10, baseLatency + variance),
        minLatency: Math.max(5, baseLatency + variance - 20),
        maxLatency: baseLatency + variance + 30,
        avgLatency: baseLatency + variance,
        packetLoss: Math.random() * 0.8,
        jitter: Math.random() * 15,
        uptime: 99.9 + Math.random() * 0.09,
        p95Latency: baseLatency + variance + 25,
        p99Latency: baseLatency + variance + 40,
      })
    }

    return data
  }

  const historicalData = generateHistoricalData()

  // Calculate statistics
  const latencies = historicalData.map((d) => d.latency)
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length
  const minLatency = Math.min(...latencies)
  const maxLatency = Math.max(...latencies)
  const p95Latency = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.95)]
  const p99Latency = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.99)]

  // Calculate trend (simple linear regression)
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0
  for (let i = 0; i < latencies.length; i++) {
    sumX += i
    sumY += latencies[i]
    sumXY += i * latencies[i]
    sumX2 += i * i
  }
  const n = latencies.length
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const trendDirection = slope > 0 ? "increasing" : "decreasing"
  const trendPercentage = ((slope / avgLatency) * 100).toFixed(2)

  return Response.json(
    {
      data: historicalData,
      stats: {
        avgLatency: avgLatency.toFixed(2),
        minLatency: minLatency.toFixed(2),
        maxLatency: maxLatency.toFixed(2),
        p95Latency: p95Latency.toFixed(2),
        p99Latency: p99Latency.toFixed(2),
        trendDirection,
        trendPercentage,
      },
      timeRange,
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
    },
  )
}

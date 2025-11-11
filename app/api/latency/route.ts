// Simulated real-time latency data endpoint
export async function GET(request: Request) {
  const url = new URL(request.url)
  const exchangeName = url.searchParams.get("exchange")
  const provider = url.searchParams.get("provider")

  // Simulate real-time latency data with slight variations
  const baseLatencies: Record<string, number> = {
    "Binance - Tokyo": 45,
    "OKX - Singapore": 120,
    "Bybit - Hong Kong": 85,
    "Deribit - Amsterdam": 200,
    "Kraken - San Francisco": 150,
  }

  const connections = [
    {
      from: "Binance - Tokyo",
      to: "OKX - Singapore",
      baseLatency: 45,
      provider: "AWS",
    },
    {
      from: "OKX - Singapore",
      to: "Bybit - Hong Kong",
      baseLatency: 65,
      provider: "GCP",
    },
    {
      from: "Bybit - Hong Kong",
      to: "Deribit - Amsterdam",
      baseLatency: 180,
      provider: "Azure",
    },
    {
      from: "Deribit - Amsterdam",
      to: "Kraken - San Francisco",
      baseLatency: 150,
      provider: "AWS",
    },
  ]

  // Filter by provider if specified
  let filteredConnections = connections
  if (provider && provider !== "all") {
    filteredConnections = connections.filter((c) => c.provider === provider)
  }

  // Add realistic latency jitter (±20% variation)
  const latencyData = filteredConnections.map((conn) => ({
    ...conn,
    latency: conn.baseLatency + (Math.random() - 0.5) * conn.baseLatency * 0.4,
    timestamp: new Date().toISOString(),
    packetLoss: Math.random() * 0.5,
    jitter: Math.random() * 10,
  }))

  // Regional latency data with updates
  const regionalLatencies = [
    {
      id: "aws-ap-tokyo",
      latency: 45 + (Math.random() - 0.5) * 10,
      uptime: 99.99 - Math.random() * 0.02,
      load: 65 + (Math.random() - 0.5) * 15,
    },
    {
      id: "gcp-asia-southeast",
      latency: 52 + (Math.random() - 0.5) * 10,
      uptime: 99.95 - Math.random() * 0.02,
      load: 58 + (Math.random() - 0.5) * 15,
    },
    {
      id: "azure-east-asia",
      latency: 48 + (Math.random() - 0.5) * 10,
      uptime: 99.98 - Math.random() * 0.02,
      load: 72 + (Math.random() - 0.5) * 15,
    },
    {
      id: "aws-eu-west",
      latency: 185 + (Math.random() - 0.5) * 20,
      uptime: 99.99 - Math.random() * 0.02,
      load: 45 + (Math.random() - 0.5) * 15,
    },
    {
      id: "gcp-us-central",
      latency: 125 + (Math.random() - 0.5) * 15,
      uptime: 99.96 - Math.random() * 0.02,
      load: 68 + (Math.random() - 0.5) * 15,
    },
  ]

  return Response.json(
    {
      connections: latencyData,
      regionalLatencies,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
    },
  )
}

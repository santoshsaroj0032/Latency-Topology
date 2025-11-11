import useSWR from "swr"
export interface LatencyConnection {
  from: string
  to: string
  baseLatency: number
  provider: string
  latency: number
  timestamp: string
  packetLoss: number
  jitter: number
}

export interface RegionalLatency {
  id: string
  latency: number
  uptime: number
  load: number
}

export interface LatencyData {
  connections: LatencyConnection[]
  regionalLatencies: RegionalLatency[]
  timestamp: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useRealtimeLatency(provider?: string) {
  const query = new URLSearchParams()
  if (provider && provider !== "all") {
    query.append("provider", provider)
  }

  const { data, error, isLoading } = useSWR<LatencyData>(`/api/latency?${query.toString()}`, fetcher, {
    // Refresh every 2 seconds for real-time updates
    refreshInterval: 2000,
    dedupingInterval: 1000,
    focusThrottleInterval: 5000,
  })

  return {
    data,
    error,
    isLoading,
  }
}

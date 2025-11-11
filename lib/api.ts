import useSWR from "swr";

export interface CloudPingRegion {
  region: string;
  provider: "aws" | "gcp" | "azure";
  rtt: number;
}

export interface GeoInfo {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

// ---- LIVE PINGS ----
export async function fetchLivePings(): Promise<CloudPingRegion[]> {
  const res = await fetch("https://www.cloudping.cloud/api/v1/ping");
  if (!res.ok) throw new Error("CloudPing unavailable");
  const raw = await res.json();

  const out: CloudPingRegion[] = [];
  for (const [region, providers] of Object.entries(raw as any)) {
    for (const [prov, rtt] of Object.entries(providers as any)) {
      out.push({ region, provider: prov as any, rtt: Number(rtt) });
    }
  }
  return out;
}

// ---- GEO CACHE ----
const geoCache = new Map<string, GeoInfo>();
export async function getGeo(region: string): Promise<GeoInfo> {
  if (geoCache.has(region)) return geoCache.get(region)!;

  const res = await fetch(`https://ipapi.co/${region}/json/`);
  const data = await res.json();
  const info: GeoInfo = {
    lat: data.latitude ?? 0,
    lng: data.longitude ?? 0,
    city: data.city ?? region,
    country: data.country_name ?? "??",
  };
  geoCache.set(region, info);
  return info;
}
import * as THREE from "three";

export const exchangeList = ["Binance", "OKX", "Bybit", "Deribit", "Kraken"];

function latLngToVec3(lat: number, lng: number, radius = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

export const exchangeLocations = [
  {
    name: "Binance - Tokyo",
    provider: "AWS",
    latency: 45,
    position: latLngToVec3(35.6762, 139.6503),
  },
  {
    name: "OKX - Singapore",
    provider: "GCP",
    latency: 120,
    position: latLngToVec3(1.3521, 103.8198),
  },
  {
    name: "Bybit - Hong Kong",
    provider: "Azure",
    latency: 85,
    position: latLngToVec3(22.3193, 114.1694),
  },
  {
    name: "Deribit - Amsterdam",
    provider: "AWS",
    latency: 200,
    position: latLngToVec3(52.374, 4.8897),
  },
  {
    name: "Kraken - San Francisco",
    provider: "GCP",
    latency: 150,
    position: latLngToVec3(37.7749, -122.4194),
  },
] as const;
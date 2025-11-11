"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlobe } from "@/lib/globe";
import {
  createAnimatedConnection,
  updateConnectionParticles,
  getLatencyColor,
} from "@/lib/connection-utils";
import { useQuery } from "@tanstack/react-query";
import { fetchLivePings, getGeo } from "@/lib/api";

interface MapViewerProps {
  selectedProvider: string;
  latencyRange: [number, number];
  showRealtime: boolean;
  showRegions: boolean;
  searchQuery: string;
}

interface RegionPoint {
  region: string;
  provider: "aws" | "gcp" | "azure";
  rtt: number;
  lat: number;
  lng: number;
  city: string;
  country: string;
  position: THREE.Vector3;
}

export function MapViewer({
  selectedProvider,
  latencyRange,
  showRealtime,
  showRegions,
  searchQuery,
}: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const markersRef = useRef<THREE.Group | null>(null);
  const connectionsRef = useRef<THREE.Group | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const frameRef = useRef<number | null>(null);

  // 1. FETCH LIVE PINGS + GEO
  const { data: points = [], isLoading } = useQuery({
    queryKey: ["live-pings", selectedProvider],
    queryFn: async () => {
      const raw = await fetchLivePings();
      const filtered = raw.filter(
        (p) => selectedProvider === "all" || p.provider === selectedProvider
      );

      const withGeo = await Promise.all(
        filtered.map(async (p) => {
          const geo = await getGeo(p.region);
          const pos = latLngToVector(geo.lat, geo.lng);
          return { ...p, ...geo, position: pos };
        })
      );

      return withGeo;
    },
    refetchInterval: showRealtime ? 30_000 : false,
    staleTime: 10_000,
  });

  // FILTER BY SEARCH & LATENCY RANGE
  const filteredPoints = points.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.region.toLowerCase().includes(searchQuery.toLowerCase());
    const withinLatency =
      p.rtt >= latencyRange[0] && p.rtt <= latencyRange[1];
    return matchesSearch && withinLatency;
  });

  // THREE.JS SETUP
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 10, 20);
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 2.5);
    cameraRef.current = camera;

    // Lights
    const ambient = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 3, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Globe
    const globe = createGlobe(1);
    scene.add(globe);

    // Groups
    const markers = new THREE.Group();
    scene.add(markers);
    markersRef.current = markers;

    const connections = new THREE.Group();
    scene.add(connections);
    connectionsRef.current = connections;

    //ORBIT CONTROLS (mouse drag + wheel)
    let isDragging = false;
    let prev = { x: 0, y: 0 };

    const onDown = (e: MouseEvent) => {
      isDragging = true;
      prev = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      globe.rotation.y += dx * 0.005;
      globe.rotation.x += dy * 0.005;
      prev = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => (isDragging = false);
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(
        camera.position.z + e.deltaY * 0.001,
        1.5,
        5
      );
    };

    const canvas = renderer.domElement;
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("wheel", onWheel);

    //ANIMATION LOOP
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();

      // slow auto-rotate
      globe.rotation.y += 0.0002;

      // pulse markers
      markers.children.forEach((m, i) => {
        const s = 1 + Math.sin(Date.now() * 0.003 + i) * 0.15;
        m.scale.set(s, s, s);
      });

      // animate particle streams
      connections.children.forEach((g) => {
        updateConnectionParticles(g as THREE.Group, delta);
      });

      renderer.render(scene, camera);
    };
    animate();

    //RESIZE HANDLER
    const onResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    //CLEANUP
    return () => {
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("wheel", onWheel);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // UPDATE MARKERS (showRegions)
  useEffect(() => {
    const markers = markersRef.current;
    if (!markers) return;
    markers.clear();

    if (!showRegions) return;

    filteredPoints.forEach((p) => {
      const geom = new THREE.SphereGeometry(0.018, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: getProviderColor(p.provider),
        emissive: getProviderColor(p.provider),
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.4,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(p.position);
      mesh.userData = { region: p.region, city: p.city, rtt: p.rtt };
      markers.add(mesh);
    });
  }, [filteredPoints, showRegions]);


  //UPDATE CONNECTIONS
  useEffect(() => {
    const connections = connectionsRef.current;
    if (!connections) return;

    connections.clear();
    if (!showRealtime) return;

    filteredPoints.forEach((p) => {
      const center = new THREE.Vector3(0, 0, 0);
      const conn = createAnimatedConnection(p.position, center, {
        latency: p.rtt,
        packetLoss: 0,
        jitter: Math.random() * 3,
      });
      conn.userData = { region: p.region, rtt: p.rtt };
      connections.add(conn);
    });
  }, [filteredPoints, showRealtime]);

  // RENDER
  return (
    <div
      ref={containerRef}
      className="h-full w-full relative bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a]"
    >
      {/* Loading */}
      {isLoading && (
        <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 text-xs text-muted-foreground shadow-lg">
          Loading live latency...
        </div>
      )}

      {/* Stats */}
      <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 text-xs text-muted-foreground shadow-lg">
        <p className="font-medium">Regions: {filteredPoints.length}</p>
        {filteredPoints.length > 0 && (
          <p className="text-[10px] opacity-75">
            Avg:{" "}
            {(filteredPoints.reduce((s, p) => s + p.rtt, 0) / filteredPoints.length).toFixed(1)}ms
          </p>
        )}
      </div>

      {/* Legend */}
      {showRegions && (
        <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 text-xs text-muted-foreground max-w-xs">
          <p className="font-medium mb-1">Latency</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>&lt; 50ms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span>50–100ms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>100–200ms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>&gt; 200ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: lat/lng
function latLngToVector(lat: number, lng: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  const x = -Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z).multiplyScalar(1.02);
}

// Provider color
function getProviderColor(provider: string): number {
  switch (provider) {
    case "aws":
      return 0xff9900;
    case "gcp":
      return 0x4285f4;
    case "azure":
      return 0x0078d4;
    default:
      return 0x00ff00;
  }
}
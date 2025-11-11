// Utilities for rendering enhanced connection visualizations
import * as THREE from "three"

export interface ConnectionConfig {
  latency: number
  packetLoss: number
  jitter: number
}

// Create an animated tube geometry for connections
export function createAnimatedConnection(
  from: THREE.Vector3,
  to: THREE.Vector3,
  config: ConnectionConfig,
): THREE.Group {
  const group = new THREE.Group()

  // Main connection line with glow
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([from.x, from.y, from.z, to.x, to.y, to.z]), 3),
  )

  const color = getLatencyColor(config.latency)
  const lineColor = new THREE.Color(color)

  // Main line
  const lineMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
    linewidth: 3,
  })
  const line = new THREE.Line(geometry, lineMaterial)
  group.add(line)

  // Glow line for effect
  const glowMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
    linewidth: 5,
    transparent: true,
    opacity: 0.2,
  })
  const glowLine = new THREE.Line(geometry, glowMaterial)
  group.add(glowLine)

  // Create animated particle flow along the connection
  const particleCount = Math.ceil(config.latency / 50)
  const particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const t = i / particleCount
    positions[i * 3] = from.x + (to.x - from.x) * t
    positions[i * 3 + 1] = from.y + (to.y - from.y) * t
    positions[i * 3 + 2] = from.z + (to.z - from.z) * t
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

  const particleMaterial = new THREE.PointsMaterial({
    color: lineColor,
    size: 0.02,
    sizeAttenuation: true,
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  particles.userData = {
    direction: to.clone().sub(from).normalize(),
    distance: from.distanceTo(to),
    speed: 0.5 + config.latency / 500,
    latency: config.latency,
    packetLoss: config.packetLoss,
    jitter: config.jitter,
  }

  group.add(particles)
  return group
}

export function updateConnectionParticles(group: THREE.Group, deltaTime: number) {
  const particles = group.children[2] as THREE.Points

  if (!particles || !particles.userData.direction) return

  const positions = (particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
  const startPos = new THREE.Vector3(positions[0], positions[1], positions[2])
  const endPos = new THREE.Vector3(
    positions[positions.length - 3],
    positions[positions.length - 2],
    positions[positions.length - 1],
  )

  const distance = startPos.distanceTo(endPos)
  const speed = particles.userData.speed * deltaTime

  for (let i = 0; i < positions.length; i += 3) {
    const t = ((positions[i] - startPos.x) / (endPos.x - startPos.x + 0.0001) + speed) % 1

    positions[i] = startPos.x + (endPos.x - startPos.x) * t
    positions[i + 1] = startPos.y + (endPos.y - startPos.y) * t
    positions[i + 2] = startPos.z + (endPos.z - startPos.z) * t
  }

  particles.geometry.attributes.position.needsUpdate = true
}

export function getLatencyColor(latency: number): number {
  if (latency < 50) return 0x00ff00 // Green
  if (latency < 100) return 0x7fff00 // Yellow-green
  if (latency < 150) return 0xffff00 // Yellow
  if (latency < 250) return 0xff8800 // Orange
  return 0xff0000 // Red
}

export function createConnectionTooltip(config: ConnectionConfig, from: string, to: string): HTMLDivElement {
  const tooltip = document.createElement("div")
  tooltip.className = "absolute bg-card border border-border rounded-md p-3 text-xs z-50 shadow-lg"
  tooltip.innerHTML = `
    <p class="font-semibold text-foreground mb-2">${from} → ${to}</p>
    <p class="text-muted-foreground">Latency: <span class="text-primary font-semibold">${config.latency.toFixed(1)}ms</span></p>
    <p class="text-muted-foreground">Jitter: <span class="text-muted-foreground">${config.jitter.toFixed(2)}ms</span></p>
    <p class="text-muted-foreground">Packet Loss: <span class="text-muted-foreground">${(config.packetLoss * 100).toFixed(2)}%</span></p>
  `
  return tooltip
}

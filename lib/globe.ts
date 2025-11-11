import * as THREE from "three"

export function createGlobe(radius: number): THREE.Group {
  const group = new THREE.Group()

  // Create globe geometry
  const geometry = new THREE.IcosahedronGeometry(radius, 64)

  // Create canvas texture for globe
  const canvas = document.createElement("canvas")
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext("2d")!

  // Draw ocean blue background
  ctx.fillStyle = "#0a1428"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw continents (simplified)
  ctx.fillStyle = "#1a3a3a"
  drawContinents(ctx, canvas.width, canvas.height)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.MeshPhongMaterial({ map: texture })
  const mesh = new THREE.Mesh(geometry, material)
  group.add(mesh)

  // Add atmosphere glow
  const atmosphereGeometry = new THREE.IcosahedronGeometry(radius * 1.05, 64)
  const atmosphereMaterial = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.1,
    color: 0x4285f4,
  })
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  group.add(atmosphere)

  return group
}

function drawContinents(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Simplified continent shapes
  const continents = [
    { x: 0.2, y: 0.3, w: 0.15, h: 0.2 },
    { x: 0.35, y: 0.35, w: 0.2, h: 0.25 },
    { x: 0.65, y: 0.25, w: 0.18, h: 0.3 },
    { x: 0.8, y: 0.5, w: 0.12, h: 0.15 },
  ]

  continents.forEach((continent) => {
    ctx.fillRect(continent.x * width, continent.y * height, continent.w * width, continent.h * height)
  })
}

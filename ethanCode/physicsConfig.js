// physicsConfig.js
// All tunable numbers for player physics and input live here.
// Units are canvas pixels per frame (assumes ~60 fps).

const PHYSICS = {
  // ---- World layout (matches debugVisuals.js: floor y=375, ceiling y=25) ----
  surfaceMargin: 25, // floor = canvasHeight - margin, ceiling = margin
  sideMargin: 25, // left wall = margin, right wall = canvasWidth - margin
  playerZ: 100, // fixed depth of the player in front of the viewer (0 = viewer)

  // ---- Forward / backward (W / S) ----
  // W and S don't move the player in z. They change how fast the world scrolls
  // toward the viewer, so enemies close in faster (W) or slower (S).
  baseScrollSpeed: 5, // z units/frame the world moves at with no input
  maxForwardSpeed: 6, // extra scroll speed from W  -> world speed up to 11
  maxBackwardSpeed: 3, // reduced scroll speed from S -> world speed down to 2
  forwardAccel: 0.25,
  backwardAccel: 0.15,
  depthDrag: 0.95, // multiplier that eases depth speed back to 0 with no input

  // ---- Left / right (A / D) ----
  sideAccel: 0.9,
  sideFriction: 0.8, // multiplier applied each frame with no A/D input
  maxSideSpeed: 6,

  // ---- Gravity and jumping (Space) ----
  gravity: 0.6, // constant acceleration; sign flips with gravityDir
  maxFallSpeed: 14,
  jumpImpulse: 3, // initial kick toward the opposite surface

  // ---- Shooting (hold Shift) ----
  fireCooldown: 8, // frames between shots
  bulletSpeed: 20, // z units/frame, away from the viewer
  bulletSize: 12, // diameter at scale 1
  bulletRadius: 6, // hit radius at scale 1

  // ---- Enemies ----
  spawnInterval: 90, // frames between asteroid spawns in sketch.js
};

// Edges of the playable area, computed from the renderer's canvas size so
// changing canvasWidth / canvasHeight in backendToRender.js just works.
function getWorldBounds() {
  const w = typeof canvasWidth !== "undefined" ? canvasWidth : 400;
  const h = typeof canvasHeight !== "undefined" ? canvasHeight : 400;
  return {
    left: PHYSICS.sideMargin,
    right: w - PHYSICS.sideMargin,
    ceiling: PHYSICS.surfaceMargin,
    floor: h - PHYSICS.surfaceMargin,
    centerX: w / 2,
  };
}

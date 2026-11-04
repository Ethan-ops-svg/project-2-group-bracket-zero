// collision.js
// Hit test between two things that live in x, y, z space (player, bullets,
// enemy bodies). Each needs: x, y, z, radius, and optionally prevZ (where its
// z was at the start of the frame).
//
// x/y use a simple circle test. z uses a swept range, so something moving 20+
// units per frame (bullets, fast scrolling enemies) can't skip over a target.

function hitTest(a, b) {
  if (a.hbox === 0 || b.hbox === 0) {
    return false;
  }
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const r = a.radius + b.radius;
  if (dx * dx + dy * dy > r * r) return false;

  const z_mult = 0.1;
  const aZ = a.radius * z_mult;
  const bZ = b.radius * z_mult;

  const aPrev = a.prevZ !== undefined ? a.prevZ : a.z;
  const bPrev = b.prevZ !== undefined ? b.prevZ : b.z;

  const aLo = Math.min(aPrev, a.z) - aZ;
  const aHi = Math.max(aPrev, a.z) + aZ;
  const bLo = Math.min(bPrev, b.z) - bZ;
  const bHi = Math.max(bPrev, b.z) + bZ;
  return aLo <= bHi && bLo <= aHi;
}

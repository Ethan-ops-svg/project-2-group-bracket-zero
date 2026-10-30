// enemyBody.js
// The x, y, z side of an enemy. Attach it to an enemy sprite object with
// `sprite.physics = body` (enemy.js and ship.js both have an empty
// `this.physics` for this).
//
// The world scrolls toward the viewer at player.scrollSpeed. Pressing W makes
// that faster and S slower, so enemies close in faster or slower relative to
// the player.

class EnemyBody {
  // isUp: true = on the ceiling, false = on the floor (same as enemy.up).
  constructor(x, z, radius, isUp = false) {
    const b = getWorldBounds();
    this.x = x;
    this.y = isUp ? b.ceiling : b.floor;
    this.z = z;
    this.prevZ = z;
    this.radius = radius;
    this.alive = true;
  }

  getPosition() {
    return { x: this.x, y: this.y, z: this.z };
  }

  // scrollSpeed: pass player.scrollSpeed.
  update(scrollSpeed) {
    this.prevZ = this.z;
    this.z -= scrollSpeed;
    // Past the viewer: gone.
    if (this.z < 0) this.alive = false;
  }
}
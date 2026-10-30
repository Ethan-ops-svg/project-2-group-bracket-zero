// projectiles.js
// Bullets fired while Shift is held. They live in the same x, y, z space as
// everything else and are drawn through adjForPerspective().

class Projectile {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.prevZ = z; // z at the start of this frame, for swept collision
    this.radius = PHYSICS.bulletRadius;
    this.speed = PHYSICS.bulletSpeed;
    this.alive = true;
  }

  update() {
    this.prevZ = this.z;
    this.z += this.speed; // away from the viewer
    // Retire once fully faded out by the fog.
    const fogEnd =
      (typeof visionFogLine !== "undefined" ? visionFogLine : 1000) +
      (typeof fogDepth !== "undefined" ? fogDepth : 100);
    if (this.z >= fogEnd) this.alive = false;
  }

  getPosition() {
    return { x: this.x, y: this.y, z: this.z };
  }

  draw() {
    const p = adjForPerspective(this.x, this.y, this.z);
    if (p.scale <= 0 || p.alpha <= 0) return;
    push();
    noStroke();
    fill(255, p.alpha);
    circle(p.x, p.y, PHYSICS.bulletSize * p.scale);
    pop();
  }
}

class Weapon {
  constructor() {
    this.projectiles = [];
    this.cooldown = 0;
  }

  // firing: true while Shift is held. owner: anything with x, y, z.
  update(owner, firing) {
    if (this.cooldown > 0) this.cooldown--;

    if (firing && this.cooldown <= 0) {
      this.projectiles.push(new Projectile(owner.x, owner.y, owner.z));
      this.cooldown = PHYSICS.fireCooldown;
    }

    for (const p of this.projectiles) p.update();
    this.projectiles = this.projectiles.filter((p) => p.alive);
  }

  draw() {
    // Farthest first so nearer bullets draw on top.
    const sorted = [...this.projectiles].sort((a, b) => b.z - a.z);
    for (const p of sorted) p.draw();
  }
}
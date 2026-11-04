// projectiles.js
// Bullets fired while Shift is held. They live in the same x, y, z space as
// everything else and are drawn through adjForPerspective().

let proj_sheet = null;
let proj_frames = [];

async function load_proj_frames() {
  await loadImage(
    "lydiaCode/projectile.png",
    (img) => {
      proj_sheet = img;

      for (let col = 0; col < 2; col++) {
        proj_frames[col] = img.get(
          col * 25,
          0,
          25,
          25
        );
      }

      console.log("LOADED FRAMES:", proj_frames.length);
    },
    (err) => {
      console.error("Failed to load projectile sprite:", err);
    }
  );
}

class Projectile {
  // shift: vertical screen offset so the bullet spawns in front of the ship.
  // vx: sideways speed in x units/frame (0 = straight ahead). Used by spread shot.
  constructor(x, y, z, shift = 0, vx = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.prevZ = z; // z at the start of this frame, for swept collision
    this.radius = PHYSICS.bulletRadius;
    this.speed = PHYSICS.bulletSpeed;
    this.alive = true;
    this.shift = shift;
    // SPRITE STUFF //
    this.spriteW = 25;
    this.spriteH = 25;

    this.frameX;
    this.frameY;
    this.current_frame = 0;
    this.total_frames = 2;
    this.sprite_sheet = proj_sheet;
    this.frames = proj_frames;

    this.sprite_sheet = proj_sheet
  }

  update() {
    this.prevZ = this.z;
    this.z += this.speed; // away from the viewer
    this.x += this.vx;
    // Retire once fully faded out by the fog.
    const fogEnd =
      (typeof visionFogLine !== "undefined" ? visionFogLine : 1000) +
      (typeof fogDepth !== "undefined" ? fogDepth : 100);
    if (this.z >= fogEnd) this.alive = false;
  }

  getPosition() {
    return { x: this.x, y: this.y, z: this.z };
  }

  getFrame() {
    /*
    gets the desired frame
    args: none
    returns:
        P5 image object to draw to screen
    */
    if (!this.frames || this.frames.length !== 2) {
      console.log("NOT 2 FRAMES");
      return null;
    }
    if (frameCount % 4 === 0) {
      if (this.current_frame === this.total_frames - 1) {
        this.current_frame = 0;
      } else {
        this.current_frame++;
      }
    }
    return this.frames[this.current_frame];
  }

  draw() {
    imageMode(CENTER);
    const p = adjForPerspective(this.x, this.y, this.z);
    if (p.scale <= 0) return;
    let currentFrameImg = this.getFrame();
    if (currentFrameImg) {
      image(currentFrameImg, p.x, p.y + this.shift*p.scale, this.spriteW * p.scale, this.spriteH * p.scale)
    }
  }
}

class Weapon {
  constructor() {
    this.projectiles = [];
    this.cooldown = 0;
    this.spread = false; // true while the spread shot power-up is active

    // Make sure the bullet sprite is loading. (Harmless if sketch.js also
    // calls load_proj_frames(); it only runs here if no frames exist yet.)
    if (proj_frames.length === 0) load_proj_frames();
  }

  // firing: true while Shift is held. owner: anything with x, y, z.
  update(owner, firing) {
    if (this.cooldown > 0) this.cooldown--;

    if (!owner.spinning && firing && this.cooldown <= 0) {
      let shift;
      if (owner.y < 0) { // shifts projectiles to spawn in front of ship
        shift = 25;
      } else if (owner.y > 0) {
        shift = -25;
      } else {
        shift = 0;
      }
      this.projectiles.push(new Projectile(owner.x, owner.y, owner.z, shift));
      if (this.spread) {
        // Two extra bullets angled left and right.
        const v = PHYSICS.spreadShotSpeed;
        this.projectiles.push(new Projectile(owner.x, owner.y, owner.z, shift, -v));
        this.projectiles.push(new Projectile(owner.x, owner.y, owner.z, shift, v));
      }
      this.cooldown = PHYSICS.fireCooldown;
    }

    for (const p of this.projectiles) {
      p.update();
    }
    this.projectiles = this.projectiles.filter((p) => p.alive);
  }

  draw() {
    // Farthest first so nearer bullets draw on top.
    const sorted = [...this.projectiles].sort((a, b) => b.z - a.z);
    for (const p of sorted) p.draw();
  }
}
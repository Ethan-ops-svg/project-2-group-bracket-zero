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

    // SPRITE STUFF //
    this.spriteW = 25;
    this.spriteH = 25;

    this.frameX;
    this.frameY;
    this.current_frame = 0;
    this.total_frames = 1;

    this.sprite_sheet;
    this.load_sheet();
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
  
  async load_sheet() {
    /*
    Loads sprite png
    */
    this.sprite_sheet = await loadImage("lydiaCode/projectile.png");
  }

  getFrame() {
    /*
    gets the desired frame
    args: none
    returns:
        P5 image object to draw to screen
    */
    if (!this.sprite_sheet) {
        return;
    }
    this.frameY = 0;
    this.frameX = this.current_frame * this.spriteW;
    if(frameCount % 4 == 0) {
        if (this.current_frame == this.total_frames) {
            this.current_frame = 0;
        } else {
            this.current_frame ++;
        }
    }

    let frame = this.sprite_sheet.get(this.frameX, this.frameY, this.spriteW, this.spriteH);
    return frame;
  }

  draw() {
    const p = adjForPerspective(this.x, this.y, this.z);
    if (p.scale <= 0 || p.alpha <= 0 || !this.getFrame()) return;
    // push();
    // noStroke();
    // fill(255, p.alpha);
    // circle(p.x, p.y, PHYSICS.bulletSize * p.scale);
    // pop();
    
    image(this.getFrame(), p.x, p.y, this.spriteW*p.scale, this.spriteH*p.scale);

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

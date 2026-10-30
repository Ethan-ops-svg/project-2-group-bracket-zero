// player.js
// The player's physics. Everything is in the renderer's 3D space:
//   x = left/right, y = up/down (gravity axis), z = depth (0 = viewer).
// Pass getPosition() to adjForPerspective() to get the screen position.
//
// The Player owns a `ship` (lydiaCode/ship.js) and drives it: gravity decides
// ship.up, a jump starts ship.spinning, and drawShip() hands the ship its
// perspective-adjusted screen position and scale.
//
// Depends on (all at runtime, not at load time):
//   backendToRender.js : adjForPerspective, canvasWidth/Height
//   ship.js            : class ship
//   physicsConfig.js, inputState.js, projectiles.js

class Player {
  constructor() {
    const b = getWorldBounds();

    // Position
    this.x = b.centerX;
    this.y = b.floor;
    this.z = PHYSICS.playerZ;

    // Velocity. vz is the depth speed: it does not move the player, it
    // changes how fast the world scrolls (see scrollSpeed).
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    // +1 = gravity pulls toward the floor (y increases),
    // -1 = gravity pulls toward the ceiling (y decreases).
    this.gravityDir = 1;
    this.grounded = true;

    this.distance = 0; // total world distance scrolled, handy for score

    this.input = new InputState();
    this.weapon = new Weapon();

    // The sprite/animation side. ship.physics points back at this Player.
    this.ship = new ship();
    this.ship.physics = this;
  }

  // ---- Values for teammates -------------------------------------------

  // Raw 3D position for the perspective renderer.
  getPosition() {
    return { x: this.x, y: this.y, z: this.z };
  }

  // Hit radius (pixels at scale 1) and last frame's z, for hitTest().
  // The player never moves in z, so prevZ is just z.
  get radius() {
    return this.ship.hbox;
  }

  get prevZ() {
    return this.z;
  }

  // How far the world moves toward the viewer this frame. Enemies and
  // scenery should do `obj.z -= player.scrollSpeed` instead of a fixed 5.
  // W raises it (up to base + maxForward), S lowers it (down to
  // base - maxBackward). Forward max is faster than backward max.
  get scrollSpeed() {
    return PHYSICS.baseScrollSpeed + this.vz;
  }

  get onCeiling() {
    return this.grounded && this.gravityDir < 0;
  }

  get shooting() {
    return this.input.shoot;
  }

  // ---- Per-frame update -------------------------------------------------

  update() {
    this.input.update();
    const bounds = getWorldBounds();

    this._updateDepth();
    this._updateSide(bounds);
    this._updateVertical(bounds);

    this.weapon.update(this, this.input.shoot);
    this.distance += this.scrollSpeed;

    // ship.up picks the sprite row (true = ceiling). Mirror gravity here so
    // it always agrees with the physics.
    this.ship.up = this.gravityDir < 0;
  }

  _updateDepth() {
    const dir = this.input.depth;
    if (dir > 0) {
      this.vz += PHYSICS.forwardAccel;
    } else if (dir < 0) {
      this.vz -= PHYSICS.backwardAccel;
    } else {
      this.vz *= PHYSICS.depthDrag;
      if (Math.abs(this.vz) < 0.01) this.vz = 0;
    }
    this.vz = constrain(this.vz, -PHYSICS.maxBackwardSpeed, PHYSICS.maxForwardSpeed);
  }

  _updateSide(bounds) {
    const dir = this.input.horizontal;
    if (dir !== 0) {
      this.vx += dir * PHYSICS.sideAccel;
    } else {
      this.vx *= PHYSICS.sideFriction;
      if (Math.abs(this.vx) < 0.05) this.vx = 0;
    }
    this.vx = constrain(this.vx, -PHYSICS.maxSideSpeed, PHYSICS.maxSideSpeed);

    this.x += this.vx;
    if (this.x <= bounds.left) {
      this.x = bounds.left;
      this.vx = 0;
    } else if (this.x >= bounds.right) {
      this.x = bounds.right;
      this.vx = 0;
    }
  }

  _updateVertical(bounds) {
    // Space on a surface: flip gravity and kick off toward the other surface.
    if (this.input.jumpPressed && this.grounded) {
      this._jump();
    }

    // Constant gravitational acceleration.
    this.vy += PHYSICS.gravity * this.gravityDir;
    this.vy = constrain(this.vy, -PHYSICS.maxFallSpeed, PHYSICS.maxFallSpeed);
    this.y += this.vy;

    // Land on the floor or ceiling.
    if (this.y >= bounds.floor) {
      this.y = bounds.floor;
      if (this.vy > 0) this.vy = 0;
    } else if (this.y <= bounds.ceiling) {
      this.y = bounds.ceiling;
      if (this.vy < 0) this.vy = 0;
    }

    // Grounded only when resting on the surface gravity pulls toward.
    this.grounded =
      (this.gravityDir > 0 && this.y >= bounds.floor) ||
      (this.gravityDir < 0 && this.y <= bounds.ceiling);
  }

  _jump() {
    this.gravityDir *= -1; // flip the sign of gravity
    this.vy = this.gravityDir * PHYSICS.jumpImpulse; // small kick the new way
    this.grounded = false;

    // Restart the ship's spin animation (ship.js plays it twice).
    this.ship.up = this.gravityDir < 0;
    this.ship.rot = 0;
    this.ship.current_frame = 0;
    this.ship.spinning = true;
  }

  // ---- Drawing ------------------------------------------------------------

  draw() {
    this.weapon.draw();
    this.drawShip();
  }

  drawShip() {
    const p = adjForPerspective(this.x, this.y, this.z);
    if (p.scale <= 0 || p.alpha <= 0) return;

    push();
    imageMode(CENTER);
    noSmooth();
    tint(255, p.alpha);

    if (!this.ship.sprite_sheet) {
      // Sheet still loading: draw a placeholder circle.
      noStroke();
      fill(255, p.alpha);
      circle(p.x, p.y, this.ship.spriteW * p.scale);
    } else {
      const wasSpinning = this.ship.spinning;
      this.ship.draw(p.x, p.y, p.scale);
      // ship.spin() returns nothing on the frame the animation ends, which
      // would leave the ship invisible for one frame. Draw the idle frame.
      if (wasSpinning && !this.ship.spinning) {
        this.ship.draw(p.x, p.y, p.scale);
      }
    }
    pop();
  }
}
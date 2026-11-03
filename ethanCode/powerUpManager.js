// powerUpManager.js
// Keeps track of the player's lives and which power-ups are active.
//
// Power-up types:
//   invincibility : enemies can't hurt you for a few seconds (ship blinks)
//   extraLife     : +1 life (up to PHYSICS.maxLives)
//   spreadShot    : each shot fires 3 bullets (left, center, right)
//
// Usage (see sketch.js):
//   powerUps = new PowerUpManager();
//   powerUps.update(player);                 // once per frame
//   powerUps.collect(body.type, player);     // when the player hits a power-up
//   if (powerUps.takeHit()) { ... }          // when an enemy hits the player
//   powerUps.drawHud();                      // lives, timers, pickup message

const POWERUP_TYPES = ["invincibility", "extraLife", "spreadShot"];

const POWERUP_LABELS = {
  invincibility: "INVINCIBLE!",
  extraLife: "+1 LIFE",
  spreadShot: "SPREAD SHOT!",
};

class PowerUpManager {
  constructor() {
    this.lives = PHYSICS.startingLives;
    // Frames left on each timed effect (0 = off).
    this.timers = { invincibility: 0, spreadShot: 0 };
    this.notice = ""; // pickup message shown on screen
    this.noticeTimer = 0;
  }

  // Which type the next power-up will be. Random, unless
  // PHYSICS.testPowerUpType is set for testing.
  pickType() {
    if (POWERUP_TYPES.includes(PHYSICS.testPowerUpType)) {
      return PHYSICS.testPowerUpType;
    }
    return POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  }

  // Apply a power-up when the player touches one.
  collect(type, player) {
    if (type === "invincibility") {
      this.timers.invincibility = PHYSICS.invincibilityFrames;
    } else if (type === "spreadShot") {
      this.timers.spreadShot = PHYSICS.spreadShotFrames;
    } else if (type === "extraLife") {
      this.lives = Math.min(this.lives + 1, PHYSICS.maxLives);
    }
    this.notice = POWERUP_LABELS[type] || type;
    this.noticeTimer = PHYSICS.powerUpNoticeFrames;
    this.apply(player);
  }

  // Counts the timers down and pushes the active effects onto the player.
  // Call once per frame.
  update(player) {
    for (const key in this.timers) {
      if (this.timers[key] > 0) this.timers[key]--;
    }
    if (this.noticeTimer > 0) this.noticeTimer--;
    this.apply(player);
  }

  apply(player) {
    player.invincible = this.invincible;
    player.weapon.spread = this.timers.spreadShot > 0;
  }

  get invincible() {
    return this.timers.invincibility > 0;
  }

  get gameOver() {
    return this.lives <= 0;
  }

  // Call when an enemy hits the player. Returns true if it cost a life,
  // false if invincibility absorbed it.
  takeHit() {
    if (this.invincible || this.gameOver) return false;
    this.lives--;
    return true;
  }

  // ---- Drawing ------------------------------------------------------------

  drawHud() {
    push();
    noStroke();
    fill(255);
    textSize(10);
    textAlign(RIGHT, TOP);

    let lines = `lives ${this.lives}`;
    if (this.timers.invincibility > 0) {
      lines += `\ninvincible ${(this.timers.invincibility / 60).toFixed(1)}s`;
    }
    if (this.timers.spreadShot > 0) {
      lines += `\nspread ${(this.timers.spreadShot / 60).toFixed(1)}s`;
    }
    text(lines, canvasWidth - 6, 6);

    if (this.noticeTimer > 0) {
      textAlign(CENTER, CENTER);
      textSize(16);
      text(this.notice, canvasWidth / 2, canvasHeight / 2 - 60);
    }

    if (this.gameOver) {
      textAlign(CENTER, CENTER);
      textSize(24);
      text("GAME OVER", canvasWidth / 2, canvasHeight / 2);
    }
    pop();
  }
}
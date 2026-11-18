// game.js
// The game itself: state (menu / playing / paused / game over), spawning,
// collisions, scoring and drawing. sketch.js just calls update() and draw().
//
// States:
//   "menu"      title screen
//   "controls"  how-to-play screen
//   "playing"   the game is running
//   "paused"    frozen, with a pause menu
//   "gameover"  out of lives, final score
//
// Uses: Player, PowerUpManager, PowerUpBody, EnemyBody, hitTest, ScoreSystem,
// UIManager, and the sprite classes asteroid / powerup.

class Game {
  constructor() {
    this.state = "menu";
    this.player = new Player();
    this.powerUps = new PowerUpManager();
    this.score = new ScoreSystem();
    this.enemies = []; // enemy sprite objects, each with .physics = EnemyBody
    this.pickups = []; // powerup sprite objects, each with .physics = PowerUpBody
    this.tick = 0; // frames spent playing (not counting pause), drives spawning
    this.ui = new UIManager(this);
  }

  setState(state) {
    this.state = state;
    this.ui.selected = 0;
  }

  // Starts a fresh game from the menu or game over screen.
  startGame() {
    this.player.reset();
    this.powerUps = new PowerUpManager();
    this.score.reset();
    this.enemies = [];
    this.pickups = [];
    this.tick = 0;
    this.setState("playing");
  }

  // ---- Update -------------------------------------------------------------------

  update() {
    this.ui.update();
    const k = this.ui.keys;

    // Esc or P pauses and unpauses; Esc also leaves the how-to-play screen.
    if (this.state === "playing" && (k.back || k.pause)) {
      this.setState("paused");
    } else if (this.state === "paused" && (k.back || k.pause)) {
      this.setState("playing");
    } else if (this.state === "controls" && k.back) {
      this.setState("menu");
    }

    if (this.state === "playing") this._updatePlaying();
  }

  _updatePlaying() {
    const player = this.player;

    player.update();
    this.powerUps.update(player);
    this.score.update(player.scrollSpeed);

    this.tick++;
    if (this.tick % PHYSICS.spawnInterval === 0) this._spawnAsteroid();
    if (this.tick % PHYSICS.powerUpInterval === 0) this._spawnPowerUp();

    // Enemies and power-ups move toward the viewer at the world scroll speed.
    for (const e of this.enemies) e.physics.update(player.scrollSpeed);
    for (const p of this.pickups) p.physics.update(player.scrollSpeed);

    // Things far away are still invisible (the renderer hides them), so they
    // can't be hit or collected yet.
    const visibleZ = this._visibleZ();

    for (const e of this.enemies) {
      if (!e.physics.alive || e.physics.z > visibleZ) continue;

      // Bullets vs enemy
      for (const bullet of player.weapon.projectiles) {
        if (bullet.alive && hitTest(bullet, e.physics)) {
          bullet.alive = false;
          e.physics.alive = false;
          this._scoreKill(e.physics);
          break;
        }
      }

      // Enemy vs player. Invincibility absorbs the hit and still destroys it.
      if (e.physics.alive && hitTest(player, e.physics)) {
        e.physics.alive = false;
        if (this.powerUps.takeHit()) this.ui.flash();
        else this._scoreKill(e.physics);
      }
    }

    // Power-ups vs player
    for (const p of this.pickups) {
      if (!p.physics.alive || p.physics.z > visibleZ) continue;
      if (hitTest(player, p.physics)) {
        p.physics.alive = false;
        this.powerUps.collect(p.physics.type, player);
        const s = this._screenPos(p.physics);
        this.score.addPickup(s.x, s.y);
      }
    }

    this.enemies = this.enemies.filter((e) => e.physics.alive);
    this.pickups = this.pickups.filter((p) => p.physics.alive);

    if (this.powerUps.gameOver) {
      this.score.finalize();
      this.setState("gameover");
    }
  }

  // The farthest z the renderer actually shows things at.
  _visibleZ() {
    const hide = typeof hideObjDelay !== "undefined" ? hideObjDelay : 0;
    return canvasDepth - hide;
  }

  _screenPos(body) {
    const p = adjForPerspective(body.x, body.y, body.z);
    return { x: p.x, y: p.y, scale: p.scale };
  }

  _scoreKill(body) {
    const s = this._screenPos(body);
    this.score.addKill(s.x, s.y);
  }

  _spawnAsteroid() {
    const b = getWorldBounds();
    const isUp = Math.random() < 0.5; // ceiling or floor
    const sprite = new asteroid(isUp);
    const x = b.left + Math.random() * (b.right - b.left);
    sprite.physics = new EnemyBody(x, canvasDepth, sprite.hbox, isUp);
    this.enemies.push(sprite);
  }

  _spawnPowerUp() {
    const b = getWorldBounds();
    const sprite = new powerup();
    const x = b.left + Math.random() * (b.right - b.left);
    sprite.physics = new PowerUpBody(x, canvasDepth, sprite.hbox, this.powerUps.pickType());
    this.pickups.push(sprite);
  }

  // ---- Draw -----------------------------------------------------------------------

  draw() {
    background(0);
    // No depth buffer: sprites are sorted farthest-first below, and the depth
    // buffer would otherwise let a sprite's transparent corners hide others.
    drawingContext.disable(drawingContext.DEPTH_TEST);
    imageMode(CENTER);

    if (this.state === "playing" || this.state === "paused" || this.state === "gameover") {
      this._drawScene();
    }
    this.ui.draw();
  }

  // Everything is drawn farthest first so nearer things cover farther ones.
  _drawScene() {
    const drawables = [];

    for (const e of this.enemies) {
      drawables.push({ z: e.physics.z, draw: () => this._drawSprite(e) });
    }
    for (const p of this.pickups) {
      drawables.push({ z: p.physics.z, draw: () => this._drawSprite(p) });
    }
    for (const bullet of this.player.weapon.projectiles) {
      drawables.push({ z: bullet.z, draw: () => bullet.draw() });
    }
    drawables.push({ z: this.player.z, draw: () => this.player.drawShip() });

    drawables.sort((a, b) => b.z - a.z);
    for (const d of drawables) d.draw();
  }

  // Converts a sprite's body x, y, z to a screen position and scale, then
  // lets the sprite (enemy or powerup) draw itself there.
  _drawSprite(sprite) {
    const pos = sprite.physics.getPosition();
    const p = adjForPerspective(pos.x, pos.y, pos.z);
    if (p.scale <= 0) return;
    sprite.draw(p.x, p.y, p.scale);
  }
}
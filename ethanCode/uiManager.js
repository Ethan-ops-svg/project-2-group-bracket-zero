// uiManager.js
// All the menus and the in-game HUD.
//
// Why a separate 2D layer: the game canvas is WEBGL, where p5's text() needs a
// loaded font file. So the UI is drawn on a normal 2D p5.Graphics (which can
// use any system font). That layer is placed on top of the game canvas as its
// own page element. (Stamping it into the WEBGL canvas with image() every frame
// roughly halved the frame rate in testing; as an overlay it costs nothing.)
//
// Screens (the game state decides which one shows):
//   menu      title screen:  PLAY / HOW TO PLAY
//   controls  list of keys:  BACK
//   playing   HUD: score, lives, active power-ups, pickup messages, "+100" popups
//   paused    PAUSED:        RESUME / QUIT TO MENU
//   gameover  final score:   PLAY AGAIN / MENU
//
// Menus work with the keyboard (W/S or arrows to move, Enter to choose) and the
// mouse (hover and click). Space is NOT used to choose, because Space jumps.
//
// Depends on: PHYSICS and the Game object.

// Reads the menu keys. Key presses are caught as events (not polled), so a
// quick tap is never missed, even if the game is running at a low frame rate.
// Each flag is true for exactly one update() call, then clears.
class MenuKeys {
  constructor() {
    this.up = false;
    this.down = false;
    this.confirm = false;
    this.back = false; // Esc
    this.pause = false; // P
    this.click = false; // mouse button went down

    // Presses seen since the last update().
    this._seen = {};
    const names = {
      ArrowUp: "up", KeyW: "up",
      ArrowDown: "down", KeyS: "down",
      Enter: "confirm", NumpadEnter: "confirm",
      Escape: "back",
      KeyP: "pause",
    };
    window.addEventListener("keydown", (e) => {
      if (e.repeat) return; // holding a key doesn't repeat
      const name = names[e.code];
      if (name) this._seen[name] = true;
    });
    window.addEventListener("mousedown", () => {
      this._seen.click = true;
    });
  }

  // Call every frame (even while playing) so old presses don't pile up.
  update() {
    this.up = !!this._seen.up;
    this.down = !!this._seen.down;
    this.confirm = !!this._seen.confirm;
    this.back = !!this._seen.back;
    this.pause = !!this._seen.pause;
    this.click = !!this._seen.click;
    this._seen = {};
  }
}

class UIManager {
  constructor(game) {
    this.game = game;
    this.layer = createGraphics(width, height);
    this.layer.textFont("monospace");
    this._mountOverlay();

    this.keys = new MenuKeys();
    this.selected = 0; // which button is highlighted
    this.flashFrames = 0; // red screen flash after taking a hit
    this.lastMouse = { x: -1, y: -1 };
  }

  // Red flash over the screen (called when the player loses a life).
  flash() {
    this.flashFrames = 12;
  }

  // ---- Menu buttons ---------------------------------------------------------

  // The buttons for the current state: [{ label, action }]. Empty while playing.
  menuItems() {
    const g = this.game;
    switch (g.state) {
      case "menu":
        return [
          { label: "PLAY", action: () => g.startGame() },
          { label: "HOW TO PLAY", action: () => g.setState("controls") },
        ];
      case "controls":
        return [{ label: "BACK", action: () => g.setState("menu") }];
      case "paused":
        return [
          { label: "RESUME", action: () => g.setState("playing") },
          { label: "QUIT TO MENU", action: () => g.setState("menu") },
        ];
      case "gameover":
        return [
          { label: "PLAY AGAIN", action: () => g.startGame() },
          { label: "MENU", action: () => g.setState("menu") },
        ];
      default:
        return [];
    }
  }

  // Where the first button sits (fraction of the canvas height) for each screen.
  _menuTop() {
    switch (this.game.state) {
      case "menu": return 0.6;
      case "controls": return 0.88;
      case "paused": return 0.55;
      case "gameover": return 0.68;
      default: return 0.6;
    }
  }

  // Button rectangle (center x/y, size) in layer coordinates (0,0 = top left).
  _buttonRect(i) {
    return { x: width / 2, y: height * this._menuTop() + i * 46, w: 240, h: 36 };
  }

  // Index of the button under the mouse, or -1.
  _buttonAt(mx, my, count) {
    for (let i = 0; i < count; i++) {
      const r = this._buttonRect(i);
      if (Math.abs(mx - r.x) <= r.w / 2 && Math.abs(my - r.y) <= r.h / 2) return i;
    }
    return -1;
  }

  // Call once per frame, before the game reads this.keys.
  update() {
    this.keys.update();
    const items = this.menuItems();
    if (items.length === 0) return;
    const n = items.length;

    if (this.keys.up) this.selected = (this.selected - 1 + n) % n;
    if (this.keys.down) this.selected = (this.selected + 1) % n;

    // The mouse only moves the highlight when it actually moves, so it
    // doesn't fight the keyboard.
    const moved = mouseX !== this.lastMouse.x || mouseY !== this.lastMouse.y;
    this.lastMouse = { x: mouseX, y: mouseY };
    const hover = this._buttonAt(mouseX, mouseY, n);
    if (moved && hover >= 0) this.selected = hover;

    if (this.keys.confirm) {
      items[this.selected].action();
    } else if (this.keys.click && hover >= 0) {
      items[hover].action();
    }
  }

  // ---- Drawing ----------------------------------------------------------------

  // Draws the right screen onto the layer, then stamps it over the game.
  draw() {
    const g = this.game;
    const l = this.layer;
    l.clear();
    l.noStroke();

    if (g.state === "menu") this._drawTitle();
    else if (g.state === "controls") this._drawControls();
    else {
      this._drawHud();
      if (g.state === "paused") this._drawPaused();
      if (g.state === "gameover") this._drawGameOver();
    }

    if (this.flashFrames > 0) {
      l.fill(255, 0, 0, this.flashFrames * 12);
      l.rect(0, 0, width, height);
      this.flashFrames--;
    }

    this._alignOverlay();
  }

  // ---- Overlay placement ------------------------------------------------------

  // Puts the UI layer's canvas directly on top of the game canvas.
  _mountOverlay() {
    const main = drawingContext.canvas;
    const el = this.layer.elt;
    const parent = main.parentElement || document.body;

    if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
    main.style.display = "block"; // removes the small gap canvases get under them by default
    el.style.display = "block";
    el.style.position = "absolute";
    el.style.pointerEvents = "none"; // clicks go through to the game
    el.style.width = width + "px";
    el.style.height = height + "px";
    parent.appendChild(el);

    this._main = main;
    this._offset = { x: null, y: null };
    this._alignOverlay();
  }

  // Keeps the overlay lined up if the page layout moves the game canvas.
  _alignOverlay() {
    const x = this._main.offsetLeft;
    const y = this._main.offsetTop;
    if (x !== this._offset.x || y !== this._offset.y) {
      this._offset = { x, y };
      this.layer.elt.style.left = x + "px";
      this.layer.elt.style.top = y + "px";
    }
  }

  _pad(n) {
    return String(Math.floor(n)).padStart(6, "0");
  }

  _dim(alpha) {
    this.layer.fill(0, 0, 0, alpha);
    this.layer.rect(0, 0, width, height);
  }

  _drawButtons() {
    const l = this.layer;
    const items = this.menuItems();
    l.textAlign(CENTER, CENTER);
    l.textSize(16);
    for (let i = 0; i < items.length; i++) {
      const r = this._buttonRect(i);
      const on = i === this.selected;
      l.fill(on ? 255 : 0, on ? 255 : 0, on ? 255 : 0, on ? 255 : 160);
      l.stroke(255);
      l.strokeWeight(2);
      l.rect(r.x - r.w / 2, r.y - r.h / 2, r.w, r.h);
      l.noStroke();
      l.fill(on ? 0 : 255);
      l.text(items[i].label, r.x, r.y);
    }
    l.noStroke();
  }

  _drawTitle() {
    const l = this.layer;
    l.fill(255);
    l.textAlign(CENTER, CENTER);
    l.textStyle(BOLD);
    l.textSize(56);
    l.text("MOOSE LIFE", width / 2, height * 0.25);
    l.textStyle(NORMAL);
    l.textSize(14);
    l.text("BEST  " + this._pad(this.game.score.highScore), width / 2, height * 0.42);
    this._drawButtons();
    l.textSize(11);
    l.fill(180);
    l.text("W/S or arrows to move, Enter to choose", width / 2, height - 18);
  }

  _drawControls() {
    const l = this.layer;
    l.fill(255);
    l.textAlign(CENTER, CENTER);
    l.textStyle(BOLD);
    l.textSize(30);
    l.text("HOW TO PLAY", width / 2, 40);
    l.textStyle(NORMAL);

    const rows = [
      ["A / D", "move left / right"],
      ["W / S", "speed the world up / slow it down"],
      ["SPACE", "jump (flips gravity)"],
      ["SHIFT", "hold to shoot"],
      ["ESC / P", "pause"],
      ["", ""],
      ["Faster world = more points, but enemies come faster.", ""],
      ["Grab power-ups: invincibility, extra life, spread shot.", ""],
    ];
    l.textSize(15);
    let y = 92;
    for (const [key, what] of rows) {
      if (what === "" && key !== "") {
        l.textAlign(CENTER, CENTER);
        l.fill(200);
        l.textSize(13);
        l.text(key, width / 2, y);
        l.fill(255);
        l.textSize(15);
      } else if (key !== "") {
        l.textAlign(RIGHT, CENTER);
        l.text(key, width / 2 - 14, y);
        l.textAlign(LEFT, CENTER);
        l.text(what, width / 2 + 14, y);
      }
      y += 26;
    }
    this._drawButtons();
  }

  _drawHud() {
    const l = this.layer;
    const g = this.game;
    const pu = g.powerUps;

    // Score (top left)
    l.fill(255);
    l.textAlign(LEFT, TOP);
    l.textSize(20);
    l.text("SCORE " + this._pad(g.score.displayScore), 12, 10);
    l.textSize(12);
    l.text("BEST  " + this._pad(g.score.highScore), 12, 36);
    l.text("SPEED x" + g.score.speedMultiplier.toFixed(1), 12, 52);

    // Lives (top right): filled squares for lives left, outlines for empty slots
    l.textAlign(RIGHT, TOP);
    l.textSize(12);
    l.text("LIVES", width - 12, 10);
    for (let i = 0; i < PHYSICS.maxLives; i++) {
      const x = width - 12 - (PHYSICS.maxLives - i) * 18;
      if (i < pu.lives) {
        l.fill(255);
        l.rect(x, 28, 14, 14);
      } else {
        l.noFill();
        l.stroke(255);
        l.strokeWeight(1);
        l.rect(x, 28, 14, 14);
        l.noStroke();
      }
    }

    // Active power-up timers (under the lives)
    l.fill(255);
    l.textAlign(RIGHT, TOP);
    let y = 50;
    if (pu.timers.invincibility > 0) {
      l.text(`INVINCIBLE ${(pu.timers.invincibility / 60).toFixed(1)}s`, width - 12, y);
      y += 16;
    }
    if (pu.timers.spreadShot > 0) {
      l.text(`SPREAD ${(pu.timers.spreadShot / 60).toFixed(1)}s`, width - 12, y);
    }

    // The pickup message and popups would overlap the game over screen.
    if (g.state === "gameover") return;

    // Pickup message (center top)
    if (pu.noticeTimer > 0) {
      l.textAlign(CENTER, CENTER);
      l.textSize(22);
      l.text(pu.notice, width / 2, height * 0.22);
    }

    // Floating "+100" popups. Their positions are canvas-center based, so
    // shift them to layer coordinates.
    l.textAlign(CENTER, CENTER);
    l.textSize(16);
    for (const p of g.score.popups) {
      l.fill(255, 255, 255, Math.min(255, (p.life / PHYSICS.scorePopupFrames) * 400));
      l.text(p.text, p.x + width / 2, p.y + height / 2);
    }
  }

  _drawPaused() {
    const l = this.layer;
    this._dim(150);
    l.fill(255);
    l.textAlign(CENTER, CENTER);
    l.textStyle(BOLD);
    l.textSize(40);
    l.text("PAUSED", width / 2, height * 0.3);
    l.textStyle(NORMAL);
    this._drawButtons();
  }

  _drawGameOver() {
    const l = this.layer;
    const s = this.game.score;
    this._dim(170);
    l.fill(255);
    l.textAlign(CENTER, CENTER);
    l.textStyle(BOLD);
    l.textSize(44);
    l.text("GAME OVER", width / 2, height * 0.2);
    l.textStyle(NORMAL);
    l.textSize(22);
    l.text("SCORE " + this._pad(s.displayScore), width / 2, height * 0.35);
    l.textSize(14);
    l.text(
      s.newHighScore ? "NEW HIGH SCORE!" : "BEST  " + this._pad(s.highScore),
      width / 2,
      height * 0.45
    );
    l.textSize(12);
    l.text(`enemies destroyed ${s.kills}   power-ups ${s.pickups}`, width / 2, height * 0.53);
    this._drawButtons();
  }
}
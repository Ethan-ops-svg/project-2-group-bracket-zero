// scoreSystem.js
// Keeps the score, the saved high score, and the floating "+100" popups.
//
// How points are earned:
//   - Distance: a few points every frame, more when the world scrolls faster.
//   - Kills: PHYSICS.killPoints per enemy, times the speed multiplier.
//   - Pickups: PHYSICS.pickupPoints per power-up.
//
// The speed multiplier is player.scrollSpeed / baseScrollSpeed, so holding W
// (faster, riskier) pays more and holding S (slower, safer) pays less.
//
// Usage (see game.js):
//   score = new ScoreSystem();
//   score.update(player.scrollSpeed);        // once per frame while playing
//   score.addKill(screenX, screenY);         // enemy destroyed
//   score.addPickup(screenX, screenY);       // power-up collected
//   score.finalize();                        // when the game ends; saves best
//   score.reset();                           // start a new game

const HIGH_SCORE_KEY = "mooseLifeHighScore";

class ScoreSystem {
  constructor() {
    this.highScore = this._loadHighScore();
    this.reset();
  }

  reset() {
    this.score = 0;
    this.kills = 0;
    this.pickups = 0;
    this.speedMultiplier = 1;
    this.newHighScore = false;
    this.popups = []; // { text, x, y, life } in screen coordinates (0,0 = canvas center)
  }

  // Whole-number score for display.
  get displayScore() {
    return Math.floor(this.score);
  }

  // Call once per frame while playing.
  update(scrollSpeed) {
    this.speedMultiplier = scrollSpeed / PHYSICS.baseScrollSpeed;
    this.score += scrollSpeed * PHYSICS.distancePointsPerUnit;

    for (const p of this.popups) {
      p.y -= 0.6; // drift upward
      p.life--;
    }
    this.popups = this.popups.filter((p) => p.life > 0);
  }

  // x, y: where to show the popup (the enemy's screen position).
  addKill(x, y) {
    const points = Math.round(PHYSICS.killPoints * this.speedMultiplier);
    this.score += points;
    this.kills++;
    this._popup(`+${points}`, x, y);
  }

  addPickup(x, y) {
    this.score += PHYSICS.pickupPoints;
    this.pickups++;
    this._popup(`+${PHYSICS.pickupPoints}`, x, y);
  }

  // Call once when the game ends. Saves the high score if it was beaten.
  finalize() {
    if (this.displayScore > this.highScore) {
      this.highScore = this.displayScore;
      this.newHighScore = true;
      this._saveHighScore(this.highScore);
    }
  }

  _popup(text, x, y) {
    this.popups.push({ text, x, y, life: PHYSICS.scorePopupFrames });
  }

  // localStorage can be missing or blocked, so every access is wrapped.
  _loadHighScore() {
    try {
      const n = parseInt(localStorage.getItem(HIGH_SCORE_KEY), 10);
      return Number.isFinite(n) && n > 0 ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  _saveHighScore(n) {
    try {
      localStorage.setItem(HIGH_SCORE_KEY, String(n));
    } catch (e) {
      // ignore: the high score just won't persist
    }
  }
}
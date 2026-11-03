// powerUpBody.js
// The x, y, z side of a power-up. Works exactly like EnemyBody (it scrolls
// toward the viewer at player.scrollSpeed and expires once it passes you), with
// two differences:
//   - It carries a `type` ("invincibility", "extraLife" or "spreadShot").
//   - It floats at a random height between the floor and ceiling instead of
//     sitting on a surface, so you can grab it mid-jump.
//
// Attach it to a powerup sprite (lydiaCode/powerups.js) with
// `sprite.physics = body`. Its hit radius should be sprite.hbox (17).

class PowerUpBody extends EnemyBody {
  constructor(x, z, radius, type) {
    super(x, z, radius, false);
    const b = getWorldBounds();
    this.y = b.ceiling + Math.random() * (b.floor - b.ceiling);
    this.type = type;
  }
}
// physicsDemo.js
// Standalone test for the player physics. It defines setup() and draw(), so
// only enable it in index.html when sketch.js / demo.js / debugVisuals.js
// are NOT also defining them.
//
// Controls: W/S speed up / slow the world, A/D move, Space jump, hold Shift shoot.

let player;
let shipSheet;
let scenery = [];

async function setup() {
  createCanvas(400, 400);
  noSmooth();
  shipSheet = await loadImage("lydiaCode/test.png");

  player = new Player();

  // Dots on the floor and ceiling that scroll at player.scrollSpeed,
  // so W / S visibly change the speed (same idea as debugVisuals.js).
  const b = getWorldBounds();
  for (let i = 0; i < 12; i++) {
    scenery.push({
      x: random(b.left, b.right),
      y: i % 2 === 0 ? b.floor : b.ceiling,
      z: random(0, canvasDepth),
    });
  }
}

function draw() {
  background(30);
  noStroke();

  player.update();

  for (const s of scenery) {
    const p = adjForPerspective(s.x, s.y, s.z);
    if (p.scale > 0) {
      fill(255, 0, 0, p.alpha);
      circle(p.x, p.y, 50 * p.scale);
    }
    s.z -= player.scrollSpeed;
    if (s.z < 0) s.z += canvasDepth;
  }

  player.draw(shipSheet);

  // Debug readout
  const pos = player.getPosition();
  fill(255);
  textSize(10);
  textAlign(LEFT, TOP);
  text(
    `x ${pos.x.toFixed(1)}  y ${pos.y.toFixed(1)}  z ${pos.z.toFixed(1)}\n` +
      `world speed ${player.scrollSpeed.toFixed(2)}  grounded ${player.grounded}`,
    6,
    6
  );
}
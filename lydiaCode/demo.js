let player;

function setup() {
  createCanvas(400, 400);
  noSmooth(); // important for scaling resolution
  player = new powerup();
  
}

// ubcomment this if testing ship
// function keyPressed() { // what needs to happen when space is presssed, can probably be done in the inputs file
//   if (key === ' ') {
//     player.rot = 0;
//     player.current_frame = 0;
//     player.up = !player.up;
//     player.spinning = true;
//   }
// }

function draw() {
  background(0);
  imageMode(CENTER); // important for drawing sprite at proper coords

  mult = abs(sin(frameCount/60) + 1); // scaling factor, for demonstration

  player.draw(200, 200, mult);
}

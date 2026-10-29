let ship_sprites; // stores the .png
let currentFrameImg;

const spriteW = 100;
const spriteH = 100;

async function setup() {
  createCanvas(400, 400);
  ship_sprites = await loadImage("lydiaCode/test.png");
  noSmooth(); // important for scaling resolution
  
}

function draw() {
  background(0);
  imageMode(CENTER); // important for drawing sprite at propoer coords

  if (spinning) {
    currentFrameImg = spin(ship_sprites);
  } else {
    currentFrameImg = get_frame(ship_sprites);
  }

  mult = abs(sin(frameCount/60) + 1); // scaling factor, for demonstration

  dW = spriteW * mult;
  dY = spriteW * mult

  if (currentFrameImg) {
    image(currentFrameImg, 200, 200, dW, dY); // draws ship to screen of size dW, dY at coord 200, 200
  }
}






let frameX; // x coord inside sheet
let frameY; // y coord inside sheet
let current_frame = 0; // spin frame
let rot = 0; // numper of spins
const total_frames = 3;


let up = false; // true if on ceiling
let spinning = false; // true if playing spin animation

function get_frame(sheet) {
    /*
    gets the desired ship frame based on active inputs
    args: none
    returns:
        P5 image object to draw to screen
    */

    if (spinning || !sheet) {
        return;
    }
    if (keyIsDown('a')) {
    frameX = 2*spriteW;

    } else if (keyIsDown('d')) {
    frameX = 0;

    } else {
    frameX = spriteW;

    }

    if (up) {
    frameY = 0;
    } else {
    frameY = 2*spriteH;
    }

    console.log(frameX, frameY, spriteW, spriteH)

    return sheet.get(frameX, frameY, spriteW, spriteH);
}

function spin(sheet) {
    /*
    plays ship spin animation
    args: none
    returns:
        p5 image object to draw to screen
    */

    if (!sheet) {
        return;
    }
    frameY = 100;
    if(frameCount % 3 == 0) {
        if (current_frame == total_frames) {
            current_frame = 0;
            rot ++;
        } else {
            current_frame ++;
        }
    }

    if (rot < 2) { // rotates only twice
        let frame = sheet.get(current_frame * spriteW, frameY, spriteW, spriteH);
        return frame;
    } else {
        spinning = false;
    }
}

function keyPressed() { // what needs to happen when space is presssed, can probably be done in the inputs file
  if (key === ' ') {
    rot = 0;
    current_frame = 0;
    up = !up;
    spinning = true;
  }
}
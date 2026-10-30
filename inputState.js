// inputState.js
// Reads the keyboard once per frame and exposes simple booleans.
// Polling (instead of a keyPressed() handler) means this file never has to
// define keyPressed(), so it can't clash with one defined elsewhere.

// Each binding lists a numeric keyCode and a KeyboardEvent.code string, so it
// works whichever form this p5 version's keyIsDown() accepts.
const KEY_BINDINGS = {
  forward: [87, "KeyW"],
  backward: [83, "KeyS"],
  left: [65, "KeyA"],
  right: [68, "KeyD"],
  jump: [32, "Space"],
  shoot: [16, "ShiftLeft", "ShiftRight"],
};

function anyKeyDown(binding) {
  for (const code of binding) {
    try {
      if (keyIsDown(code)) return true;
    } catch (e) {
      // ignore codes this p5 version rejects
    }
  }
  return false;
}

class InputState {
  constructor() {
    this.forward = false; // W
    this.backward = false; // S
    this.left = false; // A
    this.right = false; // D
    this.jumpHeld = false; // Space is down
    this.jumpPressed = false; // true only on the frame Space goes down
    this.shoot = false; // Shift held
  }

  // Call once per frame, before reading any values.
  update() {
    this.forward = anyKeyDown(KEY_BINDINGS.forward);
    this.backward = anyKeyDown(KEY_BINDINGS.backward);
    this.left = anyKeyDown(KEY_BINDINGS.left);
    this.right = anyKeyDown(KEY_BINDINGS.right);
    this.shoot = anyKeyDown(KEY_BINDINGS.shoot);

    const jumpDown = anyKeyDown(KEY_BINDINGS.jump);
    this.jumpPressed = jumpDown && !this.jumpHeld;
    this.jumpHeld = jumpDown;
  }

  // -1 (left), 0, or +1 (right). Both keys held cancel out.
  get horizontal() {
    return (this.right ? 1 : 0) - (this.left ? 1 : 0);
  }

  // +1 (forward), 0, or -1 (backward). Both keys held cancel out.
  get depth() {
    return (this.forward ? 1 : 0) - (this.backward ? 1 : 0);
  }
}
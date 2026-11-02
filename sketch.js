let p;

function setup() {
    createCanvas(800, 400, WEBGL);
    load_proj_frames();

    p = new Player();
}

function draw() {
    background(0);
    p.draw();
    p.update();
}
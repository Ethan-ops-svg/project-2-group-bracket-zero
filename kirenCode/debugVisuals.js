function setup(){
    createCanvas(400, 400);
    fill(255,0,0)
}
let currX = Math.random()*400
let currY = 375
let currZ = 1200
let point = renderPoint(currX, currY, currZ)
function draw(){
    background(200)
    stroke(0)
    point = renderPoint(currX, currY, currZ)
    circle(point.x, point.y, 50 * point.scale)
    currZ -= 10
    if (currZ < 0){
        currX = Math.random()*400
        currY = 375
        currZ = 1200
    }
}
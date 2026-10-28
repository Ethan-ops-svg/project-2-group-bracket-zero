function setup(){
    createCanvas(400, 400);
}
let point = renderPoint(0,0,0)
function draw(){
    for (let z = 0; z < 21; z++){
        for (let x = 0; x < 21; x++){
            point = renderPoint(x * 20, 400, z * 40)
            circle(point.x, point.y, 10 * point.scale)
        }
    }
}
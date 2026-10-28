function setup(){
    createCanvas(400, 400);
}

function draw(){
    for (let z = 0; z < 21; z++){
        for (let j = 0; j < 21; j++){
            circle(j*20,400,20)
        }
    }
}
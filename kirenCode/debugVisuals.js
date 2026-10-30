let objs = []

function setup(){
    createCanvas(400, 400);
    fill(255,0,0)
    objs.push([Math.random()*400,375,Math.random()*1200])
    objs.push([Math.random()*400,375,Math.random()*1200])
    objs.push([Math.random()*400,375,Math.random()*1200])
    objs.push([Math.random()*400,25,Math.random()*1200])
    objs.push([Math.random()*400,25,Math.random()*1200])
}

function draw(){
    background(200)
    noStroke()
    for (const obj of objs){
        const point = adjForPerspective(obj[0], obj[1], obj[2])
        fill(255,0,0,point.alpha)
        circle(point.x,point.y,50*point.scale)
        obj[2] -= 5
        if (obj[2] < 0){
            obj[2] += 1200
        }
    }
}
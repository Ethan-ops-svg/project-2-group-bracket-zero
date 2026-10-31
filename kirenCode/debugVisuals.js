let objs = []

function setup(){
    createCanvas(canvasWidth, canvasHeight);
    fill(255,0,0)
    objs.push([Math.random()*canvasWidth,375,Math.random()*canvasDepth])
    objs.push([Math.random()*canvasWidth,375,Math.random()*canvasDepth])
    objs.push([Math.random()*canvasWidth,375,Math.random()*canvasDepth])
    objs.push([Math.random()*canvasWidth,25,Math.random()*canvasDepth])
    objs.push([Math.random()*canvasWidth,25,Math.random()*canvasDepth])
}

function draw(){
    background(200)
    noStroke()
    for (const obj of objs){
        const point = adjForPerspective(obj[0], obj[1], obj[2])
        circle(point.x,point.y,50*point.scale)
        obj[2] -= 5
        const nextPoint = adjForPerspective(obj[0], obj[1], obj[2])
        const nextDiameter = 50 * nextPoint.scale
        if (
            nextPoint.x + nextDiameter / 2 < 0 ||
            nextPoint.x - nextDiameter / 2 > canvasWidth ||
            nextPoint.y + nextDiameter / 2 < 0 ||
            nextPoint.y - nextDiameter / 2 > canvasHeight
        ){
            obj[2] += canvasDepth
        }
    }
}
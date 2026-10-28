let canvasWidth = 400
let canvasHeight = 400
let canvasDepth = 1200
let vanishingPoint = { x: canvasWidth / 2, y: canvasHeight / 2 , z: canvasDepth}

function renderPoint(x,y,z){
    let scale = 1 - (z / vanishingPoint.z)
    let newX = vanishingPoint.x + (x - vanishingPoint.x) * scale
    let newY = vanishingPoint.y + (y - vanishingPoint.y) * scale
    return({ x: newX, y: newY, scale: scale })
}
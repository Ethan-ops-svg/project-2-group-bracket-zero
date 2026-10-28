let canvasWidth = 400
let canvasHeight = 400
let vanishingPoint = { x: canvasWidth / 2, y: canvasHeight / 2 , z: canvaswidth * 2}

//x read 0 -> 400 left to right
//y read 0 -> 400 top to bottom
//z read 0 -> 800 front to back

function renderPoint(x,y,z){
    let newX = x
    let newY = y
    let scale = 1 - (z / vanishingPoint.z)
    return({ x: newX, y: newY, scale: scale })
}
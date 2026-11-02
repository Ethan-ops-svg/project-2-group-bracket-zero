let canvasWidth = 400
let canvasHeight = 200
let canvasDepth = canvasHeight * 3
let hideObjDelay = 150
let popLength = 25
let popEnd = canvasDepth - hideObjDelay - popLength
let vanishingPoint = { x: 0, y: 0 , z: canvasDepth}
//I set the size of the canvas to be 400X400, and made the far end (on the z axis) of the canvas 3X the width
//These numbers are arbitrary, and the code should work with any number set
//Z is currently set in relation to the viewer, with 0 as the viewer and 1200 as the farthest away point.
//The vanishing point is set at the center of the canvas

//Fog makes the object fade in so it does not just pop into existence. Fog values are arbitrary aswell

//Takes in a 3d x,y,z coordinate and returns an approriate x and y for the center of the object to be rendered at
//as well as a scale value from 0-1
function adjForPerspective(x,y,z){
    let scale = (vanishingPoint.z - z) / (vanishingPoint.z + z)
    if (z > canvasDepth - hideObjDelay){
        scale = 0
    }
    else if (z > canvasDepth - hideObjDelay - popLength){
        let howFar = canvasDepth - hideObjDelay - z
        let scaleValue = ((vanishingPoint.z - popEnd) / (vanishingPoint.z + popEnd))/popLength
        scale = howFar*scaleValue
    }
    let newX = vanishingPoint.x + (x - vanishingPoint.x) * scale
    let newY = vanishingPoint.y + (y - vanishingPoint.y) * scale
    return({ x: newX, y: newY, scale: scale,})
}
//Just returns the x value changed based on the objects distance from camera
function adjX(x,z){
    let scale = (vanishingPoint.z - z) / (vanishingPoint.z + z)
    let newX = vanishingPoint.x + (x - vanishingPoint.x) * scale
    return(newX)
}
//Just returns the y value changed based on the objects distance from camera
function adjY(y,z){
    let scale = (vanishingPoint.z - z) / (vanishingPoint.z + z)
    let newY = vanishingPoint.y + (y - vanishingPoint.y) * scale
    return(newY)
}
//Just returns the scale from 0-1 based on the objects distance from camera
function adjScale(z){
    let scale = (vanishingPoint.z - z) / (vanishingPoint.z + z)
    if (z > canvasDepth - hideObjDelay){
        scale = 0
    }
    else if (z > canvasDepth - hideObjDelay - popLength){
        let howFar = canvasDepth - hideObjDelay - z
        let scaleValue = ((vanishingPoint.z - popEnd) / (vanishingPoint.z + popEnd))/popLength
        scale = howFar*scaleValue
    }
    return(scale)
}
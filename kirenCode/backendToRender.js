let canvasWidth = 400
let canvasHeight = 400
let visionFogLine = 1000
let fogDepth = 100
let canvasDepth = 1200
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
    let newX = vanishingPoint.x + (x - vanishingPoint.x) * scale
    let newY = vanishingPoint.y + (y - vanishingPoint.y) * scale
    let alpha = 255
    if (z > visionFogLine){
        //alpha increases from 0 to 255, becoming fully visible at the visionFogLine, and fully invisible fogDepth units beyond that
        alpha = 255 - ((z - visionFogLine) / fogDepth) * 255
    }
    return({ x: newX, y: newY, scale: scale, alpha: alpha })
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
    return(scale)
}
//Just returns the alpha value based on the objects distance from camera
function adjAlpha(z){
    let alpha = 255
    if (z > visionFogLine){
        alpha = 255 - ((z - visionFogLine) / fogDepth) * 255
    }
    return(alpha)
}
let enemySkeletons = []
let enemyImage = []
function setup(){
    enemySkeletons.push(new EnemyBody(Math.random()*canvasWidth,canvasDepth,25,false))
    enemyImage.push(new asteroid(false))
    createCanvas(canvasWidth, canvasHeight)
    
}
function draw(){
    background(0)
    imageMode(CENTER)
    for (i=0;i<enemySkeletons.length;i++){
        let pointXTemp = adjX(enemySkeletons[i].getPosition().x,enemySkeletons[i].getPosition().z)
        let pointYTemp = adjY(enemySkeletons[i].getPosition().y,enemySkeletons[i].getPosition().z)
        let scaleTemp = adjScale(enemySkeletons[i].getPosition().z)
        enemyImage[0].draw(pointXTemp,pointYTemp,scaleTemp)
        enemySkeletons[i].update(5)
        if (enemySkeletons[i].z < -200){
            enemySkeletons[i].z = canvasDepth
        }
    }
}
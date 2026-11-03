let enemySkeletons = []
let enemyImage = []
let spawn_timer = 0;

function setup(){
    enemyImage.push(new asteroid(false));
    createCanvas(canvasWidth*2, canvasHeight*2, WEBGL)
    
}
function draw(){
    background(0)
    imageMode(CENTER)
    spawn_timer++;
    if (spawn_timer % PHYSICS.spawnInterval === 0 && enemySkeletons.length < 10) {
        if (Math.random() < 0.5){
            enemySkeletons.push(new EnemyBody(Math.random()*canvasWidth*2 - canvasWidth,canvasDepth,25,false))
        }
        else{
            enemySkeletons.push(new EnemyBody(Math.random()*canvasWidth*2 - canvasWidth,canvasDepth,25,true))
        }
        enemyImage.push(new asteroid(false));

    }
    for (i=0;i<enemySkeletons.length;i++){
        let pointXTemp = adjX(enemySkeletons[i].getPosition().x,enemySkeletons[i].getPosition().z)
        let pointYTemp = adjY(enemySkeletons[i].getPosition().y,enemySkeletons[i].getPosition().z)
        let scaleTemp = adjScale(enemySkeletons[i].getPosition().z)
        enemyImage[i].draw(pointXTemp,pointYTemp,scaleTemp)
        enemySkeletons[i].update(3)
        if (enemySkeletons[i].z < -200){
            enemySkeletons[i].z = canvasDepth
        }
    }
}
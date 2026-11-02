let enemySkeletons = []
let enemyImage = []
let spawn_timer = 0;

function setup(){
    enemySkeletons.push(new EnemyBody(Math.random()*canvasWidth*2 - canvasWidth,canvasDepth,25,false))
    enemyImage.push(new asteroid(false));
    
    createCanvas(canvasWidth*2, canvasHeight*2, WEBGL)
    
}
function draw(){
    background(0)
    imageMode(CENTER)
    spawn_timer++;
    if (spawn_timer % PHYSICS.spawnInterval === 0 && enemySkeletons.length < 10) {
        enemySkeletons.push(new EnemyBody(Math.random()*canvasWidth*2 - canvasWidth,canvasDepth,25,false))
        enemyImage.push(new asteroid(false));

    }
    for (i=0;i<enemySkeletons.length;i++){
        let pointXTemp = adjX(enemySkeletons[i].getPosition().x,enemySkeletons[i].getPosition().z)
        let pointYTemp = adjY(enemySkeletons[i].getPosition().y,enemySkeletons[i].getPosition().z)
        let scaleTemp = adjScale(enemySkeletons[i].getPosition().z)
        enemyImage[i].draw(pointXTemp,pointYTemp,scaleTemp)
        enemySkeletons[i].update(5)
        if (enemySkeletons[i].z < -200){
            enemySkeletons[i].z = canvasDepth

            enemySkeletons[i].x = Math.random() * canvasWidth * 2 - canvasWidth;
            enemySkeletons[i].y = random(-canvasHeight, canvasHeight);
        }
    }
}
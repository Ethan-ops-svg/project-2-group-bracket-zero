let p;
let enemySkeletons = [];
let enemyImage = [];
let spawn_timer = 0;
let lives_remaining = 3;
let livesLabel;

function setup() {
    createCanvas(800, 400, WEBGL);
    load_proj_frames();

    livesLabel = createDiv(`Lives: ${lives_remaining}`);
    livesLabel.position(16, 16);
    livesLabel.style('color', 'white');
    p = new Player();
}

function draw() {
    background(0);
    imageMode(CENTER);
    spawn_timer++;
    if (spawn_timer % PHYSICS.spawnInterval === 0 && enemySkeletons.length < 10) {
        const isUp = Math.random() < 0.5;
        enemySkeletons.push(
            new EnemyBody(Math.random() * canvasWidth * 2 - canvasWidth, canvasDepth, 25, isUp)
        );
        enemyImage.push(new asteroid(false));
    }
    for (let i = 0; i < enemySkeletons.length; i++) {
        if (enemySkeletons[i].z > 0) {
            const position = enemySkeletons[i].getPosition();
            const pointX = adjX(position.x, position.z);
            const pointY = adjY(position.y, position.z);
            const scale = adjScale(position.z);

            enemyImage[i].draw(pointX, pointY, scale);
        }
    }
    p.draw();
    p.update();
    for (let i = 0; i < enemySkeletons.length; i++) {
        if (hitTest(p, enemySkeletons[i])) {
            lives_remaining--;
            livesLabel.html(`Lives: ${lives_remaining}`);
            enemySkeletons.splice(i, 1);
            enemyImage.splice(i, 1);
            i--;
            continue;
        }
        if (enemySkeletons[i].z <= 0) {
            const position = enemySkeletons[i].getPosition();
            const pointX = adjX(position.x, position.z);
            const pointY = adjY(position.y, position.z);
            const scale = adjScale(position.z);

            enemyImage[i].draw(pointX, pointY, scale);
        }
    }
    for (const enemy of enemySkeletons) {
        enemy.update(3);
        if (enemy.z < -200) {
            enemy.z = canvasDepth;
        }
    }
}
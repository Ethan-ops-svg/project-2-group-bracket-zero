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

    stroke(255, 255, 255, 100);
    strokeWeight(1);
    line(0, 0, 0, -800, 400, 0);
    line(0, 0, 0, 800, 400, 0);

    line(0, 0, 0, -800, -400, 0);
    line(0, 0, 0, 800, -400, 0);

    line(0, 0, 0, -300, 400, 0);
    line(0, 0, 0, 300, 400, 0);

    line(0, 0, 0, -300, -400, 0);
    line(0, 0, 0, 300, -400, 0);

    line(0, 0, 0, 0, -400, 0);
    line(0, 0, 0, 0, 400, 0);

    noStroke();

    imageMode(CENTER);
    spawn_timer++;
    if (spawn_timer % PHYSICS.spawnInterval === 0 && enemySkeletons.length < 10) {
        const isUp = Math.random() < 0.5;
        enemySkeletons.push(
            new EnemyBody(
                constrain(Math.random() * canvasWidth * 2 - canvasWidth, getWorldBounds().left, getWorldBounds().right),
                canvasDepth,
                25,
                isUp
            )
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

    for (let i = 0; i < p.weapon.projectiles.length; i++) {
        for (let j = 0; j < enemySkeletons.length; j++) {
            if (hitTest(p.weapon.projectiles[i], enemySkeletons[j])) {
                enemySkeletons.splice(j, 1);
                enemyImage.splice(j, 1);
                j--;

                p.weapon.projectiles[i].alive = false;
                i--;
                continue;
            }
        }
    }
    for (const enemy of enemySkeletons) {
        enemy.update(3);
        if (enemy.z < -200) {
            enemy.z = canvasDepth;
        }
    }
}
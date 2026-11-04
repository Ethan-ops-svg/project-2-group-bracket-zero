let p;
let powerUps;

let enemySkeletons = [];
let enemyImage = [];

let powerSkeletons = [];
let powerImage = [];

let spawn_timer = 0;
let lives_remaining = 3;
let livesLabel;

function setup() {
    createCanvas(800, 400, WEBGL);
    load_proj_frames();

    powerUps = new PowerUpManager;

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
    if (spawn_timer % 800 === 0 && powerSkeletons.length < 4) {
        powerSkeletons.push(
            new PowerUpBody(
                constrain(Math.random() * canvasWidth * 2 - canvasWidth, getWorldBounds().left, getWorldBounds().right),
                canvasDepth,
                17,
                powerUps.pickType()
            )
        );
        powerImage.push(new powerup(false));

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
    for (let i = 0; i < powerSkeletons.length; i++) {
        const position = powerSkeletons[i].getPosition();
        const pointX = adjX(position.x, position.z);
        const pointY = adjY(position.y, position.z);
        const scale = adjScale(position.z);

        powerImage[i].draw(pointX, pointY, scale);
    }
    p.draw();
    powerUps.update(p);
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

    for (const power of powerSkeletons) {
        power.update(3);

        if (power.z < -200) {
            power.z = canvasDepth;
        }
    }

    for (let i = p.weapon.projectiles.length - 1; i >= 0; i--) {
        const projectile = p.weapon.projectiles[i];
        if (!projectile || !projectile.alive) continue;

        for (let j = enemySkeletons.length; j >= 0; j--) {
            const enemy = enemySkeletons[j];
            if (!enemy) continue;

            if (hitTest(projectile, enemy)) {
                enemySkeletons.splice(j, 1);
                enemyImage.splice(j, 1);
                projectile.alive = false;

                break;
            }
        }
    }
    for (let i = 0; i < powerSkeletons.length; i++) {
        if (hitTest(p, powerSkeletons[i])) {
            powerUps.collect(powerSkeletons[i].type, p);

            powerSkeletons.splice(i, 1);
            powerImage.splice(i, 1);

            i--;
        }
    }
    for (const enemy of enemySkeletons) {
        enemy.update(3);
        if (enemy.z < -200) {
            enemy.z = canvasDepth;
        }
    }
}
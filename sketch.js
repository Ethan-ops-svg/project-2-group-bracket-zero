let p;
let powerUps;

let enemySkeletons = [];
let enemyImage = [];

let powerSkeletons = [];
let powerImage = [];

let spawn_timer = 0;
let livesLabel;
let overLabel;

let inputs;
let worldSpeed = PHYSICS.baseScrollSpeed;
let worldSpeedOffset = 0;

function setup() {
    const canvas = createCanvas(800, 400, WEBGL);
    canvasElement = canvas;

    inputs = new InputState();
    load_proj_frames();

    powerUps = new PowerUpManager;

    livesLabel = createDiv(`Lives: ${powerUps.lives}`);
    livesLabel.position(16, 16);
    livesLabel.style('color', 'white');

    p = new Player();
}

function draw() {
    background(0);

    inputs.update();
    updateWorldSpeed();

    // PERSPECTIVE LINES //

    stroke(255, 255, 255, 100);
    strokeWeight(1);
    line(0, 0, 0, -2*canvasWidth, 2*canvasHeight, 0);
    line(0, 0, 0, 2*canvasWidth, 2*canvasHeight, 0);

    line(0, 0, 0, -2*canvasWidth, -2*canvasHeight, 0);
    line(0, 0, 0, 2*canvasWidth, -2*canvasHeight, 0);

    line(0, 0, 0, -3/4*canvasWidth, 2*canvasHeight, 0);
    line(0, 0, 0, 3/4*canvasWidth, 2*canvasHeight, 0);

    line(0, 0, 0, -3/4*canvasWidth, -2*canvasHeight, 0);
    line(0, 0, 0, 3/4*canvasWidth, -2*canvasHeight, 0);

    line(0, 0, 0, 0, -2*canvasHeight, 0);
    line(0, 0, 0, 0, 2*canvasHeight, 0);

    noStroke();

    imageMode(CENTER);
    spawn_timer++;

    // SPAWN ENEMIES //

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

    // SPAWN POWERUPS //

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

    // DRAW ENEMIES //

    for (let i = 0; i < enemySkeletons.length; i++) {
        if (enemySkeletons[i].z > 0) {
            const position = enemySkeletons[i].getPosition();
            const pointX = adjX(position.x, position.z);
            const pointY = adjY(position.y, position.z);
            const scale = adjScale(position.z);

            enemyImage[i].draw(pointX, pointY, scale);
        }
    }

    // DRAW POWERUPS //

    for (let i = 0; i < powerSkeletons.length; i++) {
        const position = powerSkeletons[i].getPosition();
        const pointX = adjX(position.x, position.z);
        const pointY = adjY(position.y, position.z);
        const scale = adjScale(position.z);

        powerImage[i].draw(pointX, pointY, scale);
    }

    // DRAW PLAYER //

    p.draw();
    powerUps.update(p);
    p.update();

    // ENEMY COLLISION WITH PLAYER //

    for (let i = enemySkeletons.length - 1; i >= 0; i--) {
        if (i === -1) {
            return;
        }
        const enemy = enemySkeletons[i];

        if (hitTest(p, enemy)) {
            const lostLife = powerUps.takeHit();

            if (lostLife) {
                background(255);
                livesLabel.html(`Lives: ${powerUps.lives}`);
            }
            
            enemySkeletons.splice(i, 1);
            enemyImage.splice(i, 1);

            continue;
        }
        if (enemy.z <= 0) {
            const position = enemy.getPosition();
            const pointX = adjX(position.x, position.z);
            const pointY = adjY(position.y, position.z);
            const scale = adjScale(position.z);

            enemyImage[i].draw(pointX, pointY, scale);
        }
    }

    // ENEMY PROJECTILE COLLISION //

    for (let i = p.weapon.projectiles.length - 1; i >= 0; i--) {
        if (i === -1) {
            return;
        }
        const projectile = p.weapon.projectiles[i];
        if (!projectile || !projectile.alive) continue;

        for (let j = enemySkeletons.length - 1; j >= 0; j--) {
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

    // POWERUP COLLISION WITH PLAYER //

    for (let i = powerSkeletons.length - 1; i >= 0; i--) {
        if (i === -1) {
            return;
        }
        if (hitTest(p, powerSkeletons[i])) {
            powerUps.collect(powerSkeletons[i].type, p);

            livesLabel.html(`Lives: ${powerUps.lives}`);

            powerSkeletons.splice(i, 1);
            powerImage.splice(i, 1);

        }
    }

    // UPDATE POWERUPS //

    for (const power of powerSkeletons) {
        power.update(worldSpeed);

        if (power.z < -200) {
            power.z = canvasDepth;
        }
    }

    // UPDATE ENEMIES //

    for (const enemy of enemySkeletons) {
        enemy.update(worldSpeed);
        if (enemy.z < -200) {
            enemy.z = canvasDepth;
        }
    }

    if (powerUps.gameOver) {
        noLoop();
        overLabel = createDiv(`GAME OVER`);
        overLabel.position(width/2, height/2);
        overLabel.style('font-weight', 'bold');
        overLabel.style('color', 'black');
        overLabel.style('font-size', '50pt');
        overLabel.style('transform', 'translate(-50%, -50%)')
    }
}

function updateWorldSpeed() {
    PHYSICS.baseScrollSpeed = Math.min(PHYSICS.maxForwardSpeed, PHYSICS.baseScrollSpeed + PHYSICS.baseSpeedIncrease)
    PHYSICS.maxBackwardSpeed =  3/5 * PHYSICS.baseScrollSpeed

    if (inputs.forward) {
        worldSpeedOffset += PHYSICS.forwardAccel;

        worldSpeedOffset = Math.min(worldSpeedOffset, PHYSICS.maxForwardSpeed);

    } else if (inputs.backward) {
        worldSpeedOffset -= PHYSICS.backwardAccel;

        worldSpeedOffset = Math.max(worldSpeedOffset, -PHYSICS.maxBackwardSpeed);

    } else {
        worldSpeedOffset *= PHYSICS.depthDrag;

        if (Math.abs(worldSpeedOffset) < 0.05) {
            worldSpeedOffset = 0;
        }
    }
    worldSpeed = PHYSICS.baseScrollSpeed + worldSpeedOffset;
}
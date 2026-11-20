//

let currentLevel = 1


//each row is a level, row 1 is level 1, row 2 level 2, etc. 
//enemy count is the total # of enemies in the level, 
// spawn interval is the frames between each spawn, 
// maxEnemies is the max amount of enemies that can be on screen at once. 
//level 6 is an infinite mode so if you manage to clear the first 5 levels it's just an infinite mode until you die. 
const levels = [
    {enemyCount: 10, spawnInterval: 90, maxEnemies: 4},
    {enemyCount: 15, spawnInterval: 75, maxEnemies: 5},
    {enemyCount: 18, spawnInterval: 65, maxEnemies: 6},
    {enemyCount: 22, spawnInterval: 55, maxEnemies: 8},
    {enemyCount: 25, spawnInterval: 45, maxEnemies: 10},
    {enemyCount: Infinity, spawnInterval: 40, maxEnemies: 10}
]

//turns level number into the level's numbers cuz levels[0] is level 1
function getLevelData(n) {
        return levels[n - 1]
}

//this is how many have spawned in the level so far
let levelSpawned = 0


//transition between levels will have text and stuff. will block spawning for 2 seconds
let levelTransition = false

//the text for levels when u move onto next level it'll say like LEVEL 3, LEVEL 4, etc.
let bannerText = ""

let bannerTimer = 0

function getSpawnInterval() {
    return getLevelData(currentLevel).spawnInterval
}

//checks if enemies can spawn with 3 conditions
function canSpawnEnemy() {
    return !levelTransition &&
    levelSpawned < getLevelData(currentLevel).enemyCount &&
    enemySkeletons.length < getLevelData(currentLevel).maxEnemies
}

function onEnemySpawned() {
    levelSpawned = levelSpawned + 1
}

//begins the level
function startLevel(n) {
    currentLevel() = n
    levelSpawned = 0
    levelTransition = false
}

function updateLevel() {
    drawBanner()

    if (levelTransition) return

    if (levelSpawned >= getLevelData(currentLevel).enemyCount && enemySkeletons.length === 0) {
        levelTransition = true

        const nextLevel = currentLevel + 1

        showBanner(nextLevel === levels.length ? `LEVEL ${nextLevel} - ENDLESS` : `LEVEL ${nextLevel}`)
    }
}


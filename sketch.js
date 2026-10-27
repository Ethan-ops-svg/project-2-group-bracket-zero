//After running the sketch, press SPACE or click to begin

const W = 720, H = 680;

const TOWER_X   = 360;
const GROUND_Y  = 590;
const DECK_Y    = 300;
const ZONE      = { x: 338, y: 266, w: 44, h: 34 };

const MAX_HEALTH = 100;
const DAMAGE     = 6;

const CAMP_RADIUS = 70;
const CAMP_TIME   = 5;
const JAM_TIME    = 10;

const SPEED_SCALE = 5;

const WAVES = [
  { kills: 10, speed: 10, gap: 1.6  },
  { kills: 20, speed: 20, gap: 1.2  },
  { kills: 30, speed: 30, gap: 0.9  },
  { kills: 40, speed: 40, gap: 0.7  },
  { kills: 50, speed: 50, gap: 0.55 },
];

const BULLET_SPEED = 950;
const BULLET_R     = 5;

let state = 'title';
let waveIdx = 0, kills = 0, health = MAX_HEALTH;
let spawnTimer = 0, bannerTimer = 0;
let skyT = 0;
let zoneFlash = 0, muzzleFlash = 0, lostTimer = 0;
let campTimer = 0, jamTimer = 0;
const campAnchor = { x: TOWER_X, y: 120 };
let towerGone = false;
let mouseSeen = false;

let demons = [], bullets = [], particles = [];
const drone = { x: TOWER_X, y: 120, tilt: 0, spin: 0 };

let stars = [], fireflies = [], tufts = [];
let blasterSfx;

console.log("Have a snack for energy before you start 🥕");
console.log("Current documented high score: Skirball -- 2100 points");
const pointDisplay = document.querySelector("#pointDisplay").firstChild;
const timerDisplay = document.querySelector("#timerDisplay").firstChild;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);
let soilBedArray = [];
let plantArray = [];
let openPlantSpots = [];
let pointTotal = 0;
let timer = 60;

// Force canvas height to be a multiple of 10px so avatar can
// sit flush with the bottom.  Leave 1px extra to avoid the
// appearance of avatar spilling out of canvas.
if (canvas.height % 10 !== 0) {
  canvas.height -= (canvas.height % 10) - 1;
}

// SET UP SPRITE CLASS AND GENERATE SPRITES

let sprite = new Image();
sprite.src = "./assets/CharacterSpritesheet.png";

class Sprite {
  constructor() {
    (this.sprite = sprite),
      (this.spritesheetColumns = 8),
      (this.spritesheetRows = 24),
      // this.frameWidth and this.frameHeight collectively divide the spritesheet into a grid.  Each
      // grid-item or frame is a 16px x 16px character image with 16px of transparent space on all four
      // sides.  We'll leave the frame size as 48x48 here, but slice into it when drawing the sprite so
      // that that 'margin' isn't causing hit detection before the character actually touches something.
      (this.frameWidth = this.sprite.width / this.spritesheetColumns),
      (this.frameHeight = this.sprite.height / this.spritesheetRows),
      (this.x = canvas.width / 2 - 32),
      (this.y = canvas.height / 2 - 32),
      (this.currentFrame = 64),
      (this.spriteSize = 16),
      (this.spriteScale = 4);
    this.directionFacing = "down";
    this.isSlowed = false;
  }

  animateSprite() {
    let column = this.currentFrame % this.spritesheetColumns;
    let row = Math.floor(this.currentFrame / this.spritesheetColumns);
    ctx.drawImage(
      this.sprite,
      // 16 in next two lines represents the 16px 'margin' of space around
      // the sprite that we're slicing into to avoid early hit detection.
      column * this.frameWidth + 16,
      row * this.frameHeight + 14,
      this.spriteSize,
      this.spriteSize + 2,
      this.x,
      this.y,
      this.spriteSize * this.spriteScale,
      (this.spriteSize + 2) * this.spriteScale
    );
  }
  // Finds the starting frame for the current animation, increments
  // this.currentFrame, and if doing so will push this.currentFrame
  // into a new animation, resets this.currentFrame to the starting
  // frame for the current animation.
  cycleSpriteFrame() {
    let startFrame = this.currentFrame - (this.currentFrame % 8);
    this.currentFrame++;
    if (this.currentFrame > startFrame + 7) {
      this.currentFrame = startFrame;
    }
  }
}

let playerSprite = new Sprite();

// SET UP NON-PLAYER CANVAS ELEMENTS

class SoilBed {
  constructor(x) {
    this.x = x;
    this.y = 100;
    this.width = 100;
    this.height = canvas.height - 200;
    this.color = "#3d2b24";
    soilBedArray.push(this);
  }
  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

new SoilBed(100);
new SoilBed(300);
new SoilBed(canvas.width - 400);
new SoilBed(canvas.width - 200);

// When a plant spawns, it will grab a set of x and
// y spawn coordinates from this array to ensure
// it's spawning in an acceptable/expected location.
let validPlantSpots = [
  {
    location: [116, 116],
    occupied: false,
  },
  {
    location: [116, canvas.height / 2 - 32],
    occupied: false,
  },
  {
    location: [116, canvas.height - 184],
    occupied: false,
  },
  {
    location: [316, 116],
    occupied: false,
  },
  {
    location: [316, canvas.height / 2 - 32],
    occupied: false,
  },
  {
    location: [316, canvas.height - 184],
    occupied: false,
  },
  {
    location: [canvas.width - 384, 116],
    occupied: false,
  },
  {
    location: [canvas.width - 384, canvas.height / 2 - 32],
    occupied: false,
  },
  {
    location: [canvas.width - 384, canvas.height - 184],
    occupied: false,
  },
  {
    location: [canvas.width - 184, 116],
    occupied: false,
  },
  {
    location: [canvas.width - 184, canvas.height / 2 - 32],
    occupied: false,
  },
  {
    location: [canvas.width - 184, canvas.height - 184],
    occupied: false,
  },
];

const getOpenPlantSpots = () => {
  openPlantSpots = [];
  validPlantSpots.forEach((spot) => {
    if (!spot.occupied) {
      openPlantSpots.push(spot);
    }
  });
};

// Used when spawning new plant.  After having found an open spot and
// having given its coords to the new plant, this finds the corresponding
// spot in the array of valid spots and marks it as occupied.
const markPlantSpotOccupied = (plant) => {
  validPlantSpots.forEach((spot) => {
    if (plant.x === spot.location[0] && plant.y === spot.location[1]) {
      spot.occupied = true;
    }
  });
};

// Used when player collects a plant.  Like the above, this finds the
// corresponding spot in the array of valid spots and marks it as unoccupied.
const markPlantSpotUnoccupied = (plant) => {
  validPlantSpots.forEach((spot) => {
    if (plant.x === spot.location[0] && plant.y === spot.location[1]) {
      spot.occupied = false;
    }
  });
};

let plantSprite = new Image();
plantSprite.src = "./assets/PlantSpritesheet.png";

class PlantSprite {
  constructor() {
    getOpenPlantSpots();
    if (openPlantSpots.length === 0) {
      return;
    }
    let randomPlantSpot = Math.floor(Math.random() * openPlantSpots.length);
    this.sprite = plantSprite;
    this.x = openPlantSpots[randomPlantSpot].location[0];
    this.y = openPlantSpots[randomPlantSpot].location[1];
    this.width = 64;
    this.height = 64;
    markPlantSpotOccupied(this);
    plantArray.push(this);
  }
}

class CarrotSprite extends PlantSprite {
  pointValue = 100;
  drawSprite() {
    ctx.drawImage(this.sprite, 47, 33, 16, 16, this.x, this.y, 64, 64);
  }
}

class StarfruitSprite extends PlantSprite {
  pointValue = 500;
  drawSprite() {
    ctx.drawImage(this.sprite, 47, 208, 16, 16, this.x, this.y, 64, 64);
  }
}

// MOVEMENT

let keyState = {};

document.addEventListener("keydown", (e) => {
  keyState[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keyState[e.key] = false;
});

const handleMovement = () => {
  let speed = 8;
  playerSprite.isSlowed = false;
  if (soilBedArray.some((bed) => detectHit(bed))) {
    speed = 3;
    playerSprite.isSlowed = true;
  }
  if (keyState["a"] || keyState["ArrowLeft"]) {
    if (playerSprite.directionFacing !== "left") {
      playerSprite.currentFrame = 88;
    }
    if (playerSprite.x - speed >= 0) {
      playerSprite.x -= speed;
    }
    playerSprite.directionFacing = "left";
  }
  if (keyState["d"] || keyState["ArrowRight"]) {
    if (playerSprite.directionFacing !== "right") {
      playerSprite.currentFrame = 80;
    }
    if (
      playerSprite.x +
        playerSprite.spriteSize * playerSprite.spriteScale +
        speed <=
      canvas.width
    ) {
      playerSprite.x += speed;
    }
    playerSprite.directionFacing = "right";
  }
  if (keyState["w"] || keyState["ArrowUp"]) {
    if (playerSprite.directionFacing !== "up") {
      playerSprite.currentFrame = 72;
    }
    if (playerSprite.y - speed >= 0) {
      playerSprite.y -= speed;
    }
    playerSprite.directionFacing = "up";
  }
  if (keyState["s"] || keyState["ArrowDown"]) {
    if (playerSprite.directionFacing !== "down") {
      playerSprite.currentFrame = 64;
    }
    if (
      playerSprite.y +
        playerSprite.spriteSize * playerSprite.spriteScale +
        speed <=
      canvas.height
    ) {
      playerSprite.y += speed;
    }
    playerSprite.directionFacing = "down";
  }
  // Checks for a case where no key is actively being pressed and player direction
  // is other than facing down, and if both true, resets player facing to down
  if (
    playerSprite.directionFacing !== "down" &&
    !Object.values(keyState).includes(true)
  ) {
    playerSprite.directionFacing = "down";
    playerSprite.currentFrame = 64;
  }
};

// HIT DETECTION / INTERACTIVITY

const detectHit = (object) => {
  if (
    playerSprite.x < object.x + object.width &&
    playerSprite.x + playerSprite.spriteSize * playerSprite.spriteScale >
      object.x &&
    playerSprite.y < object.y + object.height &&
    playerSprite.y + playerSprite.spriteSize * playerSprite.spriteScale >
      object.y
  ) {
    return true;
  } else {
    return false;
  }
};

const playerInteract = function () {
  plantArray.forEach((plant, i) => {
    if (detectHit(plant)) {
      plantArray.splice(i, 1);
      setTimeout(() => {
        markPlantSpotUnoccupied(plant);
      }, 8000);
      pointTotal += plant.pointValue;
    }
  });
};

// ESTABLISH GAMEPLAY LOOPS

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  soilBedArray.forEach((soilBed) => soilBed.render());
  plantArray.forEach((plant) => plant.drawSprite());
  handleMovement();
  if (keyState["f"]) {
    playerInteract();
  }
  playerSprite.animateSprite();
  pointDisplay.innerText = pointTotal;
  if (timer === 0) {
    clearInterval(gameLoopInterval);
    clearInterval(plantSpawnInterval);
    timerDisplay.innerText = "time's up!";
  }
};

const spawnPlant = () => {
  if (Math.random() < 0.3) {
    let randomFruit = Math.random();
    if (randomFruit > 0.2) {
      new CarrotSprite();
    } else {
      new StarfruitSprite();
    }
  }
};

const countDown = () => {
  timer -= 1;
  if (timer > 9) {
    timerDisplay.innerText = `0:${timer}`;
  } else {
    timerDisplay.innerText = `0:0${timer}`;
  }
  if (timer === 0) {
    clearInterval(timerInterval);
  }
};

// Running into an issue where the sprite intermittently fails to load.
// Trying nesting gameLoop interval into an onload event to see whether
// this resolves the issue.
window.onload = (e) => {
  gameLoopInterval = setInterval(gameLoop, 30);
};
// const gameLoopInterval = setInterval(gameLoop, 30);
const plantSpawnInterval = setInterval(spawnPlant, 1000);
const spriteFrameInterval = setInterval(() => {
  playerSprite.cycleSpriteFrame();
}, 60);
const timerInterval = setInterval(countDown, 1000);

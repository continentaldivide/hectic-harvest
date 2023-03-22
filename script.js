console.log("Have a snack for energy before you start 🥕");
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
      (this.currentFrame = 32),
      (this.spriteSize = 16),
      (this.spriteScale = 4);
  }

  animateSprite() {
    let column = this.currentFrame % this.spritesheetColumns;
    let row = Math.floor(this.currentFrame / this.spritesheetColumns);
    ctx.drawImage(
      this.sprite,
      // 16 in next two lines represents the 16px 'margin' of space around
      // the sprite that we're slicing into to avoid early hit detection.
      column * this.frameWidth + 16,
      row * this.frameHeight + 16,
      this.spriteSize,
      this.spriteSize,
      this.x,
      this.y,
      this.spriteSize * this.spriteScale,
      this.spriteSize * this.spriteScale
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
    location: [125, 125],
    occupied: false,
  },
  {
    location: [125, canvas.height / 2 - 25],
    occupied: false,
  },
  {
    location: [125, canvas.height - 175],
    occupied: false,
  },
  {
    location: [325, 125],
    occupied: false,
  },
  {
    location: [325, canvas.height / 2 - 25],
    occupied: false,
  },
  {
    location: [325, canvas.height - 175],
    occupied: false,
  },
  {
    location: [canvas.width - 375, 125],
    occupied: false,
  },
  {
    location: [canvas.width - 375, canvas.height / 2 - 25],
    occupied: false,
  },
  {
    location: [canvas.width - 375, canvas.height - 175],
    occupied: false,
  },
  {
    location: [canvas.width - 175, 125],
    occupied: false,
  },
  {
    location: [canvas.width - 175, canvas.height / 2 - 25],
    occupied: false,
  },
  {
    location: [canvas.width - 175, canvas.height - 175],
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

class Plant {
  constructor() {
    getOpenPlantSpots();
    if (openPlantSpots.length === 0) {
      return;
    }
    let randomPlantSpot = Math.floor(Math.random() * openPlantSpots.length);
    this.x = openPlantSpots[randomPlantSpot].location[0];
    this.y = openPlantSpots[randomPlantSpot].location[1];
    markPlantSpotOccupied(this);
    this.width = 50;
    this.height = 50;
    this.color = "green";
    plantArray.push(this);
  }
  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
  if (soilBedArray.some((bed) => detectHit(bed))) {
    speed = 3;
  }
  if (keyState["a"] || keyState["ArrowLeft"]) {
    if (playerSprite.x - speed >= 0) {
      playerSprite.x -= speed;
    }
  }
  if (keyState["d"] || keyState["ArrowRight"]) {
    if (
      playerSprite.x +
        playerSprite.spriteSize * playerSprite.spriteScale +
        speed <=
      canvas.width
    ) {
      playerSprite.x += speed;
    }
  }
  if (keyState["w"] || keyState["ArrowUp"]) {
    if (playerSprite.y - speed >= 0) {
      playerSprite.y -= speed;
    }
  }
  if (keyState["s"] || keyState["ArrowDown"]) {
    if (
      playerSprite.y +
        playerSprite.spriteSize * playerSprite.spriteScale +
        speed <=
      canvas.height
    ) {
      playerSprite.y += speed;
    }
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
      pointTotal += 100;
    }
  });
};

// ESTABLISH GAMEPLAY LOOPS

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  soilBedArray.forEach((soilBed) => soilBed.render());
  plantArray.forEach((plant) => plant.render());
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
    new Plant();
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

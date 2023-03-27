console.log("Have a snack for energy before you start 🥕");
console.log(
  `Current documented high score: Skirball -- 7400 points\nWant to dethrone the champ?  Send an email with a screenshot of your\nhigh score and your preferred handle to andrew@andrewsmith.org`
);
const pointDisplay = document.querySelector("#pointDisplay").firstChild;
const timerDisplay = document.querySelector("#timerDisplay").firstChild;
const speakerPlayIcon = document.querySelector("#speakerPlayIcon");
const speakerStopIcon = document.querySelector("#speakerStopIcon");
const intro = document.querySelector(".intro");
const outro = document.querySelector(".outro");
const scoreReport = document.querySelector(".scoreReport");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let sessionHighScore = 0;

const backgroundMusic = new Audio("./assets/backgroundMusic.wav");
backgroundMusic.volume = 0.2;
backgroundMusic.loop = true;

speakerPlayIcon.addEventListener("click", (e) => {
  backgroundMusic.pause();
  speakerPlayIcon.style.display = "none";
  speakerStopIcon.style.display = "block";
});

speakerStopIcon.addEventListener("click", (e) => {
  backgroundMusic.play();
  speakerStopIcon.style.display = "none";
  speakerPlayIcon.style.display = "block";
});

let sprite = new Image();
sprite.src = "./assets/CharacterSpritesheet.png";

let plantSprite = new Image();
plantSprite.src = "./assets/PlantSpritesheet.png";

// Brief delay before allowing user to click through the intro pane
setTimeout(() => {
  intro.addEventListener("click", runGame);
}, 2000);

function runGame() {
  let soilBedArray = [];
  let plantArray = [];
  let openPlantSpots = [];
  let pointTotal = 0;
  let timer = 60;
  timerDisplay.innerText = "1:00";
  intro.style.display = "none";
  outro.style.display = "none";
  scoreReport.innerText = "your score:";
  canvas.style.display = "block";
  canvas.setAttribute("height", getComputedStyle(canvas).height);
  canvas.setAttribute("width", getComputedStyle(canvas).width);

  // Force canvas height to be a multiple of 10px so avatar can
  // sit flush with the bottom.  Leave 1px extra to avoid the
  // appearance of avatar spilling out of canvas.
  if (canvas.height % 10 !== 0) {
    canvas.height -= (canvas.height % 10) - 1;
  }

  // SET UP SPRITE CLASS AND GENERATE SPRITES

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
        // 16 and 14 in next two lines represents the 'margin' of space around
        // the sprite that we're slicing into to avoid early hit detection. We're
        // only slicing 14 from the y value because the animation 'bounces' up
        // into the margin.
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
  new SoilBed(400);
  new SoilBed(canvas.width - 500);
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
      location: [416, 116],
      occupied: false,
    },
    {
      location: [416, canvas.height / 2 - 32],
      occupied: false,
    },
    {
      location: [416, canvas.height - 184],
      occupied: false,
    },
    {
      location: [canvas.width - 484, 116],
      occupied: false,
    },
    {
      location: [canvas.width - 484, canvas.height / 2 - 32],
      occupied: false,
    },
    {
      location: [canvas.width - 484, canvas.height - 184],
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

  class EggplantSprite extends PlantSprite {
    pointValue = 200;
    drawSprite() {
      ctx.drawImage(this.sprite, 47, 81, 16, 16, this.x, this.y, 64, 64);
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
      speed = 4;
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
        }, 3000);
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
      clearInterval(timerInterval);
      intro.style.display = "none";
      outro.style.display = "flex";
      canvas.style.display = "none";
      if (pointTotal > sessionHighScore) {
        sessionHighScore = pointTotal;
      }
      scoreReport.innerText += ` ${pointTotal}\nsession high score: ${sessionHighScore}`;
      setTimeout(() => {
        outro.addEventListener("click", runGame);
      }, 1000);
    }
  };

  const spawnPlant = () => {
    if (Math.random() < 0.33) {
      let randomFruit = Math.random();
      if (randomFruit > 0.4) {
        new CarrotSprite();
      } else if (randomFruit > 0.1) {
        new EggplantSprite();
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
  };

  gameLoopInterval = setInterval(gameLoop, 30);
  plantSpawnInterval = setInterval(spawnPlant, 500);
  spriteFrameInterval = setInterval(() => {
    playerSprite.cycleSpriteFrame();
  }, 60);
  timerInterval = setInterval(countDown, 1000);
}

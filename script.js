console.log("Have a snack for energy before you start 🥕");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);
let soilBedArray = [];
let plantArray = [];

// Force canvas height to be a multiple of 10px so avatar can
// sit flush with the bottom.  Leave 1px extra to avoid the
// appearance of avatar spilling out of canvas.
if (canvas.height % 10 !== 0) {
  canvas.height -= (canvas.height % 10) - 1;
}

const playerCharacter = {
  x: 10,
  y: 10,
  width: 100,
  height: 100,
  color: "#ccc",
  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
};

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

// Eventually when plants are spawning randomly, they will grab
// a set of x and y spawn coordinates from this array to ensure
// they're spawning in acceptable/expected locations
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
];

class Plant {
  constructor() {
    let randomPlantSpot = Math.floor(Math.random() * validPlantSpots.length);
    validPlantSpots[randomPlantSpot].occupied = true;
    this.x = validPlantSpots[randomPlantSpot].location[0];
    this.y = validPlantSpots[randomPlantSpot].location[1];
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

const soilBedA = new SoilBed(100);
const soilBedB = new SoilBed(300);
const soilBedC = new SoilBed(canvas.width - 400);
const soilBedD = new SoilBed(canvas.width - 200);

const testPlant = new Plant();

// const soilBed = {
//   x: 100,
//   y: 100,
//   width: 100,
//   // leaves space above and below for avatar to move without
//   // touching; can change this if/when avatar is changed
//   height: canvas.height - 200,
//   color: "#3d2b24",
//   render() {
//     ctx.fillStyle = this.color;
//     ctx.fillRect(this.x, this.y, this.width, this.height);
//   },
// };

document.addEventListener("keydown", handleKeyPressEvent);

function handleKeyPressEvent(e) {
  const speed = 10;
  switch (e.key) {
    case "w":
    case "ArrowUp":
      if (playerCharacter.y - speed >= 0) {
        playerCharacter.y -= speed;
        break;
      } else {
        break;
      }
    case "s":
    case "ArrowDown":
      if (playerCharacter.y + playerCharacter.height + speed <= canvas.height) {
        playerCharacter.y += speed;
        break;
      } else {
        break;
      }
    case "a":
    case "ArrowLeft":
      if (playerCharacter.x - speed >= 0) {
        playerCharacter.x -= speed;
        break;
      } else {
        break;
      }
    case "d":
    case "ArrowRight":
      if (playerCharacter.x + playerCharacter.width + speed <= canvas.width) {
        playerCharacter.x += speed;
        break;
      } else {
        break;
      }
  }
}

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  soilBedArray.forEach((soilBed) => soilBed.render());
  plantArray.forEach((plant) => plant.render());
  playerCharacter.render();
};

const gameLoopInterval = setInterval(gameLoop, 60);

console.log("Have a snack for energy before you start 🥕");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);
let soilBedArray = [];
let plantArray = [];
let openPlantSpots = [];

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

// When plants are spawning randomly, they will grab a set
// of x and y spawn coordinates from this array to ensure
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
//  having given its coords to the new plant, this finds the corresponding
// spot in the array of valid spots and marks it as occupied.
const markPlantSpotOccupied = (plant) => {
  validPlantSpots.forEach((spot) => {
    if (plant.x === spot.location[0] && plant.y === spot.location[1]) {
      spot.occupied = true;
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

new SoilBed(100);
new SoilBed(300);
new SoilBed(canvas.width - 400);
new SoilBed(canvas.width - 200);

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

const spawnPlant = () => {
  if (Math.random() < 0.3) {
    new Plant();
  }
};

const gameLoopInterval = setInterval(gameLoop, 60);
const plantSpawnInterval = setInterval(spawnPlant, 1000);

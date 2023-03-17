console.log("Have a snack for energy before you start 🥕");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);

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

const soilBed = {
  x: 100,
  y: 100,
  width: 100,
  // leaves space above and below for avatar to move without
  // touching; can change this if/when avatar is changed
  height: canvas.height - 200,
  color: "#3d2b24",
  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
};

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
  soilBed.render();
  playerCharacter.render();
};

const gameLoopInterval = setInterval(gameLoop, 60);

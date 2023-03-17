console.log("Have a snack for energy before you start 🥕");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);

const playerCharacter = {
  x: 10,
  y: 10,
  width: 100,
  height: 100,
  color: "#ccc",
  render() {
    ctx.fillStyle = "#ccc";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
};

document.addEventListener("keydown", handleKeyPressEvent);

function handleKeyPressEvent(e) {
  const speed = 10;
  switch (e.key) {
    case "w":
    case "ArrowUp":
      playerCharacter.y -= speed;
      break;
    case "s":
    case "ArrowDown":
      playerCharacter.y += speed;
      break;
    case "a":
    case "ArrowLeft":
      playerCharacter.x -= speed;
      break;
    case "d":
    case "ArrowRight":
      playerCharacter.x += speed;
      break;
  }
}

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  playerCharacter.render();
};

const gameLoopInterval = setInterval(gameLoop, 60);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  color: "red",
  speed: 5,
  dx: 0,
  dz: 0,
  originalWidth: 50,
  originalHeight: 50,
};

const boundaries = {
  left: 100,
  right: canvas.width - 100,
  top: 100,
  bottom: canvas.height - 100,
};

let dec = 0.9;

const backgroundImage = new Image();
backgroundImage.src = "../images/virtua1[1].png";

let backgroundX = 0;
let backgroundY = 0;
let backgroundScale = 1;

function drawBackground() {
  const scaledWidth = canvas.width * backgroundScale;
  const scaledHeight = canvas.height * backgroundScale;
  const offsetX = (scaledWidth - canvas.width) / 2;
  const offsetY = (scaledHeight - canvas.height) / 2;

  ctx.drawImage(
    backgroundImage,
    backgroundX - offsetX,
    backgroundY - offsetY,
    scaledWidth,
    scaledHeight
  );
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - player.width / 2,
    player.y - player.height / 2,
    player.width,
    player.height
  );
}

function movePlayer() {
  player.x += player.dx;
  player.y += player.dz;

  if (player.dx !== 0 && player.dz !== 0) {
    player.width *= 0.99;
    player.height *= 0.99;
  }

  if (player.x < boundaries.left + player.width / 2)
    player.x = boundaries.left + player.width / 2;
  if (player.x > boundaries.right - player.width / 2)
    player.x = boundaries.right - player.width / 2;
  if (player.y < boundaries.top + player.height / 2)
    player.y = boundaries.top + player.height / 2;
  if (player.y > boundaries.bottom - player.height / 2)
    player.y = boundaries.bottom - player.height / 2;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    backgroundScale += 0.1;
  } else if (event.key === "ArrowDown") {
    backgroundScale -= 0.1;
    if (backgroundScale < 1) backgroundScale = 1;
  } else if (event.key === "w" || event.key === "W") {
    player.dx = -player.speed * Math.cos(Math.PI / 5.9);
    player.dz = -player.speed * Math.sin(Math.PI / 5.9);
    player.width = player.originalWidth * dec;
    player.height = player.originalHeight * dec;
    if (dec > 0.1) dec -= 0.1;
  } else if (event.key === "s" || event.key === "S") {
    player.dx = player.speed * Math.cos(Math.PI / 5.9);
    player.dz = player.speed * Math.sin(Math.PI / 5.9);
    player.width = player.originalWidth * dec;
    player.height = player.originalHeight * dec;
    if (dec < 0.9) dec += 0.1;
  } else if (event.key === "a" || event.key === "A") {
    player.dx = -player.speed;
    player.dz = 0;
  } else if (event.key === "d" || event.key === "D") {
    player.dx = player.speed;
    player.dz = 0;
  }
});

document.addEventListener("keyup", (event) => {
  if (
    event.key === "w" ||
    event.key === "W" ||
    event.key === "s" ||
    event.key === "S"
  ) {
    player.dx = 0;
    player.dz = 0;
  } else if (
    event.key === "a" ||
    event.key === "A" ||
    event.key === "d" ||
    event.key === "D"
  ) {
    player.dx = 0;
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlayer();
  movePlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();
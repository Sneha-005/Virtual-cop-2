const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "black";

const bgImages = ["bg1.jpg", "bg2.jpg", "bg3.jpg"];
const backgrounds = [];
let bgX = 0;
let characterX = canvas.width / 2;
const characterY = canvas.height - 50;
let characterWidth = 50;
let characterHeight = 50;
const speed = 5;

const buildings = [
  { x: 50, y: 0, width: 50, height: canvas.height },
  { x: canvas.width - 100, y: 0, width: 50, height: canvas.height },
];

bgImages.forEach((src, index) => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    backgrounds.push({ img, x: index * canvas.width });
  };
});

function drawBackground() {
  backgrounds.forEach((bg) => {
    ctx.drawImage(bg.img, bg.x, 0, canvas.width, canvas.height);
  });
}

function drawCharacter() {
  ctx.fillStyle = "orange";
  ctx.fillRect(characterX, characterY, characterWidth, characterHeight);
}

function drawBuildings() {
  ctx.fillStyle = "gray";
  buildings.forEach((building) => {
    ctx.fillRect(building.x, building.y, building.width, building.height);
  });
}

function updateBackground() {
  backgrounds.forEach((bg) => {
    bg.x -= speed;
    if (bg.x <= -canvas.width) {
      bg.x = (backgrounds.length - 1) * canvas.width;
    }
  });
}

function updateCharacter(direction) {
  if (direction === "left") {
    characterX -= speed;
  } else if (direction === "right") {
    characterX += speed;
  } else if (direction === "up") {
    characterWidth += 5;
    characterHeight += 5;
    buildings.forEach((building) => {
      building.width -= 2;
      building.height -= 10;
      building.x += building.x < canvas.width / 2 ? -5 : 5;
    });
  } else if (direction === "down") {
    characterWidth -= 5;
    characterHeight -= 5;
    buildings.forEach((building) => {
      building.width += 2;
      building.height += 10;
      building.x += building.x < canvas.width / 2 ? 5 : -5;
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBuildings();
  drawCharacter();
  requestAnimationFrame(animate);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    updateCharacter("left");
    updateBackground();
  } else if (e.key === "ArrowRight") {
    updateCharacter("right");
    updateBackground();
  } else if (e.key === "ArrowUp") {
    updateCharacter("up");
  } else if (e.key === "ArrowDown") {
    updateCharacter("down");
  }
});

animate();

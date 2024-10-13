import { Character } from "./classes.js";
import { HidingObject } from "./classes.js";
import { Enemy } from "./enemy.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const img1 = new Image();
const img2 = new Image();
img1.src = "../images/city.jpg";
img2.src = "../images/virtua.png";

let img1X = 0;
let img2X = canvas.width;

const speed = 5;

const boundaries = [
  [158, 681],
  [2, 373],
  [0, 485],
  [180, 525],
  [160, 692],
  [1480, 695],
  [1456, 374],
  [857, 368],
  [525, 299],
  [362, 260],
  [208, 266],
  [190, 376],
  [0, 381],
];

const idleSprite = new Image();
idleSprite.src = "../images/Idle.png";
const runningSprite = new Image();
runningSprite.src = "../images/Run.png";
const shootingSprite = new Image();
shootingSprite.src = "../images/Shot_1.png";

const character = new Character(idleSprite, runningSprite, shootingSprite, 5, {
  idle: 7,
  running: 8,
  shooting: 4,
}, boundaries);

character.x = (canvas.width - character.spriteWidth) / 2;
character.y = canvas.height - character.spriteHeight - 100;

const hidingObject = new HidingObject(
  300,
  300, 
  192,
  192,
  "../images/Ride.png",
  1
);

const enemyPoints = [
  { x: 644, y: 141 },
  { x: 488, y: 261 },
  { x: 176, y: 282 },
  { x: 984, y: 306 },
  { x: 1163, y: 311 },
  { x: 476, y: 266 }
];

const enemies = enemyPoints.map(point => new Enemy(point.x, point.y));


const safeZone = {
  x1: 332,
  y1: 484,
  x2: 469,
  y2: 567
};

function loadImage(image) {
  return new Promise((resolve) => {
    image.onload = resolve;
  });
}

function drawBoundaries() {
  ctx.strokeStyle = "transparent";
  ctx.beginPath();
  for (let i = 0; i < boundaries.length; i++) {
    const [x1, y1] = boundaries[i];
    const [x2, y2] = boundaries[(i + 1) % boundaries.length];
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  ctx.drawImage(img1, img1X, 0, canvas.width, canvas.height);
  ctx.drawImage(img2, img2X, 0, canvas.width, canvas.height);

  drawBoundaries();

  
  if (hidingObject.isCharacterBehind(character)) {
    hidingObject.draw(ctx);
    character.updateFrame();
    character.draw(ctx);
  } else {
    character.updateFrame();
    character.draw(ctx);
    hidingObject.draw(ctx);
  }


  enemies.forEach(enemy => enemy.draw(ctx));

  enemies.forEach(enemy => {
    if (enemy.isCharacterColliding(character) && !isCharacterInSafeZone(character)) {
      console.log('Character collided with enemy!');
    }
  });

  requestAnimationFrame(draw);
}

function isCharacterInSafeZone(character) {
  const charCenterX = character.x + character.spriteWidth / 2;
  const charCenterY = character.y + character.spriteHeight / 2;
  return (
    charCenterX >= safeZone.x1 &&
    charCenterX <= safeZone.x2 &&
    charCenterY >= safeZone.y1 &&
    charCenterY <= safeZone.y2
  );
}

function shootAtCharacter(enemy) {
  console.log(`Enemy at (${enemy.x}, ${enemy.y}) shoots at character!`);
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      character.moveUp(hidingObject);
      break;
    case "s":
      character.moveDown(hidingObject);
      break;
    case "a":
      character.moveLeft(hidingObject);
      break;
    case "d":
      character.moveRight(hidingObject);
      break;
  }

  if (img1X >= canvas.width) {
    img1X = img2X - canvas.width;
  } else if (img1X <= -canvas.width) {
    img1X = img2X + canvas.width;
  }

  if (img2X >= canvas.width) {
    img2X = img1X - canvas.width;
  } else if (img2X <= -canvas.width) {
    img2X = img1X + canvas.width;
  }
});

document.addEventListener("keyup", (event) => {
  if (!["w", "a", "s", "d"].includes(event.key)) {
    return;
  }
  character.setIdle();
});

canvas.addEventListener("click", (event) => {
  const facingRight = event.clientX >= canvas.width / 2;
  character.shoot(facingRight);
  console.log(`Mouse click coordinates: (${event.clientX}, ${event.clientY})`);

  enemies.forEach((enemy, index) => {
    const dx = event.clientX - enemy.x;
    const dy = event.clientY - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < enemy.radius) {
      enemies.splice(index, 1);
      console.log(`Enemy at (${enemy.x}, ${enemy.y}) was killed!`);
    }
  });
});

Promise.all([
  loadImage(img1),
  loadImage(img2),
  loadImage(idleSprite),
  loadImage(runningSprite),
  loadImage(shootingSprite),
  loadImage(hidingObject.image),
]).then(() => {
  draw();
  enemies.forEach(enemy => {
    setInterval(() => shootAtCharacter(enemy), 1000);
  });
});
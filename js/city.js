import { Character, HidingObject, Enemy } from "./classes.js";

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

const character = new Character(
  idleSprite,
  runningSprite,
  shootingSprite,
  5,
  {
    idle: 7,
    running: 8,
    shooting: 4,
  },
  boundaries
);

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
  { x: 176, y: 282 },
  { x: 984, y: 306 },
  { x: 1163, y: 311 },
  { x: 476, y: 266 },
];

let enemies = enemyPoints.map((point) => new Enemy(point.x, point.y));

const safeZone = {
  x1: 332,
  y1: 484,
  x2: 469,
  y2: 567,
};

const targetSymbol = new Image();
targetSymbol.src = "../images/target.png";
let targetX = 0;
let targetY = 0;
let targetSize = 100;
let targetClicked = false;

let clickCount = 0;

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

  const characterWidth = character.spriteWidth * 1.5; // Increase width by 50%
  const characterHeight = character.spriteHeight * 1.5; // Increase height by 50%

  if (hidingObject.isCharacterBehind(character)) {
    hidingObject.draw(ctx);
    character.updateFrame();
    character.draw(ctx, characterWidth, characterHeight);
  } else {
    character.updateFrame();
    character.draw(ctx, characterWidth, characterHeight);
    hidingObject.draw(ctx);
  }

  enemies.forEach((enemy) => enemy.draw(ctx));

  enemies.forEach((enemy) => {
    if (
      enemy.isCharacterColliding(character) &&
      !isCharacterInSafeZone(character)
    ) {
      console.log("Character collided with enemy!");
    }
  });

  if (targetClicked) {
    targetSize -= 2;
    if (targetSize <= 0) {
      targetSize = 100;
      targetClicked = false;
    }
  }

  ctx.drawImage(
    targetSymbol,
    targetX - targetSize / 2,
    targetY - targetSize / 2,
    targetSize,
    targetSize
  );

  hidingObject.draw(ctx);

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

function respawnEnemy(index) {
  setTimeout(() => {
    enemies.push(new Enemy(enemyPoints[index].x, enemyPoints[index].y));
  }, 3000);
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
    case "ArrowLeft":
      if (img1X < 0) {
        img1X += speed;
        img2X += speed;
        hidingObject.x += speed;
        enemies.forEach((enemy) => (enemy.x += speed));
      }
      break;
    case "ArrowRight":
      if (img2X > canvas.width - img1.width) {
        img1X -= speed;
        img2X -= speed;
        hidingObject.x -= speed;
        enemies.forEach((enemy) => (enemy.x -= speed));
      }
      break;
  }
});

document.addEventListener("keyup", (event) => {
  if (
    ![
      "w",
      "a",
      "s",
      "d",
      "ArrowUp",
      "ArrowLeft",
      "ArrowDown",
      "ArrowRight",
    ].includes(event.key)
  ) {
    return;
  }
  character.setIdle();
});

canvas.addEventListener("mousemove", (event) => {
  targetX = event.clientX;
  targetY = event.clientY;
});

canvas.addEventListener("click", (event) => {
  targetClicked = true;

  const facingRight = event.clientX >= canvas.width / 2;
  character.shoot(facingRight, () => {
    targetClicked = false;
    targetSize = 50;
  });
  console.log(`Mouse click coordinates: (${event.clientX}, ${event.clientY})`);

  enemies.forEach((enemy, index) => {
    const dx = event.clientX - enemy.x;
    const dy = event.clientY - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < enemy.radius) {
      enemies.splice(index, 1);
      console.log(`Enemy at (${enemy.x}, ${enemy.y}) was killed!`);
      respawnEnemy(index);
    }
  });

  const dx = event.clientX - hidingObject.x;
  const dy = event.clientY - hidingObject.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < hidingObject.width / 2) {
    clickCount++;
    if (clickCount >= 4) {
      hidingObject.triggerDestruction();
      clickCount = 0;

      const charCenterX = character.x + character.spriteWidth / 2;
      const charCenterY = character.y + character.spriteHeight / 2;
      const charDistance = Math.sqrt(
        (charCenterX - hidingObject.x) ** 2 +
          (charCenterY - hidingObject.y) ** 2
      );
      if (charDistance <= 20) {
        alert("Character died in the blast!");
      }
    }
  }
});

Promise.all([
  loadImage(img1),
  loadImage(img2),
  loadImage(idleSprite),
  loadImage(runningSprite),
  loadImage(shootingSprite),
  loadImage(hidingObject.image),
  loadImage(targetSymbol),
  loadImage(hidingObject.destroyedSprite),
]).then(() => {
  draw();
  enemies.forEach((enemy, index) => {
    setInterval(() => shootAtCharacter(enemy), 1000);
  });
});

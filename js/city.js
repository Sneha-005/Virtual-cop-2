import { Character } from "./character.js";
import { Enemy } from "./enemy.js";
import { HidingObject } from "./hiddenObject.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const myAudio = document.getElementById("myAudio");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const img1 = new Image();
const img2 = new Image();
img1.src = "../images/city.jpg";
img2.src = "../images/city.jpg";

let img1X = 0;
let img2X = canvas.width;

const speed = 5;

let score = 0;

function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "yellow";
  ctx.fillText("KILL: " + score, 30, 30);
}

const boundaries = [
  [163, 518],
  [143, 692],
  [1533, 659],
  [1528, 353],
  [910, 309],
  [381, 189],
  [209, 186],
  [182, 346],
  [3, 338],
];

const idleSprite = new Image();
idleSprite.src = "../images/Idle.png";
const runningSprite = new Image();
runningSprite.src = "../images/Run.png";
const shootingSprite = new Image();
shootingSprite.src = "../images/Shot_1.png";
const enemySprite = new Image();
enemySprite.src = "../images/Enemy.png"; // Add your enemy sprite image path here

const character = new Character(
  idleSprite,
  runningSprite,
  shootingSprite,
  15,
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
  { x: 644, y: 121 },
  { x: 488, y: 241 },
  { x: 176, y: 262 },
  { x: 984, y: 276 },
  { x: 1163, y: 291 },
];

let enemies = [];
let currentEnemyIndex = 0;
let targetEnemy = null;

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

  character.updateFrame();
  character.draw(ctx, characterWidth, characterHeight);

  enemies.forEach((enemy) => {
    enemy.updateFrame();
    enemy.draw(ctx, canvas.width / 2);
  });

  ctx.drawImage(
    targetSymbol,
    targetX - targetSize / 2,
    targetY - targetSize / 2,
    targetSize,
    targetSize
  );

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
    enemies.push(
      new Enemy(
        enemyPoints[index].x,
        enemyPoints[index].y,
        enemySprite,
        128,
        128,
        4
      )
    );
  }, 3000);
}

function spawnNextEnemy() {
  if (currentEnemyIndex < enemyPoints.length) {
    const point = enemyPoints[currentEnemyIndex];
    const enemy = new Enemy(point.x, point.y, enemySprite, 128, 128, 4);
    enemies.push(enemy);
    targetEnemy = enemy;
    targetX = enemy.x;
    targetY = enemy.y;
    currentEnemyIndex++;
  } else {
    currentEnemyIndex = 0; // Reset index to loop through enemy points again
  }

  // Call spawnNextEnemy again after a delay to continuously spawn enemies
  setTimeout(spawnNextEnemy, 3000);
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
  const rect = canvas.getBoundingClientRect();
  targetX = event.clientX - rect.left;
  targetY = event.clientY - rect.top;

  if (targetEnemy) {
    const dx = targetX - targetEnemy.x;
    const dy = targetY - targetEnemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < targetEnemy.width / 2) {
      targetSize = 80; // Reduce target size to 80%
    } else {
      targetSize = 100; // Reset target size
    }
  }
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  showClickPoint(x, y);

  targetClicked = true;

  const facingRight = event.clientX >= canvas.width / 2;
  character.shoot(facingRight);
  myAudio.currentTime = 0; 
  myAudio.play();
  character.shoot(facingRight, () => {
    targetClicked = false;
    targetSize = 100;
  });
  console.log(`Mouse click coordinates: (${event.clientX}, ${event.clientY})`);

  enemies.forEach((enemy, index) => {
    const enemyCenterX = enemy.x;
    const enemyCenterY = enemy.y;
    const dx = x - enemyCenterX;
    const dy = y - enemyCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < enemy.width / 2) {
      enemies.splice(index, 1);
      score++; 
      console.log(`Enemy at (${enemy.x}, ${enemy.y}) was killed!`);
      targetEnemy = null;
    }
  });

  const dx = event.clientX - hidingObject.x + 12;
  const dy = event.clientY - hidingObject.y - 180;
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

// Function to show mouse click point
function showClickPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2, true); // Draw a circle at the click point
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

Promise.all([
  loadImage(img1),
  loadImage(img2),
  loadImage(idleSprite),
  loadImage(runningSprite),
  loadImage(shootingSprite),
  loadImage(hidingObject.image),
  loadImage(targetSymbol),
  loadImage(hidingObject.destroyedSprite),
  loadImage(enemySprite),
]).then(() => {
  spawnNextEnemy();
  draw();
});


const restartButton = document.getElementById("restartButton");
const backButton = document.getElementById("backButton");

function restartGame() {
  character.x = (canvas.width - character.spriteWidth) / 2;
  character.y = canvas.height - character.spriteHeight - 100;
  enemies.length = 0;  
  enemyPoints.forEach(point => enemies.push(new Enemy(point.x, point.y)));  
  score = 0;
  console.log("Game restarted!");
}

function goBack() {
  window.location.href = "../html/roundSelection.html"; 
  console.log("Going back to menu...");
}

restartButton.addEventListener("click", restartGame);
backButton.addEventListener("click", goBack);
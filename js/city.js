class Character {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 10;
    this.minSize = 20;
    this.originalSize = width;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveUp() {
    if (this.isInsideBoundary(this.x, this.y - this.speed)) {
      this.y -= this.speed;
      this.decreaseSize();
    }
  }

  moveDown() {
    if (this.isInsideBoundary(this.x, this.y + this.speed)) {
      this.y += this.speed;
      this.increaseSize();
    }
  }

  moveLeft() {
    if (this.isInsideBoundary(this.x - this.speed, this.y)) {
      this.x -= this.speed;
    }
  }

  moveRight() {
    if (this.isInsideBoundary(this.x + this.speed, this.y)) {
      this.x += this.speed;
    }
  }

  decreaseSize() {
    this.width = Math.max(this.minSize, this.width - 1);
    this.height = Math.max(this.minSize, this.height - 1);
  }

  increaseSize() {
    this.width = Math.min(this.originalSize, this.width + 1);
    this.height = Math.min(this.originalSize, this.height + 1);
  }

  isInsideBoundary(x, y) {
    let inside = false;
    for (let i = 0, j = boundaries.length - 1; i < boundaries.length; j = i++) {
      const [xi, yi] = boundaries[i];
      const [xj, yj] = boundaries[j];
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  update() {
    // Character stays in the center, no need to update position
  }
}

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

const character = new Character(
  canvas.width / 2 - 15,
  canvas.height - 60,
  60,
  60,
  "orange"
);

const boundaries = [
  [158, 681],
  [2, 373],
  [0, 485],
  [180, 525],
  [160, 642],
  [1480, 645],
  [1456, 374],
  [857, 368],
  [525, 299],
  [362, 260],
  [208, 266],
  [190, 376],
  [0, 381],
];

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

  // Draw background images
  ctx.drawImage(img1, img1X, 0, canvas.width, canvas.height);
  ctx.drawImage(img2, img2X, 0, canvas.width, canvas.height);

  // Draw boundaries
  drawBoundaries();

  // Draw character
  character.draw(ctx);

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    img1X += speed;
    img2X += speed;
  } else if (event.key === "ArrowRight") {
    img1X -= speed;
    img2X -= speed;
  } else if (event.key === "w") {
    character.moveUp();
  } else if (event.key === "s") {
    character.moveDown();
  } else if (event.key === "a") {
    character.moveLeft();
  } else if (event.key === "d") {
    character.moveRight();
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

img1.onload = () => {
  img2.onload = () => {
    draw();
  };
};

canvas.addEventListener("click", (event) => {
  // Get the bounding rectangle of the canvas
  const rect = canvas.getBoundingClientRect();

  // Calculate the mouse coordinates relative to the canvas
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Log the coordinates to the console
  console.log(`Mouse coordinates: (${x}, ${y})`);
});

class Character {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 5;
    this.minSize = 20;
    this.originalSize = width;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveUp() {
    this.y -= this.speed;
    this.decreaseSize();
  }

  moveDown() {
    this.y += this.speed;
    this.increaseSize();
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() {
    this.x += this.speed;
  }

  decreaseSize() {
    this.width = Math.max(this.minSize, this.width - 1);
    this.height = Math.max(this.minSize, this.height - 1);
  }

  increaseSize() {
    this.width = Math.min(this.originalSize, this.width + 1);
    this.height = Math.min(this.originalSize, this.height + 1);
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
img1.src = "../images/virtua.png";
img2.src = "../images/virtua.png";

let img1X = 0;
let img2X = canvas.width;

const speed = 5;

const character = new Character(
  canvas.width / 2 - 15,
  canvas.height - 60,
  30,
  30,
  "blue"
);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background images
  ctx.drawImage(img1, img1X, 0, canvas.width, canvas.height);
  ctx.drawImage(img2, img2X, 0, canvas.width, canvas.height);

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

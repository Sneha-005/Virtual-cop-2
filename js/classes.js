export class Character {
  constructor(
    idleSprite,
    runningSprite,
    shootingSprite,
    speed,
    frameCounts,
    boundaries
  ) {
    this.idleSprite = idleSprite;
    this.runningSprite = runningSprite;
    this.shootingSprite = shootingSprite;
    this.speed = speed;
    this.frameCounts = frameCounts;
    this.frameIndex = 0;
    this.x = 0;
    this.y = 0;
    this.state = "idle";
    this.spriteWidth = 128;
    this.spriteHeight = 128;
    this.shootingTimeout = null;
    this.frameInterval = 10; 
    this.frameCounter = 0;
    this.facingRight = true; 
    this.boundaries = boundaries; 
  }

  setIdle() {
    this.state = "idle";
    this.frameIndex = 0;
  }

  setRunning() {
    this.state = "running";
    this.frameIndex = 0;
  }

  setShooting() {
    this.state = "shooting";
    this.frameIndex = 0;
    if (this.shootingTimeout) {
      clearTimeout(this.shootingTimeout);
    }
    this.shootingTimeout = setTimeout(() => {
      this.setIdle();
    }, this.frameCounts["shooting"] * 100); 
  }

  moveLeft(hidingObject) {
    if (
      this.isInsideBoundary(this.x - this.speed, this.y) &&
      !this.isCollidingWithObject(this.x - this.speed, this.y, hidingObject)
    ) {
      this.x -= this.speed;
      this.setRunning();
      this.facingRight = false;
    }
  }

  moveRight(hidingObject) {
    if (
      this.isInsideBoundary(this.x + this.speed, this.y) &&
      !this.isCollidingWithObject(this.x + this.speed, this.y, hidingObject)
    ) {
      this.x += this.speed;
      this.setRunning();
      this.facingRight = true;
    }
  }

  moveUp(hidingObject) {
    if (
      this.isInsideBoundary(this.x, this.y - this.speed) &&
      !this.isCollidingWithObject(this.x, this.y - this.speed, hidingObject)
    ) {
      this.y -= this.speed;
      this.setRunning();
    }
  }

  moveDown(hidingObject) {
    if (
      this.isInsideBoundary(this.x, this.y + this.speed) &&
      !this.isCollidingWithObject(this.x, this.y + this.speed, hidingObject)
    ) {
      this.y += this.speed;
      this.setRunning();
    }
  }

  shoot(facingRight) {
    this.setShooting();
    this.facingRight = facingRight;
  }

  updateFrame() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameInterval) {
      this.frameIndex = (this.frameIndex + 1) % this.frameCounts[this.state];
      this.frameCounter = 0;
    }
  }

  draw(context) {
    let sprite;
    switch (this.state) {
      case "idle":
        sprite = this.idleSprite;
        break;
      case "running":
        sprite = this.runningSprite;
        break;
      case "shooting":
        sprite = this.shootingSprite;
        break;
    }
    const frameX = this.frameIndex * this.spriteWidth;

    context.save();
    if (!this.facingRight) {
      context.translate(this.x + this.spriteWidth, this.y);
      context.scale(-1, 1);
      context.drawImage(
        sprite,
        frameX,
        0,
        this.spriteWidth,
        this.spriteHeight,
        0,
        0,
        this.spriteWidth,
        this.spriteHeight
      );
    } else {
      context.drawImage(
        sprite,
        frameX,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.spriteWidth,
        this.spriteHeight
      );
    }
    context.restore();
  }

  isInsideBoundary(x, y) {
    const { boundaries } = this;
    let inside = false;
    for (let i = 0, j = boundaries.length - 1; i < boundaries.length; j = i++) {
      const xi = boundaries[i][0],
        yi = boundaries[i][1];
      const xj = boundaries[j][0],
        yj = boundaries[j][1];
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  isCollidingWithObject(x, y, object) {
    const { charLeft, charRight, charTop, charBottom } = this.getCollisionBox(
      x,
      y
    );
    const { objLeft, objRight, objTop, objBottom } = object.getCollisionBox();

    return (
      charRight > objLeft &&
      charLeft < objRight &&
      charBottom > objTop &&
      charTop < objBottom
    );
  }

  getCollisionBox(x = this.x, y = this.y) {
    const reducedWidth = this.spriteWidth * 0.7; 
    const reducedHeight = this.spriteHeight * 0.5;
    const centerX = x + this.spriteWidth / 2;
    const centerY = y + this.spriteHeight / 2;

    return {
      charLeft: centerX - reducedWidth / 2,
      charRight: centerX + reducedWidth / 2,
      charTop: centerY - reducedHeight / 2,
      charBottom: centerY + reducedHeight / 2,
    };
  }
}
export class HidingObject {
  constructor(x, y, width, height, imageSrc, frameCount) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.frameCount = frameCount;
    this.frameIndex = 0;
    this.frameInterval = 10; 
    this.frameCounter = 0;
  }

  draw(context) {
    this.frameCounter++;
    if (this.frameCounter >= this.frameInterval) {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.frameCounter = 0;
    }
    const frameX = this.frameIndex * this.width;
    context.drawImage(
      this.image,
      frameX,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  isCharacterBehind(character) {
    return (
      character.x + character.spriteWidth > this.x &&
      character.x < this.x + this.width &&
      character.y + character.spriteHeight > this.y &&
      character.y < this.y + this.height
    );
  }

  getCollisionBox() {
    const reducedWidth = this.width * 0.7;
    const reducedHeight = this.height * 0.5; 
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    return {
      objLeft: centerX - reducedWidth / 2,
      objRight: centerX + reducedWidth / 2,
      objTop: centerY - reducedHeight / 2,
      objBottom: centerY + reducedHeight / 2,
    };
  }
}
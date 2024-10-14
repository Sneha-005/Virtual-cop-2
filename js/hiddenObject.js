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
    this.isDestroyed = false;
    this.destroyedSprite = new Image();
    this.destroyedSprite.src = "../images/Destroyed.png"; // Path to the destroyed sprite sheet
    this.destroyedFrameCount = 10; // Number of frames in the destroyed animation
    this.destroyedFrameIndex = 0;
    this.destroyedFrameInterval = 10;
    this.destroyedFrameCounter = 0;
  }

  draw(context) {
    if (this.isDestroyed) {
      this.destroyedFrameCounter++;
      if (this.destroyedFrameCounter >= this.destroyedFrameInterval) {
        this.destroyedFrameIndex++;
        this.destroyedFrameCounter = 0;
      }
      if (this.destroyedFrameIndex < this.destroyedFrameCount) {
        const frameX = this.destroyedFrameIndex * this.width;
        context.drawImage(
          this.destroyedSprite,
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
    } else {
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

  triggerDestruction() {
    this.isDestroyed = true;
    this.destroyedFrameIndex = 0;
    this.destroyedFrameCounter = 0;
  }

  triggerDestruction() {
    this.destroyed = true;
    setTimeout(() => {
      this.destroyed = false;
    }, 3000);
  }
}

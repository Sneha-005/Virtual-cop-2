export class Enemy {
  constructor(x, y, sprite, width, height, frames) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.width = width;
    this.height = height;
    this.frames = frames;
    this.currentFrame = 0;
    this.frameCount = 0;
    this.frameSpeed = 10; // Adjust the speed of animation
    this.radius = 64; // Adjust as needed for collision detection
  }

  updateFrame() {
    this.frameCount++;
    if (this.frameCount >= this.frameSpeed) {
      this.frameCount = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames;
    }
  }

  draw(ctx, canvasHalfWidth) {
    const frameX = this.currentFrame * this.width;
    ctx.save();
    if (this.x > canvasHalfWidth) {
      ctx.translate(this.x + this.width / 2, this.y);
      ctx.scale(-1, 1);
      ctx.translate(-this.x - this.width / 2, -this.y);
    }
    ctx.drawImage(
      this.sprite,
      frameX,
      0,
      this.width,
      this.height,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }

  isCharacterColliding(character) {
    const dx = this.x - character.x;
    const dy = this.y - character.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + character.spriteWidth / 2;
  }
}

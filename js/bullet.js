export class Bullet {
  constructor(x, y, targetX, targetY, speed = 2) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = speed;

    const angle = Math.atan2(targetY - y, targetX - x);
    this.velocityX = Math.cos(angle) * speed;
    this.velocityY = Math.sin(angle) * speed;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  draw(context) {
    context.fillStyle = "black";
    context.beginPath();
    context.arc(this.x, this.y, 5, 0, Math.PI * 2);
    context.fill();
  }

  isCollidingWithCharacter(character) {
    const dx = this.x - (character.x + character.spriteWidth / 2);
    const dy = this.y - (character.y + character.spriteHeight / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 5 + character.spriteWidth / 2;
  }
}

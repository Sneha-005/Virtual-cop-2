export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
  }

  draw(context) {
    context.fillStyle = "red";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }

  isCharacterColliding(character) {
    const dx = this.x - (character.x + character.spriteWidth / 2);
    const dy = this.y - (character.y + character.spriteHeight / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + character.spriteWidth / 2;
  }
}

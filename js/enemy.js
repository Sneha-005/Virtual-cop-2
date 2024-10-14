export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.image = new Image();
    this.image.src = "../images/Gangster.png";
    this.spriteWidth = 50;  
    this.spriteHeight = 77;
  }

  draw(context) {
 
    context.drawImage(this.image, this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2, this.spriteWidth, this.spriteHeight);
  }

  isCharacterColliding(character) {
    const dx = this.x - (character.x + character.spriteWidth / 2);
    const dy = this.y - (character.y + character.spriteHeight / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + character.spriteWidth / 2;
  }
}

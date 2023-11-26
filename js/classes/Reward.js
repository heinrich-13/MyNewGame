class Reward {
  constructor({ position, imageSrc, scale = 1 }) {
    this.position = position;
    this.width = 16; // Adjust the width as needed
    this.height = 16; // Adjust the height as needed
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
  }

  draw() {
    if (!this.image.complete) return;

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width * this.scale,
      this.height * this.scale
    );
  }
}

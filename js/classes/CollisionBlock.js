class CollisionBlock {
	constructor({position, height = 16, imageSrc, scale = 3}) {
		this.position = position
    this.width = 16
    this.height = height
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
	}

	draw() {
		if (!this.image.complete) return

		c.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width * this.scale / 3,
			this.height * this.scale
		)
	}
}

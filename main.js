const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 900;

const scaledCanvas = {
	width: canvas.width / 2,
	height: canvas.height / 2,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 36) {
	floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 202) {
			collisionBlocks.push(
				new CollisionBlock({
					position: {
						x: x * 16,
						y: y * 16,
					},
				})
			)
		}
	})
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i+= 36) {
	platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 202) {
			platformCollisionBlocks.push(
				new CollisionBlock({
					position: {
						x: x * 16,
						y: y * 16,
					},
					height: 4,
				})
			)
		}
	})
})


const gravity = 0.2;

const player = new Player({
	position: {
		x: 100,
		y: 330
	},
	collisionBlocks,
	platformCollisionBlocks,
	imageSrc: "./img/warrior/Idle.png",
	frameRate: 8,
	animations: {
		Idle: {
			imageSrc: "./img/warrior/Idle.png",
			frameRate: 8,
			frameBuffer: 8
		},
		IdleLeft: {
			imageSrc: "./img/warrior/IdleLeft.png",
			frameRate: 8,
			frameBuffer: 8
		},
		Run: {
			imageSrc: "./img/warrior/Run.png",
			frameRate: 8,
			frameBuffer: 6
		},
		RunLeft: {
			imageSrc: "./img/warrior/RunLeft.png",
			frameRate: 8,
			frameBuffer: 6
		},
		Jump: {
			imageSrc: "./img/warrior/Jump.png",
			frameRate: 2,
			frameBuffer: 6
		},
		JumpLeft: {
			imageSrc: "./img/warrior/JumpLeft.png",
			frameRate: 2,
			frameBuffer: 6
		},
		Fall: {
			imageSrc: "./img/warrior/Fall.png",
			frameRate: 2,
			frameBuffer: 6
		},
		FallLeft: {
			imageSrc: "./img/warrior/FallLeft.png",
			frameRate: 2,
			frameBuffer: 6
		},
	}
})

const keys = {
	ArrowRight: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false
	},
	a: {
		pressed: false
	}
}

const background = new Sprite(
	{
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: "./img/background.png"
	}
)

backgroundImageHeight = 432
const camera = {
	position: {
		x: 0,
		y: -backgroundImageHeight + scaledCanvas.height,
	},
}

function animate() {
	requestAnimationFrame(animate);

	c.save();
	c.scale(4, 4);
	c.translate(camera.position.x, camera.position.y)
	background.update();

	player.checkForHorizontalCanvasCollision()
	player.update();
	player.velocity.x = 0;

	const diamondIndices = [];

	platformCollisionBlocks.forEach((block, index) => {
		block.draw(); // Draw the platformCollisionBlock

		// Check if the index is a multiple of 3 (0, 3, 6, ...)
		if (index % 3 === 0) {
			const reward = new Reward({
				position: {
					x: block.position.x,
					y: block.position.y - 20, // Adjust the y position as needed
				},
				imageSrc: "./img/rewards/diamond.png",
				scale: 0.5, // Adjust the scale as needed
			});

			reward.draw(); // Draw the diamond for every third platformCollisionBlock
		}
	});

	if (keys.ArrowRight.pressed || keys.d.pressed) {
		player.switchSprite("Run")
		player.velocity.x = 1.5
		player.lastDirection = "right"
		player.shouldPanCameraToTheLeft({canvas, camera})
	} else if (keys.ArrowLeft.pressed || keys.a.pressed) {
		player.switchSprite("RunLeft")
		player.velocity.x = -1.5
		player.lastDirection = "left"
		player.shouldPanCameraToTheRight({canvas, camera})
	}
	else if(player.velocity.y === 0) {
		if (player.lastDirection === "right") player.switchSprite("Idle")
		else player.switchSprite("IdleLeft")
	}

	if (player.velocity.y < 0) {
		player.shouldPanCameraDown({canvas, camera})
		if (player.lastDirection === "right") player.switchSprite("Jump")
		else player.switchSprite(("JumpLeft"))
	}
	else if (player.velocity.y > 0) {
		player.shouldPanCameraUp({canvas, camera})
		if (player.lastDirection === "right") player.switchSprite("Fall")
		else player.switchSprite("FallLeft")
	}

	c.restore();
}

animate();

window.addEventListener("keydown", (event) => {
	switch (event.key) {
		case "ArrowRight":
			keys.ArrowRight.pressed = true;
			break;
		case "a":
			keys.a.pressed = true;
			break;
		case "ArrowLeft":
			keys.ArrowLeft.pressed = true;
			break;
		case "d":
			keys.d.pressed = true;
			break;
		case "ArrowUp":
			player.velocity.y = -4.5;
			break;
		case "w":
			player.velocity.y = -8;
			break;
	}
})

window.addEventListener("keyup", (event) => {
	switch (event.key) {
		case "ArrowRight":
			keys.ArrowRight.pressed = false;
			break;
		case "a":
			keys.a.pressed = false;
			break;
		case "ArrowLeft":
			keys.ArrowLeft.pressed = false;
			break;
		case "d":
			keys.d.pressed = false;
			break;
	}
})

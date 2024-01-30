class Player extends Sprite {
  constructor({
    position,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    animations,
  }) {
    super({ imageSrc, frameRate, scale })
    this.position = position
    this.velocity = {
      x: 0,
      y: 1,
    }

    this.collisionBlocks = collisionBlocks
    this.platformCollisionBlocks = platformCollisionBlocks
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    }

    this.animations = animations
    this.lastDirection = 'right'

    for (let key in this.animations) {
      const image = new Image()
      image.src = this.animations[key].imageSrc

      this.animations[key].image = image
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    }
  }

  SwitchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return

    this.currentFrame = 0
    // als je dit niet erin hebt, kan het gebeuren dat als je op frame 3 of hoger bent in lopen en de dan springt, 
    //dat de sprite weg flasht, omdat die maar 2 frames heeft
    this.image = this.animations[key].image
    this.frameBuffer = this.animations[key].frameBuffer
    this.frameRate = this.animations[key].frameRate
  }

  updateCameraBox(){
    this.camerabox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y
      },
      width: 200,
      height: 80,
    }
  }

  checkForHorizontalCanvasCollision() {
    const leftEdge = -30;  // Adjusted left edge to move player more to the left
    const rightEdge = canvas.width - this.hitbox.width + -490;  // Adjusted right edge to move player more to the left

    if (this.position.x < leftEdge) {
      this.position.x = leftEdge;
    } else if (this.position.x > rightEdge) {
      this.position.x = rightEdge;
    }
  }

  shouldPanCameraToTheLeft({ canvas, camera }) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
    const scaledDownCanvasWidth = canvas.width / 4

    if (cameraboxRightSide >= 576) return
    // 576

    if (
      cameraboxRightSide >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x
    }
  }

  shouldPanCameraToTheRight({ canvas, camera }) {
    if (this.camerabox.position.x <= 0) return

    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x
    }
  }

  shouldPanCameraDown ({ canvas, camera }) {
    if (this.camerabox.position.y + this.velocity.y <= 0) return

    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y
    }
  }

  shouldPanCameraUp ({ canvas, camera }) {
    if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 
      432) return

    const scaledCanvasHeight = canvas.height / 4

    if (this.camerabox.position.y + this.camerabox.height >= 
      Math.abs(camera.position.y) + scaledCanvasHeight
      ) {
      camera.position.y -= this.velocity.y
    }
  }

  update() {
    this.updateFrames()
    this.updateHitbox()

    this.updateCameraBox()
    // c.fillStyle = 'rgba(0, 0, 255, 0.2'
    // c.fillRect(
    // this.camerabox.position.x, 
    // this.camerabox.position.y, 
    // this.camerabox.width, 
    // this.camerabox.height)

    // // draws out image
    // c.fillStyle = 'rgba(0, 255, 0, 0.2'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    // c.fillStyle = 'rgba(255, 0, 0, 0.2'
    // c.fillRect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height)

    this.draw()

    this.position.x += this.velocity.x
    this.updateHitbox()
    this.checkForHorizontalCollisions()
    this.applyGravity()
    this.updateHitbox()
    this.checkForVerticalCollisions()
  }

  updateHitbox() {
    this.hitBox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 25
      },
      width: 14,
      height: 28
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset = this.position.x - collisionBlock.position.x - this.hitbox.width;

          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = collisionBlock.position.x + collisionBlock.width - this.position.x;

          this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }


  applyGravity() {
    this.velocity.y += gravity
    this.position.y += this.velocity.y
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitBox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;

          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitBox.position.y - this.position.y;

          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    // platform collision
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];

      if (
        platformCollision({
          object1: this.hitBox,
          object2: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;

          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
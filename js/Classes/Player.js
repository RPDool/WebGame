class Player extends Sprite {
  constructor({
    position, // positie speler
    collisionBlocks, // array van vloer-collision
    platformCollisionBlocks, // array van platform-collision
    imageSrc, // De image
    frameRate, // de frames per seconde
    scale = 0.5, // de schaal
    animations, // de animaties voor de speler
  }) {
    super({ imageSrc, frameRate, scale }) // Roep de constructor aan
    this.position = position
    this.velocity = {
      x: 0, // Horizontale snelheid van de speler (standaard 0)
      y: 1, // Verticale snelheid van de speler (standaard 1)
    }

    this.collisionBlocks = collisionBlocks // Array van vloer-collisionblokken
    this.platformCollisionBlocks = platformCollisionBlocks // Array van platform-collisionblokken
    this.hitbox = {
      position: {
        x: this.position.x, // x-positie van de hitbox
        y: this.position.y, // y-positie van de hitbox
      },
      width: 10, // Breedte van de hitbox
      height: 10, // Hoogte van de hitbox
    }

    this.animations = animations // Animaties voor de speler
    this.lastDirection = 'right' // Laatste richting van de speler

    // Voorbereiding van de animatieafbeeldingen
    for (let key in this.animations) {
      const image = new Image() // Nieuw Image object voor elke animatieafbeelding
      image.src = this.animations[key].imageSrc // source instellen voor elke animatie

      this.animations[key].image = image // Toevoegen van de afbeelding aan de animatiegegevens
    }

     // Definitie van de camerabox voor het volgen van de speler met de camera
    this.camerabox = {
      position: {
        x: this.position.x, // x-positie van de camerabox (standaard gelijk aan spelerpositie)
        y: this.position.y, // y-positie van de camerabox (standaard gelijk aan spelerpositie)
      },
      width: 200,
      height: 80,
    }
  }

  // Method om de sprite van de speler te wijzigen naar de gegeven animatie
  SwitchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return

    this.currentFrame = 0 // Reset het huidige frame naar 0
    this.image = this.animations[key].image // Verander de afbeelding naar de afbeelding van de animatie
    this.frameBuffer = this.animations[key].frameBuffer // Pas het framebuffer van de animatie toe
    this.frameRate = this.animations[key].frameRate // Pas de framerate van de animatie toe
  }

  // Method om de camerabox van de speler bij te werken
  updateCameraBox(){
    this.camerabox = {
      position: {
        x: this.position.x - 50, // x-positie van de camerabox met offset voor centrering
        y: this.position.y // y-positie van de camerabox (gelijk aan spelerpositie)
      },
      width: 200,
      height: 80,
    }
  }

  // Method om horizontale canvasbotsingen voor de speler te controleren en te corrigeren
  checkForHorizontalCanvasCollision() {
    const leftEdge = -30; // linker muur collision
    const rightEdge = canvas.width - this.hitbox.width + -490;  // rechter muur collision

    if (this.position.x < leftEdge) {
      this.position.x = leftEdge;
    } else if (this.position.x > rightEdge) {
      this.position.x = rightEdge;
    }
  }

  shouldPanCameraToTheLeft({ canvas, camera }) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
    const scaledDownCanvasWidth = canvas.width / 4 // gedeeld door 4 omdat de canvas met 4 is vergroot

    if (cameraboxRightSide >= 576) return
    // 576 is de pixel breedte van de background sprite

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
    // Loop door alle vloer-collisionblokken om horizontale botsingen te controleren
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      // Controleer of er een botsing is tussen de speler en het huidige collisionblok
      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        // Als de speler naar rechts beweegt
        if (this.velocity.x > 0) {
          this.velocity.x = 0; // Stop de beweging van de speler

          // Bereken de offset om de speler buiten het collisionblok te plaatsen
          const offset = this.position.x - collisionBlock.position.x - this.hitbox.width;

          // Pas de positie van de speler aan om buiten het collisionblok te plaatsen
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break; // Stop de loop zodra een botsing is gedetecteerd
        }

        // Als de speler naar links beweegt
        if (this.velocity.x < 0) {
          this.velocity.x = 0; // Stop de beweging van de speler

          // Bereken de offset om de speler buiten het collisionblok te plaatsen
          const offset = collisionBlock.position.x + collisionBlock.width - this.position.x;

          // Pas de positie van de speler aan om buiten het collisionblok te plaatsen
          this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break; // Stop de loop zodra een botsing is gedetecteerd
        }
      }
    }
  }

  applyGravity() {
    // Voeg zwaartekracht toe aan de verticale snelheid van de speler
    this.velocity.y += gravity;
    // Pas de verticale positie van de speler aan op basis van de snelheid
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    // Loop door alle vloer-collisionblokken om verticale botsingen te controleren
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      // Controleer of er een botsing is tussen de speler en het huidige collisionblok
      if (
        collision({
          object1: this.hitBox,
          object2: collisionBlock,
        })
      ) {
        // Als de speler naar beneden beweegt
        if (this.velocity.y > 0) {
          this.velocity.y = 0; // Stop de verticale beweging van de speler

          // Bereken de offset om de speler buiten het collisionblok te plaatsen
          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;

          // Pas de verticale positie van de speler aan om buiten het collisionblok te plaatsen
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break; // Stop de loop zodra een botsing is gedetecteerd
        }

        // Als de speler naar boven beweegt
        if (this.velocity.y < 0) {
          this.velocity.y = 0; // Stop de verticale beweging van de speler

          // Bereken de offset om de speler buiten het collisionblok te plaatsen
          const offset = this.hitBox.position.y - this.position.y;

          // Pas de verticale positie van de speler aan om buiten het collisionblok te plaatsen
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break; // Stop de loop zodra een botsing is gedetecteerd
        }
      }
    }

    // Loop door alle platform-collisionblokken om verticale botsingen te controleren
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];

      // Controleer of er een botsing is tussen de speler en het huidige platform-collisionblok
      if (
        platformCollision({
          object1: this.hitBox,
          object2: platformCollisionBlock,
        })
      ) {
        // Als de speler naar beneden beweegt
        if (this.velocity.y > 0) {
          this.velocity.y = 0; // Stop de verticale beweging van de speler

          // Bereken de offset om de speler buiten het platform-collisionblok te plaatsen
          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;

          // Pas de verticale positie van de speler aan om buiten het platform-collisionblok te plaatsen
          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break; // Stop de loop zodra een botsing is gedetecteerd
        }
      }
    }
  }
}



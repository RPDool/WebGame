class Sprite {
  constructor({
    position, // Positie van de sprite {x, y}
    imageSrc, // Bron van de afbeelding voor de sprite
    frameRate = 1, // Snelheid van de animatie (aantal frames per seconde)
    frameBuffer = 3, // Aantal frames tussen frame-updates
    scale = 1, // Schaal van de sprite
  }) {
    this.position = position; // Positie van de sprite
    this.scale = scale; // Schaal van de sprite
    this.loaded = false; // Status van de afbeeldingslading
    this.image = new Image(); // Nieuw Image object voor de afbeelding
    // Functie die wordt uitgevoerd wanneer de afbeelding is geladen
    this.image.onload = () => {
      // Bereken de breedte en hoogte van de sprite op basis van frameRate en schaal
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = this.image.height * this.scale;
      this.loaded = true; // Markeer de afbeelding als geladen
    };
    this.image.src = imageSrc; // Bronpad van de afbeelding
    this.frameRate = frameRate; // Snelheid van de animatie (frames per seconde)
    this.currentFrame = 0; // Huidig frame van de animatie
    this.frameBuffer = frameBuffer; // Aantal frames tussen frame-updates
    this.elapsedFrames = 0; // Aantal verstreken frames sinds de laatste update
  }

  // Methode om de sprite te tekenen op het canvas
  draw() {
    if (!this.image) return; // Stop met tekenen als de afbeelding niet is geladen

    // Bepaal het uitsnijvak voor het huidige frame van de animatie
    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };

    // Teken de afbeelding op het canvas met het juiste uitsnijvak en positie
    c.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  // Methode om de sprite bij te werken (te tekenen en frames bij te werken)
  update() {
    this.draw(); // Teken de sprite op het canvas
    this.updateFrames(); // Werk de frames van de sprite bij
  }

  // Methode om de frames van de sprite bij te werken
  updateFrames() {
    this.elapsedFrames++; // Verhoog het aantal verstreken frames

    // Controleer of het tijd is om het frame bij te werken op basis van het frameBuffer
    if (this.elapsedFrames % this.frameBuffer === 0) {
      // Als het huidige frame niet het laatste frame is, verhoog het huidige frame met één
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
      // Als het huidige frame het laatste frame is, reset het naar het eerste frame
      else this.currentFrame = 0;
    }
  }
}

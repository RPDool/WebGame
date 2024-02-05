const canvas = document.querySelector("canvas"); // Selecteer het canvas element
const c = canvas.getContext("2d"); // Haal de 2D-rendercontext op

canvas.width = 1024; // Stel de breedte van het canvas in
canvas.height = 576; // Stel de hoogte van het canvas in

// Definieer een geschaalde versie van het canvas voor eenvoudigere berekeningen
const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

// Array om vloer-collisiongegevens in 2D-formaat op te slaan
const floorCollisions2D = [];
// Converteer 1D floorCollisions-array naar een 2D-array
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

// Array om collision-blokken voor de vloer op te slaan
const collisionBlocks = [];
// Loop door de 2D-array om collision-blokken voor de vloer te maken
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      // Controleer op collision-symbool
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16, // Bereken x-positie
            y: y * 16, // Bereken y-positie
          },
        })
      );
    }
  });
});

// Array om platform-collisiongegevens in 2D-formaat op te slaan
const platformCollisions2D = [];
// Converteer 1D platformCollisions-array naar een 2D-array
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

// Array om collision-blokken voor platforms op te slaan
const platformCollisionBlocks = [];
// Loop door de 2D-array om collision-blokken voor platforms te maken
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      // Controleer op collision-symbool
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16, // Bereken x-positie
            y: y * 16, // Bereken y-positie
          },
          height: 4, // Stel de hoogte van het platformblok in
        })
      );
    }
  });
});

// Zwaartekrachtwaarde
const gravity = 0.09;

// Maak speler object aan
const player = new Player({
  position: {
    x: 30, // Initiële x-positie van de speler
    y: 300, // Initiële y-positie van de speler
  },
  collisionBlocks, // Geef vloer-collision-blokken door aan speler
  platformCollisionBlocks, // Geef platform-collision-blokken door aan speler
  imageSrc: "img/warrior/warrior/Idle.png", // Afbeeldingsbron voor initiële staat van speler
  frameRate: 8, // Framerate voor animaties van speler
  animations: {
    // Definieer verschillende animaties voor de speler
    Idle: {
      imageSrc: "img/warrior/warrior/Idle.png",
      frameRate: 8,
      frameBuffer: 8,
    },
    Run: {
      imageSrc: "img/warrior/warrior/Run.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    Jump: {
      imageSrc: "img/warrior/warrior/Jump.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: "img/warrior/warrior/Fall.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: "img/warrior/warrior/FallLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: "img/warrior/warrior/RunLeft.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    IdleLeft: {
      imageSrc: "img/warrior/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    JumpLeft: {
      imageSrc: "img/warrior/warrior/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
  },
});

// Toetsenbord toetsen
const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

// Achtergrond sprite
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "img/background.png",
});

// Hoogte van achtergrondafbeelding
const backgroundImageHeight = 432;

// Camera
const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

// Animeren van het spel
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save(); // Gebruik c.save() om de huidige staat van het canvas op te slaan
  c.scale(4, 4); // Schaal de afbeelding met 4
  c.translate(camera.position.x, camera.position.y);
  background.update();
  player.checkForHorizontalCanvasCollision();
  player.update();

  player.velocity.x = 0; // Zet de horizontale snelheid van de speler standaard op 0

  // Controleer of de 'd'-toets is ingedrukt (rechts bewegen)
  if (keys.d.pressed) {
    player.SwitchSprite("Run"); // Verander de sprite van de speler naar 'Run'
    player.velocity.x = 0.9; // Zet de horizontale snelheid van de speler op 1 (rechts)
    player.lastDirection = "right"; // Onthoud de laatste richting (rechts)
    player.shouldPanCameraToTheLeft({ canvas, camera });
  }
  // Controleer of de 'a'-toets is ingedrukt (links bewegen)
  else if (keys.a.pressed) {
    player.SwitchSprite("RunLeft"); // Verander de sprite van de speler naar 'RunLeft'
    player.velocity.x = -0.9; // Zet de horizontale snelheid van de speler op -1 (links)
    player.lastDirection = "left"; // Onthoud de laatste richting (links)
    player.shouldPanCameraToTheRight({ canvas, camera });
  }
  // Controleer of de speler zich op de grond bevindt en niet beweegt in de horizontale richting
  else if (player.velocity.y === 0) {
    // Controleer de laatste richting van de speler en verander de sprite dienovereenkomstig
    if (player.lastDirection === "right") player.SwitchSprite("Idle");
    else player.SwitchSprite("IdleLeft");
  }

  // Controleer of de speler omhoog springt
  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    // Controleer de laatste richting van de speler en verander de sprite dienovereenkomstig
    if (player.lastDirection === "right") player.SwitchSprite("Jump");
    else player.SwitchSprite("JumpLeft");
  }
  // Controleer of de speler naar beneden valt
  else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas });
    // Controleer de laatste richting van de speler en verander de sprite dienovereenkomstig
    if (player.lastDirection === "right") player.SwitchSprite("Fall");
    else player.SwitchSprite("FallLeft");
  }

  checkCoinCollision(); // Controleer coin collision
  coins.forEach((coin) => {
    coin.draw();
  });

  updateScore(); // Werk de score bij

  c.restore(); // Gebruik c.restore() om de staat van het canvas te herstellen
}

animate();

// Event listener voor toetsenbordbediening
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      if (player.velocity.y === 0) {
        // Toestaan van springen alleen wanneer de speler een collision block of platform raakt en wanneer velocity.y gelijk is aan 0
        player.velocity.y = -3.5;
      }
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});

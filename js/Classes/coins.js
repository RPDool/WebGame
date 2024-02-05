const coins = []; // Array om muntobjecten op te slaan

class Coin {
  constructor(position) {
    this.position = position; // Positie van de munt
    this.radius = 8; // Straal van de munt (voor de cirkel)
    this.isCollected = false; // Status van de munt (verzameld of niet)
  }

  draw() {
    // Tekent de munt op het canvas als deze nog niet is verzameld
    if (!this.isCollected) {
      c.fillStyle = 'gold'; // Kleur van de munt
      c.beginPath(); // Begin een nieuw pad voor het tekenen van de munt
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // Tekent een cirkel (munt)
      c.fill(); // Vul de cirkel met de opgegeven kleur
    }
  }
}

// Functie om te controleren op botsingen tussen speler en munten
const pickupRange = 3; // Afstand waarbinnen een munt kan worden opgepikt (aangepast)

function checkCoinCollision() {
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    // Controleert of de speler binnen het bereik van een munt is en de munt nog niet is verzameld
    if (!coin.isCollected &&
      player.position.x < coin.position.x + pickupRange &&
      player.position.x + player.width > coin.position.x - pickupRange &&
      player.position.y < coin.position.y + pickupRange &&
      player.position.y + player.height > coin.position.y - pickupRange) {
      coin.isCollected = true; // Markeer de munt als verzameld
      score++; // Verhoog de score wanneer een munt wordt verzameld
      if (score === 5) { // Controleer of alle munten zijn verzameld
        clearInterval(timerInterval); // Stop de timer wanneer alle munten zijn verzameld
      }
    }
  }
}

// Functie om 5 nieuwe munten op willekeurige posities te maken
function createCoins() {
  for (let i = 0; i < 5; i++) {
    const coinX = Math.random() * canvas.width; // X-positie van de munt
    const coinY = Math.random() * (300) + 100; // Y-positie van de munt (aangepast bereik om ervoor te zorgen dat max. y-niveau 400 is)
    // console.log("Coin Y:", coinY);
    const newCoin = new Coin({ x: coinX, y: coinY }); // Maak een nieuw muntobject
    coins.push(newCoin); // Voeg het nieuwe muntobject toe aan de array van munten
  }
}

let score = 0; // Initialiseer de score
const scoreElement = document.getElementById('score'); // Haal het score-element op uit de HTML
const timerElement = document.getElementById('timer'); // Haal het timer-element op uit de HTML
let timerInterval; // Variabele om het timerinterval vast te houden
let time = 0; // Timer variabele

function updateScore() {
    scoreElement.textContent = `Score: ${score}`; // Werk de inhoud van het score-element bij
}

function updateTimer() {
  time++;
  timerElement.textContent = `Time: ${time}s`; // Werk de inhoud van het timer-element bij
}

// Start de timer wanneer de pagina wordt geladen
timerInterval = setInterval(updateTimer, 1000);

// Roep de createCoin-functie aan om aanvankelijk munten te maken
createCoins();

// Update functie om checkCoinCollision aan te roepen en munten te tekenen
function update() {
  // Andere update logica...
  checkCoinCollision(); // Controleer op muntbotsingen
  coins.forEach(coin => {
      coin.draw(); // Teken alle munten op het canvas
  });
  updateScore(); // Werk de scoreweergave bij
}

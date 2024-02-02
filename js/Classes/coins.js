const coins = []; // Array to store coin objects

class Coin {
  constructor(position) {
    this.position = position;
    this.radius = 8; // Adjust radius as needed
    this.isCollected = false;
  }

  draw() {
    if (!this.isCollected) {
      c.fillStyle = 'gold';
      c.beginPath();
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      c.fill();
    }
  }
}

// Function to check collision between player and coins
const pickupRange = 3; // Adjust pickup range as needed

function checkCoinCollision() {
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    if (!coin.isCollected &&
      player.position.x < coin.position.x + pickupRange &&
      player.position.x + player.width > coin.position.x - pickupRange &&
      player.position.y < coin.position.y + pickupRange &&
      player.position.y + player.height > coin.position.y - pickupRange) {
      coin.isCollected = true;
      score++; // Increase score when a coin is collected
      if (score === 5) { // Check if all coins are collected
        clearInterval(timerInterval); // Stop the timer when all coins are collected
      }
      // Perform any actions when coin is collected
    }
  }
}

// Function to create 5 new coins at random positions
function createCoins() {
  for (let i = 0; i < 5; i++) {
    const coinX = Math.random() * canvas.width;
    const coinY = Math.random() * (300) + 100; // Adjusted range to ensure max y-level of 400
    console.log("Coin Y:", coinY); // Add this line for debugging
    const newCoin = new Coin({ x: coinX, y: coinY });
    coins.push(newCoin);
  }
}

let score = 0; // Initialize score
const scoreElement = document.getElementById('score'); // Get the score element
const timerElement = document.getElementById('timer'); // Get the timer element
let timerInterval; // Variable to hold the timer interval
let time = 0; // Timer variable

function updateScore() {
    scoreElement.textContent = `Score: ${score}`; // Update the score element content
}

function updateTimer() {
  time++;
  timerElement.textContent = `Time: ${time}s`; // Update the timer element content
}

// Start the timer when the page loads
timerInterval = setInterval(updateTimer, 1000);

// Call createCoin function to initially create coins
createCoins();

// Update function to call checkCoinCollision and draw coins
function update() {
  // Other update logic...
  checkCoinCollision();
  coins.forEach(coin => {
      coin.draw();
  });
  updateScore(); // Update the score display
}

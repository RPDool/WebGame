// makes a class for collision blocks
class CollisionBlock {
  // Constructor method to initialize the object
  constructor({ position, height = 16 }) {
    // Set initial properties based on input parameters
    this.position = position; // Position of the collision block
    this.width = 16; // Default width of the collision block
    this.height = height; // Height of the collision block (default: 16)
  }

  // Method to draw the collision block on the canvas
  draw() {
    // Set the fill style (color and transparency) for the collision block
    c.fillStyle = "rgba(255, 0, 0, 0.5)";
    // Draw a filled rectangle representing the collision block on the canvas
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  // Method to update the collision block (currently, it just draws the block)
  update() {
    // Call the draw method to render the collision block on the canvas
    this.draw();
  }
}

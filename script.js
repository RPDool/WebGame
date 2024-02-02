const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024 // the width of the canvas
canvas.height = 576 // the height of the canvas

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
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
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlock = []
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlock.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4
        })
      )
    }
  })
})

const gravity = 0.09

const player = new Player({
    position: {
    x: 100,
    y: 300,
    },
    collisionBlocks,
    platformCollisionBlocks: platformCollisionBlock, 
    imageSrc: 'img/warrior/warrior/Idle.png',
    frameRate: 8, // idk of het 1 is
    animations: {
      Idle: {
        imageSrc: 'img/warrior/warrior/Idle.png',
        frameRate: 8, // idk of het 1 is
        frameBuffer: 8,
      },
      Run: {
        imageSrc: 'img/warrior/warrior/Run.png',
        frameRate: 8,
        frameBuffer: 7,
      },
      Jump: {
        imageSrc: 'img/warrior/warrior/Jump.png',
        frameRate: 2,
        frameBuffer: 3,
      },
      Fall: {
        imageSrc: 'img/warrior/warrior/Fall.png',
        frameRate: 2,
        frameBuffer: 3,
      },
      FallLeft: {
        imageSrc: 'img/warrior/warrior/FallLeft.png',
        frameRate: 2,
        frameBuffer: 3,
      },
      RunLeft: {
        imageSrc: 'img/warrior/warrior/RunLeft.png',
        frameRate: 8,
        frameBuffer: 7,
      },
      IdleLeft: {
        imageSrc: 'img/warrior/warrior/IdleLeft.png',
        frameRate: 8,
        frameBuffer: 7,
      },
      JumpLeft: {
        imageSrc: 'img/warrior/warrior/JumpLeft.png',
        frameRate: 2,
        frameBuffer: 3,
      },
    }
})

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: 'img/background.png',
})
 
const backgroundImageHeight = 432
    // De 432 is de hoogte van de background image

    const camera = {
      position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
      },
    }
  
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save() // Use c.save() to save the current canvas state
    c.scale(4, 4) // scale the image by 4
    c.translate(camera.position.x, camera.position.y)
    background.update()
    // collisionBlocks.forEach(collisionBlock => {
    //     collisionBlock.update()
    // })

    // platformCollisionBlock.forEach(block => {
    //     block.update()
    // })

    player.checkForHorizontalCanvasCollision()
    player.update()

    player.velocity.x = 0
    if (keys.d.pressed) {
      player.SwitchSprite('Run')
      player.velocity.x = 1
      player.lastDirection = 'right'
      player.shouldPanCameraToTheLeft({ canvas, camera })

    } else if (keys.a.pressed) { 
      player.SwitchSprite('RunLeft')
      player.velocity.x = -1
      player.lastDirection = 'left'
      player.shouldPanCameraToTheRight({ canvas, camera })
    } else if (player.velocity.y === 0){
      if (player.lastDirection === 'right') player.SwitchSprite('Idle')
      else player.SwitchSprite('IdleLeft')
    }

    if (player.velocity.y < 0) {
      player.shouldPanCameraDown ({ camera, canvas })
      if (player.lastDirection === 'right') player.SwitchSprite('Jump');
      else player.SwitchSprite('JumpLeft')
    }else if (player.velocity.y > 0) { 
      player.shouldPanCameraUp({ camera, canvas})
      if (player.lastDirection === 'right') player.SwitchSprite('Fall');
      else player.SwitchSprite('FallLeft')
    }
    
    checkCoinCollision(); // Call checkCoinCollision here
    coins.forEach(coin => {
        coin.draw();
    });

    updateScore(); // Update and display the score

    c.restore() // Use c.restore() to restore the canvas state

    
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      break;
    case 'a':
      keys.a.pressed = true;
      break;
    case 'w':
      if (player.velocity.y === 0) {
        // Allowing jump only when touching a collision block or platform and when velocity.y is 0 (player is on the ground)
        player.velocity.y = -3.5;
      }
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
      
  }
})


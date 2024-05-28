let frames = 0

const audio = new Audio()
audio.src = "./hits/hit.wav"

const sprites = new Image()
sprites.src = "./sprites.png"

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const gameBackground = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = "#70c5ce"
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.drawImage(
      sprites,
      gameBackground.spriteX, gameBackground.spriteY,
      gameBackground.width, gameBackground.height,
      gameBackground.x, gameBackground.y,
      gameBackground.width, gameBackground.height,
    )

    context.drawImage(
      sprites,
      gameBackground.spriteX, gameBackground.spriteY,
      gameBackground.width, gameBackground.height,
      (gameBackground.x + gameBackground.width), gameBackground.y,
      gameBackground.width, gameBackground.height,
    )
  }
}

function gameFloor() {
  const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      const moveFloor = 1
      const repeat = floor.width / 2
      const mov = floor.x - moveFloor

      // console.log('[floor.x]', floor.x)
      // console.log('[repeat]',repeat)
      // console.log('[mov]', mov % repeat)

      floor.x = mov % repeat
    },
    draw() {
      context.drawImage(
        sprites,
        floor.spriteX, floor.spriteY,
        floor.width, floor.height,
        floor.x, floor.y,
        floor.width, floor.height,
      )

      context.drawImage(
        sprites,
        floor.spriteX, floor.spriteY,
        floor.width, floor.height,
        (floor.x + floor.width), floor.y,
        floor.width, floor.height,
      )
    }
  }

  return floor
}

function colision(flappyBird, floor) {
  const flappyBirdY = flappyBird.y + flappyBird.height
  const floorY = floor.y

  if (flappyBirdY >= floorY) {
    return true
  }

  return false
}

function createFlappy() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    jump: 4.6,
    toJump() {
      flappyBird.speed = - flappyBird.jump
    },
    gravity: 0.25,
    speed: 0,
    update() {
      if (colision(flappyBird, globais.floor)) {
        audio.play()

        changeScreen(screens.GAME_OVER)
        return
      }

      flappyBird.speed = flappyBird.speed + flappyBird.gravity
      flappyBird.y = flappyBird.y + flappyBird.speed
    },
    movements: [
      { spriteX: 0, spriteY: 0, }, 
      { spriteX: 0, spriteY: 26, }, 
      { spriteX: 0, spriteY: 52, }, 
      { spriteX: 0, spriteY: 26, }
    ],
    currentFrame: 0,
    updateCurrentFrame() {
      const intervalFrames = 10
      const intervalLimit = frames % intervalFrames === 0

      if (intervalLimit) {
        const incrementBase = 1
        const increment = incrementBase + flappyBird.currentFrame
        
        const repeatBase = flappyBird.movements.length
        flappyBird.currentFrame = increment % repeatBase
      }
    },
    draw() {
      flappyBird.updateCurrentFrame()
      const { spriteX, spriteY } = flappyBird.movements[flappyBird.currentFrame]

      context.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.width, flappyBird.height,
        flappyBird.x, flappyBird.y,
        flappyBird.width, flappyBird.height,
      )
    }
  }
  return flappyBird
}

const getReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      getReady.sX, getReady.sY,
      getReady.w, getReady.h,
      getReady.x, getReady.y,
      getReady.w, getReady.h
    )
  }
}

const gameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      gameOver.sX, gameOver.sY,
      gameOver.w, gameOver.h,
      gameOver.x, gameOver.y,
      gameOver.w, gameOver.h
    )
  }
}

function createPipes() {
  const pipes = {
    width: 52,
    height: 400,
    floor: {
      spriteX: 0,
      spriteY: 169,
    },
    sky: {
      spriteX: 52,
      spriteY: 169,
    },
    space: 80,
    draw() {
      pipes.pairs.forEach(function (pair) {
        const yRandom = pair.y
        const spacePipes = 90

        const pipeX = pair.x
        const pipeY = yRandom

        context.drawImage(
          sprites,
          pipes.sky.spriteX, pipes.sky.spriteY,
          pipes.width, pipes.height,
          pipeX, pipeY,
          pipes.width, pipes.height,
        )

        const pipeFloorX = pair.x
        const pipeFloorY = pipes.height + spacePipes + yRandom

        context.drawImage(
          sprites,
          pipes.floor.spriteX, pipes.floor.spriteY,
          pipes.width, pipes.height,
          pipeFloorX, pipeFloorY,
          pipes.width, pipes.height,
        )

        pair.pipeSky = {
          x: pipeX,
          y: pipes.height + pipeY
        }

        pair.canofloor = {
          x: pipeFloorX,
          y: pipeFloorY
        }
      })
    },
    hasCollisionFlappyBird(pair) {
      const flappyHead = globais.flappyBird.y
      const flappyFeet = globais.flappyBird.y + globais.flappyBird.height

      if ((globais.flappyBird.x + globais.flappyBird.width) >= pair.x) {
        if (flappyHead <= pair.pipeSky.y) {
          return true
        }

        if (flappyFeet >= pair.canofloor.y) {
          return true
        }
      }
      return false
    },
    pairs: [],
    update() {
      const passed100Frames = frames % 100 === 0

      if (passed100Frames) {
        pipes.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        })
      }

      pipes.pairs.forEach(function (par) {
        par.x = par.x - 2

        if (pipes.hasCollisionFlappyBird(par)) {
          audio.play()
          changeScreen(screens.GAME_OVER)
        }

        if (par.x + pipes.width <= 0) {
          pipes.pairs.shift()
        }
      })
    }
  }

  return pipes
}

function createScoreBoard() {
  const score = {
    punctuation: 0,
    draw() {
      context.font = '35px "VT323"'
      context.textAlign = 'right'
      context.fillStyle = 'white'
      context.fillText(`${score.punctuation}`, canvas.width - 10, 35)
    },
    update() {
      const intervalFrames = 20
      const intervalLimit = frames % intervalFrames === 0

      if (intervalLimit) {
        score.punctuation = score.punctuation + 1
      }
    }
  }

  return score
}

const globais = {}
let activeScreen = {}

function changeScreen(newScreen) {
  activeScreen = newScreen

  if (activeScreen.initialize) {
    activeScreen.initialize()
  }
}

const screens = {
  START: {
    initialize() {
      globais.flappyBird = createFlappy()
      globais.floor = gameFloor()
      globais.pipes = createPipes()
    },
    draw() {
      gameBackground.draw()
      globais.flappyBird.draw()

      globais.floor.draw()
      getReady.draw()
    },
    click() {
      changeScreen(screens.GAME)
    },
    space() {
      changeScreen(screens.GAME)
    },
    update() {
      globais.floor.update()
    }
  }
}

screens.GAME = {
  initialize() {
    globais.score = createScoreBoard()
  },
  draw() {
    gameBackground.draw()
    globais.pipes.draw()
    globais.floor.draw()
    globais.flappyBird.draw()
    globais.score.draw()
  },
  click() {
    globais.flappyBird.toJump()
  },
  space() {
    globais.flappyBird.toJump()
  },
  update() {
    globais.pipes.update()
    globais.floor.update()
    globais.flappyBird.update()
    globais.score.update()
  }
}

screens.GAME_OVER = {
  draw() {
    gameOver.draw()
  },
  update() {

  },
  click() {
    changeScreen(screens.START)
  },
  space() {
    changeScreen(screens.START)
  }
}

function loop() {
  activeScreen.draw()
  activeScreen.update()

  frames = frames + 1
  requestAnimationFrame(loop)
}

window.addEventListener("keydown", function (event) {
  if (activeScreen.space) {
    activeScreen.space()
  }
})

window.addEventListener("click", function () {
  if (activeScreen.click) {
    activeScreen.click()
  }
})

changeScreen(screens.START)
loop()
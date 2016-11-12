define('userInput', [], function() {

  const buttonValues = {
    0: {
      buttons: {
        0: {pressed: false},
        1: {pressed: false},
        2: {pressed: false},
        3: {pressed: false},
        4: {pressed: false},
        5: {pressed: false},
        6: {pressed: false},
        7: {pressed: false},
        8: {pressed: false},
        9: {pressed: false},
        10: {pressed: false},
        11: {pressed: false},
        12: {pressed: false},
        13: {pressed: false},
        14: {pressed: false},
        15: {pressed: false},
      },
      axes: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
      }
    }
  }

  let isLeft = false
  let isRight = false
  let isDown = false
  let isUp = false

  window.addEventListener('keydown', function (e) {
    let isLeftJustPressed = false
    let isRightJustPressed = false
    let isUpJustPressed = false
    let isDownJustPressed = false

    switch(e.keyCode) {
      case 37: // left
        isLeftJustPressed = true
        isLeft = true
        e.preventDefault()
      break
      case 38: // up
        isUpJustPressed = true
        isUp = true
        e.preventDefault()
      break
      case 39: // right
        isRightJustPressed = true
        isRight = true
        e.preventDefault()
      break
      case 40: // down
        isDownJustPressed = true
        isDown = true
        e.preventDefault()
      break
      case 90: // z (pad button A)
        buttonValues[0].buttons[0].pressed = true
        e.preventDefault()
      break
    }

    if (isLeftJustPressed) {
      buttonValues[0].axes[0] = -1;
    } else if (isRightJustPressed) {
      buttonValues[0].axes[0] = 1;
    }

    if (isUpJustPressed) {
      buttonValues[0].axes[1] = -1;
    } else if (isDownJustPressed) {
      buttonValues[0].axes[1] = 1;
    }

  })
  window.addEventListener('keyup', function(e) {
    let isLeftJustReleased = false
    let isRightJustReleased = false
    let isUpJustReleased = false
    let isDownJustReleased = false

    switch(e.keyCode) {
        case 37: // left
          isLeft = false
          isLeftJustReleased = true
            e.preventDefault()
          break
          case 38: // up
            isUp = false
            isUpJustReleased = true
            e.preventDefault()
          break
          case 39: // right
            isRight = false
            isRightJustReleased = true
            e.preventDefault()
          break
          case 40: // down
            isDown = false
            isDownJustReleased = true
            e.preventDefault()
          break
          case 90: // z (pad button A)
            buttonValues[0].buttons[0].pressed = false
            e.preventDefault()
          break
    }

    if (isLeftJustReleased && isRight) {
      buttonValues[0].axes[0] = 1;
    } else if (isLeftJustReleased && !isRight) {
      buttonValues[0].axes[0] = 0;
    }

    if (isRightJustReleased && isLeft) {
      buttonValues[0].axes[0] = -1;
    } else if (isRightJustReleased && !isLeft) {
      buttonValues[0].axes[0] = 0;
    }

    if (isUpJustReleased && isDown) {
      buttonValues[0].axes[1] = 1;
    } else if (isUpJustReleased && !isDown) {
      buttonValues[0].axes[1] = 0;
    }

    if (isDownJustReleased && isUp) {
      buttonValues[0].axes[1] = -1;
    } else if (isDownJustReleased && !isUp) {
      buttonValues[0].axes[1] = 0;
    }
  })
  window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length)
  })

  return {
    getInput: function(playerIndex) {
      return navigator.getGamepads()[0] || buttonValues[playerIndex]
    }
  }
})
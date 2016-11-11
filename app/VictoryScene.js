define('app/VictoryScene', [
  'Ob',
  'userInput',
], function (
  Ob,
  userInput
) {
  return {
    name: 'VictoryScene',
    create: function (params) {
      this.keyblocker = 100;
      this.win = params.win;
      this.playSound = params.playSound;
      this.playSound('gameMusic', true, true);
      if (this.win) {
        this.playSound('victoryMusic')
      } else {
        this.playSound('gameOverMusic')
      }
    },
    update: function() {
      this.keyblocker -= 1;
      const pad = userInput.getInput(0)

      if (this.win) return;
      if (this.keyblocker > 0) return;

      if (pad.buttons[2].pressed || Math.abs(pad.axes[0]) > 0 || Math.abs(pad.axes[1]) > 0) {
        this.playSound('gameOverMusic', true, true)
        this.sceneManager.changeScene('GameScene', this.playSound)
      }
    },
    draw: function(context) {
      context.fillStyle = "black";
      context.fillRect(0,0,canvas.width, canvas.height);

      context.font= "30px Verdana";
      context.fillStyle="white";
      var text = (this.win) ? "VICTORY" : "GAME OVER";
      context.fillText(text,145,100);

    },
  }
})
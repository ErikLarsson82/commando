define('app/VictoryScene', [
  'Ob'
], function (
  Ob
) {
  return {
    name: 'VictoryScene',
    create: function (params) {
      this.win = params.win;
    },
    update: function() {

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
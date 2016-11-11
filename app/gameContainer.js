requirejs.config({
    waitSeconds: '60',
    baseUrl: 'lib',
    paths: {
      'app': '../app',
      'GameLoop': '../node_modules/gameloop-schwein/GameLoop',
      'SpriteSheet': '../node_modules/spritesheet-canvas/SpriteSheet'
    }
});

requirejs([
  'app/game',
  'GameLoop',
  'SpriteSheet',
], function (game, GameLoop, SpriteSheet) {

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    game.init();

    var config = {
        callback: function(delta) { game.tick(delta); game.draw(context, canvas); },
        fpsMode: 'fixed',
        fps: 60,
        autoStart: true,
        createDebugKeyBoardShortcuts: true
    }

    var gameLoop = new GameLoop(config);
})
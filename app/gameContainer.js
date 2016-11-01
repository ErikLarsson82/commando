requirejs.config({
    waitSeconds: '60',
    baseUrl: 'lib',
    paths: {
      'app': '../app',
      'GameLoop': './node_modules/GameLoop/GameLoop'
    }
});

requirejs([
  'app/game',
  'GameLoop'
], function (game) {

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var config = {
        callback: function(delta) { game.tick(delta); game.draw(context, canvas); },
        fpsMode: 'screenHz',
        fps: 144,
        autoStart: true,
        createDebugKeyBoardShortcuts: true
    }

    var gameLoop = new GameLoop(config);
})
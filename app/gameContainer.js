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
  'app/VictoryScene',
  'GameLoop',
  'SpriteSheet',
  'Ob',
], function (game, VictoryScene, GameLoop, SpriteSheet, Ob) {

    const sceneManager = new Ob.SceneManager()

    sceneManager.setScenes([
      new Ob.Scene(game),
      new Ob.Scene(VictoryScene),
      ])

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    sceneManager.changeScene('GameScene')

    var config = {
        callback: function(delta) {
          sceneManager.update(delta);
          sceneManager.draw(context, canvas);
        },
        fpsMode: 'fixed',
        fps: 60,
        autoStart: true,
        createDebugKeyBoardShortcuts: true
    }

    var gameLoop = new GameLoop(config);
})

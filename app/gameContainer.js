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


    const gameMusic = new Audio('assets/sounds/House_song_2016_05_02.ogg')
    gameMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    const victoryMusic = new Audio('assets/sounds/Lewl.ogg')
    victoryMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    const gameOverMusic = new Audio('assets/sounds/death.ogg')

    const sfxs = {
      gameMusic: gameMusic,
      victoryMusic: victoryMusic,
      gameOverMusic: gameOverMusic,
    }

    var muted = !false;
    window.addEventListener("keydown", function(e) {
      if (e.keyCode === 77) { // M - mute
        muted = !muted
        if (muted) {
          gameMusic.pause()
          victoryMusic.pause();
          gameOverMusic.pause();
        } else {
          gameMusic.play()
        }
      }
    })
    function playSound(soundString, shouldPause, reset) {
      if (reset) {
        sfxs[soundString].currentTime = 0;
      }
      if (!muted) {
        if (shouldPause) {
          sfxs[soundString].pause()
        } else {
          sfxs[soundString].play()
        }
      }
    }

    sceneManager.changeScene('GameScene', playSound)

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

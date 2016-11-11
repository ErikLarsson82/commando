define('app/images', ['SpriteSheet'], function(SpriteSheet) {
  var player = new Image();
  player.src = "./assets/images/player_placeholder.png";

  var wall_side = new Image();
  wall_side.src = "./assets/images/wall_side.png";

  var wall_top = new Image();
  wall_top.src = "./assets/images/wall_top.png";

  var wall_side_breakable = new Image();
  wall_side_breakable.src = "./assets/images/wall_side_breakable.png";

  var wall_top_breakable = new Image();
  wall_top_breakable.src = "./assets/images/wall_top_breakable.png";

  var player_side = new Image();
  player_side.src = "./assets/images/player_side.png";

  var player_walking = SpriteSheet.new(player_side, {
    frames: [60, 60, 60],
    x: 0,
    y: 0,
    width: 64,
    height: 128,
    restart: true,
  });

  var enemy = new Image();
  enemy.src = "./assets/images/enemy.png";

  var bullet = new Image();
  bullet.src = "./assets/images/bullet.png";

  var bullet_hit = new Image();
  bullet_hit.src = "./assets/images/bullet_hit.png";

  var stones001 = new Image();
  stones001.src = "./assets/images/stones001.png";

  var stones002 = new Image();
  stones002.src = "./assets/images/stones002.png";

  var grass001 = new Image();
  grass001.src = "./assets/images/grass001.png";

  var victory = new Image();
  victory.src = "./assets/images/victory.png";

  var defeat = new Image();
  defeat.src = "./assets/images/defeat.png";

  var explosion = new Image();
  explosion.src = "./assets/images/explosion.png";

  return {
    player: player,
    wall_side: wall_side,
    wall_top: wall_top,
    player_walking: player_walking,
    bullet: bullet,
    enemy: enemy,
    bullet_hit: bullet_hit,
    stones001: stones001,
    stones002: stones002,
    grass001: grass001,
    victory: victory,
    defeat: defeat,
    explosion: explosion,
  }
})
define('app/images', ['SpriteSheet'], function(SpriteSheet) {
  var player = new Image();
  player.src = "./assets/images/player_placeholder.png";

  var wall_side = new Image();
  wall_side.src = "./assets/images/wall_side.png";

  var wall_top = new Image();
  wall_top.src = "./assets/images/wall_top.png";

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

  return {
    player: player,
    wall_side: wall_side,
    wall_top: wall_top,
    player_walking: player_walking,
    bullet: bullet,
    enemy: enemy,
    bullet_hit: bullet_hit,
  }
})
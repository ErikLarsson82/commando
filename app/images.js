define('app/images', ['SpriteSheet'], function(SpriteSheet) {
  var player = new Image();
  player.src = "./assets/images/player_placeholder.png";

  /*var walk_animation_sprite = new Image();
  walk_animation_sprite.src = "./assets/images/walk_animation.png";

  var walk_animation = SpriteSheet.new(walk_animation_sprite, {
    frames: [200, 200, 200],
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    restart: true,
    autoPlay: true,
  });*/

  return {
    player: player,
  }
})
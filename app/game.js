define('app/game', [
    'underscore',
    'userInput',
    'utils',
    'app/images',
    'Krocka',
], function (
    _,
    userInput,
    utils,
    images,
    Krocka
) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    let gameObjects = [];

    class GameObject extends Krocka.AABB {
        constructor(config) {
            super(config.width, config.height);
            this.markedForRemoval = false;
            this.isDetectable = true;
        }
        tick() {

        }
        draw() {
            context.fillStyle = "red";
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
        destroy() {
            this.markedForRemoval = true;
        }
    }

    class PlayerBullet extends GameObject {
        constructor(config) {
            super(config)
            this.speed = 4;
            this.direction = config.direction;
        }
        tick() {
            this.setVelocityXY(this.direction.x * this.speed,this.direction.y * this.speed)
        }
        draw() {
            context.fillStyle = "red";
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    class Player extends GameObject {
        constructor(config) {
            super(config)
            this.speed = 3;
            this.direction = { x: 0, y: 0 }
            this.recharge = 0;
        }
        tick() {
            const pad = userInput.getInput(0)

            var velocity = {
                x: 0,
                y: 0
            }
            velocity.x = velocity.x + (pad.axes[0] * this.speed);
            velocity.y = velocity.y + (pad.axes[1] * this.speed);

            if (!(velocity.x === 0 && velocity.y === 0))
                this.direction = velocity;

            this.setVelocityXY(velocity.x,velocity.y)

            if (pad.buttons[2].pressed && this.recharge === 0) {
                this.recharge = 10;
                var playerBullet = new PlayerBullet({
                    direction: _.clone(this.direction),
                    width: 20,
                    height: 20
                });
                playerBullet.setPositionXY(this.position.x + this.width/2 - 10, this.position.y + this.height/2 - 10);
                playerBullet.setVelocityXY(0, 0)
                gameObjects.push(playerBullet)
            } else if (this.recharge > 0) {
                this.recharge = this.recharge - 1;
            }
        }
        draw() {
            context.drawImage(images.player, this.position.x, this.position.y);
        }
    }

    class Enemy extends GameObject {
        constructor(config) {
            super(config)
        }
        tick() {
            this.setVelocityXY(0,0)
        }
        draw() {
            //super.draw()
            context.drawImage(images.player, this.position.x, this.position.y);
        }
    }

    return {
        init: function() {
            var player = new Player({
                width: 64,
                height: 128
            });
            player.setPositionXY(50, 50);
            gameObjects.push(player);

            var enemy = new Enemy({
                width: 64,
                height: 128
            });
            enemy.setPositionXY(200, 50);
            gameObjects.push(enemy);
        },
        tick: function() {
            _.each(gameObjects, function(gameObject) {
                gameObject.tick();
            });

            gameObjects.forEach(function (gameObject) {

                gameObject.position.add(gameObject.velocity)

                // reset velocity
                gameObject.velocity.setXY(0, 0)
            })

            Krocka.run({
                objects: gameObjects,
                detector: function (gameObject, other) {
                  /*var filter = [[Player, Enemy]];
                  var ignore = _.filter(filter, function(pair) {
                     return (gameObject instanceof pair[0] && other instanceof pair[1] ||
                        gameObject instanceof pair[1] && other instanceof pair[0])
                  })
                  if (ignore.length > 1) return false;*/
                  if (!other.markedForRemoval && !gameObject.markedForRemoval) {
                    return Krocka.detectAABBtoAABB(gameObject, other)
                  }
                  return false
                },
                resolver: function (collision) {

                  collision.resolveByType(PlayerBullet, Enemy, function (playerBullet, enemy) {
                    playerBullet.destroy();
                    enemy.destroy();
                  })

                },
              })

            gameObjects = _.filter(gameObjects, function(gameObject) {
                return (!gameObject.markedForRemoval)
            });
        },
        draw: function() {
            context.fillStyle = "white";
            context.fillRect(0,0,canvas.width, canvas.height);

            _.each(gameObjects, function(gameObject) {
                gameObject.draw();
            });
        }
    }
});
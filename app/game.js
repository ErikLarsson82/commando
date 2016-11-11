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

    class Player extends GameObject {
        constructor(config) {
            super(config)
        }
        tick() {
            this.setVelocityXY(1,0)
        }
        draw() {
            //super.draw()
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
                  if (!other.markedForRemoval && !gameObject.markedForRemoval) {
                    return Krocka.detectAABBtoAABB(gameObject, other)
                  }
                  return false
                },
                resolver: function (collision) {

                  collision.resolveByType(Player, Enemy, function (player, enemy) {
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
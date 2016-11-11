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

    class GameObject {
        constructor(config) {
            this.game = config.game;
            this.color = config.color || "#444444";
        }
        tick() {}
        draw() {}
    }

    class PhysicsObject extends Krocka.AABB {
        constructor(config) {
            super(config);
            //this.game = config.game;
        }
        tick() {

        }
        draw() {
            context.fillStyle = this.color;
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    class Player extends PhysicsObject {
        constructor(config) {
            super(config)
        }
        tick() {
            this.x = this.x + 1;
        }
        draw() {
            context.drawImage(images.player, this.position.x, this.position.y);
        }
    }

    class Enemy extends PhysicsObject {
        constructor(config) {
            super(config)
        }
        tick() {

        }
        draw() {
            context.drawImage(images.player, this.position.x, this.position.y);
        }
    }

    return {
        init: function() {
            var player = new Player();
            player.setPositionXY(50, 50);
            gameObjects.push(player);

            var enemy = new Enemy();
            enemy.setPositionXY(100, 50);
            gameObjects.push(enemy);
        },
        tick: function() {
            _.each(gameObjects, function(gameObject) {
                gameObject.tick();
            });

            var physicsObjects = _.filter(gameObjects, function(gameObject) {
                return (gameObject.x && gameObject.y && gameObject.width && gameObject.height)
            })

            Krocka.run({
                objects: physicsObjects,
                detector: function (gameObject, other) {
                  if (!other.markedForRemoval && !gameObject.markedForRemoval) {
                    return Krocka.detectAABBtoAABB(gameObject, other)
                  }
                  return false
                },
                resolver: function (collision) {

                  collision.resolveByType(Player, Enemy, function (player, enemy) {
                    console.log('collision');
                  })

                },
              })
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
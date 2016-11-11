define('app/game', [
    'underscore',
    'userInput',
    'utils',
    'app/images',
    'Krocka',
    'app/map',
], function (
    _,
    userInput,
    utils,
    images,
    Krocka,
    map
) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var TILE_SIZE = 64;

    let gameObjects = [];
    var player;
    var scroller;

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

    class Scroller extends GameObject {
        constructor(scrollAmount) {
            super({width: 0, height: 0})
            this.setVelocityXY(0,0)
            this.setPositionXY(0,0)
            this.isDetectable = false;
            this.scrollAmount = scrollAmount;
        }
        tick() {
            if (player.position.y < this.scrollAmount + 500) {
                this.scrollAmount = player.position.y - 500;
                if (this.scrollAmount < 0) this.scrollAmount = 0;
            }
        }
        draw() {}
        getScreenOffset() {
            return this.scrollAmount;
        }
    }

    class Tile extends GameObject {
        constructor(config) {
            super(config)
            this.setVelocityXY(0, 0)
        }
    }

    class PlayerBullet extends GameObject {
        constructor(config) {
            super(config)
            this.speed = 4;
            this.direction = config.direction;
            this.duration = 22;
        }
        tick() {
            this.duration--;
            this.setVelocityXY(this.direction.x * this.speed,this.direction.y * this.speed)
            if (this.duration < 0) {
                this.destroy();
                var playerBulletExplosion = new PlayerBulletExplosion({
                    width: 20,
                    height: 20
                });
                playerBulletExplosion.setPositionXY(this.position.x + this.width/2 - 10, this.position.y + this.height/2 - 10);
                playerBulletExplosion.setVelocityXY(0, 0)
                gameObjects.push(playerBulletExplosion)
            }
        }
        draw() {
            context.fillStyle = "red";
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    class PlayerBulletExplosion extends GameObject {
        constructor(config) {
            super(config)
            this.duration = 10;
        }
        tick() {
            this.duration--;
            if (this.duration < 0) {
                this.destroy();
            }
            this.setVelocityXY(0,0)
        }
        draw() {
            context.fillStyle = "blue";
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
            this.speed = config.speed || 2
            this.setVelocityXY(0, 0)
            this.decisionCooldown = config.decisionCooldown || 120
            this.decisionCooldownCounter = 0
        }
        makeDecision() {
            const player = getPlayerObject()
            let str = 'run against'
            let nextAngle = this.position.getAngleBetween(player.position)
            if (player.position.getDistance(this.position) < 280) {
                nextAngle += Math.PI
                str = 'run away'
            }
            // console.log('makeDecision', str, this.position.getDistance(player.position))
            this.velocity.setAngle(nextAngle)
            this.velocity.setMagnitude(this.speed)
        }
        tick() {
            if (this.decisionCooldownCounter <= 0) {
                this.decisionCooldownCounter = this.decisionCooldown
                this.makeDecision()
            } else {
                this.decisionCooldownCounter--
            }
        }
        draw() {
            //super.draw()
            context.drawImage(images.player, this.position.x, this.position.y);
        }
    }

    function loadMap(map) {

        _.each(map, function(row, rowIdx) {
          _.each(row, function(column, colIdx) {
            switch(column) {
              case 1:
                player = new Player({
                    width: TILE_SIZE,
                    height: TILE_SIZE * 2
                });
                player.setPositionXY(colIdx * TILE_SIZE, rowIdx * TILE_SIZE);
                gameObjects.push(player);
              break;
              case 3:
                var enemy = new Enemy({
                    width: TILE_SIZE,
                    height: TILE_SIZE * 2
                });
                enemy.setPositionXY(colIdx * TILE_SIZE, rowIdx * TILE_SIZE);
                gameObjects.push(enemy);
              break;
            }
          })
      })
    }

    function getPlayerObject() {
        return gameObjects.find(function (gameObject) {
            return gameObject instanceof Player
        })
    }

    return {
        init: function() {
            var _map = map.getMap();
            scroller = new Scroller((_map.length * TILE_SIZE) - canvas.height);
            gameObjects.push(scroller);
            loadMap(_map);
        },
        tick: function() {
            _.each(gameObjects, function(gameObject) {
                gameObject.previousPosition = gameObject.position.clone()
                gameObject.tick();
            });

            gameObjects.forEach(function (gameObject) {

                gameObject.position.add(gameObject.velocity)

            })

            function resolveGubbeVsTile(gubbe, tile) {
                if ((gubbe.velocity.x > 0 &&
                    gubbe.previousPosition.x + gubbe.width < tile.position.x) ||
                    (gubbe.velocity.x < 0 &&
                    gubbe.previousPosition.x > tile.position.x + tile.width)) {
                    gubbe.velocity.x = 0
                    gubbe.position = gubbe.previousPosition.clone().setY(gubbe.position.y)
                }
                if ((gubbe.velocity.y > 0 &&
                    gubbe.previousPosition.y + gubbe.height < tile.position.y) ||
                    (gubbe.velocity.y < 0 &&
                    gubbe.previousPosition.y > tile.position.y + tile.height)) {
                    gubbe.velocity.y = 0
                    gubbe.position = gubbe.previousPosition.clone().setX(gubbe.position.x)
                }
            }

            Krocka.run({
                objects: gameObjects,
                detector: function (gameObject, other) {
                  if (!other.markedForRemoval && !gameObject.markedForRemoval) {
                    return Krocka.detectAABBtoAABB(gameObject, other)
                  }
                  return false
                },
                resolver: function (collision) {

                    collision.resolveByType(Player, Tile, resolveGubbeVsTile)
                    collision.resolveByType(Enemy, Tile, resolveGubbeVsTile)

                  collision.resolveByType(PlayerBullet, Enemy, function (playerBullet, enemy) {
                    playerBullet.destroy();
                    enemy.destroy();
                  })

                  collision

                },
            })

            gameObjects = _.filter(gameObjects, function(gameObject) {
                return (!gameObject.markedForRemoval)
            });
        },
        draw: function() {
            context.fillStyle = "white";
            context.fillRect(0,0,canvas.width, canvas.height);

            context.save();
            context.translate(0, -scroller.getScreenOffset());
            _.each(gameObjects, function(gameObject) {
                gameObject.draw();
            });
            context.restore();
        }
    }
});
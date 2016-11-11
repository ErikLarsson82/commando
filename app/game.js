define('app/game', [
    'underscore',
    'userInput',
    'utils',
    'app/images',
    'Krocka',
    'app/map',
    'Ob',
    'SpriteSheet'
], function (
    _,
    userInput,
    utils,
    images,
    Krocka,
    map,
    Ob,
    SpriteSheet
) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var TILE_SIZE = 64;

    let gameObjects = [];
    var player;
    var scroller;
    var winCondition;

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

    class Scroller {
        constructor(scrollAmount) {
            this.scrollAmount = scrollAmount;
        }
        tick() {
            if (player.position.y < this.scrollAmount + 500) {
                this.scrollAmount = player.position.y - 500;
                if (this.scrollAmount < 0) this.scrollAmount = 0;
            }
        }
        getScreenOffset() {
            return this.scrollAmount;
        }
    }

    class WinCondition {
        victory() {
            return (player.position.y + player.height < 0)
        }
    }

    class Tile extends GameObject {
        constructor(config) {
            super(config)
            this.setVelocityXY(0, 0)
        }
        draw() {
            context.drawImage(images.wall_top, this.position.x, this.position.y);
            context.drawImage(images.wall_side, this.position.x, this.position.y + TILE_SIZE);
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
            if (this.duration < 0) {
                this.destroy();
            }
            this.setVelocityXY(this.direction.x * this.speed,this.direction.y * this.speed)
        }
        draw() {
            context.drawImage(images.bullet, this.position.x, this.position.y);
        }
        destroy() {
            super.destroy();
            var playerBulletExplosion = new PlayerBulletExplosion({
                width: 20,
                height: 20
            });
            playerBulletExplosion.setPositionXY(this.position.x + this.width/2 - 10, this.position.y + this.height/2 - 10);
            playerBulletExplosion.setVelocityXY(0, 0)
            gameObjects.push(playerBulletExplosion)
        }
    }

    class PlayerBulletExplosion extends GameObject {
        constructor(config) {
            super(config)
            var parent = this;
            this.bullet = SpriteSheet.new(images.bullet_hit, {
                frames: [120, 120, 120],
                x: 0,
                y: 0,
                width: 64,
                height: 64,
                autoPlay: true,
                callback: function() { parent.destroy() }
            });
        }
        tick() {
            this.bullet.tick(1000/60);
            this.setVelocityXY(0,0)
        }
        draw() {
            context.save()
            context.translate(this.position.x - 23, this.position.y - 32);
            this.bullet.draw(context);
            context.restore();
        }
    }

    class EnemyBullet extends PlayerBullet {
        constructor(config) {
            super(config)
        }
        draw() {
            context.fillStyle = '#FFFF00'
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    class PlayerDyingAnimation extends GameObject {
        //this.changeScene('VictoryScene', {win: false});
    }

    class Player extends GameObject {
        constructor(config) {
            super(config)
            this.speed = 3;
            this.direction = { x: 0, y: 0 }
            this.recharge = 0;
            this.player_walking = images.player_walking;
        }
        tick() {
            this.player_walking.tick(1000/60);
            const pad = userInput.getInput(0)

            var velocity = {
                x: 0,
                y: 0
            }
            velocity.x = velocity.x + (pad.axes[0] * this.speed);
            velocity.y = velocity.y + (pad.axes[1] * this.speed);

            if (!(velocity.x === 0 && velocity.y === 0))
                this.direction = velocity;

            //Prevent player from leaving bottom edge of screen
            if (velocity.y > 0 && this.position.y > scroller.getScreenOffset() + canvas.height - this.height)
                velocity.y = 0;

            if (velocity.x !== 0 || velocity.y !== 0) {
                this.player_walking.play();
            } else {
                this.player_walking.stop();
            }

            this.setVelocityXY(velocity.x,velocity.y)

            if (pad.buttons[2].pressed && this.recharge === 0) {
                this.recharge = 10;
                var playerBullet = new PlayerBullet({
                    direction: _.clone(this.direction),
                    width: 20,
                    height: 20
                });
                var bulletPosition = {
                    x: this.position.x + this.width/2 - 10,
                    y: this.position.y + this.height/2 - 10
                }
                if (this.direction.x > 0) {
                    bulletPosition.x += 40;
                }
                if (this.direction.x < 0) {
                    bulletPosition.x -= 40;
                }
                if (this.direction.y > 0 && this.direction.x === 0) {
                    bulletPosition.y += 40;
                }
                if (this.direction.y < 0 && this.direction.x === 0) {
                    bulletPosition.y -= 80;
                }
                playerBullet.setPositionXY(bulletPosition.x, bulletPosition.y);
                playerBullet.setVelocityXY(0, 0)
                gameObjects.push(playerBullet)
            } else if (this.recharge > 0) {
                this.recharge = this.recharge - 1;
            }
        }
        draw() {
            context.save()
            context.translate(this.position.x, this.position.y);
            if (this.direction.x <= 0) {
                context.translate(TILE_SIZE,0)
                context.scale(-1, 1)
            }
            this.player_walking.draw(context);
            context.restore();
        }
    }

    class Enemy extends GameObject {
        constructor(config) {
            super(config)
            this.speed = config.speed || 3
            this.setVelocityXY(0, 0)
            this.decisionCooldown = config.decisionCooldown || 60
            this.decisionCooldownCounter = 0
            this.enemy_walking = SpriteSheet.new(images.enemy, {
                frames: [60, 60, 60],
                x: 0,
                y: 0,
                width: 64,
                height: 128,
                restart: true,
                autoPlay: true
            });
            this.direction = {x: 0, y:0 }
            this.shotCooldown = Math.random() * 40 + 80
            this.shotCooldownCounter = this.shotCooldown
            this.state = 'TOWARDS'
        }
        makeDecision() {
            const player = getPlayerObject()
            let nextAngle = this.position.getAngleBetween(player.position)
            this.state = 'TOWARDS'
            if (player.position.getDistance(this.position) < 280) {
                nextAngle += Math.PI
                this.state = 'AWAY'
                this.shotCooldownCounter = this.shotCooldown
            }
            this.velocity.setAngle(nextAngle)
            this.velocity.setMagnitude(this.speed)
            this.direction.x = this.velocity.x;
        }
        tick() {
            this.enemy_walking.tick(1000/60);
            if (this.decisionCooldownCounter <= 0) {
                this.decisionCooldownCounter = this.decisionCooldown
                this.makeDecision()
            } else {
                this.decisionCooldownCounter--
            }

            if (this.state === 'TOWARDS') {
                if (this.shotCooldownCounter <= 0) {
                    var bullet = new EnemyBullet({
                        direction: _.clone(this.velocity),
                        width: 20,
                        height: 20
                    });
                    bullet.setPositionXY(this.position.x + this.width/2 - 10, this.position.y + this.height/2 - 10);
                    bullet.setVelocityXY(0, 0)
                    gameObjects.push(bullet)

                    this.shotCooldownCounter = this.shotCooldown
                }
                this.shotCooldownCounter--
            }
        }
        draw() {
            context.save()
            context.translate(this.position.x, this.position.y);
            if (this.direction.x <= 0) {
                context.translate(TILE_SIZE,0)
                context.scale(-1, 1)
            }
            this.enemy_walking.draw(context);
            context.restore();
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
              case 2:
                var tile = new Tile({
                    width: TILE_SIZE,
                    height: TILE_SIZE * 2
                });
                tile.setPositionXY(colIdx * TILE_SIZE, rowIdx * TILE_SIZE);
                gameObjects.push(tile);
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

    function countEnemies() {
        return gameObjects.filter(function (gameObject) {
            return gameObject instanceof Enemy
        }).length
    }

    return {
        name: 'GameScene',
        create: function() {
            var _map = map.getMap();
            scroller = new Scroller((_map.length * TILE_SIZE) - canvas.height);
            winCondition = new WinCondition();
            loadMap(_map);
        },
        update: function() {
            _.each(gameObjects, function(gameObject) {
                gameObject.previousPosition = gameObject.position.clone()
                gameObject.tick();
            });
            scroller.tick();
            if (winCondition.victory()) this.changeScene('VictoryScene', {win: true});

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
                        if (!(playerBullet instanceof EnemyBullet)) {
                            playerBullet.destroy();
                            enemy.destroy();
                        }
                    })

                    collision.resolveByType(EnemyBullet, Player, function (enemyBullet, player) {
                        console.log('DEATH')
                    })

                    collision.resolveByType(PlayerBullet, Tile, function (playerBullet, tile) {
                      playerBullet.destroy();
                    })
                },
            })

            gameObjects = _.filter(gameObjects, function(gameObject) {
                return (!gameObject.markedForRemoval)
            });
        },
        draw: function() {
            context.fillStyle = "#d3cca7";
            context.fillRect(0,0,canvas.width, canvas.height);

            context.save();
            context.translate(0, -scroller.getScreenOffset());
            const tiles = gameObjects.filter(function (gameObject) {
                return gameObject instanceof Tile
            })
            const everythingElse = gameObjects.filter(function (gameObject) {
                return !(gameObject instanceof Tile)
            })
            tiles.forEach(function(gameObject) {
                gameObject.draw();
            })
            everythingElse.forEach(function(gameObject) {
                gameObject.draw();
            })
            context.restore();
        }
    }
});
define('app/game', [
    'underscore',
    'userInput',
    'utils',
    'app/images',
], function (
    _,
    userInput,
    utils,
    images
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

    class PhysicsObject extends GameObject {
        constructor(config) {
            super(config);
            this.hitbox = config.hitbox;
        }
        draw() {
            context.fillStyle = this.color;
            context.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
        }
    }

    class Player extends PhysicsObject {
        constructor(config) {

        }
        tick() {

        }
        draw() {

        }
    }

    class Enemy extends PhysicsObject {
        constructor(config) {

        }
        tick() {

        }
        draw() {

        }
    }

    return {
        init: function() {
            context.font = "20px Georgia";

            gameObjects.push(new GameObject({
                hitbox: {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 10
                }
            }));
        },
        tick: function(delta) {
            _.each(gameObjects, function(gameObject) {
                gameObject.tick(delta);
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
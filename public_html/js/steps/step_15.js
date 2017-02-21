(function () {
    var step = 15;

    $(window).on('tap click', function (event) {
        event.preventDefault();
        if (!gameArea.canvas) {
            $('#modal-step-15').addClass('hidden');
            startGame();
        } else if (!gameArea.active) {
            gameArea.interval = setInterval(updateGameArea, 20);
            gameArea.active = true;
        }
    });
    $(window).blur(function () {
        gameArea.pause();
    });

    function startGame() {
        gameArea.start();
        playerShip = new playerCharacter(15, 120);
        cursor = new cursor();
    }

    var gameArea = {
        start: function () {
            this.active = true;
            this.terminate = false;

            this.enemies = [];
            this.playerMissiles = [];
            this.explodyBits = [];
            this.exhausts = [];
            this.crosshairs = [];
            this.explosions = [];
            this.entities = [
                [this.enemies],
                [this.playerMissiles],
                [this.explodyBits],
                [this.exhausts],
                [this.crosshairs],
                [this.explosions]
            ];
            this.frameNo = 0;
            this.canvas = document.getElementById('canvas-step-' + (step));
            this.canvas.width = 480;
            this.canvas.height = 320;
            this.context = this.canvas.getContext("2d");
            this.interval = setInterval(updateGameArea, 20);
            this.mouseX = 0;
            this.mouseY = 0;
            this.mouseDown = false;
            this.score = 0;

            this.bgImg = new Image();
            this.bgImg.src = '../img/background.jpg';
            this.bgCounter = 0;
            this.getMousePos = function (mouseEvent) {
                var rect = this.canvas.getBoundingClientRect();
                gameArea.mouseX = mouseEvent.clientX - rect.left;
                gameArea.mouseY = mouseEvent.clientY - rect.top;
            };
            this.getTouchPos = function (touchEvent) {
                var rect = this.canvas.getBoundingClientRect();
                gameArea.mouseX = touchEvent.touches[0].clientX - rect.left;
                gameArea.mouseY = touchEvent.touches[0].clientY - rect.top;
                if (event.target === gameArea.canvas) {
                    event.preventDefault();
                }
            };

            this.canvas.addEventListener("touchmove", function (event) {
                gameArea.getTouchPos(event);
                cursor.active = false;
            });
            this.canvas.addEventListener("mousemove", function (event) {
                gameArea.getMousePos(event);
                cursor.active = true;
            });
            this.canvas.addEventListener("touchstart", function (event) {
                event.preventDefault();
                event.stopPropagation();
                gameArea.getTouchPos(event);
                if (gameArea.terminate) {
                    gameArea.start();
                }
                gameArea.mouseDown = true;
                cursor.active = false;
            });
            this.canvas.addEventListener("mousedown", function () {
                if (gameArea.terminate) {
                    gameArea.start();
                }
                gameArea.mouseDown = true;
                cursor.active = true;
            });
            ['mouseup', 'touchend'].forEach(function (event) {
                gameArea.canvas.addEventListener(event, function () {
                    gameArea.mouseDown = false;
                });
            });
        },
        background: function () {
            if (this.bgCounter <= 615) {
                this.bgCounter++;
            } else {
                this.bgCounter = 0;
            }
            this.context.drawImage(this.bgImg, 0, 0, this.bgImg.width, 320, 0 - this.bgCounter, 0, this.bgImg.width, 320);
        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        pause: function () {
            clearInterval(this.interval);
            this.active = false;
            this.updateScore();
        },
        stop: function () {
            clearInterval(this.interval);
            this.active = false;
            this.terminate = true;
            this.killEntities();
        },
        killEntities: function () {
            playerShip.targets = [];
            this.entities.forEach(function (entityList) {
                entityList.forEach(function (entity) {
                    if (entity.active) {
                        entity.active = false;
                    }
                });
            });
        },
        updateScore: function () {
            ctx = gameArea.context;
            ctx.font = "20px Arial";
            ctx.fillStyle = 'black';
            if (!this.active && !this.terminate) {
                ctx.fillText(this.score + ' - PAUSED', 5, 20);
            } else {
                ctx.fillText(this.score, 5, 20);
            }
        }
    };

    function cursor() {
        this.active = true;
        this.hoverEnemy = false;
        this.image = new Image();
        this.image.src = '../img/cursor_sprite_sheet.png';
        this.srcWidth = 200;
        this.srcHeight = 200;
        this.destWidth = 35;
        this.destHeight = 35;
        this.index = 0;
        this.width = 10;
        this.height = 10;
        this.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };
        this.newPos = function () {
            this.x = gameArea.mouseX - this.width / 2;
            this.y = gameArea.mouseY - this.height / 2;
        };
        this.update = function () {
            if (gameArea.mouseDown) {
                if (this.index < 10) {
                    this.index += 2;
                } else {
                    this.index = 10;
                }
            } else if (this.index > 0) {
                this.index -= 2;
            } else {
                this.index = 0;
            }
            if (this.active) {
                this.draw();
            }
        };
        this.draw = function () {
            gameArea.context.drawImage(
                    this.image,
                    (this.index * this.srcWidth),
                    0,
                    this.srcWidth,
                    this.srcHeight,
                    this.midpoint().x - this.destWidth / 2,
                    this.midpoint().y - this.destHeight / 2,
                    this.destWidth,
                    this.destHeight);
        };
    }

    function playerCharacter(x, y) {
        this.active = true;
        this.width = 55;
        this.height = 28;
        this.x = x;
        this.y = y;
        this.color = "transparent";
        this.acceleration = 35;
        this.maxSpeed = 130;
        this.targets = [];
        this.i = 0;
        this.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };
        this.update = function () {
            this.draw();
            this.fireControl();
            this.index = Math.floor(clamp(((this.y - gameArea.mouseY) / 13 + 15), 0, 29));
        };
        this.draw = function () {
            ctx = gameArea.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            gameArea.context.drawImage(
                    this.image,
                    (this.index * this.srcWidth),
                    0,
                    this.srcWidth,
                    this.srcHeight,
                    this.x + this.offsetX,
                    this.y + this.offsetY,
                    this.destWidth,
                    this.destHeight);
        };
        this.fireControl = function () {
            if (!gameArea.mouseDown && this.targets.length >= 1) {
                if (this.i <= this.targets.length && (gameArea.frameNo % 3 === 0)) {
                    this.i = 0;
                    this.fire(this.targets[this.i]);
                    this.targets.splice(this.i, 1);
                    this.i++;
                }
            }
            ;
        };
        this.newPos = function (targetY) {
            this.y += (clamp(((targetY - this.height / 2) - this.y), -this.maxSpeed, this.maxSpeed)) / this.acceleration;
        };
        this.fire = function (target) {
            gameArea.playerMissiles.push(new playerMissile(playerShip.midpoint().x, playerShip.midpoint().y, target));
        };
        this.image = new Image();
        this.image.src = '../img/ship_sprite_sheet.png';
        this.offsetX = 0;
        this.offsetY = -15;
        this.srcWidth = 100;
        this.srcHeight = 90;
        this.index = 15;
        this.destWidth = this.srcWidth / 1.5;
        this.destHeight = this.srcHeight / 1.5;
    }

    function enemyBasic(x, y, accel, speed) {
        this.active = true;
        this.width = 30;
        this.height = 30;
        this.x = x;
        this.y = y;
        this.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };
        this.spriteWidth = this.width + 10;
        this.spriteHeight = this.height + 10;
        this.color = 'transparent';
        this.acceleration = accel;
        this.speed = speed;
        this.locked = false;
        this.tracked = false;
        this.update = function () {
            this.draw();
            if (this.index <= 117) {
                this.index++;
            } else {
                this.index = 0;
            }
            if (this.x <= -100) {
                this.active = false;
            }
            if (mouseOver(this) && !this.locked) {
                if (gameArea.mouseDown) {
                    this.locked = true;
                    playerShip.targets.push(this);
                    gameArea.crosshairs.push(new crosshair(this.midpoint().x, this.midpoint().y, 45, 45, this));
                }
            }
        };
        this.draw = function () {
            ctx = gameArea.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            gameArea.context.drawImage(
                    this.image,
                    (this.index * this.srcWidth),
                    0,
                    this.srcWidth,
                    this.srcHeight,
                    this.midpoint().x - this.spriteWidth / 2,
                    this.midpoint().y - this.spriteHeight / 2,
                    this.destWidth,
                    this.destHeight);
            ctx.restore();
        },
                this.newPos = function () {
                    this.x += this.speed;
                };
        this.image = new Image();
        this.image.src = '../img/drone_sprite_sheet.png';
        this.srcWidth = 120;
        this.srcHeight = 120;
        this.index = 0;
        this.destWidth = this.spriteWidth;
        this.destHeight = this.spriteHeight;
    }

    function crosshair(x, y, minWidth, minHeight, parent) {
        this.age = 0;
        this.active = true;
        this.width = 100;
        this.height = 100;
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.x = x;
        this.y = y;
        this.color = '#005500';
        this.parent = parent;
        this.angle = 0;
        this.midpoint = function () {
            return {
                x: this.x - this.width / 2,
                y: this.y - this.height / 2
            };
        };
        this.update = function () {
            this.age++;
            if (this.width > this.minWidth & this.age > 5) {
                this.width -= 10;
                this.height -= 10;
            }
            if (!this.parent.tracked) {
                this.color = '#005500';
                this.angle -= 0.1;
            } else {
                this.flashLockBox();
            }
            ctx = gameArea.context;
            ctx.save();
            ctx.translate(this.parent.midpoint().x, this.parent.midpoint().y);
            ctx.rotate(this.angle);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.strokeRect(0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
            ctx.restore();
            if (!this.parent.active) {
                this.active = false;
            }
        };
        this.flashLockBox = function () {
            this.angle = 0;
            if (this.age % 4 === 0 && this.width <= this.minWidth) {
                if (this.color === 'red') {
                    this.color = 'transparent';
                } else {
                    this.color = 'red';
                }
            }
        };
        this.newPos = function () {
            this.x = this.parent.midpoint().x;
            this.y = this.parent.midpoint().y;
        };
    }

    function playerMissile(x, y, target) {
        this.active = true;
        this.age = 0;
        this.width = 33;
        this.height = 12;
        this.x = x;
        this.y = y;
        this.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };
        this.angle = 0;
        this.velocityX;
        this.velocityY;
        this.acceleration = 0.3;
        this.thrust = 0;
        this.target = target;
        this.target.tracked = true;
        this.update = function () {
            this.age++;
            this.getAngle();
            this.draw();
            if (this.index <= 18) {
                this.index++;
            } else {
                this.index = 1;
            }
            if (this.age > 75) {
                this.active = false;
            }
            for (var i = 0; i <= 6; i++) {
                gameArea.exhausts.push(new exhaust((Math.random() * 10) + this.x, this.y, this.angle));
            }
        };
        this.draw = function () {
            ctx = gameArea.context;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = "transparent";
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            gameArea.context.drawImage(
                    this.image,
                    (this.index * this.srcWidth),
                    0,
                    this.srcWidth,
                    this.srcHeight,
                    0 + this.width / -2,
                    0 + this.height / -2,
                    this.destWidth,
                    this.destHeight);
            ctx.restore();
        };
        this.newPos = function () {
            var tx = (this.target.midpoint().x) - this.x;
            var ty = (this.target.midpoint().y) - this.y;
            var dist = Math.sqrt(tx * tx + ty * ty);

            this.thrust = this.thrust + this.acceleration;

            this.velocityX = (tx / dist) * this.thrust;
            this.velocityY = (ty / dist) * this.thrust;

            this.x += this.velocityX;
            this.y += this.velocityY;
        };
        this.getAngle = function () {
            var x = this.x - (this.target.midpoint().x);
            var y = this.y - (this.target.midpoint().y);
            this.angle = (Math.atan2(y, x)) - Math.PI;
        };
        this.image = new Image();
        this.image.src = '../img/missile_sprite_sheet.png';
        this.srcWidth = 50;
        this.srcHeight = 20;
        this.index = 0;
        this.destWidth = this.srcWidth / 1.5;
        this.destHeight = this.srcHeight / 1.5;
    }

    function explodyBit(x, y) {
        this.active = true;
        this.age = 0;
        this.width = Math.random() * 4;
        this.height = Math.random() * 4;
        this.x = x;
        this.y = y;
        this.midpoint = function () {
            return {
                x: this.x - this.width / 2,
                y: this.y - this.height / 2
            };
        };
        this.velocityX;
        this.velocityY;
        this.acceleration = -0.3;
        this.thrust = (Math.random() * 3) + 5;
        this.angle = (Math.random() * 360) - 180;
        this.gravity = 0;
        this.update = function () {
            this.age++;
            this.draw();
            if (this.age > 300) {
                this.active = false;
            }
        };
        this.draw = function () {
            ctx = gameArea.context;
            ctx.fillStyle = "#262626";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.newPos = function () {
            this.thrust = clamp(this.thrust + this.acceleration, 2, 100);

            this.velocityX = Math.cos(this.angle) * this.thrust;
            this.velocityY = Math.sin(this.angle) * this.thrust;

            this.gravity += 0.3;

            this.x += this.velocityX;
            this.y += this.velocityY + this.gravity;
        };
    }

    function explosion(x, y) {
        this.image = new Image();
        this.image.src = '../img/explosion_sprite_sheet.png';
        this.srcWidth = 64;
        this.srcHeight = 64;
        this.index = 0;
        this.destWidth = this.srcWidth * 1.2;
        this.destHeight = this.srcHeight * 1.2;

        this.active = true;
        this.age = 0;
        this.width = 5;
        this.height = 5;
        this.x = x;
        this.y = y;
        this.midpoint = function () {
            return {
                x: this.x - this.width / 2,
                y: this.y - this.height / 2
            };
        };
        this.update = function () {
            this.age++;
            this.draw();
            this.index = this.age * 2;
            if (this.index > 25) {
                this.active = false;
            }
        };
        this.draw = function () {
            ctx = gameArea.context;
            ctx.fillStyle = "transparent";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            gameArea.context.drawImage(
                    this.image,
                    (this.index * this.srcWidth),
                    0,
                    this.srcWidth,
                    this.srcHeight,
                    this.x + this.destWidth / -2,
                    this.y + this.destHeight / -2.5,
                    this.destWidth,
                    this.destHeight);
        };
    }

    function exhaust(x, y, angle) {
        this.active = true;
        this.age = 0;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };
        this.velocityX;
        this.velocityY;
        this.acceleration = -0.1;
        this.radius = 0;
        this.thrust = (Math.random() * 1) + 2;
        this.angle = (Math.random() * 0.25) + angle - Math.PI;
        this.lifetime = Math.random() * 50 + 10;
        this.update = function () {
            this.age++;
            this.draw();
            this.fadeEffect();
        };
        this.fadeEffect = function () {
            this.radius = (8 * (this.age / this.lifetime)) + 3;
            if (this.x < 0 || this.age > this.lifetime) {
                this.active = false;
            }
        };
        this.draw = function () {
            ctx = gameArea.context;
            ctx.globalAlpha = 1 - (this.age / (this.lifetime + 1));
            gradient = ctx.createRadialGradient(this.x, this.y, this.radius / 2, this.x, this.y, this.radius);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalAlpha = 1.0;
        };
        this.newPos = function () {
            this.thrust = this.thrust + this.acceleration;

            this.velocityX = Math.cos(this.angle) * this.thrust;
            this.velocityY = Math.sin(this.angle) * this.thrust;

            this.x += this.velocityX - 4;
            this.y += this.velocityY;
        };
    }

    function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }

    function collision(a, b) {
        return a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y;
    }

    function mouseOver(object) {
        return gameArea.mouseX < object.x + object.width &&
                gameArea.mouseX > object.x &&
                gameArea.mouseY < object.y + object.height &&
                gameArea.mouseY > object.y;
    }

    function collisionHandler() {
        cursor.hoverEnemy = false;
        $(gameArea.enemies).each(function () {
            enemy = this;
            if (collision(playerShip, enemy)) {
                gameArea.score = "FAILED AT " + gameArea.score + ' - CLICK TO RESTART';
                gameArea.stop();
            }
            if (collision(cursor, enemy)) {
                cursor.hoverEnemy = true;
            }
        });
        $(gameArea.playerMissiles).each(function () {
            if (collision(this.target, this)) {
                gameArea.score += 10;
                this.target.active = false;
                this.active = false;
                for (var i = 0; i < 10; i++) {
                    gameArea.explodyBits.push(new explodyBit(this.x, this.y));
                }
                gameArea.explosions.push(new explosion(this.target.x, this.target.y));
            }
        });
    }

    function updateGameArea() {
        collisionHandler();
        gameArea.clear();
        gameArea.frameNo++;
        gameArea.background();

        if ((Math.random() * 1000) > (990 - gameArea.frameNo / 100)) {
            gameArea.enemies.push(new enemyBasic(490, (Math.random() * 280), 0, (Math.random() * -1.5 - 1)));
        }
        ;

        gameArea.enemies = gameArea.enemies.filter(function (enemyBasic) {
            return enemyBasic.active;
        });

        $(gameArea.enemies).each(function () {
            this.newPos();
            this.update();
        });

        gameArea.exhausts = gameArea.exhausts.filter(function (exhaust) {
            return exhaust.active;
        });

        $(gameArea.exhausts).each(function () {
            this.newPos();
            this.update();
        });

        gameArea.playerMissiles = gameArea.playerMissiles.filter(function (playerMissile) {
            return playerMissile.active;
        });

        $(gameArea.playerMissiles).each(function () {
            this.newPos();
            this.update();
        });

        gameArea.explodyBits = gameArea.explodyBits.filter(function (explodyBit) {
            return explodyBit.active;
        });

        $(gameArea.explodyBits).each(function () {
            this.newPos();
            this.update();
        });

        gameArea.explosions = gameArea.explosions.filter(function (explosion) {
            return explosion.active;
        });

        $(gameArea.explosions).each(function () {
            this.update();
        });

        playerShip.newPos(gameArea.mouseY);
        playerShip.update();
        gameArea.updateScore();

        gameArea.crosshairs = gameArea.crosshairs.filter(function (crosshair) {
            return crosshair.active;
        });

        $(gameArea.crosshairs).each(function () {
            this.newPos();
            this.update();
        });

        cursor.newPos();
        cursor.update();
    }
})();
(function () {
    var step = 14;

    $(window).click(function () {
        if (!myGameArea.canvas) {
            $('#modal-step-14').addClass('hidden');
            startGame();
        } else if (!myGameArea.active) {
            myGameArea.interval = setInterval(updateGameArea, 20);
            myGameArea.active = true;
        }
    });
    $(window).blur(function () {
        myGameArea.pause();
    });

    function startGame() {
        myGameArea.start();
        myGamePiece = new playerCharacter(65, 35, "transparent", 15, 120, 35, 130);
    }

    var myGameArea = {
        start: function () {
            this.active = true;
            this.terminate = false;

            this.enemies = [];
            this.playerMissiles = [];
            this.explodyBits = [];
            this.exhausts = [];
            this.crosshairs = [];

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

            this.canvas.addEventListener("mousemove", function (event) {
                myGameArea.mouseX = event.offsetX;
                myGameArea.mouseY = event.offsetY;
            });
            this.canvas.addEventListener("mousedown", function () {
                if (myGameArea.terminate) {
                    myGameArea.start();
                }
                myGameArea.mouseDown = true;
            });
            this.canvas.addEventListener("mouseup", function () {
                myGameArea.mouseDown = false;
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
        },
        updateScore: function () {
            ctx = myGameArea.context;
            ctx.font = "20px Arial";
            ctx.fillStyle = 'red';
            if (!this.active && !this.terminate) {
                ctx.fillText(this.score + ' - PAUSED', 5, 20);
            } else {
                ctx.fillText(this.score, 5, 20);
            }
        },
        render: function (object) {
            this.context.drawImage(
                    object.image,
                    (object.index * object.srcWidth),
                    0,
                    object.srcWidth,
                    object.srcHeight,
                    object.x + object.offsetX,
                    object.y + object.offsetY,
                    object.destWidth,
                    object.destHeight);
        }
    };

    function playerCharacter(width, height, color, x, y, accel, speed) {
        this.active = true;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.acceleration = accel;
        this.maxSpeed = speed;
        this.targets = [];
        this.i = 0;
        this.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };
        this.update = function () {
            this.drawBoundingBox();
            this.fireControl();
            this.index = Math.floor(clamp(((this.y - myGameArea.mouseY) / 13 + 15), 0, 29));
        };
        this.drawBoundingBox = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.fireControl = function () {
            if (!myGameArea.mouseDown && this.targets.length >= 1) {
                if (this.i <= this.targets.length && (myGameArea.frameNo % 3 === 0)) {
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
            myGameArea.playerMissiles.push(new playerMissile(myGamePiece.midpoint().x, myGamePiece.midpoint().y, target));
        };
        this.image = new Image();
        this.image.src = '../img/ship_sprite_sheet.png';
        this.offsetX = 0;
        this.offsetY = -12;
        this.srcWidth = 100;
        this.srcHeight = 90;
        this.index = 15;
        this.destWidth = this.srcWidth / 1.5;
        this.destHeight = this.srcHeight / 1.5;
    }

    function enemyBasic(width, height, color, x, y, accel, speed) {
        this.active = true;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };
        this.color = color;
        this.acceleration = accel;
        this.speed = speed;
        this.locked = false;
        this.tracked = false;
        this.update = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.x <= -20) {
                this.active = false;
            }
            if (mouseOver(this) && !this.locked) {
                if (myGameArea.mouseDown) {
                    this.locked = true;
                    myGamePiece.targets.push(this);
                    myGameArea.crosshairs.push(new crosshair(this.midpoint().x, this.midpoint().y, 100, 100, this));
                }
            }
        };
        this.newPos = function () {
            this.x += this.speed;
        };
    }

    function crosshair(x, y, width, height, parent) {
        this.age = 0;
        this.active = true;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = '#00EE00';
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
            if (this.width > 45 & this.age > 5) {
                this.width -= 10;
                this.height -= 10;
            }
            if (!this.parent.tracked) {
                this.color = '#00EE00';
                this.angle -= 0.1;
            } else {
                this.flashLockBox();
            }
            ctx = myGameArea.context;
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
            if (this.age % 4 === 0 && this.width <= 45) {
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
        this.width = 20;
        this.height = 10;
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
            ctx = myGameArea.context;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
            if (this.age > 75) {
                this.active = false;
            }
            myGameArea.exhausts.push(new exhaust(this.x, this.midpoint().y, this.angle));
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
    }

    function explodyBit(x, y) {
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
        this.velocityX;
        this.velocityY;
        this.acceleration = -0.3;
        this.thrust = (Math.random() * 3) + 5;
        this.angle = (Math.random() * 360) - 180;
        this.update = function () {
            this.age++;
            this.draw();
            if (this.thrust < 1 || this.age > 50) {
                this.active = false;
            }
        };
        this.draw = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.newPos = function () {
            this.thrust = this.thrust + this.acceleration;

            this.velocityX = Math.cos(this.angle) * this.thrust;
            this.velocityY = Math.sin(this.angle) * this.thrust;

            this.x += this.velocityX;
            this.y += this.velocityY;
        };
    }

    function exhaust(x, y, angle) {
        this.active = true;
        this.age = 0;
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
        this.acceleration = -0.1;
        this.thrust = (Math.random() * 3) + 5;
        this.angle = (Math.random() * 0.25) + angle - Math.PI;
        this.lifetime = 50;
        this.update = function () {
            this.age++;
            this.draw();
            this.fadeEffect();
        };
        this.fadeEffect = function () {
            this.width = (20 * (this.age / this.lifetime)) + 5;
            this.height = (20 * (this.age / this.lifetime)) + 5;
            if (this.x < 0 || this.age > this.lifetime) {
                this.active = false;
            }
        };
        this.draw = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = "#999999";
            ctx.globalAlpha = 1 - (this.age / (this.lifetime + 1));
            ctx.fillRect(this.midpoint().x, this.midpoint().y, this.width, this.height);
            ctx.globalAlpha = 1.0;
        };
        this.newPos = function () {
            this.thrust = this.thrust + this.acceleration;

            this.velocityX = Math.cos(this.angle) * this.thrust;
            this.velocityY = Math.sin(this.angle) * this.thrust;

            this.x += this.velocityX - 1;
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
        return myGameArea.mouseX < object.x + object.width &&
                myGameArea.mouseX > object.x &&
                myGameArea.mouseY < object.y + object.height &&
                myGameArea.mouseY > object.y;
    }

    function collisionHandler() {
        $(myGameArea.enemies).each(function () {
            enemy = this;
            if (collision(myGamePiece, enemy)) {
                myGameArea.score = "FAILED AT " + myGameArea.score + ' - CLICK TO RESTART';
                myGameArea.stop();
            }
        });
        $(myGameArea.playerMissiles).each(function () {
            if (collision(this.target, this)) {
                myGameArea.score += 10;
                this.target.active = false;
                this.active = false;
                for (var i = 0; i < 20; i++) {
                    myGameArea.explodyBits.push(new explodyBit(this.x, this.y));
                }
            }
        });
    }

    function updateGameArea() {
        collisionHandler();
        myGameArea.clear();
        myGameArea.frameNo++;
        myGameArea.background();

        if ((Math.random() * 1000) > (990 - myGameArea.frameNo / 100)) {
            myGameArea.enemies.push(new enemyBasic(30, 30, "#AA0000", 490, (Math.random() * 280), 0, (Math.random() * -1.5 - 1)));
        }
        ;

        myGameArea.enemies = myGameArea.enemies.filter(function (enemyBasic) {
            return enemyBasic.active;
        });

        $(myGameArea.enemies).each(function () {
            this.newPos();
            this.update();
        });

        myGameArea.exhausts = myGameArea.exhausts.filter(function (exhaust) {
            return exhaust.active;
        });

        $(myGameArea.exhausts).each(function () {
            this.newPos();
            this.update();
        });

        myGameArea.playerMissiles = myGameArea.playerMissiles.filter(function (playerMissile) {
            return playerMissile.active;
        });

        $(myGameArea.playerMissiles).each(function () {
            this.newPos();
            this.update();
        });

        myGameArea.explodyBits = myGameArea.explodyBits.filter(function (explodyBit) {
            return explodyBit.active;
        });

        $(myGameArea.explodyBits).each(function () {
            this.newPos();
            this.update();
        });

        myGamePiece.newPos(myGameArea.mouseY);
        myGamePiece.update();
        myGameArea.updateScore();
        myGameArea.render(myGamePiece);

        myGameArea.crosshairs = myGameArea.crosshairs.filter(function (crosshair) {
            return crosshair.active;
        });

        $(myGameArea.crosshairs).each(function () {
            this.newPos();
            this.update();
        });
    }
})();
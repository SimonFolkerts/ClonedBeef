(function () {
    var step = 12;

    $(window).click(function () {
        if (!myGameArea.canvas) {
            $('#modal-step-12').addClass('hidden');
            startGame();
        } else if (!myGameArea.active) {
            myGameArea.interval = setInterval(updateGameArea, 20);
            myGameArea.active = true;
        }
    });
    $(window).blur(function () {
        myGameArea.stop();
    });

    function startGame() {
        myGameArea.start();
        myGamePiece = new playerCharacter(30, 30, "black", 20, 120, 30, 150);
        enemyPiece = new enemyBasic(30, 30, "red", 490, (Math.random() * 280), 0, -3);
    }

    var myGameArea = {
        start: function () {
            this.active = true;
            this.enemies = [];
            this.playerMissiles = [];
            this.frameNo = 0;
            this.canvas = document.getElementById('canvas-step-' + (step));
            this.canvas.width = 480;
            this.canvas.height = 320;
            this.context = this.canvas.getContext("2d");
            this.interval = setInterval(updateGameArea, 20);
            this.mouseX = 0;
            this.mouseY = 0;
            this.mouseDown = false;
            this.canvas.addEventListener("mousemove", function (event) {
                myGameArea.mouseX = event.offsetX;
                myGameArea.mouseY = event.offsetY;
            });
            this.canvas.addEventListener("mousedown", function () {
                myGameArea.mouseDown = true;
            });
            this.canvas.addEventListener("mouseup", function () {
                myGameArea.mouseDown = false;
            });
        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop: function () {
            clearInterval(this.interval);
            this.active = false;
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
        this.update = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            this.fireControl();
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
            this.y += (clamp((targetY - this.y), -this.maxSpeed, this.maxSpeed)) / this.acceleration;
        };
        this.fire = function (target) {
            myGameArea.playerMissiles.push(new playerMissile(myGamePiece.x, myGamePiece.y, target));
        };
    }


    function enemyBasic(width, height, color, x, y, accel, speed) {
        this.active = true;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.acceleration = accel;
        this.speed = speed;
        this.targeted = false;
        this.update = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.x <= -20) {
                this.active = false;
            }
            if (mouseOver(this) && !this.targeted) {
                if (myGameArea.mouseDown) {
                    this.targeted = true;
                    this.color = 'yellow';
                    myGamePiece.targets.push(this);
                }
            }
        };
        this.newPos = function () {
            this.x += this.speed;
        };
    }

    function playerMissile(x, y, target) {
        this.active = true;
        this.age = 0;
        this.width = 15;
        this.height = 15;
        this.x = x;
        this.y = y;
        this.velocityX;
        this.velocityY;
        this.acceleration = 0.3;
        this.thrust = 0;
        this.target = target;
        this.update = function () {
            this.age++;
            ctx = myGameArea.context;
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            if (Math.abs(this.x - this.targetX) < 8 || this.age > 75) {
                this.active = false;
            }
        };
        this.newPos = function () {
            var tx = this.target.x - this.x;
            var ty = this.target.y - this.y;
            var dist = Math.sqrt(tx * tx + ty * ty);

            this.thrust = this.thrust + this.acceleration;

            this.velocityX = (tx / dist) * this.thrust;
            this.velocityY = (ty / dist) * this.thrust;

            this.x += this.velocityX;
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
                myGameArea.stop();
            }
            $(myGameArea.playerMissiles).each(function () {
                if (collision(this.target, this)) {
                    this.target.active = false;
                    this.active = false;
                }
            });
        });
    }

    function updateGameArea() {
        myGameArea.clear();
        myGameArea.frameNo++;
        myGamePiece.newPos(myGameArea.mouseY);
        myGamePiece.update();

        if ((Math.random() * 1000) > (990 - myGameArea.frameNo / 100)) {
            myGameArea.enemies.push(new enemyBasic(30, 30, "red", 490, (Math.random() * 280), 0, -3));
        };

        myGameArea.enemies = myGameArea.enemies.filter(function (enemyBasic) {
            return enemyBasic.active;
        });

        $(myGameArea.enemies).each(function () {
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
        collisionHandler();
    }
})();


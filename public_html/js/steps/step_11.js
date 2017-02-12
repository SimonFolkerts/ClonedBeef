(function () {
    var step = 11;

    $("#canvas-step-" + step).click(function () {
        if (!myGameArea.canvas) {
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
        myGamePiece = new playerCharacter(30, 30, "black", 20, 120, 15, 100);
        enemyPiece = new enemyBasic(30, 30, "red", 490, (Math.random() * 280), 0, 0);
    }

    var myGameArea = {
        start: function () {
            this.active = true;
            this.enemies = [];
            this.playerMissiles = [];
            this.canvas = document.getElementById('canvas-step-' + (step));
            this.canvas.width = 480;
            this.canvas.height = 320;
            this.context = this.canvas.getContext("2d");
            this.interval = setInterval(updateGameArea, 20);
            this.mouseX = 0;
            this.mouseY = 0;
            this.canvas.addEventListener("mousemove", function (event) {
                myGameArea.mouseX = event.offsetX;
                myGameArea.mouseY = event.offsetY;
            });
            this.canvas.addEventListener("click", function () {
                myGameArea.playerMissiles.push(new playerMissile(myGamePiece.x, myGamePiece.y, myGameArea.mouseX, myGameArea.mouseY));
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
        this.acceleration = accel;
        this.maxSpeed = speed;
        this.update = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.newPos = function (targetY) {
            this.y += (clamp((targetY - this.y), -this.maxSpeed, this.maxSpeed)) / this.acceleration;
        };
    }

    function enemyBasic(width, height, color, x, y, accel, speed) {
        this.active = true;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.acceleration = accel;
        this.maxSpeed = speed;
        this.update = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.x <= 0) {
                this.active = false;
            }
        };
        this.newPos = function () {
            this.x += -3;
        };
    }

    function playerMissile(x, y, targetX, targetY) {
        this.active = true;
        this.width = 15;
        this.height = 15;
        this.x = x;
        this.y = y;
        this.velocityX;
        this.velocityY;
        this.acceleration = 0.3;
        this.thrust = 0;
        this.targetX = targetX;
        this.targetY = targetY;
        this.update = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            if (Math.abs(this.x - this.targetX) < 10) {
                this.active = false;
            }
        };
        this.newPos = function () {
            var tx = this.targetX - this.x;
            var ty = this.targetY - this.y;
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

    function collisionHandler() {
        $(myGameArea.enemies).each(function () {
            enemy = this;
            if (collision(myGamePiece, enemy)) {
                myGameArea.stop();
            }
            $(myGameArea.playerMissiles).each(function () {
                if (collision(enemy, this)) {
                    enemy.active = false;
                    this.active = false;
                }
            });
        });
    }

    function updateGameArea() {
        myGameArea.clear();

        myGamePiece.newPos(myGameArea.mouseY);
        myGamePiece.update();

        if ((Math.random() * 1000) > 990) {
            myGameArea.enemies.push(new enemyBasic(30, 30, "red", 490, (Math.random() * 280), 0, 0));
        }

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


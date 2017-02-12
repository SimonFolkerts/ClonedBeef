(function () {
    var step = 7;
    function startGame() {
        myGameArea.start();
        myGamePiece = new playerCharacter(30, 30, "black", 20, 120, 15, 100);
        enemyPiece = new enemyBasic(30, 30, "red", 490, (Math.random() * 280), 0, 0);
    }

    var myGameArea = {
        start: function () {
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
        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }

    function updateGameArea() {
        myGameArea.clear();
        if ((Math.random() * 1000) > 990) {
             enemyPiece = new enemyBasic(30, 30, "red", 490, (Math.random() * 320), 0, 0);
        }
        if (enemyPiece.active) {
            enemyPiece.update();
            enemyPiece.newPos();
        }
        myGamePiece.newPos(myGameArea.mouseY);
        myGamePiece.update();
    }
    startGame();
})();


(function () {
    var step = 6;
    function startGame() {
        myGameArea.start();
        myGamePiece = new component(30, 30, "black", 20, 120, 15, 100);
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
       
    function component (width, height, color, x, y, accel, speed) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.acceleration = accel; //lower means faster. This will affect maxSpeed too.
        this.maxSpeed = speed;
        this.update = function () {
            ctx = myGameArea.context;
            ctx.fillstyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.newPos = function (targetY) {
            this.y += (clamp((targetY - this.y), -this.maxSpeed, this.maxSpeed)) / this.acceleration;
        };
    }

    function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }

    function updateGameArea() {
        myGameArea.clear();
        myGamePiece.newPos(myGameArea.mouseY);
        myGamePiece.update();
    }
    startGame();
})();


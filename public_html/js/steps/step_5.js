(function () {
    var step = 5;

    function startGame() {
        myGameArea.start();
        myGamePiece = new component(30, 30, "black", 10, 120);
    }

    var myGameArea = {
        start: function () {
            this.canvas = document.getElementById('canvas-step-' + step);
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

    function component(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.update = function () {
            ctx = myGameArea.context;
            ctx.fillstyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.newPos = function (targetX, targetY) {
            this.x = targetX;
            this.y = targetY;
        };
    }

    function updateGameArea() {
        myGameArea.clear();
        myGamePiece.newPos(myGameArea.mouseX, myGameArea.mouseY);
        myGamePiece.update();
    }
    startGame();
})();


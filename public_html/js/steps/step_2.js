    (function () {
        var step = 2;

        function startGame() {
            myGameArea.start();
            myGamePiece = new component(30, 30, "black", 10, 120);
        }

        var myGameArea = {
            start: function () {
                this.canvas = document.getElementById('canvas-step-' + (step - 1));
                this.canvas.width = 480;
                this.canvas.height = 320;
                this.context = this.canvas.getContext("2d");
            }
        };

        function component(width, height, color, x, y) {
            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;
            ctx = myGameArea.context;
            ctx.fillstyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        startGame();
    })();

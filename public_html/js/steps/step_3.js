function step3() {
    var step = 3;

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
            this.interval = setInterval(updateGameArea, 20);
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
    }

    function updateGameArea() {
        myGameArea.clear();
        myGamePiece.update();
        
        //counter logic
        if (count <= 50) {
            count++;
        } else {
            count = 0;
        }
        $('#count-2').html(count);
    }
    
    var count = 0;
    startGame();
};
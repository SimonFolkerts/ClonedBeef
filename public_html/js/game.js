//$(document).ready(function() {

//Editor contents
var contents = [];

//########## Step One ##########//
contents[0] = ['function startGame() {\r\n    myGameArea.start();\r\n} \n \nvar myGameArea = {\r\n    canvas : document.getElementById("gameArea"),\r\n    start : function() {\r\n        this.canvas.width = 480;\r\n        this.canvas.height = 320; \r\n        this.context = this.canvas.getContext(\"2d);\");\r\n    }\r\n};', 'javascript'];

//########## Step Two ##########//
contents[1] = ['function startGame() {\r\n    myGameArea.start();\r\n} \n \n var myGameArea = {\r\n    canvas : $(\"#game-area\"),\r\n    start : function() {\r\n        this.context = this.canvas.getContext(\"2d);\");\r\n    }\r\n};', 'javascript'];

function stepTwo() {
    var step = 2;

    function startGame() {
        myGameArea.start();
        myGamePiece = new component(30, 30, "black", 10, 120);
    }

    var myGameArea = {
        start: function() {
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
}

stepTwo();

//########## INIT EDITORS ##########//

//Get all editors on the page
var editors = $(".editor");

//Initialise all editors on the page with theme, mode and contents
$(editors).each(function() {
    //Get individual editor
    var editorId = $(this).attr('id');
    var editor = ace.edit(editorId);
    //Set parameters
    editor.setTheme("ace/theme/monokai");
    editor.setReadOnly(true);
    editor.setOptions({
        maxLines: 16
    });
    //Get editor number
    editorNumber = $(this).attr('id').match(/\d+/g);
    //If an entry exists, apply it to the editor, else throw an error
    if (contents[editorNumber]) {
        //Load contents
        editor.setValue(contents[editorNumber][0]);
        //Load mode
        editor.getSession().setMode("ace/mode/" + contents[editorNumber][1])
    } else {
        console.log('No contents specified for editor #' + editorNumber);
    }
});
//});
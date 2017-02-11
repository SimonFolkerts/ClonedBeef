$(document).ready(function () {

//Editor contents
    var contents = [];
    
//    $(".game-area").each(function () {
//        $(this).click(function () {
//            var id = parseInt($(this).attr('id').match(/\d+/g)) + 1;
//            console.log('../js/steps/step_' + id + '.js');
//            $.getScript('../js/steps/step_' + id + '.js', function () {
//                clearScripts();
//                runStep();
//            });
//        });
//    });


//########## Step One ##########//
    contents[0] = ['function startGame() {\r\n    myGameArea.start();\r\n} \n \nvar myGameArea = {\r\n    canvas : document.getElementById("gameArea"),\r\n    start : function() {\r\n        this.canvas.width = 480;\r\n        this.canvas.height = 320; \r\n        this.context = this.canvas.getContext(\"2d);\");\r\n    }\r\n};', 'javascript'];
//########## Step Two ##########//
            contents[1] = ['function startGame() {\r\n    myGameArea.start();\r\n    myGamePiece = new component(30, 30, \"black\", 10, 120);\r\n}\n\nfunction component(width, height, color, x, y) {\r\n    this.width = width;\r\n    this.height = height;\r\n    this.x = x;\r\n    this.y = y;\r\n    ctx = myGameArea.context;\r\n    ctx.fillstyle = color;\r\n    ctx.fillRect(this.x, this.y, this.width, this.height);\r\n}', 'javascript'];

//########## Step Three ##########//
    contents[2] = ['var myGameArea = {\r\n    start : function() {\r\n        //existing code \n        this.interval = setInterval(updateGameArea, 20);\r\n    },\r\n    clear : function() {\r\n        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n    }\r\n};\n\nfunction component(width, height, color, x, y) {\n    //existing code\n    this.update = function(){\r\n        ctx = myGameArea.context;\r\n        ctx.fillStyle = color;\r\n        ctx.fillRect(this.x, this.y, this.width, this.height);\r\n    };\n}\n\nfunction updateGameArea() {\r\n    myGameArea.clear();\r\n    myGamePiece.update();\r\n}', 'javascript'];

//########## Step Four ##########//
    contents[3] = ['function startGame() {\r\n    myGameArea.start();\r\n    myGamePiece = new component(30, 30, \"black\", 10, 120);\r\n}\r\n\r\nvar myGameArea = {\r\n    start: function () {\r\n        this.canvas = document.getElementById(\'canvas-step-\' + (step - 1));\r\n        this.canvas.width = 480;\r\n        this.canvas.height = 320;\r\n        this.context = this.canvas.getContext(\"2d\");\r\n        this.interval = setInterval(updateGameArea, 20);\r\n    },\r\n    clear: function () {\r\n        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n    }\r\n};\r\n\r\nfunction component(width, height, color, x, y) {\r\n    this.width = width;\r\n    this.height = height;\r\n    this.x = x;\r\n    this.y = y;\r\n    this.update = function () {\r\n        ctx = myGameArea.context;\r\n        ctx.fillstyle = color;\r\n        ctx.fillRect(this.x, this.y, this.width, this.height);\r\n    };\r\n}\r\n\r\nfunction updateGameArea() {\r\n    myGameArea.clear();\r\n    myGamePiece.update();\r\n}\r\n\r\nstartGame();', 'javascript']

//########## Step Five ##########//
    contents[4] = ['function component(width, height, color, x, y) {\n    //existing code\n    this.newPos = function() {\r\n        this.x += targetX;\r\n        this.y += targetY; \r\n        };\n}', 'javascript'];

//########## INIT EDITORS ##########//

//Get all editors on the page
    var editors = $(".editor");

//Initialise all editors on the page with theme, mode and contents
    $(editors).each(function () {
        //Get individual editor
        var editorId = $(this).attr('id');
        var editor = ace.edit(editorId);
        //Set parameters
        editor.setTheme("ace/theme/monokai");
        editor.setReadOnly(true);
        editor.setOptions({
            maxLines: 30
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
});
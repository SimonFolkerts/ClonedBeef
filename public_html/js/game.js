$(document).ready(function() {

//Editor contents
var contents = [];

//########## Step One ##########//
contents[0] = ['function startGame() {\r\n    myGameArea.start();\r\n} \n \nvar myGameArea = {\r\n    canvas : document.getElementById("gameArea"),\r\n    start : function() {\r\n        this.canvas.width = 480;\r\n        this.canvas.height = 320; \r\n        this.context = this.canvas.getContext(\"2d);\");\r\n    }\r\n};', 'javascript'];

//########## Step Two ##########//
contents[1] = ['function startGame() {\r\n    myGameArea.start();\r\n    myGamePiece = new component(30, 30, \"black\", 10, 120);\r\n}\n\nfunction component(width, height, color, x, y) {\r\n    this.width = width;\r\n    this.height = height;\r\n    this.x = x;\r\n    this.y = y;\r\n    ctx = myGameArea.context;\r\n    ctx.fillstyle = color;\r\n    ctx.fillRect(this.x, this.y, this.width, this.height);\r\n}', 'javascript'];

$.getScript('../steps/step2', function(){
    step2();
});
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
});
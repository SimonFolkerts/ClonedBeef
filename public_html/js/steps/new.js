(function () {
    var step = 16;

    $('#canvas-step-16').on('tap click', function (event) {
        event.preventDefault();
        if (!gameArea.canvas) {
            startGame();
            $('#canvas-step-16').addClass('no-cursor');
        } else if (!gameArea.active) {
            gameArea.interval = setInterval(updateGameArea, 20);
            gameArea.active = true;
            $('#canvas-step-16').addClass('no-cursor');
        }
    });
    $(window).on('tap click', function (event) {
        if (!gameArea.canvas) {
            return null;
        } else if (event.target !== $('#canvas-step-16')[0] && gameArea.active) {
            gameArea.pause();
            $('#canvas-step-16').removeClass('no-cursor');
        }
    });
//  these event listeners trigger the setup/pausing/unpausing of the game

    function startGame() {
        gameArea.start();
        playerShip = new playerShip(40, 120, playerShipProperties);
        cursor = new cursor(0, 0, cursorProperties);
    }
//  this function calls the necessary methods and functions to set up the game world



//  OBJECTS AND OBJECT CONSTRUCTORS ================================================

    var gameArea = {
        start: function () {
            this.active = true;
            this.terminate = false;

            this.enemies = [];
            this.playerMissiles = [];
            this.explodyBits = [];
            this.exhausts = [];
            this.crosshairs = [];
            this.explosions = [];
            this.entities = [
                [this.enemies],
                [this.playerMissiles],
                [this.explodyBits],
                [this.exhausts],
                [this.crosshairs],
                [this.explosions]
            ];
            this.frameNo = 0;
            this.canvas = document.getElementById('canvas-step-' + (step));
            this.canvas.width = 480;
            this.canvas.height = 320;
            this.context = this.canvas.getContext("2d");
            this.interval = setInterval(updateGameArea, 20);
            this.mouseX = 0;
            this.mouseY = 0;
            this.mouseDown = false;
            this.score = 0;

            this.bgImg = new Image();
            this.bgImg.src = '../img/background.jpg';
            this.bgCounter = 0;

            this.canvas.addEventListener("touchmove", function (event) {
                gameArea.getTouchPos(event);
                cursor.visible = false;
            });
            this.canvas.addEventListener("mousemove", function (event) {
                gameArea.getMousePos(event);
                cursor.visible = true;
            });
            this.canvas.addEventListener("touchstart", function (event) {
                event.preventDefault();
                event.stopPropagation();
                gameArea.getTouchPos(event);
                if (gameArea.terminate) {
                    gameArea.start();
                }
                gameArea.mouseDown = true;
                cursor.visible = false;
            });
            this.canvas.addEventListener("mousedown", function () {
                if (gameArea.terminate) {
                    gameArea.start();
                }
                gameArea.mouseDown = true;
                cursor.visible = true;
            });
            ['mouseup', 'touchend'].forEach(function (event) {
                gameArea.canvas.addEventListener(event, function () {
                    gameArea.mouseDown = false;
                });
            });
        },
        getMousePos: function (mouseEvent) {
            var rect = this.canvas.getBoundingClientRect();
            gameArea.mouseX = Math.round(mouseEvent.clientX) - rect.left;
            gameArea.mouseY = Math.round(mouseEvent.clientY) - rect.top;
        },
        getTouchPos: function (touchEvent) {
            var rect = this.canvas.getBoundingClientRect();
            gameArea.mouseX = touchEvent.touches[0].clientX - rect.left;
            gameArea.mouseY = touchEvent.touches[0].clientY - rect.top;
            if (event.target === gameArea.canvas) {
                event.preventDefault();
            }
        },
        background: function () {
            if (this.bgCounter <= 615) {
                this.bgCounter++;
            } else {
                this.bgCounter = 0;
            }
            this.context.drawImage(this.bgImg, 0, 0, this.bgImg.width, 320, 0 - this.bgCounter, 0, this.bgImg.width, 320);
        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        pause: function () {
            clearInterval(this.interval);
            this.active = false;
            this.updateScore();
        },
        stop: function () {
            clearInterval(this.interval);
            this.active = false;
            this.terminate = true;
            this.killEntities();
        },
        killEntities: function () {
            playerShip.targets = [];
            this.entities.forEach(function (entityList) {
                entityList.forEach(function (entity) {
                    if (entity.active) {
                        entity.active = false;
                    }
                });
            });
        },
        updateScore: function () {
            ctx = gameArea.context;
            ctx.font = "20px Arial";
            ctx.fillStyle = 'black';
            if (!this.active && !this.terminate) {
                ctx.fillText(this.score + ' - PAUSED', 5, 20);
            } else {
                ctx.fillText(this.score, 5, 20);
            }
        }
    };
//  this object stores the game state and contains the functionality necesary 
//  to initialize, interface with and display the game world.
//  ----- methods:
//  start()         - initialise the game area
//  getMousePos()   - get the mouse position
//  getTouchPos()   - get touch position
//  background()    - adjust and draw the background
//  clear()         - empty the canvas
//  pause()         - halt the game, preserving state
//  stop()          - halt the game, initiate cleanup
//  killEntities()  - set all extant active objects to inactive
//  updateScore()   - update the score readout
//  --------------------------------------------------------------------------------   


    function component(x, y, params) {
        //basic attributes
        this.active = params.active;
        this.age = 0;
        //position and dimension info
        this.x = x;
        this.y = y;
        this.width = params.width;
        this.height = params.height;
        this.topLeftBoundary = function () {
            //this determines the top left coordinate
            //of the entity for collision detection
            return {
                x: this.x - this.width / 2,
                y: this.y - this.height / 2
            };
        };
        this.topLeftSprite = function () {
            //this determines the top left coordinate
            //of the entity for drawing
            return {
                x: this.x - this.destWidth / 2,
                y: this.y - this.destHeight / 2
            };
        };
        this.rotate = params.rotate;
        this.angle = params.angle;
        //bounding box info
        this.color = params.color;
        //rendering info
        this.image = new Image();
        this.image.src = params.image;
        this.offsetX = params.offsetX;
        this.offsetY = params.offsetY;
        this.srcWidth = params.srcWidth;
        this.srcHeight = params.srcHeight;
        this.index = params.index;
        this.destWidth = this.srcWidth * params.rescaleX;
        this.destHeight = this.srcHeight * params.rescaleY;
        //draw bounding box
        this.drawBox = function () {
            //this function checks if rotation is enabled for this object, and if so,
            //runs the code necessary to draw the rotated image. Otherwise is skips the
            //save/rotate/restore actions to improve performance and merely draws a rect
            ctx = gameArea.context;
            if (this.rotate) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
            }
            ctx.fillStyle = this.color;
            ctx.fillRect(
                    this.topLeftBoundary().x * !this.rotate, //if rotate this is 0
                    this.topLeftBoundary().y * !this.rotate,
                    this.width,
                    this.height);
            if (this.rotate) {
                ctx.restore();
            }
        };
        //draw sprite
        this.drawSprite = function () {
            //this function uses the same logic as the one above, but instead of a rect
            //it draws a specified sprite frame.
            if (this.rotate) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
            }
            gameArea.context.drawImage(
                    this.image, //source file
                    (this.index * this.srcWidth), //source x
                    0, //source y
                    this.srcWidth, //sub-image width
                    this.srcHeight, //sub-image height
                    this.topLeftSprite().x + this.offsetX * !this.rotate, //if rotate this is 0
                    this.topLeftSprite().y + this.offsetY * !this.rotate,
                    this.destWidth, //destination width
                    this.destHeight); //destination height
            if (this.rotate) {
                ctx.restore();
            }
        };
    }
//  this serves as the prototype for the entities on the board. It contains information 
//  necessary to position and render the entities at various locations, orientations and so on.
//  ----- external methods:
//  drawBox()       - draw bounding box
//  drawSprite()    - draw sprite
//  --------------------------------------------------------------------------------    


    function playerShip(x, y, params) {
        //run component()'s initialization logic - playerShip extends component
        component.call(this, x, y, params);

        this.acceleration = params.acceleration;
        this.maxSpeed = params.maxSpeed;
        this.targetsLocked = [];

        //if mouse is not pressed and there are targets locked, fire a missile at and
        //unlock each target in sequence until no targets are locked
        this.fireControl = function () {
            if (!gameArea.mouseDown && this.targetsLocked.length >= 1) {
                if (gameArea.frameNo % 3 === 0) {
                    this.fire(this.targetsLocked[0]);
                    this.targetsLocked.splice(0, 1);
                }
            }
            ;
        };

        //fire a missile at a target
        this.fire = function (target) {
            gameArea.playerMissiles.push(new playerMissile(playerShip.x, playerShip.y, playerMissileProperties, target));
        };

        //update position with respect to user input
        this.newPos = function (targetY) {
            this.y += (clamp((targetY - this.y), -this.maxSpeed, this.maxSpeed)) / this.acceleration;
        };

        //run necessary logic to prepare for the next frame
        this.update = function () {
            this.fireControl();
            this.index = Math.floor(clamp(((this.y - gameArea.mouseY) / 13 + 15), 0, 29));
        };
    }
//  playerShip extends component. This constructs the player character.
//  ----- external methods:
//  newPos()        - update position
//  update()        - controller that prepares for next frame and draws object
//  drawBox()       - draw bounding box
//  drawSprite()    - draw sprite
//  --------------------------------------------------------------------------------    


    function playerMissile(x, y, params, target) {
        //run component()'s initialization logic - playerMissile extends component
        component.call(this, x, y, params, target);

        this.acceleration = params.acceleration;

        this.x = x;
        this.y = y;
        this.velocityX;
        this.velocityY;
        this.thrust = 0;
        this.target = target;
        this.target.tracked = true;
        this.targetsLocked = [];

        //get angle to target
        this.getAngle = function () {
            var x = this.x - (this.target.x);
            var y = this.y - (this.target.y);
            this.angle = (Math.atan2(y, x)) - Math.PI;
        };
        //update position with respect to target
        this.newPos = function () {
            var tx = (this.target.x) - this.x;
            var ty = (this.target.y) - this.y;
            var dist = Math.sqrt(tx * tx + ty * ty);

            this.thrust = this.thrust + this.acceleration;

            this.velocityX = (tx / dist) * this.thrust;
            this.velocityY = (ty / dist) * this.thrust;

            this.x += this.velocityX;
            this.y += this.velocityY;
        };
        //run necessary logic to prepare for the next frame
        this.update = function () {
            this.age++;
            this.getAngle();
            if (this.index <= 18) {
                this.index++;
            } else {
                this.index = 1;
            }
            if (this.age > 75) {
                this.active = false;
            }
//            for (var i = 0; i <= 6; i++) {
//                gameArea.exhausts.push(new exhaust((Math.random() * 10) + this.x, this.y, this.angle));
//            }
        };
    }
    //  playerMissile extends component. This constructs a missile object.
//  ----- external methods:   
//  newPos()        - update position
//  update()        - controller that prepares for next frame and draws object
//  drawBox()       - draw bounding box
//  drawSprite()    - draw sprite
//  --------------------------------------------------------------------------------

    function enemyBasic(x, y, params, speed) {
        //run component()'s initialization logic - enemyBasic extends component
        component.call(this, x, y, params);

        this.speed = speed;
        this.locked = false;
        this.tracked = false;

        //run necessary logic to prepare for the next frame
        this.update = function () {
            //sprite animation loop
            if (this.index <= 117) {
                this.index++;
            } else {
                this.index = 0;
            }
            //if object leaves left side of gameArea then self-destruct
            if (this.x <= -100) {
                this.active = false;
            }
            //if touched by cursor whilst not locked, set self to locked
            if (cursor.hoverEnemy === this && !this.locked) {
                console.log('lock');
                if (gameArea.mouseDown) {
                    this.locked = true;
                    playerShip.targetsLocked.push(this);
                    //create new crosshair over this enemyBasic with a set size
                    gameArea.crosshairs.push(new crosshair(this.x, this.y, crosshairProperties, this));
                }
            }
        };
        //update position
        this.newPos = function () {
            this.x += this.speed;
        };
    }
//  enemyBasic extends component. This object is the most basic enemy.
//  ----- external methods:   
//  newPos()        - update position
//  update()        - controller that prepares for next frame and draws object
//  drawBox()       - draw bounding box
//  drawSprite()    - draw sprite
//  --------------------------------------------------------------------------------


    function cursor(x, y, params) {
        //run component()'s initialization logic - cursor extends component
        component.call(this, x, y, params);

        this.visible = true;
        this.hoverEnemy = false;

        //update position with respect to user input
        this.newPos = function () {
            this.x = gameArea.mouseX;
            this.y = gameArea.mouseY;
        };
        this.update = function () {
            if (gameArea.mouseDown) {
                //sprite animation increments to maximum and holds if mouseDown
                if (this.index < 10) {
                    this.index += 2;
                } else {
                    this.index = 10;
                }
            } else if (this.index > 0) {
                //else decrements to minimum and holds if !mouseDown
                this.index -= 2;
            } else {
                this.index = 0;
            }

            if (this.visible) {
                this.width = params.widthMouse;
                this.height = params.heightMouse;
                this.drawSprite();
            } else {
                this.width = params.widthTouch;
                this.height = params.heightTouch;
            }
        };
    }
//  cursor extends component. This constructs the cursor object.
//  external methods:
//  newPos()        - update position
//  update()        - controller that prepares for next frame and draws object
//  drawBox()       - draw bounding box
//  NB this object assumes control of its own sprite drawing, no drawSprite() call necessary
//  --------------------------------------------------------------------------------    


    function crosshair(x, y, params, parent) {
        //run component()'s initialization logic - cursor extends component
        component.call(this, x, y, params);

        //the size to shrink to
        this.minSize = params.minSize;

        //object this crosshair is slaved to
        this.parent = parent;

        //toggle the box color at a regular interval if at min size
        this.flashLockBox = function () {
            this.angle = 0;
            if (this.age % 4 === 0 && this.width <= this.minSize) {
                if (this.color === 'red') {
                    this.color = 'transparent';
                } else {
                    this.color = 'red';
                }
            }
        };
        //update position based on parent
        this.newPos = function () {
            this.x = this.parent.x;
            this.y = this.parent.y;
        };
        //custom draw function using stroke. Prototype uses rect
        this.drawCustom = function () {
            ctx = gameArea.context;
            ctx.save();
            ctx.translate(this.parent.x, this.parent.y);
            ctx.rotate(this.angle);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.strokeRect(0 - this.width / 2, 0 - this.width / 2, this.width, this.height);
            ctx.restore();
        };
        this.update = function () {
            this.age++;

            if (this.width > this.minSize & this.age > 5) {
                //if crosshair has existed for a set time and is above a set size, begin shrinking
                this.width -= 10;
                this.height -= 10;
            }
            if (!this.parent.tracked) {
                //if not tracked by missile, rotate red
                this.color = '#005500';
                this.angle -= 0.1;
            } else {
                this.flashLockBox();
            }
            //custom draw function uses stroke
            this.drawCustom();
            //existence is tied to the parent
            if (!this.parent.active) {
                this.active = false;
            }
        };
    }
//  crosshair extends component. This constructs crosshair objects.
//  external methods:
//  newPos()        - update position
//  update()        - controller that prepares for next frame and draws object
//  drawBox()       - draw bounding box
//  NB this object assumes control of its own canvas based drawing, no drawSprite() call necessary
//  --------------------------------------------------------------------------------    



//  UTILITY FUNCTIONS  =============================================================

    function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }

    function collision(a, b) {
        return a.topLeftBoundary().x < b.topLeftBoundary().x + b.width &&
                a.topLeftBoundary().x + a.width > b.topLeftBoundary().x &&
                a.topLeftBoundary().y < b.topLeftBoundary().y + b.height &&
                a.topLeftBoundary().y + a.height > b.topLeftBoundary().y;
    }

    function collisionHandler() {
        cursor.hoverEnemy = null;
        $(gameArea.enemies).each(function () {
            enemy = this;
            if (collision(playerShip, enemy)) {
                gameArea.score = "FAILED AT " + gameArea.score + ' - CLICK TO RESTART';
                gameArea.stop();
            }
            if (collision(cursor, enemy)) {
                cursor.hoverEnemy = enemy;
            }
        });
        $(gameArea.playerMissiles).each(function () {
            if (collision(this.target, this)) {
                gameArea.score += 10;
                this.target.active = false;
                this.active = false;
                for (var i = 0; i < 10; i++) {
//                    gameArea.explodyBits.push(new explodyBit(this.x, this.y));
                }
//                gameArea.explosions.push(new explosion(this.target.x, this.target.y));
            }
        });
    }



//  THE LOOP =======================================================================

    function updateGameArea() {
        gameArea.clear();
        gameArea.frameNo++;

        //PLAYER SHIP ==============================================================
        playerShip.update();
        playerShip.newPos(gameArea.mouseY);
        playerShip.drawSprite();
        playerShip.drawBox();

        //PLAYERMISSILES
        //filter missiles
        gameArea.playerMissiles = gameArea.playerMissiles.filter(function (playerMissile) {
            return playerMissile.active;
        });
        //update and render missiles
        $(gameArea.playerMissiles).each(function () {
            this.newPos();
            this.update();
            this.drawSprite();
            this.drawBox();
        });

        //ENEMIES ==================================================================
        //filter enemies
        gameArea.enemies = gameArea.enemies.filter(function (enemyBasic) {
            return enemyBasic.active;
        });
        //spawn enemies
        if ((Math.random() * 1000) > (990 - gameArea.frameNo / 100)) {
            gameArea.enemies.push(new enemyBasic(490, (Math.random() * 280), enemyBasicProperties, (Math.random() * -1.5 - 1)));
        }
        //update and render enemies
        $(gameArea.enemies).each(function () {
            this.newPos();
            this.update();
            this.drawSprite();
            this.drawBox();
        });

        //CROSSHAIRS ===============================================================
        //filter crosshairs
        gameArea.crosshairs = gameArea.crosshairs.filter(function (crosshair) {
            return crosshair.active;
        });
        //render crosshairs
        $(gameArea.crosshairs).each(function () {
            this.newPos();
            this.update();
        });

        //CURSOR ===================================================================
        cursor.update();
        cursor.newPos();
        cursor.drawBox();

        console.log(playerShip.targetsLocked);
        collisionHandler();
    }
})();
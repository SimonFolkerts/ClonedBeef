var playerShipProperties = {
    active: true,
    age: 0,
    width: 55,
    height: 28,
    
    acceleration: 35,
    maxSpeed: 130,
    
    rotate: false,
    angle: null,
    
    color: 'red',
    image:  '../img/ship_sprite_sheet.png',
    offsetX: 0,
    offsetY: 4,
    srcWidth: 100,
    srcHeight: 100,
    index: 15,
    rescaleX: 0.75,
    rescaleY: 0.75
};

var playerMissileProperties = {
    active: true,
    age: 0,
    width: 33,
    height: 12,
    
    acceleration: 0.3,
    
    rotate: true,
    angle: 0,
    
    color: 'green',
    image:  '../img/missile_sprite_sheet.png',
    offsetX: 0,
    offsetY: 0,
    srcWidth: 50,
    srcHeight: 20,
    index: 0,
    rescaleX: 0.75,
    rescaleY: 0.75
};

var enemyBasicProperties = {
    active: true,
    age: 0,
    width: 30,
    height: 30,
    
    rotate: false,
    angle: null,
    
    color: 'red',
    image:  '../img/drone_sprite_sheet.png',
    offsetX: 0,
    offsetY: 0,
    srcWidth: 120,
    srcHeight: 120,
    index: 0,
    rescaleX: 0.35,
    rescaleY: 0.35
};

var cursorProperties = {
    active: true,
    age: 0,
    widthMouse: 10,
    heightMouse: 10,
    widthTouch: 40,
    heightTouch: 40,
    
    rotate: false,
    angle: null,
    
    color: 'red',
    image:  '../img/cursor_sprite_sheet.png',
    offsetX: 0,
    offsetY: 0,
    srcWidth: 200,
    srcHeight: 200,
    index: 0,
    rescaleX: 0.2,
    rescaleY: 0.2
};

var crosshairProperties = {
    active: true,
    age: 0,
    width: 100,
    height: 100,
    minSize: 45,
    
    rotate: true,
    angle: 0,
    
    color: '#005500',
    image:  '',
    offsetX: '',
    offsetY: '',
    srcWidth: '',
    srcHeight: '',
    index: '',
    rescaleX: '',
    rescaleY: ''
};


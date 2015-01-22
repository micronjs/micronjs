
// Input.js

Input = Base.extend({

    keysDown : {},
    isClick : false,
    clickPosition : { x:0, y:0 },
    mousePosition : { x:0, y:0 },
    inputObjectsRegistered : [],
    supportsMultitouch : false,
    scale : { x:1, y:1 },
    offset : { x:0, y:0 },

    // some useful keys
    KEY_BACK : 8,	KEY_TAB	: 9,	 KEY_ENTER : 13,	KEY_SHIFT : 16,	    KEY_CTRL : 17,
    KEY_ALT : 18,	KEY_PAUSE : 19,  KEY_CLOCK : 20,	KEY_ESC : 27,	    KEY_SPACE : 32,
    KEY_PGUP : 33,	KEY_PGDOWN : 34, KEY_END	: 35,	KEY_HOME : 36,	    KEY_LEFT : 37,
    KEY_UP : 38,	KEY_RIGHT : 39,  KEY_DOWN : 40,	    KEY_INSERT : 45,    KEY_DEL : 46,
    KEY_0	: 48,	KEY_1	: 49,	 KEY_2	: 50,	    KEY_3	: 51,	    KEY_4	: 52,
    KEY_5	: 53,	KEY_6	: 54,    KEY_7	: 55,	    KEY_8	: 56, 	    KEY_9	: 57,
    KEY_A	: 65,	KEY_B	: 66,	 KEY_C	: 67,	    KEY_D	: 68,	    KEY_E   : 69,
    KEY_F   : 70,	KEY_G	: 71,    KEY_H	: 72,	    KEY_I	: 73,	    KEY_J	: 74,
    KEY_K	: 75,	KEY_L	: 76,	 KEY_M	: 77,	    KEY_N	: 78,	    KEY_O	: 79,
    KEY_P	: 80,	KEY_Q	: 81,    KEY_R	: 82,	    KEY_S	: 83,	    KEY_T	: 84,
    KEY_U	: 85,	KEY_V	: 86,	 KEY_W	: 87,	    KEY_X	: 88,	    KEY_Y	: 89,
    KEY_Z	: 90,	KEY_NUM0 : 96,   KEY_NUM1 : 97,	    KEY_NUM2 : 98,	    KEY_NUM3 : 99,
    KEY_NUM4 : 100,	KEY_NUM5 : 101,	 KEY_NUM6 : 102,	KEY_NUM7 : 103,	    KEY_NUM8 : 104,
    KEY_NUM9 : 105,	KEY_MUL : 106,   KEY_ADD : 107,	    KEY_SUB : 109,	    KEY_POINT : 110,
    KEY_DIV : 111,

    constructor : function()
    {
        this.inputObjectsRegistered = [];
        this.supportsMultitouch = this.checkMulitouchSupport();

        if(this.supportsMultitouch)
        {
            addEventListener("touchstart", function (e) {
                var touches = e.changedTouches;
                var firstTouch = touches[0];
                Input.generateClick(firstTouch.clientX, firstTouch.clientY);
            } , true);

            addEventListener("touchend", function (e) {
                Input.releaseClick();
            } , true);
        }
        else
        {
            addEventListener("mousedown", function (e) {
                Input.generateClick(e.clientX, e.clientY);
            } , true);

            addEventListener("mouseup", function (e) {
                Input.releaseClick();
            } , true);

            addEventListener("mousemove", function(e) {
                Input.mouseMoved(e.clientX, e.clientY);
            }, true);
        }
    },

    resetAll : function()
    {
        this.keysDown = {};
        this.isClick = false;
        this.clickPosition = { x:0, y:0 };
        this.mousePosition = { x:0, y:0 };
    },

    checkMulitouchSupport : function()
    {
        return ("ontouchstart" in document.documentElement);
    },

    addInputReceiver : function(object)
    {
        this.inputObjectsRegistered.push(object);
    },

    isKeyPressed : function(key)
    {
        return (key in this.keysDown);
    },

    isMousePressed : function()
    {
        return (this.isClick === true);
    },

    isMouseReleased : function()
    {
        return (this.isClick === false);
    },

    generateClick : function(xpos, ypos)
    {
        this.isClick = true;
        this.clickPosition.x = this.mousePosition.x = (xpos / this.scale.x) - (this.offset.x / this.scale.x);
        this.clickPosition.y = this.mousePosition.y = (ypos / this.scale.y) - (this.offset.y / this.scale.y);

        // for all the objects that registered as "clickInputReceivers", call them with the event
        for(var i = 0; i < this.inputObjectsRegistered.length; i++)
        {
            this.inputObjectsRegistered[i].onClickInput(this.clickPosition.x, this.clickPosition.y);
        }
    },

    releaseClick : function()
    {
        this.isClick = false;
        this.clickPosition.x = -1;
        this.clickPosition.y = -1;
        // todo: add a call to a release method too?
    },

    mouseMoved : function(x, y)
    {
        this.mousePosition.x = (x / this.scale.x) - (this.offset.x / this.scale.x);
        this.mousePosition.y = (y / this.scale.y) - (this.offset.y / this.scale.y);
    },

    getMousePosition : function()
    {
        return this.mousePosition;
    },

    getMousePositionInWorld : function()
    {
        var mouseInWorld = {x: this.mousePosition.x + Camera.x, y : this.mousePosition.y + Camera.y };
        return mouseInWorld;
    }
});

var Input = new Input();

addEventListener("keydown", function (e) {
    Input.keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete Input.keysDown[e.keyCode];
}, false);

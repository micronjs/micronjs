/***
 * MICRON. Almar. 2014-2015. Core. Input. Graphics. Sound. And a lot of other things.
 ***/

// Core.js

// Quick and simple requestAnimFrame.
window.requestAnimFrame = (function()
{
    return (
        window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

//-----------------------------------------------------------------------

var tweenEmptyFunc = function() { /* do nothing */ };

// Helper class to encapsulate our current tweened objects
var TweenObject = Base.extend({

    object : null,
    property : "",
    initial : 0.0,
    destination : 0.0,
    time : 0.0,
    easing : "easeLinearIn", // added here to avoid issues (utils needs tween object and tweenobject needs utils...)
    callback : tweenEmptyFunc,
    currentTime : 0.0,

    // params: (object, property, destination, time, easing function, callback)
    constructor : function(o, p, d, t, e, c)
    {
        this.object = o;
        this.initial = this.object[p];
        this.property = p;
        this.destination = d;
        this.time = t;

        if(typeof e !== "undefined" && e !== null) // the same as "easing" initialization
        {
            this.easing = e;
        }
        if(typeof c !== "undefined" && c !== null) // and again
        {
            this.callback = c;
        }
    }
});

//-----------------------------------------------------------------------
// Utils
var UtilsDef = Base.extend({

    _tweenFuncs : null,
    _tweens : null,

    // easing functions: linear(default), sine, quad, expo, elastic, cubic, circular, bounce, back
    E_LINEAR_IN     : "easeLinearIn", 	E_LINEAR_OUT 	: "easeLinearOut", 	 E_LINEAR_INOUT 	: "easeLinearInOut",
    E_SINE_IN 		: "easeSineIn", 	E_SINE_OUT      : "easeSineOut", 	 E_SINE_INOUT 	: "easeSineInOut",
    E_QUAD_IN 		: "easeQuadIn", 	E_QUAD_OUT 		: "easeQuadOut", 	 E_QUAD_INOUT 	: "easeQuadInOut",
    E_EXPO_IN 		: "easeExpoIn", 	E_EXPO_OUT 		: "easeExpoOut", 	 E_EXPO_INOUT 	: "easeExpoInOut",
    E_ELASTIC_IN 	: "easeElasticIn", 	E_ELASTIC_OUT   : "easeElasticOut",  E_ELASTIC_INOUT : "easeElasticInOut",
    E_CUBIC_IN 		: "easeCubicIn", 	E_CUBIC_OUT 	: "easeCubicOut", 	 E_CUBIC_INOUT   : "easeCubicInOut",
    E_CIRCULAR_IN 	: "easeCircularIn", E_CIRCULAR_OUT 	: "easeCircularOut", E_CIRCULAR_INOUT: "easeCircularInOut",
    E_BOUNCE_IN 	: "easeBounceIn", 	E_BOUNCE_OUT 	: "easeBounceOut", 	 E_BOUNCE_INOUT 	: "easeBounceInOut",
    E_BACK_IN 		: "easeBackIn", 	E_BACK_OUT 		: "easeBackOut", 	 E_BACK_INOUT 	: "easeBackInOut",

    constructor : function()
    {
        this._tweenFuncs = {};
        this._tweenFuncs[this.E_LINEAR_IN] = this.easeLinear.bind(this);
        this._tweenFuncs[this.E_LINEAR_OUT] = this.easeLinear.bind(this);
        this._tweenFuncs[this.E_LINEAR_INOUT] = this.easeLinear.bind(this);
        this._tweenFuncs[this.E_SINE_IN] = this.easeSineIn.bind(this);
        this._tweenFuncs[this.E_SINE_OUT] = this.easeSineOut.bind(this);
        this._tweenFuncs[this.E_SINE_INOUT] = this.easeSineInOut.bind(this);
        this._tweenFuncs[this.E_QUAD_IN] = this.easeQuadIn.bind(this);
        this._tweenFuncs[this.E_QUAD_OUT] = this.easeQuadOut.bind(this);
        this._tweenFuncs[this.E_QUAD_INOUT] = this.easeQuadInOut.bind(this);
        this._tweenFuncs[this.E_EXPO_IN] = this.easeExpoIn.bind(this);
        this._tweenFuncs[this.E_EXPO_OUT] = this.easeExpoOut.bind(this);
        this._tweenFuncs[this.E_EXPO_INOUT] = this.easeExpoInOut.bind(this);
        this._tweenFuncs[this.E_ELASTIC_IN] = this.easeElasticIn.bind(this);
        this._tweenFuncs[this.E_ELASTIC_OUT] = this.easeElasticOut.bind(this);
        this._tweenFuncs[this.E_ELASTIC_INOUT] = this.easeElasticInOut.bind(this);
        this._tweenFuncs[this.E_CUBIC_IN] = this.easeCubicIn.bind(this);
        this._tweenFuncs[this.E_CUBIC_OUT] = this.easeCubicOut.bind(this);
        this._tweenFuncs[this.E_CUBIC_INOUT] = this.easeCubicInOut.bind(this);
        this._tweenFuncs[this.E_CIRCULAR_IN] = this.easeCircularIn.bind(this);
        this._tweenFuncs[this.E_CIRCULAR_OUT] = this.easeCircularOut.bind(this);
        this._tweenFuncs[this.E_CIRCULAR_INOUT] = this.easeCircularInOut.bind(this);
        this._tweenFuncs[this.E_BOUNCE_IN] = this.easeBounceIn.bind(this);
        this._tweenFuncs[this.E_BOUNCE_OUT] = this.easeBounceOut.bind(this);
        this._tweenFuncs[this.E_BOUNCE_INOUT] = this.easeBounceInOut.bind(this);
        this._tweenFuncs[this.E_BACK_IN] = this.easeBackIn.bind(this);
        this._tweenFuncs[this.E_BACK_OUT] = this.easeBackOut.bind(this);
        this._tweenFuncs[this.E_BACK_INOUT] = this.easeBackInOut.bind(this);

        this._tweens = [];
    },

    update : function(delta)
    {
        var value;

        for(var i = 0;i < this._tweens.length; i++)
        {
            this._tweens[i].currentTime += delta;
            value = this._execTween(this._tweens[i].currentTime,
                                    this._tweens[i].initial,
                                    this._tweens[i].destination - this._tweens[i].initial,
                                    this._tweens[i].time,
                                    this._tweens[i].easing);
            this._tweens[i].object[this._tweens[i].property] = value;

            if(this._tweens[i].currentTime >= this._tweens[i].time)
            {
                this._tweens[i].object[this._tweens[i].property] = this._tweens[i].destination;
                this._tweens[i].callback();
                var index = this._tweens.indexOf(this._tweens[i]); // note: this might fuck up all, be careful
                this._tweens.splice(index, 1);
            }
        }
    },

    reset : function()
    {
        for(var i = 0;i < this._tweens.length; i++)
        {
            this._tweens[i].object[this._tweens[i].property] = this._tweens[i].destination;
            this._tweens[i].callback();
        }
        this._tweens = [];
    },

    emptyFunc : function()
    {
        // empty function, used to initialize callbacks
    },

    isEmpty : function(v)
    {
        return typeof v === "undefined" || v === null;
    },

    // note: this is shit. I know it, you know it, and even the cat of the github logo knows it.
    // But what can we do? We are simple machines afterall.
    copyAttributes : function(clone, original)
    {
        for(var attr in original)
        {
            if(original.hasOwnProperty(attr)) {
                clone[attr] = original[attr];
            }
        }
        return clone;
    },

    checkExtension : function(text, extension)
    {
        return (text.indexOf(extension) !== -1);
    },

    indexToDecimal : function(value)
    {
        return Math.floor(Math.min(value * 255, 255));
    },

    rgbaToString : function(r, g, b, a)
    {
        var color =
            "rgba(" +
            this.indexToDecimal(r) + "," +
            this.indexToDecimal(g) + "," +
            this.indexToDecimal(b) + "," +
            this.clamp(0.0, a, 1.0) +
            ")";
        return color;
    },

    invoke : function(func, time)
    {
        setTimeout(func, time * 1000);
    },

    invokeRepeating : function(func, time)
    {
        setInterval(func, time * 1000);
    },

    // Quick math functions
    distance : function(x1, y1, x2, y2)
    {
        return Math.sqrt((x1 -= x2) * x1 + (y1 -= y2) * y1);
    },

    angle : function(x1, y1, x2, y2)
    {
        return Math.atan2(x2 - x1, y2 - y1);
    },

    randRange : function(min, max)
    {
        return ((Math.random() * max) + min);
    },

    intRandRange : function(min, max)
    {
        return (Math.floor(this.randRange(min, max)));
    },

    randSpread : function(range)
    {
        return this.randRange(0, range) * (0.5 - Math.random());
    },

    randSign : function()
    {
        return Math.random() < 0.5 ? -1 : 1;
    },

    randFlipCoin : function()
    {
        return Math.random() < 0.5 ? false : true;
    },

    clamp : function(min, value, max)
    {
        return Math.min(Math.max(value, min), max);
    },

    lerp : function(initial, end, time)
    {
        return (initial + (end - initial) * time);
    },

    perp : function(initial, end, time)
    {
        return (initial + (time * time) * (end - initial));
    },

    berp : function(initial, end, time)
    {
        return (initial + (time / 2) * (end - initial));
    },

    smoothStep : function(x)
    {
        return ((x) * (x) * (3 - 2 * (x))) * 2;
    },

    // Definition for all easing functions
    // This was likely taken from somewhere, but I don't remember exactly where.
    // Note: linear works for linearIN, OUT and INOUT.
    easeLinear : function(t, b, c, d)
    {
        return c * t / d + b;
    },

    // sine
    easeSineIn : function(t, b, c, d)
    {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    easeSineOut : function(t, b, c, d)
    {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    easeSineInOut : function(t, b, c, d)
    {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },

    // quad
    easeQuadIn : function(t, b, c, d)
    {
        return c * (t /= d) * t + b;
    },

    easeQuadOut : function(t, b, c, d)
    {
        return -c * (t /= d) * (t - 2) + b;
    },

    easeQuadInOut : function(t, b, c, d)
    {
        if((t /= d / 2) < 1)
        {
            return ((c / 2) * (t * t)) + b;
        }
        return -c / 2 * (((t - 2) * (--t)) - 1) + b;
    },

    // expo
    easeExpoIn : function(t, b, c, d)
    {
        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },

    easeExpoOut : function(t, b, c, d)
    {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },

    easeExpoInOut : function(t, b, c, d)
    {
        if(t === 0)
        {
            return b;
        }
        if(t === d)
        {
            return b + c;
        }
        if((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    // elastic
    easeElasticIn : function(t, b, c, d)
    {
        if(t === 0)
        {
            return b;
        }
        if((t /= d) === 1)
        {
            return b + c;
        }
        var p = d * 0.3;
        var a = c;
        var s = p / 4.0;
        var postFix = a * Math.pow(2, 10 * (t -= 1)); // this is a fix, again, with post-increment operators
        return -(postFix * Math.sin((t * d - s) * (2.0 * Math.PI) / p)) + b;
    },

    easeElasticOut : function(t, b, c, d)
    {
        if(t === 0)
        {
            return b;
        }
        if((t /= d) === 1)
        {
            return b + c;
        }
        var p = d * 0.3;
        var a = c;
        var s = p / 4.0;
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },

    easeElasticInOut : function(t, b, c, d)
    {
        if(t === 0)
        {
            return b;
        }
        if((t /= d / 2) === 2)
        {
            return b + c;
        }
        var p = d * (0.45);
        var a = c;
        var s = p / 4.0;
        var postFix;

        if(t < 1)
        {
            postFix = a * Math.pow(2, 10 * (t -= 1));
            return -0.5 * (postFix * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        postFix =  a * Math.pow(2, -10 * (t -= 1));
        return postFix * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },

    // cubic
    easeCubicIn : function(t, b, c, d)
    {
        return c * (t /= d) * t * t + b;
    },

    easeCubicOut : function(t, b, c, d)
    {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },

    easeCubicInOut : function(t, b, c, d)
    {
        if((t /= d / 2) < 1)
        {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },

    // circular
    easeCircularIn : function(t, b, c, d)
    {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },

    easeCircularOut : function(t, b, c, d)
    {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },

    easeCircularInOut : function(t, b, c, d)
    {
        if((t /= d / 2) < 1)
        {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - t * (t -= 2)) + 1) + b;
    },

    // bounce
    easeBounceOut : function(t, b, c, d)
    {
        var postFix;
        if((t /= d) < 0.3636)
        {
            return c * (7.5625 * t * t) + b;
        }
        else if(t < 0.7272)
        {
            postFix = t -= (0.5454);
            return c * (7.5625 * (postFix) * t + 0.75) + b;
        }
        else if(t < 0.9090)
        {
            postFix = t -= (0.8181);
            return c * (7.5625 * (postFix) * t + 0.9375) + b;
        }
        else
        {
            postFix = t -= (0.9545);
            return c * (7.5625 * (postFix) * t + 0.984375) + b;
        }
    },

    easeBounceIn : function(t, b, c, d)
    {
        return c - UtilsDef.prototype.bounceOut(d - t, 0, c, d) + b;
    },

    easeBounceInOut : function(t, b, c, d)
    {
        if(t < d / 2)
        {
            return UtilsDef.prototype.bounceIn (t * 2, 0, c, d) * 0.5 + b;
        }
        else
        {
            return UtilsDef.prototype.bounceOut (t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    },

    // back
    easeBackIn : function(t, b, c, d)
    {
        var s = 1.70158;
        var postFix = t /= d;
        return c * (postFix) * t * ((s + 1) * t - s) + b;
    },

    easeBackOut : function(t, b, c, d)
    {
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },

    easeBackInOut : function(t, b, c, d)
    {
        var s = 1.70158;
        if((t /= d / 2) < 1)
        {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        var postFix = t -= 2;
        return c / 2 * ((postFix) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },

   /* About the parameters:
    * t = elapsed time
    * b = initial position (beginning)
    * c = delta position (final - initial) (change)
    * d = total duration time (in seconds)
    * e = easing function
    */
    _execTween : function(t, b, c, d, e)
    {
        var result = this._tweenFuncs[e](t, b, c, d);
        return result;
    },

    /*
     * object: holds the object to modify.
     * property: the current property to tween. from here we get the initial value.
     * destination: the final value.
     * time: the total time it will take to tween.
     * [easing]: any of the easing functions
     * [func]: callback to execute when the tween is over.
    */
    // todo: accept multliple parameters! (or something)
    tween : function(object, property, destination, time, easing, callback)
    {
        this._tweens.push(new TweenObject(object, property, destination, time, easing, callback));
    }

});

var Utils = new UtilsDef();

//--------------------------------------------------------------------------
// Everything is an entity: game states, sprites, all.
// It all goes down to the same structure: this thing. Btw, entities are poolable.
var Entity = Base.extend({

    name : "",
    entities : null,
    inUse : true, // this is true to keep consistency with non-pooled objects

    constructor : function(name)
    {
        this.name = name;
        this.entities = [];
    },

    spawn : function()
    {
        // special function used for pooling. Extend in child classes!
        this.inUse = true;
    },

    add : function(ent)
    {
        this.entities.push(ent);
    },

    remove : function(ent)
    {
        var index = this.entities.indexOf(ent);
        if(index > -1)
        {
            this.entities.splice(index, 1);
        }
    },

    removeAll : function()
    {
        this.entities = [];
    },

    clone : function()
    {
        var c = new Entity();
        c = Utils.copyAttributes(c, this);
        return c;
    },

    update : function(delta)
    {
        for(var i = 0;i < this.entities.length; i++)
        {
            this.entities[i].update(delta);
        }
    },

    draw : function()
    {
        for(var i = 0;i < this.entities.length; i++)
        {
            this.entities[i].draw();
        }
    },

    destroy : function()
    {
        for(var i = 0;i < this.entities.length; i++)
        {
            this.entities[i].destroy();
        }
        delete this.entities;
    }
});

//--------------------------------------------------------------------------
// Pools are simple ways to add groups of objects easily.
// You can mix what you pool and set the amount of each pooled object.
var Pool = Entity.extend({

    lastSpawned : 0,

    constructor : function()
    {
        this.callParent("Pool");
    },

    addToPool : function(object, amount)
    {
        if(!(object instanceof Entity))
        {
            console.log("[Core::Pool] Unable to add object " + object + ". You must extend from Entity");
            return;
        }
        object.inUse = false; // when pooling, the object gets disabled. You need to spawn it before using it.
        for(var i = 0;i < amount;i++)
        {
            var clone = object.clone();
            this.entities.push(clone);
        }
    },

    spawn : function(amount)
    {
        var spawned = [];

        for(var s = this.lastSpawned; s < this.entities.length;s++)
        {
            if(!this.entities[s].inUse)
            {
                this.entities[s].spawn();
                this.lastSpawned++;
            }
            amount--;
            spawned.push(this.entities[s]);

            if(amount <= 0)
            {
                break;
            }
        }

        this.lastSpawned = this.lastSpawned % this.entities.length;
        return spawned;
    },

    update : function(delta)
    {
        var i, entity;
        for(i = this.entities.length - 1; i >= 0; i--)
        {
            entity = this.entities[i];
            if(entity.inUse)
            {
                entity.update(delta);
            }
        }
    },

    draw : function()
    {
        for(var i = 0; i < this.entities.length; i++)
        {
            if(this.entities[i].inUse)
            {
                this.entities[i].draw();
            }
        }
    }

});

//--------------------------------------------------------------------------
// Use it to encapsulate your logic. Switch states to do different things.
var State = Entity.extend({

    constructor : function(name)
    {
        this.callParent(name);
    },

    // This is called right after all your assets were loaded by core, and before the first update and draw.
    // Use this method to load/create objects that require assets fully loaded.
    init : function()
    {
    },

    // override this method to control what happens when the game is paused
    onPause : function(flag)
    {
    }
});

//--------------------------------------------------------------------------
// Main game thing.
Core = Base.extend({

    currentState : null,
    width : 0,
    height : 0,
    storage : false,
    fps : 0,
    fpsCounter : 0,
    elapsed : 0,
    totalTime : 0.0,
    delta : 0.016,
    timeScale : 1.0,
    date : null,
    dateNow: null,
    dateThen : null,
    loaded : false,
    assets : null, // keep it in case someone wants just to iterate through assets quickly
    assetsMap : null,
    assetsLoaded : 0,
    pause : false,

    constructor : function()
    {
        // do something?
    },

    // Pass the size the game should have on the screen. It will be rescaled and recentered automatically.
    init : function(width, height)
    {
        this.width = width;
        this.height = height;
        window.addEventListener("resize", this._calculateResize.bind(this));
        window.addEventListener("blur", this._onBlur.bind(this));
        //window.addEventListener("focus", this._onFocus.bind(this));
        Graphics.init(this.width, this.height);
        this._calculateResize();

        this.delta		= 0.0;
        this.date		= new Date();
        this.dateThen 	= Date.now();
        this.dateNow 	= Date.now();

        this.storage = this.hasStorageSupport();
        this.assets = [];
        this.assetsMap = {};
    },

    _calculateResize : function()
    {
        var appWidth = this.width,
            appHeight = this.height,
            windowWidth = window.innerWidth,
            windowHeight = window.innerHeight,
            ratio = Math.min(windowWidth / appWidth, windowHeight / appHeight),
            scaledAppWidth = Math.floor(appWidth * ratio),
            scaledAppHeight = Math.floor(appHeight * ratio),
            offsetX = (windowWidth - scaledAppWidth) / 2,
            offsetY = (windowHeight - scaledAppHeight) / 2;

        Graphics.rescale(scaledAppWidth, scaledAppHeight);
        Graphics.reposition(offsetX, offsetY);
    },

    _onBlur : function()
    {
        this.pause = true;
        Input.resetAll();

        if(this.currentState !== null)
        {
            this.currentState.onPause(true);
        }
    },

    //_onFocus : function()
    //{
    //	this.pause = false;
    //},

    update : function(delta)
    {
        // extremely simple way to calculate FPS
        this.elapsed += delta;
        this.fpsCounter++;
        if(this.elapsed >= 1)
        {
            this.elapsed = 0.0;
            this.fps = this.fpsCounter;
            this.fpsCounter = 0;
        }

        if(!this.pause)
        {
            this.totalTime += delta;

            if(this.currentState !== null)
            {
                this.currentState.update(delta * this.timeScale);
            }

            Utils.update(delta * this.timeScale);
            Graphics.update(delta * this.timeScale);
        }
        else if(Input.isMousePressed())
		{
            this.pause = false;
            if(this.currentState !== null)
            {
                this.currentState.onPause(false);
            }
        }
    },

    draw : function()
    {
        if(this.currentState !== null)
        {
            Graphics.preDraw();
            this.currentState.draw();
            Graphics.postDraw();
        }

        if(this.pause)
        {
            Graphics.drawFullScreenRect (0, 0, 0, 0.72);
            Graphics.enableBlur(5, 1, 1, 1, 1);
            Graphics.drawRegularPolygon (
                Graphics.width / 2,
                Graphics.height / 2,
                3,
                Utils.scalePercentWidth(25),
                1,
                1,
                1,
                1,
                "fill"
            );
            Graphics.disableBlur();
        }
    },

    run : function(time)
    {
        this.dateNow 	= this.date.getTime();
        this.delta 		= this.dateNow - this.dateThen;
        this.delta 		= this.delta || 0.016;
        this.dateThen 	= this.dateNow;

        // execute update and draw
        this.update(this.delta);
        this.draw();
        window.requestAnimFrame(this.run.bind(this));
    },

    setState : function(state)
    {
        if(this.currentState !== null)
        {
            this.currentState.destroy();
        }

        this.currentState = null;
        //delete this.currentState;
        this.currentState = state;
        this.currentState.init();
        this._calculateResize();
    },

    getFPS : function()
    {
        return this.fps;
    },

    // todo: use for images only for now!
    addAsset : function(pathOrArray)
    {
        if(pathOrArray instanceof Array)
        {
            for(var i = 0; i < pathOrArray.length; i += 2)
            {
                this.assetsMap[pathOrArray[i]] = pathOrArray[i + 1];
                this.assets.push(pathOrArray[i + 1]);
            }
        }
        else if(typeof pathOrArray === "string")
        {
            this.assets.push(pathOrArray);
            this.assetsMap[""] = pathOrArray;
        }
        else
        {
            console.log(
                "[Core::addAsset] You should not try to add ", pathOrArray, " as an asset. " +
                "Try using a string or an array instead."
            );
        }
    },

    loadAndRun : function()
    {
        // todo: load other type of assets
        var path;
        var empty = true;
        for(var key in this.assetsMap)
        {
            if(
                this.assetsMap.hasOwnProperty(key) &&
                (Utils.checkExtension(path, ".jpg") ||
                Utils.checkExtension(path, ".png") ||
                Utils.checkExtension(path, ".svg"))
            )
            {
                empty = false;
                path = this.assetsMap[key];
                Graphics.loadImage(key, path);
            }
        }
        // hackity hackity hack!
        if(empty)
        {
            this.onImageLoaded();
        }
    },

    hasStorageSupport : function()
    {
        try
        {
            return "localStorage" in window && window.localStorage !== null;
        }
        catch(e)
        {
            return false;
        }
    },

    saveToStorage : function(object, value)
    {
        if(this.storage)
        {
            localStorage[object] = value;
        }
    },

    readFromStorage : function(object)
    {
        if(this.storage)
        {
            return localStorage[object];
        }
        return null;
    },

    // todo: add a callback to have custom drawing here
    onImageLoaded : function()
    {
        this.assetsLoaded++;
        if(this.assetsLoaded >= this.assets.length)
        {
            if(this.currentState !== null)
            {
                this.currentState.init();
                this.run();
            }
        }
        else
        {
            Graphics.drawFullScreenRect(0, 0, 0, 1);
            Graphics.enableBlur(25, 1, 1, 1, 1);
            Graphics.drawRegularPolygon (
                Graphics.width / 2,
                Graphics.height / 2,
                Math.round((this.assetsLoaded / this.assets.length) * 10) + 3,
                Utils.scalePercentWidth(15),
                1,
                1,
                1,
                1,
                "fill"
            );
            Graphics.disableBlur();
            console.log("[Core::onImageLoaded] Loaded: " + this.assetsLoaded + " / " + (this.assets.length - 1));
        }
    }
});

var Core = new Core();

//-----------------------------------------------------------------
/* Extra utils: these ones need to be after the core, so I put them here
 * These two functions return the value in pixels given the percentage (from 0..100).
 * Example: the screen is (800x600). Using scalePercentWidth(50) and scalePercentHeight(50) would return 400x300.
 * This is useful to quickly rescale values across the screen using percentages.
 */
Utils.scalePercentWidth = function(value)
{
    return Math.round((Core.width * value) / 100);
};

Utils.scalePercentHeight = function(value)
{
    return Math.round((Core.height * value) / 100);
};

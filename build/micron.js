window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1e3 / 60);
    };
}();

var tweenEmptyFunc = function() {};

var TweenObject = Base.extend({
    object: null,
    property: "",
    initial: 0,
    destination: 0,
    time: 0,
    easing: "easeLinearIn",
    callback: tweenEmptyFunc,
    currentTime: 0,
    constructor: function(o, p, d, t, e, c) {
        this.object = o;
        this.initial = this.object[p];
        this.property = p;
        this.destination = d;
        this.time = t;
        if (typeof e !== "undefined" && e !== null) {
            this.easing = e;
        }
        if (typeof c !== "undefined" && c !== null) {
            this.callback = c;
        }
    }
});

var UtilsDef = Base.extend({
    _tweenFuncs: null,
    _tweens: null,
    E_LINEAR_IN: "easeLinearIn",
    E_LINEAR_OUT: "easeLinearOut",
    E_LINEAR_INOUT: "easeLinearInOut",
    E_SINE_IN: "easeSineIn",
    E_SINE_OUT: "easeSineOut",
    E_SINE_INOUT: "easeSineInOut",
    E_QUAD_IN: "easeQuadIn",
    E_QUAD_OUT: "easeQuadOut",
    E_QUAD_INOUT: "easeQuadInOut",
    E_EXPO_IN: "easeExpoIn",
    E_EXPO_OUT: "easeExpoOut",
    E_EXPO_INOUT: "easeExpoInOut",
    E_ELASTIC_IN: "easeElasticIn",
    E_ELASTIC_OUT: "easeElasticOut",
    E_ELASTIC_INOUT: "easeElasticInOut",
    E_CUBIC_IN: "easeCubicIn",
    E_CUBIC_OUT: "easeCubicOut",
    E_CUBIC_INOUT: "easeCubicInOut",
    E_CIRCULAR_IN: "easeCircularIn",
    E_CIRCULAR_OUT: "easeCircularOut",
    E_CIRCULAR_INOUT: "easeCircularInOut",
    E_BOUNCE_IN: "easeBounceIn",
    E_BOUNCE_OUT: "easeBounceOut",
    E_BOUNCE_INOUT: "easeBounceInOut",
    E_BACK_IN: "easeBackIn",
    E_BACK_OUT: "easeBackOut",
    E_BACK_INOUT: "easeBackInOut",
    constructor: function() {
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
    update: function(delta) {
        var value;
        for (var i = 0; i < this._tweens.length; i++) {
            var index = 0;
            if (this.isEmpty(this._tweens[i].object) || this.isEmpty(this._tweens[i].object[this._tweens[i].property])) {
                this._tweens.indexOf(this._tweens[i]);
                this._tweens.splice(index, 1);
            }
            this._tweens[i].currentTime += delta;
            value = this._execTween(this._tweens[i].currentTime, this._tweens[i].initial, this._tweens[i].destination - this._tweens[i].initial, this._tweens[i].time, this._tweens[i].easing);
            this._tweens[i].object[this._tweens[i].property] = value;
            if (this._tweens[i].currentTime >= this._tweens[i].time) {
                this._tweens[i].object[this._tweens[i].property] = this._tweens[i].destination;
                this._tweens[i].callback();
                this._tweens.indexOf(this._tweens[i]);
                this._tweens.splice(index, 1);
            }
        }
    },
    reset: function() {
        for (var i = 0; i < this._tweens.length; i++) {
            this._tweens[i].object[this._tweens[i].property] = this._tweens[i].destination;
            this._tweens[i].callback();
        }
        this._tweens = [];
    },
    emptyFunc: function() {},
    isEmpty: function(v) {
        return typeof v === "undefined" || v === null;
    },
    copyAttributes: function(clone, original) {
        for (var attr in original) {
            if (original.hasOwnProperty(attr)) {
                clone[attr] = original[attr];
            }
        }
        return clone;
    },
    checkExtension: function(text, extension) {
        if (this.isEmpty(text)) {
            return false;
        }
        return text.indexOf(extension) !== -1;
    },
    indexToDecimal: function(value) {
        return Math.floor(Math.min(value * 255, 255));
    },
    rgbaToString: function(r, g, b, a) {
        var color = "rgba(" + this.indexToDecimal(r) + "," + this.indexToDecimal(g) + "," + this.indexToDecimal(b) + "," + this.clamp(0, a, 1) + ")";
        return color;
    },
    invoke: function(func, time) {
        setTimeout(func, time * 1e3);
    },
    invokeRepeating: function(func, time) {
        setInterval(func, time * 1e3);
    },
    distance: function(x1, y1, x2, y2) {
        return Math.sqrt((x1 -= x2) * x1 + (y1 -= y2) * y1);
    },
    angle: function(x1, y1, x2, y2) {
        return Math.atan2(x2 - x1, y2 - y1);
    },
    randRange: function(min, max) {
        return Math.random() * max + min;
    },
    intRandRange: function(min, max) {
        return Math.floor(this.randRange(min, max));
    },
    randSpread: function(range) {
        return this.randRange(0, range) * (.5 - Math.random());
    },
    randSign: function() {
        return Math.random() < .5 ? -1 : 1;
    },
    randFlipCoin: function() {
        return Math.random() < .5 ? false : true;
    },
    clamp: function(min, value, max) {
        return Math.min(Math.max(value, min), max);
    },
    lerp: function(initial, end, time) {
        return initial + (end - initial) * time;
    },
    perp: function(initial, end, time) {
        return initial + time * time * (end - initial);
    },
    berp: function(initial, end, time) {
        return initial + time / 2 * (end - initial);
    },
    smoothStep: function(x) {
        return x * x * (3 - 2 * x) * 2;
    },
    easeLinear: function(t, b, c, d) {
        return c * t / d + b;
    },
    easeSineIn: function(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeSineOut: function(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeSineInOut: function(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeQuadIn: function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeQuadOut: function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeQuadInOut: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t) + b;
        }
        return -c / 2 * ((t - 2) * --t - 1) + b;
    },
    easeExpoIn: function(t, b, c, d) {
        return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeExpoOut: function(t, b, c, d) {
        return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeExpoInOut: function(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeElasticIn: function(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        var p = d * .3;
        var a = c;
        var s = p / 4;
        var postFix = a * Math.pow(2, 10 * (t -= 1));
        return -(postFix * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeElasticOut: function(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        var p = d * .3;
        var a = c;
        var s = p / 4;
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeElasticInOut: function(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        var p = d * .45;
        var a = c;
        var s = p / 4;
        var postFix;
        if (t < 1) {
            postFix = a * Math.pow(2, 10 * (t -= 1));
            return -.5 * (postFix * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        postFix = a * Math.pow(2, -10 * (t -= 1));
        return postFix * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeCubicIn: function(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeCubicOut: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeCubicInOut: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeCircularIn: function(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeCircularOut: function(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeCircularInOut: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - t * (t -= 2)) + 1) + b;
    },
    easeBounceOut: function(t, b, c, d) {
        var postFix;
        if ((t /= d) < .3636) {
            return c * (7.5625 * t * t) + b;
        } else if (t < .7272) {
            postFix = t -= .5454;
            return c * (7.5625 * postFix * t + .75) + b;
        } else if (t < .909) {
            postFix = t -= .8181;
            return c * (7.5625 * postFix * t + .9375) + b;
        } else {
            postFix = t -= .9545;
            return c * (7.5625 * postFix * t + .984375) + b;
        }
    },
    easeBounceIn: function(t, b, c, d) {
        return c - UtilsDef.prototype.bounceOut(d - t, 0, c, d) + b;
    },
    easeBounceInOut: function(t, b, c, d) {
        if (t < d / 2) {
            return UtilsDef.prototype.bounceIn(t * 2, 0, c, d) * .5 + b;
        } else {
            return UtilsDef.prototype.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    },
    easeBackIn: function(t, b, c, d) {
        var s = 1.70158;
        var postFix = t /= d;
        return c * postFix * t * ((s + 1) * t - s) + b;
    },
    easeBackOut: function(t, b, c, d) {
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeBackInOut: function(t, b, c, d) {
        var s = 1.70158;
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        var postFix = t -= 2;
        return c / 2 * (postFix * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    _execTween: function(t, b, c, d, e) {
        var result = this._tweenFuncs[e](t, b, c, d);
        return result;
    },
    tween: function(object, property, destination, time, easing, callback) {
        this._tweens.push(new TweenObject(object, property, destination, time, easing, callback));
    }
});

var Utils = new UtilsDef();

var Entity = Base.extend({
    name: "",
    entities: null,
    inUse: true,
    constructor: function(name) {
        this.name = name;
        this.entities = [];
    },
    spawn: function() {
        this.inUse = true;
    },
    add: function(ent) {
        this.entities.push(ent);
    },
    remove: function(ent) {
        var index = this.entities.indexOf(ent);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    },
    removeAll: function() {
        this.entities = [];
    },
    clone: function() {
        var c = new Entity();
        c = Utils.copyAttributes(c, this);
        return c;
    },
    update: function(delta) {
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].update(delta);
        }
    },
    draw: function() {
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw();
        }
    },
    destroy: function() {
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].destroy();
        }
        delete this.entities;
    }
});

var Pool = Entity.extend({
    lastSpawned: 0,
    constructor: function() {
        this.callParent("Pool");
    },
    addToPool: function(object, amount) {
        if (!(object instanceof Entity)) {
            console.log("[Core::Pool] Unable to add object " + object + ". You must extend from Entity");
            return;
        }
        object.inUse = false;
        for (var i = 0; i < amount; i++) {
            var clone = object.clone();
            this.entities.push(clone);
        }
    },
    spawn: function(amount) {
        var spawned = [];
        for (var s = this.lastSpawned; s < this.entities.length; s++) {
            if (!this.entities[s].inUse) {
                this.entities[s].spawn();
                this.lastSpawned++;
            }
            amount--;
            spawned.push(this.entities[s]);
            if (amount <= 0) {
                break;
            }
        }
        this.lastSpawned = this.lastSpawned % this.entities.length;
        return spawned;
    },
    update: function(delta) {
        var i, entity;
        for (i = this.entities.length - 1; i >= 0; i--) {
            entity = this.entities[i];
            if (entity.inUse) {
                entity.update(delta);
            }
        }
    },
    draw: function() {
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].inUse) {
                this.entities[i].draw();
            }
        }
    }
});

var State = Entity.extend({
    constructor: function(name) {
        this.callParent(name);
    },
    init: function() {},
    onPause: function(flag) {}
});

Core = Base.extend({
    currentState: null,
    width: 0,
    height: 0,
    storage: false,
    fps: 0,
    fpsCounter: 0,
    elapsed: 0,
    totalTime: 0,
    delta: .016,
    timeScale: 1,
    date: null,
    dateNow: null,
    dateThen: null,
    loaded: false,
    assets: null,
    assetsMap: null,
    assetsLoaded: 0,
    pause: false,
    constructor: function() {},
    init: function(width, height) {
        this.width = width;
        this.height = height;
        window.addEventListener("resize", this._calculateResize.bind(this));
        window.addEventListener("blur", this._onBlur.bind(this));
        Graphics.init(this.width, this.height);
        this._calculateResize();
        this.delta = 0;
        this.date = new Date();
        this.dateThen = Date.now();
        this.dateNow = Date.now();
        this.storage = this.hasStorageSupport();
        this.assets = [];
        this.assetsMap = {};
    },
    _calculateResize: function() {
        var appWidth = this.width, appHeight = this.height, windowWidth = window.innerWidth, windowHeight = window.innerHeight, ratio = Math.min(windowWidth / appWidth, windowHeight / appHeight), scaledAppWidth = Math.floor(appWidth * ratio), scaledAppHeight = Math.floor(appHeight * ratio), offsetX = (windowWidth - scaledAppWidth) / 2, offsetY = (windowHeight - scaledAppHeight) / 2;
        Graphics.rescale(scaledAppWidth, scaledAppHeight);
        Graphics.reposition(offsetX, offsetY);
    },
    _onBlur: function() {
        this.pause = true;
        Input.resetAll();
        if (this.currentState !== null) {
            this.currentState.onPause(true);
        }
    },
    update: function(delta) {
        this.elapsed += delta;
        this.fpsCounter++;
        if (this.elapsed >= 1) {
            this.elapsed = 0;
            this.fps = this.fpsCounter;
            this.fpsCounter = 0;
        }
        if (!this.pause) {
            this.totalTime += delta;
            if (this.currentState !== null) {
                this.currentState.update(delta * this.timeScale);
            }
            Utils.update(delta * this.timeScale);
            Graphics.update(delta * this.timeScale);
        } else if (Input.isMousePressed()) {
            this.pause = false;
            if (this.currentState !== null) {
                this.currentState.onPause(false);
            }
        }
    },
    draw: function() {
        if (this.currentState !== null) {
            Graphics.preDraw();
            this.currentState.draw();
            Graphics.postDraw();
        }
        if (this.pause) {
            Graphics.drawFullScreenRect(0, 0, 0, .72);
            Graphics.enableBlur(5, 1, 1, 1, 1);
            Graphics.drawRegularPolygon(Graphics.width / 2, Graphics.height / 2, 3, Utils.scalePercentWidth(25), 1, 1, 1, 1, "fill");
            Graphics.disableBlur();
        }
    },
    run: function(time) {
        this.dateNow = this.date.getTime();
        this.delta = this.dateNow - this.dateThen;
        this.delta = this.delta || .016;
        this.dateThen = this.dateNow;
        this.update(this.delta);
        this.draw();
        window.requestAnimFrame(this.run.bind(this));
    },
    setState: function(state) {
        if (this.currentState !== null) {
            this.currentState.destroy();
        }
        this.currentState = null;
        this.currentState = state;
        this._calculateResize();
    },
    getFPS: function() {
        return this.fps;
    },
    addAsset: function(pathOrArray) {
        if (pathOrArray instanceof Array) {
            for (var i = 0; i < pathOrArray.length; i += 2) {
                this.assetsMap[pathOrArray[i]] = pathOrArray[i + 1];
                this.assets.push(pathOrArray[i + 1]);
            }
        } else if (typeof pathOrArray === "string") {
            this.assets.push(pathOrArray);
            this.assetsMap[""] = pathOrArray;
        } else {
            console.log("[Core::addAsset] You should not try to add ", pathOrArray, " as an asset. " + "Try using a string or an array instead.");
        }
    },
    loadAndRun: function() {
        var path;
        var empty = true;
        for (var key in this.assetsMap) {
            path = this.assetsMap[key];
            if (this.assetsMap.hasOwnProperty(key) && (Utils.checkExtension(path, ".jpg") || Utils.checkExtension(path, ".png") || Utils.checkExtension(path, ".svg"))) {
                empty = false;
                Graphics.loadImage(key, path);
            }
        }
        if (empty) {
            this.onImageLoaded();
        }
    },
    hasStorageSupport: function() {
        try {
            return "localStorage" in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    },
    saveToStorage: function(object, value) {
        if (this.storage) {
            localStorage[object] = value;
        }
    },
    readFromStorage: function(object) {
        if (this.storage) {
            return localStorage[object];
        }
        return null;
    },
    onImageLoaded: function() {
        this.assetsLoaded++;
        if (this.assetsLoaded >= this.assets.length) {
            if (this.currentState !== null) {
                this.currentState.init();
                this.run();
            }
        } else {
            Graphics.drawFullScreenRect(0, 0, 0, 1);
            Graphics.enableBlur(25, 1, 1, 1, 1);
            Graphics.drawRegularPolygon(Graphics.width / 2, Graphics.height / 2, Math.round(this.assetsLoaded / this.assets.length * 10) + 3, Utils.scalePercentWidth(15), 1, 1, 1, 1, "fill");
            Graphics.disableBlur();
            console.log("[Core::onImageLoaded] Loaded: " + this.assetsLoaded + " / " + (this.assets.length - 1));
        }
    }
});

var Core = new Core();

Utils.scalePercentWidth = function(value) {
    return Math.round(Core.width * value / 100);
};

Utils.scalePercentHeight = function(value) {
    return Math.round(Core.height * value / 100);
};

Input = Base.extend({
    keysDown: {},
    isClick: false,
    clickPosition: {
        x: 0,
        y: 0
    },
    mousePosition: {
        x: 0,
        y: 0
    },
    inputObjectsRegistered: [],
    supportsMultitouch: false,
    scale: {
        x: 1,
        y: 1
    },
    offset: {
        x: 0,
        y: 0
    },
    KEY_BACK: 8,
    KEY_TAB: 9,
    KEY_ENTER: 13,
    KEY_SHIFT: 16,
    KEY_CTRL: 17,
    KEY_ALT: 18,
    KEY_PAUSE: 19,
    KEY_CLOCK: 20,
    KEY_ESC: 27,
    KEY_SPACE: 32,
    KEY_PGUP: 33,
    KEY_PGDOWN: 34,
    KEY_END: 35,
    KEY_HOME: 36,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_INSERT: 45,
    KEY_DEL: 46,
    KEY_0: 48,
    KEY_1: 49,
    KEY_2: 50,
    KEY_3: 51,
    KEY_4: 52,
    KEY_5: 53,
    KEY_6: 54,
    KEY_7: 55,
    KEY_8: 56,
    KEY_9: 57,
    KEY_A: 65,
    KEY_B: 66,
    KEY_C: 67,
    KEY_D: 68,
    KEY_E: 69,
    KEY_F: 70,
    KEY_G: 71,
    KEY_H: 72,
    KEY_I: 73,
    KEY_J: 74,
    KEY_K: 75,
    KEY_L: 76,
    KEY_M: 77,
    KEY_N: 78,
    KEY_O: 79,
    KEY_P: 80,
    KEY_Q: 81,
    KEY_R: 82,
    KEY_S: 83,
    KEY_T: 84,
    KEY_U: 85,
    KEY_V: 86,
    KEY_W: 87,
    KEY_X: 88,
    KEY_Y: 89,
    KEY_Z: 90,
    KEY_NUM0: 96,
    KEY_NUM1: 97,
    KEY_NUM2: 98,
    KEY_NUM3: 99,
    KEY_NUM4: 100,
    KEY_NUM5: 101,
    KEY_NUM6: 102,
    KEY_NUM7: 103,
    KEY_NUM8: 104,
    KEY_NUM9: 105,
    KEY_MUL: 106,
    KEY_ADD: 107,
    KEY_SUB: 109,
    KEY_POINT: 110,
    KEY_DIV: 111,
    constructor: function() {
        this.inputObjectsRegistered = [];
        this.supportsMultitouch = this.checkMulitouchSupport();
        if (this.supportsMultitouch) {
            addEventListener("touchstart", function(e) {
                var touches = e.changedTouches;
                var firstTouch = touches[0];
                Input.generateClick(firstTouch.clientX, firstTouch.clientY);
            }, true);
            addEventListener("touchend", function(e) {
                Input.releaseClick();
            }, true);
        } else {
            addEventListener("mousedown", function(e) {
                Input.generateClick(e.clientX, e.clientY);
            }, true);
            addEventListener("mouseup", function(e) {
                Input.releaseClick();
            }, true);
            addEventListener("mousemove", function(e) {
                Input.mouseMoved(e.clientX, e.clientY);
            }, true);
        }
    },
    resetAll: function() {
        this.keysDown = {};
        this.isClick = false;
        this.clickPosition = {
            x: 0,
            y: 0
        };
        this.mousePosition = {
            x: 0,
            y: 0
        };
    },
    checkMulitouchSupport: function() {
        return "ontouchstart" in document.documentElement;
    },
    addInputReceiver: function(object) {
        this.inputObjectsRegistered.push(object);
    },
    isKeyPressed: function(key) {
        return key in this.keysDown;
    },
    isMousePressed: function() {
        return this.isClick === true;
    },
    isMouseReleased: function() {
        return this.isClick === false;
    },
    generateClick: function(xpos, ypos) {
        this.isClick = true;
        this.clickPosition.x = this.mousePosition.x = xpos / this.scale.x - this.offset.x / this.scale.x;
        this.clickPosition.y = this.mousePosition.y = ypos / this.scale.y - this.offset.y / this.scale.y;
        for (var i = 0; i < this.inputObjectsRegistered.length; i++) {
            this.inputObjectsRegistered[i].onClickInput(this.clickPosition.x, this.clickPosition.y);
        }
    },
    releaseClick: function() {
        this.isClick = false;
        this.clickPosition.x = -1;
        this.clickPosition.y = -1;
    },
    mouseMoved: function(x, y) {
        this.mousePosition.x = x / this.scale.x - this.offset.x / this.scale.x;
        this.mousePosition.y = y / this.scale.y - this.offset.y / this.scale.y;
    },
    getMousePosition: function() {
        return this.mousePosition;
    },
    getMousePositionInWorld: function() {
        var mouseInWorld = {
            x: this.mousePosition.x + Camera.x,
            y: this.mousePosition.y + Camera.y
        };
        return mouseInWorld;
    }
});

var Input = new Input();

addEventListener("keydown", function(e) {
    Input.keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
    delete Input.keysDown[e.keyCode];
}, false);

Camera = Entity.extend({
    x: 0,
    y: 0,
    shaking: false,
    shakeStrength: 1,
    shakeTime: 0,
    shakeOffset: null,
    onShakeEndCallback: Utils.emptyFunc,
    fading: false,
    overlayColor: null,
    drawOverlay: false,
    onFadeEndCallback: Utils.emptyFunc,
    constructor: function() {
        this.callParent("Camera");
        this.overlayColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        };
        this.shakeOffset = {
            x: 0,
            y: 0
        };
    },
    shake: function(time, strength, shakeEndCallback) {
        this.shaking = true;
        this.shakeTime = time;
        this.shakeStrength = strength;
        if (!Utils.isEmpty(shakeEndCallback)) {
            this.onShakeEndCallback = shakeEndCallback;
        } else {
            this.onShakeEndCallback = Utils.emptyFunc;
        }
    },
    stopShake: function() {
        this.shaking = false;
        this.shakeTime = 0;
        this.shakeStrentgh = 0;
        this.shakeOffset.x = 0;
        this.shakeOffset.y = 0;
    },
    fade: function(fromColor, toColor, time, easing, fadeEndCallback) {
        this.fading = true;
        if (!Utils.isEmpty(fadeEndCallback)) {
            this.onFadeEndCallback = fadeEndCallback;
        } else {
            this.onFadeEndCallback = Utils.emptyFunc;
        }
        this.overlayColor.r = fromColor.r;
        this.overlayColor.g = fromColor.g;
        this.overlayColor.b = fromColor.b;
        this.overlayColor.a = fromColor.a;
        Utils.tween(this.overlayColor, "r", toColor.r, time, easing, fadeEndCallback);
        Utils.tween(this.overlayColor, "g", toColor.g, time, easing);
        Utils.tween(this.overlayColor, "b", toColor.b, time, easing);
        Utils.tween(this.overlayColor, "a", toColor.a, time, easing);
    },
    update: function(delta) {
        this.callParent(delta);
        if (this.shaking === true) {
            this.shakeTime -= delta;
            this.shakeOffset.x = Utils.randRange(this.shakeStrength * -1, this.shakeStrength);
            this.shakeOffset.y = Utils.randRange(this.shakeStrength * -1, this.shakeStrength);
            if (this.shakeTime <= 0) {
                this.shaking = false;
                this.shakeStartTime = 0;
                this.shakeTime = 0;
                this.onShakeEndCallback();
                this.shakeOffset.x = 0;
                this.shakeOffset.y = 0;
            }
        }
    },
    draw: function() {
        this.callParent();
    },
    getX: function() {
        return Math.round(this.x + this.shakeOffset.x);
    },
    getY: function() {
        return Math.round(this.y + this.shakeOffset.y);
    },
    setOverlayColor: function(r, g, b, a) {
        this.overlayColor.r = r;
        this.overlayColor.g = g;
        this.overlayColor.b = b;
        this.overlayColor.a = a;
        this.drawOverlay = true;
    },
    clearOverlayColor: function() {
        this.overlayColor.r = 0;
        this.overlayColor.g = 0;
        this.overlayColor.b = 0;
        this.overlayColor.a = 0;
        this.drawOverlay = false;
        this.fading = false;
    }
});

var Camera = new Camera();

Graphics = Base.extend({
    canvas: null,
    context: null,
    initialized: false,
    images: null,
    imagesMap: null,
    scale: {
        x: 1,
        y: 1
    },
    screenRect: null,
    autoClearScreen: true,
    constructor: function() {
        this.images = [];
        this.imagesMap = {};
    },
    init: function(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.position = "absolute";
        document.body.appendChild(this.canvas);
        this.initialized = true;
        this.screenRect = this.canvas.getBoundingClientRect();
    },
    rescale: function(width, height) {
        this.scale.x = width / this.width;
        this.scale.y = height / this.height;
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
        this.screenRect = this.canvas.getBoundingClientRect();
        Input.scale.x = this.scale.x;
        Input.scale.y = this.scale.y;
        Input.offset.x = this.screenRect.left;
        Input.offset.y = this.screenRect.top;
    },
    reposition: function(x, y) {
        this.canvas.style.left = x + "px";
        this.canvas.style.top = y + "px";
    },
    pixelify: function(flag) {
        this.context.imageSmoothingEnabled = !flag;
    },
    getCanvasOffset: function() {
        return this.screenRect;
    },
    getWidth: function() {
        return this.canvas.width;
    },
    getHeight: function() {
        return this.canvas.height;
    },
    onImageLoaded: function() {
        Core.onImageLoaded();
    },
    loadImage: function(alias, path) {
        if (Utils.isEmpty(this.images[path])) {
            this.images[path] = new Image();
            this.images[path].src = path;
            this.images[path].addEventListener("load", this.onImageLoaded.bind(this));
            this.imagesMap[alias] = path;
        } else {
            this.onImageLoaded();
        }
    },
    getImage: function(path) {
        if (Utils.isEmpty(this.images[path])) {
            if (!Utils.isEmpty(this.imagesMap[path])) {
                return this.images[this.imagesMap[path]];
            } else {
                console.log("[Graphics] The image " + path + " is not loaded. " + "Check if it was added on the asset list (addAsset).");
                return null;
            }
        }
        return this.images[path];
    },
    update: function(delta) {
        Camera.update(delta);
    },
    preDraw: function() {
        if (this.autoClearScreen) {
            this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
        this.context.save();
        this.context.translate(-Camera.getX(), -Camera.getY());
        this.context.scale(this.scaleRatio, this.scaleRatio);
    },
    postDraw: function() {
        this.context.restore();
        Camera.draw();
        if (Camera.fading || Camera.drawOverlay) {
            this.drawFullScreenRect(Camera.overlayColor.r, Camera.overlayColor.g, Camera.overlayColor.b, Camera.overlayColor.a);
        }
    },
    _startDraw: function(mode, r, g, b, a) {
        if (mode === "fill") {
            this.context.fillStyle = Utils.rgbaToString(r, g, b, a);
        } else if (mode === "stroke") {
            this.context.strokeStyle = Utils.rgbaToString(r, g, b, a);
        }
    },
    _endDraw: function(mode) {
        if (mode === "fill") {
            this.context.fill();
        } else if (mode === "stroke") {
            this.context.stroke();
        }
    },
    enableBlur: function(size, r, g, b, a) {
        Graphics.context.shadowBlur = size;
        Graphics.context.shadowColor = Utils.rgbaToString(r, g, b, a);
    },
    disableBlur: function() {
        Graphics.context.shadowBlur = 0;
        Graphics.context.shadowColor = Utils.rgbaToString(0, 0, 0, 0);
    },
    drawText: function(text, x, y, r, g, b, a, size, font) {
        this._startDraw("fill", r, g, b, a);
        this.context.font = size + "px " + font;
        this.context.textAlign = "left";
        this.context.textBaseline = "top";
        this.context.fillText(text, x, y);
    },
    drawRect: function(x, y, width, height, r, g, b, a, mode) {
        if (Utils.isEmpty(mode)) {
            mode = "fill";
        }
        this._startDraw(mode, r, g, b, a);
        if (mode === "fill") {
            this.context.fillRect(x, y, width, height);
        } else if (mode === "stroke") {
            this.context.strokeRect(x, y, width, height);
        }
    },
    drawFullScreenRect: function(r, g, b, a) {
        this.drawRect(0, 0, this.width, this.height, r, g, b, a);
    },
    drawLine: function(x1, y1, x2, y2, r, g, b, a, lineWidth, round) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        if (!Utils.isEmpty(lineWidth)) {
            this.context.lineWidth = lineWidth;
        }
        this.context.strokeStyle = Utils.rgbaToString(r, g, b, a);
        if (!Utils.isEmpty(round)) {
            this.context.lineCap = round;
        }
        this.context.stroke();
    },
    drawArc: function(x, y, radius, startAngle, endAngle, r, g, b, a, lineWidth, mode) {
        if (Utils.isEmpty(mode)) {
            mode = "fill";
        }
        this.context.beginPath();
        this._startDraw(mode, r, g, b, a);
        if (!Utils.isEmpty(lineWidth)) {
            this.context.lineWidth = lineWidth;
        }
        this.context.arc(x, y, radius, startAngle, endAngle, false);
        this._endDraw(mode);
    },
    drawCircle: function(x, y, radius, r, g, b, a, mode) {
        if (Utils.isEmpty(mode)) {
            mode = "fill";
        }
        this.context.beginPath();
        this._startDraw(mode, r, g, b, a);
        this.context.arc(x, y, radius, 0, 6.28, false);
        this._endDraw(mode);
    },
    drawSprite: function(img, x, y, width, height, angle, scaleX, scaleY, alpha) {
        if (Utils.isEmpty(img)) {
            return;
        }
        this.context.save();
        this.context.globalAlpha = Utils.clamp(0, alpha, 1);
        this.context.translate(x + width / 2, y + height / 2);
        this.context.rotate(angle);
        this.context.scale(scaleX, scaleY);
        this.context.drawImage(img, -width / 2, -height / 2);
        this.context.restore();
    },
    drawSpriteCropped: function(img, x, y, width, height, angle, scaleX, scaleY, alpha, uvX, uvY, uvW, uvH) {
        if (Utils.isEmpty(img)) {
            return;
        }
        this.context.save();
        this.context.globalAlpha = Utils.clamp(0, alpha, 1);
        this.context.translate(x + width / 2, y + height / 2);
        this.context.rotate(angle);
        this.context.scale(scaleX, scaleY);
        this.context.drawImage(img, uvX, uvY, uvW, uvH, -width / 2, -height / 2, width, height);
        this.context.restore();
    },
    drawPolygon: function(points, x, y, r, g, b, a, mode) {
        if (Utils.isEmpty(mode)) {
            mode = "fill";
        }
        this.context.beginPath();
        this._startDraw(mode, r, g, b, a);
        this.context.moveTo(x + points[0], y + points[1]);
        for (var i = 2; i < points.length - 1; i += 2) {
            this.context.lineTo(x + points[i], y + points[i + 1]);
        }
        this.context.closePath();
        this._endDraw(mode);
    },
    drawRegularPolygon: function(x, y, numberOfSides, size, r, g, b, a, mode) {
        if (Utils.isEmpty(mode)) {
            mode = "fill";
        }
        this.context.beginPath();
        this._startDraw(mode, r, g, b, a);
        this.context.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
        for (var i = 1; i <= numberOfSides; i += 1) {
            this.context.lineTo(x + size * Math.cos(i * 2 * Math.PI / numberOfSides), y + size * Math.sin(i * 2 * Math.PI / numberOfSides));
        }
        this.context.closePath();
        this._endDraw(mode);
    }
});

var Graphics = new Graphics();

var Sprite = Entity.extend({
    img: null,
    path: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    angle: 0,
    scale: null,
    uv: null,
    rect: null,
    useBoundingBox: true,
    radius: 0,
    center: null,
    alpha: 1,
    constructor: function(path) {
        this.callParent(path);
        this.img = Graphics.getImage(path);
        this.path = path;
        if (!Utils.isEmpty(this.img)) {
            this.width = this.img.width;
            this.height = this.img.height;
        } else {
            this.width = 0;
            this.height = 0;
        }
        this.radius = Math.max(this.width, this.height) / 2;
        this.scale = {
            x: 1,
            y: 1
        };
        this.rect = {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height
        };
        this.uv = {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height
        };
        this.center = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    },
    draw: function() {
        this.callParent();
        Graphics.drawSpriteCropped(this.img, this.x, this.y, this.width, this.height, this.angle, this.scale.x, this.scale.y, this.alpha, this.uv.x, this.uv.y, this.uv.w, this.uv.h);
    },
    drawDebug: function() {
        if (this.useBoundingBox) {
            Graphics.drawRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h, 1, 1, 1, 1, "stroke");
        } else {
            Graphics.drawCircle(this.x + this.width / 2, this.y + this.height / 2, this.radius, 0, 0, 1, 1, "stroke");
        }
    },
    update: function(delta) {
        this.callParent(delta);
        this.recalculate();
    },
    recalculate: function() {
        this.center.x = this.x + this.width / 2;
        this.center.y = this.y + this.height / 2;
        if (!this.useBoundingBox) {
            return;
        }
        this.rect.x = this.x * this.scale.x;
        this.rect.y = this.y * this.scale.y;
        this.rect.w = this.width * this.scale.x;
        this.rect.h = this.height * this.scale.y;
    },
    setSource: function(path) {
        this.path = path;
        this.img = Graphics.getImage(this.path);
        if (!Utils.isEmpty(this.img)) {
            this.width = this.img.width;
            this.height = this.img.height;
        } else {
            this.width = 0;
            this.height = 0;
        }
        this.radius = Math.max(this.width, this.height) / 2;
        this.rect.w = this.width;
        this.rect.h = this.height;
        this.uv.w = this.width;
        this.uv.h = this.height;
        this.center.x = this.x + this.width / 2;
        this.center.y = this.y + this.height / 2;
    },
    setUV: function(x, y, w, h) {
        this.uv = {
            x: x,
            y: y,
            w: w,
            h: h
        };
        this.width = w;
        this.height = h;
    },
    resetUV: function() {
        this.uv = {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height
        };
    },
    collides: function(other) {
        var distance;
        if (this.useBoundingBox && other.useBoundingBox && this.rect.x <= other.rect.x + other.rect.w && other.rect.x <= this.rect.x + this.rect.w && this.rect.y <= other.rect.y + other.rect.h && other.rect.y <= this.rect.y + this.rect.h) {
            return true;
        }
        if (this.radius !== 0 && other.radius !== 0) {
            distance = Utils.distance(this.x + this.width / 2, this.y + this.height / 2, other.x + other.width / 2, other.y + other.height / 2);
            if (distance <= this.radius + other.radius) {
                return true;
            }
        }
        return false;
    },
    isPointInRect: function(x, y) {
        if (x >= this.rect.x && x <= this.rect.x + this.rect.w && y >= this.rect.y && y <= this.rect.y + this.rect.h) {
            return true;
        }
        return false;
    },
    isPointInCircle: function(x, y) {
        if (Utils.distance(this.x + this.width / 2, this.y + this.height / 2, x, y) <= this.radius) {
            return true;
        }
        return false;
    }
});

var Atlas = Sprite.extend({
    constructor: function(path) {
        this.callParent(path);
    },
    getImage: function(x, y, w, h) {
        var newImg = new Sprite(this.path);
        newImg.x = this.x;
        newImg.y = this.y;
        newImg.setUV(x, y, w, h);
        return newImg;
    },
    drawTile: function(x, y, w, h, ux, uy, uw, uh) {
        if (Utils.isEmpty(this.img)) {
            return;
        }
        Graphics.context.drawImage(this.img, ux, uy, uw, uh, x, y, w, h);
    }
});

var Label = Sprite.extend({
    str: "",
    size: 16,
    r: 1,
    g: 1,
    b: 1,
    font: "Times",
    constructor: function(str) {
        this.callParent("Label_" + str);
        this.str = str;
        this.x = 0;
        this.y = 0;
        this.alpha = 1;
    },
    draw: function() {
        Graphics.drawText(this.str, this.x, this.y, this.r, this.g, this.b, this.alpha, this.size, this.font);
    }
});

var Button = Sprite.extend({
    onClickFunc: null,
    text: null,
    enabled: true,
    constructor: function(img, xpos, ypos, myOnClickFunc) {
        this.callParent(img, xpos, ypos);
        this.onClickFunc = myOnClickFunc;
        Input.addInputReceiver(this);
    },
    setText: function(str) {
        this.text = new Text(str);
        return this.text;
    },
    draw: function() {
        this.callParent();
        if (this.text !== null) {
            this.text.draw();
        }
    },
    drawDebug: function(r, g, b) {
        Graphics.drawRect(this.x, this.y, this.width, this.height, 1, 1, 1);
    },
    onClickInput: function(x, y) {
        var offset = Graphics.getCanvasOffset();
        if (this.isPointInRect((x - offset.left) / Graphics.scale.x, (y - offset.top) / Graphics.scale.y) && this.enabled) {
            this.onClickFunc(this);
        }
    }
});

var ParticleBase = Sprite.extend({
    radius: 10,
    wander: 3.15,
    theta: Math.random(6.28),
    drag: .92,
    vx: 0,
    vy: 0,
    r: 1,
    g: 1,
    b: 1,
    constructor: function(path, x, y, radius) {
        this.callParent(path, x, y, "particle");
        this.radius = radius;
        this.spawn();
    },
    update: function(delta) {
        this.callParent(delta);
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.theta += Utils.randRange(-.5, .5) * this.wander;
        this.vx += Math.sin(this.theta) * delta;
        this.vy += Math.cos(this.theta) * delta;
        this.x += this.vx;
        this.y += this.vy;
        this.radius *= .96;
        this.inUse = this.radius > 1;
    },
    draw: function() {},
    spawn: function() {
        this.callParent();
        this.radius = Utils.randRange(10, 50);
        this.wander = Utils.randRange(.01, .05);
        this.drag = Utils.randRange(.5, .79);
        this.theta = Math.random() * 6.28;
        this.force = Utils.randRange(.01, .03);
        this.vx = Math.sin(this.theta) * this.force;
        this.vy = Math.cos(this.theta) * this.force;
        this.r = Utils.randRange(0, 1);
        this.g = Utils.randRange(0, 1);
        this.b = Utils.randRange(0, 1);
        this.alpha = Utils.randRange(0, 1);
    },
    clone: function() {
        var p = new ParticleBase(this.path, this.x, this.y, this.radius);
        p = Utils.copyAttributes(p, this);
        return p;
    }
});

var ParticleCircle = ParticleBase.extend({
    constructor: function(path, x, y, radius) {
        this.callParent(path, x, y, radius);
    },
    draw: function() {
        Graphics.drawCircle(this.x, this.y, this.radius, this.r, this.g, this.b, this.a);
    }
});

var ParticleSystem = Pool.extend({
    constructor: function() {
        this.callParent("ParticleSystem");
    },
    spawn: function(x, y, amount) {
        var spawned = [];
        spawned = this.callParent(amount);
        for (var i = 0; i < spawned.length; i++) {
            spawned[i].x = x;
            spawned[i].y = y;
        }
    }
});

var SoundDef = Base.extend({
    soundSupported: false,
    constructor: function() {
        this.soundSupported = !!document.createElement("audio").canPlayType;
    },
    hasSound: function() {
        return this.soundSupported;
    }
});

var Sound = new SoundDef();

var Song = Base.extend({
    path: "",
    loops: false,
    song: null,
    playing: false,
    constructor: function(path, loop) {
        this.path = path;
        this.loops = loop;
        this.song = document.createElement("audio");
        this.song.setAttribute("src", this.path);
        if (this.loops) {
            this.song.setAttribute("loop", true);
        }
    },
    play: function() {
        if (Audio.hasSound() && this.song !== null) {
            this.playing = true;
            this.song.play();
        }
    },
    pause: function() {
        if (Audio.hasSound() && this.song !== null) {
            this.playing = false;
            this.song.pause();
        }
    },
    stop: function() {
        if (Audio.hasSound() && this.song !== null) {
            this.playing = false;
            this.song.pause();
            if (!isNaN(this.song.duration)) {
                this.song.currentTime = 0;
            }
        }
    },
    setVolume: function(value) {
        if (Audio.hasSound() && this.song !== null) {
            this.song.volume = value;
        }
    }
});
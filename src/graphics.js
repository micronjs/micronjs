
// Graphics.js

//-----------------------------------------------------------------------
// Camera. It is a singleton.
// todo: add "isRectVisible" and "isCircleVisible" to do auto-culling
// todo: zoom?
Camera = Entity.extend({

    x : 0,
    y : 0,
    shaking : false,
    shakeStrength : 1.0,
    shakeTime : 0,
    shakeOffset : null,
    onShakeEndCallback : Utils.emptyFunc,
    fading : false,
    overlayColor : null,
    drawOverlay : false,
    onFadeEndCallback : Utils.emptyFunc,

    constructor : function()
    {
        this.callParent("Camera");
        this.overlayColor = { r:0.0, g:0.0, b:0.0, a: 0.0 };
        this.shakeOffset = { x: 0.0, y: 0.0 };
    },

    shake : function(time, strength, shakeEndCallback)
    {
        this.shaking = true;
        this.shakeTime = time;
        this.shakeStrength = strength;
        if(!Utils.isEmpty(shakeEndCallback)) // needed to reset possible old callbacks
        {
            this.onShakeEndCallback = shakeEndCallback;
        }
        else
        {
            this.onShakeEndCallback = Utils.emptyFunc;
        }
    },

    stopShake : function()
    {
        this.shaking = false;
        this.shakeTime = 0;
        this.shakeStrentgh = 0;
        this.shakeOffset.x = 0.0;
        this.shakeOffset.y = 0.0;
    },

    fade : function(fromColor, toColor, time, easing, fadeEndCallback)
    {
        this.fading = true;

        if(!Utils.isEmpty(fadeEndCallback))
        {
            this.onFadeEndCallback = fadeEndCallback;
        }
        else
        {
            this.onFadeEndCallback = Utils.emptyFunc;
        }

        this.overlayColor.r = fromColor.r;
        this.overlayColor.g = fromColor.g;
        this.overlayColor.b = fromColor.b;
        this.overlayColor.a = fromColor.a;

        // we really need a way to pass multiple parameters for cases like this!
        Utils.tween(this.overlayColor, "r", toColor.r, time, easing, fadeEndCallback);
        Utils.tween(this.overlayColor, "g", toColor.g, time, easing);
        Utils.tween(this.overlayColor, "b", toColor.b, time, easing);
        Utils.tween(this.overlayColor, "a", toColor.a, time, easing);
    },

    update : function(delta)
    {
        this.callParent(delta);

        if(this.shaking === true)
        {
            this.shakeTime -= delta;
            this.shakeOffset.x = (Utils.randRange(this.shakeStrength * -1, this.shakeStrength));
            this.shakeOffset.y = (Utils.randRange(this.shakeStrength * -1, this.shakeStrength));

            if(this.shakeTime <= 0)
            {
                this.shaking = false;
                this.shakeStartTime = 0;
                this.shakeTime = 0;
                this.onShakeEndCallback();
                this.shakeOffset.x = 0.0;
                this.shakeOffset.y = 0.0;
            }
        }
    },

    draw : function()
    {
        this.callParent();
    },

        getX : function()
        {
            return Math.round(this.x + this.shakeOffset.x);
        },

        getY : function()
        {
            return Math.round(this.y + this.shakeOffset.y);
        },

        setOverlayColor : function(r, g, b, a)
        {
            this.overlayColor.r = r;
            this.overlayColor.g = g;
            this.overlayColor.b = b;
            this.overlayColor.a = a;
            this.drawOverlay = true;
        },

        clearOverlayColor : function()
        {
            this.overlayColor.r = 0;
            this.overlayColor.g = 0;
            this.overlayColor.b = 0;
            this.overlayColor.a = 0;
            this.drawOverlay = false;
            this.fading = false;
        }
});

var Camera = new Camera();

//-----------------------------------------------------------------------
// The main rendering module.
Graphics = Base.extend({

    canvas : null,
    context : null,
    initialized : false,
    images : null,
    imagesMap : null,
    scale : { x:1, y:1 },
    screenRect : null, // real screen size. used?
    autoClearScreen : true,

    constructor : function()
    {
        this.images = [];
        this.imagesMap = {};
    },

    // call this function with the proper width and height for our game "window".
    init : function(width, height)
    {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement("canvas");
        // new
        //WebGL2D.enable(this.canvas); //experimental. not working :(
        this.context = this.canvas.getContext("2d"); // webgl-2d
        //console.log(WebGL2D, this.context);
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.position = "absolute";
        document.body.appendChild(this.canvas);
        this.initialized = true;
        this.screenRect = this.canvas.getBoundingClientRect();
    },

    rescale : function(width, height)
    {
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

    // does this work? :D
    reposition : function(x, y)
    {
        this.canvas.style.left = x + "px";
        this.canvas.style.top = y + "px";
    },

    pixelify : function(flag)
    {
        this.context.imageSmoothingEnabled = !flag;
    },

    getCanvasOffset : function()
    {
        return this.screenRect;
    },

    getWidth : function()
    {
        return this.canvas.width;
    },

    getHeight : function()
    {
        return this.canvas.height;
    },

    onImageLoaded : function()
    {
        Core.onImageLoaded();
    },

    loadImage : function(alias, path)
    {
        // if the image was loaded already, return it and dont load it again! (quick and simple texture manager)
        if(Utils.isEmpty(this.images[path]))
        {
            this.images[path] = new Image();
            this.images[path].src = path;
            this.images[path].addEventListener("load", this.onImageLoaded.bind(this));
            this.imagesMap[alias] = path;
        }
        else
        {
            this.onImageLoaded();
        }
    },

    getImage : function(path)
    {
        // Step 1: look for the path
        if(Utils.isEmpty(this.images[path]))
        {
            // Step 2: look for the alias. If the alias is found, return the image using the alias.
            if(!Utils.isEmpty(this.imagesMap[path]))
            {
                return this.images[this.imagesMap[path]];
            }
            else
            {
                console.log(
                    "[Graphics] The image " + path + " is not loaded. " +
                    "Check if it was added on the asset list (addAsset)."
                );
                return null;
            }
        }
        return this.images[path];
    },

    update : function(delta)
    {
        Camera.update(delta);
    },

    preDraw : function()
    {
        if(this.autoClearScreen)
        {
            this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
        this.context.save();
        this.context.translate(-Camera.getX(), -Camera.getY());
        this.context.scale(this.scaleRatio, this.scaleRatio);
    },

    postDraw : function()
    {
        this.context.restore();
        Camera.draw(); // draw the objects added to the camera itself

        if(Camera.fading || Camera.drawOverlay)
        {
            this.drawFullScreenRect(
                Camera.overlayColor.r,
                Camera.overlayColor.g,
                Camera.overlayColor.b,
                Camera.overlayColor.a
            );
        }
    },

    _startDraw : function(mode, r, g, b, a)
    {
        if(mode === "fill")
        {
            this.context.fillStyle = Utils.rgbaToString(r, g, b, a);
        }
        else if(mode === "stroke")
        {
            this.context.strokeStyle = Utils.rgbaToString(r, g, b, a);
        }
    },

    _endDraw : function(mode)
    {
        if(mode === "fill")
        {
            this.context.fill();
        }
        else if(mode === "stroke")
        {
            this.context.stroke();
        }
    },

    enableBlur : function(size, r, g, b, a)
    {
        Graphics.context.shadowBlur = size;
        Graphics.context.shadowColor = Utils.rgbaToString(r, g, b, a);
    },

    disableBlur : function()
    {
        Graphics.context.shadowBlur = 0;
        Graphics.context.shadowColor = Utils.rgbaToString(0, 0, 0, 0);
    },

    drawText : function(text, x, y, r, g, b, a, size, font)
    {
        this._startDraw("fill", r, g, b, a);
        this.context.font = size + "px " + font;
        this.context.textAlign = "left";
        this.context.textBaseline = "top";
        this.context.fillText(text, x, y);
    },

    drawRect : function(x, y, width, height, r, g, b, a, mode)
    {
        if(Utils.isEmpty(mode))
        {
            mode = "fill";
        }
        this._startDraw(mode, r, g, b, a);
        if(mode === "fill")
        {
            this.context.fillRect(x, y, width, height);
        }
        else if(mode === "stroke")
        {
            this.context.strokeRect(x, y, width, height);
        }
    },

    drawFullScreenRect : function(r, g, b, a)
    {
        this.drawRect(0, 0, this.width, this.height, r, g, b, a);
    },

    drawLine : function(x1, y1, x2, y2, r, g, b, a, lineWidth, round)
    {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        if(!Utils.isEmpty(lineWidth))
        {
            this.context.lineWidth = lineWidth;
        }
        this.context.strokeStyle = Utils.rgbaToString(r, g, b, a);
        if(!Utils.isEmpty(round))
        {
            this.context.lineCap = round;
        }
        this.context.stroke();
    },

    drawArc : function(x, y, radius, startAngle, endAngle, r, g, b, a, lineWidth, mode)
    {
        if(Utils.isEmpty(mode))
        {
            mode = "fill";
        }
        this.context.beginPath();
        this._startDraw(mode, r, g, b, a);
        if(!Utils.isEmpty(lineWidth))
        {
            this.context.lineWidth = lineWidth;
        }
        this.context.arc(x, y, radius, startAngle, endAngle, false);
        this._endDraw(mode);
    },

    drawCircle : function(x, y, radius, r, g, b, a, mode)
    {
        if(Utils.isEmpty(mode))
        {
            mode = "fill";
        }
        this.context.beginPath();
        this._startDraw(mode, r, g, b, a);
        this.context.arc(x, y, radius, 0, 6.28, false);
        this._endDraw(mode);
    },

    drawSprite : function(img, x, y, width, height, angle, scaleX, scaleY, alpha)
    {
        if(Utils.isEmpty(img))
        {
            return;
        }
        this.context.save();
        this.context.globalAlpha = Utils.clamp(0.0, alpha, 1.0);
        this.context.translate(x + width / 2, y + height / 2);
        this.context.rotate(angle);
        this.context.scale(scaleX, scaleY);
        this.context.drawImage(img, -width / 2, -height / 2);
        this.context.restore();
    },

    drawSpriteCropped : function(img, x, y, width, height, angle, scaleX, scaleY, alpha, uvX, uvY, uvW, uvH)
    {
        if(Utils.isEmpty(img))
        {
            return;
        }
        this.context.save();
        this.context.globalAlpha = Utils.clamp(0.0, alpha, 1.0);
        this.context.translate(x + width / 2, y + height / 2);
        this.context.rotate(angle);
        this.context.scale(scaleX, scaleY);
        this.context.drawImage(img, uvX, uvY, uvW, uvH, -width / 2, -height / 2, width, height);
        this.context.restore();
    },

    drawPolygon : function(points, x, y, r, g, b, a, mode)
    {
        if(Utils.isEmpty(mode))
        {
            mode = "fill";
        }
        this.context.beginPath();
        this._startDraw(mode, r, g, b, a);
        this.context.moveTo(x + points[0], y + points[1]);

        for(var i = 2; i < points.length - 1; i += 2)
        {
            this.context.lineTo(x + points[i], y + points[i + 1]);
        }
        this.context.closePath();
        this._endDraw(mode);
    },

    drawRegularPolygon : function(x, y, numberOfSides, size, r, g, b, a, mode)
    {
        if(Utils.isEmpty(mode))
        {
            mode = "fill";
        }
        this.context.beginPath();
        this._startDraw(mode, r, g, b, a);
        this.context.moveTo (x +  size * Math.cos(0), y +  size *  Math.sin(0));
        for(var i = 1; i <= numberOfSides;i += 1)
        {
            this.context.lineTo (
                x + size * Math.cos(i * 2 * Math.PI / numberOfSides),
                y + size * Math.sin(i * 2 * Math.PI / numberOfSides)
            );
        }
        this.context.closePath();
        this._endDraw(mode);
    }

});

var Graphics = new Graphics();

//-----------------------------------------------------------------------
// TODO: spritesheet or something like animations???
var Sprite = Entity.extend({

    img : null,
    path : "",
    x : 0,
    y : 0,
    width : 0,
    height : 0,
    angle : 0.0,
    scale : null,
    uv : null,
    rect : null,
    useBoundingBox : true,
    radius : 0.0,
    center : null,
    alpha : 1.0,

    constructor : function(path)
    {
        this.callParent(path);
        this.img = Graphics.getImage(path);
        this.path = path;
        if(!Utils.isEmpty(this.img))
        {
            this.width = this.img.width;
            this.height = this.img.height;
        }
        else
        {
            this.width = 0;
            this.height = 0;
        }
        this.radius = Math.max(this.width, this.height) / 2.0;
        this.scale = { x: 1.0, y: 1.0 };
        this.rect = { x : this.x, y : this.y, w : this.width, h : this.height };
        this.uv = { x: this.x, y: this.y, w: this.width, h: this.height };
        this.center = { x: this.x + this.width / 2.0, y: this.y + this.height / 2.0 };
    },

    draw : function()
    {
        this.callParent();

        Graphics.drawSpriteCropped(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height,
            this.angle,
            this.scale.x,
            this.scale.y,
            this.alpha,
            this.uv.x,
            this.uv.y,
            this.uv.w,
            this.uv.h
        );
    },

    drawDebug : function()
    {
        if(this.useBoundingBox)
        {
            Graphics.drawRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h, 1, 1, 1, 1, "stroke");
        }
        else
        {
            Graphics.drawCircle(this.x + this.width / 2, this.y + this.height / 2, this.radius, 0, 0, 1, 1, "stroke");
        }
    },

    update : function(delta)
    {
        this.callParent(delta);
        this.recalculate();
    },

    recalculate : function()
    {
		// todo: add scale to this!
        this.center.x = this.x + this.width / 2.0;
        this.center.y = this.y + this.height / 2.0;	
        if(!this.useBoundingBox)
        {
            return;
        }
        this.rect.x = this.x /*-(this.width/2))*/ * this.scale.x;
        this.rect.y = this.y /*-(this.height/2))*/ * this.scale.y;
        this.rect.w = this.width * this.scale.x;
        this.rect.h = this.height * this.scale.y;
    },

    setSource : function(path)
    {
        this.path = path;
        this.img = Graphics.getImage(this.path);
        if(!Utils.isEmpty(this.img))
        {
            this.width = this.img.width;
            this.height = this.img.height;
        }
        else
        {
            this.width = 0;
            this.height = 0;
        }
        this.radius = Math.max(this.width, this.height) / 2.0;
        this.rect.w = this.width;
        this.rect.h = this.height;
        this.uv.w = this.width;
        this.uv.h = this.height;
        this.center.x = this.x + this.width / 2.0;
        this.center.y = this.y + this.height / 2.0;
    },

    setUV : function(x, y, w, h)
    {
        this.uv = { x:x, y:y, w:w, h:h};
        this.width = w;
        this.height = h;
    },

    resetUV : function()
    {
        this.uv = { x: this.x, y: this.y, w: this.width, h: this.height };
    },

    collides : function(other)
    {
        var distance;
        if(
            this.useBoundingBox && other.useBoundingBox &&
            this.rect.x <= (other.rect.x + other.rect.w) &&
            other.rect.x <= (this.rect.x + this.rect.w) &&
            this.rect.y <= (other.rect.y + other.rect.h) &&
            other.rect.y <= (this.rect.y + this.rect.h)
        )
        {
            return true;
        }

        if(this.radius !== 0.0 && other.radius !== 0.0)
        {
            distance = Utils.distance(
                this.x + this.width / 2.0,
                this.y + this.height / 2.0,
                other.x + other.width / 2.0,
                other.y + other.height / 2.0
            );
            if(distance <= (this.radius + other.radius))
            {
                return true;
            }
        }

        return false;
    },

    // maybe put this things in Utils too?
    isPointInRect : function(x, y)
    {
        if(x >= this.rect.x && x <= (this.rect.x + this.rect.w) && y >= this.rect.y && y <= (this.rect.y + this.rect.h))
        {
            return true;
        }
        return false;
    },

    isPointInCircle : function(x, y)
    {
        if(Utils.distance(this.x + this.width / 2, this.y + this.height / 2, x, y) <= this.radius)
        {
            return true;
        }
        return false;
    }

});

// todo: add a list of images, and allow to read from .json or something?
var Atlas = Sprite.extend({

    constructor : function(path)
    {
        this.callParent(path);
    },

    getImage : function(x, y, w, h)
    {
        var newImg = new Sprite(this.path);
        newImg.x = this.x;
        newImg.y = this.y;
        newImg.setUV(x, y, w, h);
        return newImg;
    },

    drawTile : function(x, y, w, h, ux, uy, uw, uh)
    {
        if(Utils.isEmpty(this.img))
        {
            return;
        }
        Graphics.context.drawImage(this.img, ux, uy, uw, uh, x, y, w, h);
    }

});

//-----------------------------------------------------------------------
var Label = Sprite.extend({

    str : "",
    size : 16,
    r : 1.0,
    g : 1.0,
    b : 1.0,
    font : "Times",

    constructor : function(str)
    {
        this.callParent("Label_" + str);
        this.str = str;
        this.x = 0;
        this.y = 0;
        this.alpha = 1.0;
    },

    draw : function()
    {
        Graphics.drawText(this.str, this.x, this.y, this.r, this.g, this.b, this.alpha, this.size, this.font);
    }
});

//-----------------------------------------------------------------------
// todo: add more than one image (for the "on touch" state) if needed.
var Button = Sprite.extend({

    onClickFunc : null,
    text : null,
    enabled : true,

    // load actually the graphic
    constructor : function(img, xpos, ypos, myOnClickFunc)
    {
        this.callParent(img, xpos, ypos);
        this.onClickFunc = myOnClickFunc;
        Input.addInputReceiver(this);
    },

    setText : function(str)
    {
        this.text = new Text(str);
        return this.text;
    },

    draw : function()
    {
        this.callParent();

        if(this.text !== null)
        {
            this.text.draw();
        }
    },

    drawDebug : function(r, g, b)
    {
        Graphics.drawRect(this.x, this.y, this.width, this.height, 1.0, 1.0, 1.0);
    },

    onClickInput : function(x, y)
    {
        var offset = Graphics.getCanvasOffset();

        // todo: account for camera offset!
        if(
            this.isPointInRect((x - offset.left) / Graphics.scale.x, (y - offset.top) / Graphics.scale.y) &&
            this.enabled
        )
        {
            this.onClickFunc(this);
        }
    }
});

//-----------------------------------------------------------------------
// Basic particle
// todo: refactor this shit
var ParticleBase = Sprite.extend({

    radius : 10,
    wander : 3.15,
    theta : Math.random(6.28), // 2 * pi
    drag : 0.92,
    vx : 0.0,
    vy : 0.0,
    r : 1,
    g : 1,
    b : 1,

    constructor : function(path, x, y, radius)
    {
        this.callParent(path, x, y, "particle");
        this.radius = radius;
        this.spawn();
    },

    update : function(delta)
    {
        this.callParent(delta);

        this.vx *= this.drag;
        this.vy *= this.drag;
        this.theta += Utils.randRange(-0.5, 0.5) * this.wander;
        this.vx += Math.sin(this.theta) * delta;
        this.vy += Math.cos(this.theta) * delta;
        this.x += this.vx;
        this.y += this.vy;
        this.radius *= 0.96;
        this.inUse = this.radius > 1.0;
    },

    draw : function()
    {
        // override me
    },

    spawn : function()
    {
        this.callParent();

        this.radius = Utils.randRange(10, 50);
        this.wander = Utils.randRange(0.01, 0.05);
        this.drag = Utils.randRange(0.5, 0.79);
        this.theta = Math.random() * 6.28; // 2 * pi
        this.force = Utils.randRange(0.01, 0.03);
        this.vx = Math.sin(this.theta) * this.force;
        this.vy = Math.cos(this.theta) * this.force;

        this.r = Utils.randRange(0.0, 1.0);
        this.g = Utils.randRange(0.0, 1.0);
        this.b = Utils.randRange(0.0, 1.0);
        this.alpha = Utils.randRange(0.0, 1.0);
    },

    clone : function()
    {
        var p = new ParticleBase(this.path, this.x, this.y, this.radius);
        p = Utils.copyAttributes(p, this);
        return p;
    }

});

var ParticleCircle = ParticleBase.extend({

    constructor : function(path, x, y, radius)
    {
        this.callParent(path, x, y, radius);
    },

    draw : function()
    {
        Graphics.drawCircle(this.x, this.y, this.radius, this.r, this.g, this.b, this.a);
    }
});

var ParticleSystem = Pool.extend({

    constructor : function()
    {
        this.callParent("ParticleSystem");
    },

    // todo: fix the bug of the position
    spawn : function(x, y, amount)
    {
        var spawned = [];
        spawned = this.callParent(amount);
        for(var i = 0;i < spawned.length; i++)
        {
            spawned[i].x = x;
            spawned[i].y = y;
        }
    }
});

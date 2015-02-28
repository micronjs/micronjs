
// A quite complex key for a frame. We need:
// - obj: the actor name upon we will do things
// - startTime: the time at which this key will start
// - stopTime: the time at which this key will stop (if easing)
// - property: what we will be changing. string.
// - value: the destination value the property will have
// - easing: any easing function to use (if easing)
var AnimKey = TweenObject.extend({

	stopTime : 0.0, 
			
	// TODO: check that stopTime is bigger than time!!!
	constructor : function(obj, startTime, stopTime, property, value, easing)
	{
		this.callParent(obj, property, value, startTime, easing);
		this.timeStop = stopTime;
	}
});

// A quite simple key for calling any method. We need:
// - obj: the actor name 
// - time: the time to trigger the call
// - func: the function callback we will execute
// - params: extra magic, an array.
var AnimKeyCall = Base.extend({
        
	object : null,
	time : 0.0,
	func : Utils.emptyFunc,
	params : null,
	
	constructor : function(obj, time, func, params)
	{
		this.object = obj;
		this.time = time;
		this.func = func;
		this.params = [];
		
		if(!Utils.isEmpty(params))
		{    
			this.params = params;
		}
	}
});

var NEXT_FRAME_INCREMENT_TIME = 0.016; // This shit is ugly as fuck

//--------------------------------------------------------------------------
// An animation clip. One clip is a single animation. It can animate any object or actor passed and can have any number of keyframes.
// Keyframes can be mixed and disordered in its definition. They can define custom easing functions and you can add AnimKey's or AnimKeyCall's.

var AnimClip = Base.extend({
   
	name : "",
	loop : false,
	ease : false,
	frames : null,
	lastFrameTime : 0.0,
	currentTime : 0.0,	
	animator : null, // parent animator object, added by the animator itself (good luck trying to use a clip without an actual animator)
	
	constructor : function(name, loop, ease)
	{
		this.name = name;

		if(!Utils.isEmpty(loop))
		{				
			this.loop = loop;
		}

		if(!Utils.isEmpty(ease))
		{			
			this.ease = ease;
		}

		this.frames = [];
	},

	// TODO: it should be possible to do something like 'actor.scale' in order to access sub-objects!!!
	addKey : function(actor, startTime, stopTime, property, value, easing)
	{
		var key = new AnimKey(actor, startTime, stopTime, property, value, easing);		
		this.frames.push(key);		
		
		if(stopTime > this.lastFrameTime)
		{
			this.lastFrameTime = stopTime;			
		}
	},
	
	addKeyCall : function()
	{
		// TODO		
		//var key = new AnimKeyCall(...)
	},
	
	// deletes all the keys from the given timestamp.
	// todo: if time is empty, remove all!
	removeKeys : function(startTime)
	{
		// todo: do this shit and also update lastFrameTime!
	},
	
	run : function(delta)
	{	
		if(this.currentTime > this.lastFrameTime)
		{
			if(this.loop)
			{
				this.reset(); // NOTE: should restore ALL the values of the first frame when going back to the first one?????
			}
			else
			{
				return; // there's nothing to do if we finished and the animation is not loopable.
			}
		}
	
		this.currentTime += delta;
		
		// find next frames to execute
		var shouldIncreaseFrame = false;
		for(var i = 0; i < this.frames.length; i++)
		{
			var timeDelta = this.frames[i].time - this.currentTime;
			
			if(timeDelta > 0 && timeDelta < NEXT_FRAME_INCREMENT_TIME) //this.frames[i].time > this.currentTime  
			{
				shouldIncreaseFrame = true;
				
				// TRIGGER THE OBJECT FRAME!!!
				// if easing is enabled for this animation, create a new tween!
				// if animator is empty, it means you fucked it up and you must create a one and add this clip to it :D								
				// if the keyframe is a call, then execute the callback

				if(this.frames[i] instanceof AnimKey)
				{				
					if(this.ease)
					{					
						var actor = this.animator.getActor(this.frames[i].object);
						Utils.tween(actor, this.frames[i].property, this.frames[i].destination, this.frames[i].time - this.frames[i].stopTime, this.frames[i].easing);					
					}
					else
					{
						this.animator.onActorUpdate(this.frames[i].object, this.frames[i].property, this.frames[i].destination);
					}
				}
				// TODO: add here AnimKeyCall!
			}
		}
		
		if(shouldIncreaseFrame)
		{
			this.currentTime += NEXT_FRAME_INCREMENT_TIME;			
		}
	},
	
	reset : function()
	{
		this.currentTime = 0.0;
	},
	
	destroy : function()
	{
		this.frames = [];		
	}    
});

//--------------------------------------------------------------------------
// The animator is the class responsible for the actual animation: you need this one to play/pause/stop clips.
// IMPORTANT: you need to manually update it, or just do this.add(this_animator) to your entity/state/whatever.
var Animator = Entity.extend({
    
	playing : false,
	paused : false,
	clips : null, // the animations
	currentAnim : "",

	constructor : function()
	{
		this.callParent();
		this.clips = {};
	},

	// animClip = AnimClip
	// actorsMap = { "name" : object, "other" : object, ...... }
	addClip : function(animClip, actorsMap) 
	{ 
		animClip.animator = this;
		this.clips[animClip.name] = { clip: animClip, actors: actorsMap };
	},
	
	remove : function(animClip)
	{
		if(!Utils.isEmpty(this.animations[animClip.name]))
		{
			delete this.clips[animClip.name];//wot
		}	
	},

	removeAll : function()
	{
		this.clips = {};
	},

	// The Animator is the actual piece of the puzzle that knows which "actors" must be updated for the animation
	// So... this will return you whatever you put in the actors map under the given "actorName" string.
	getActor : function(actorName)	
	{
		if(this.playing || this.paused)
		{
			var actors = this.clips[this.currentAnim].actors;
			for(var actor in actors)
			{
				if(actor == actorName)
				{
					return actors[actor];
				}
			}
		}
		return null; // be careful
	},
	
	onActorUpdate : function(actor, property, value)
	{
		var actor = this.getActor(actor);
		if(!Utils.isEmpty(actor))
		{
			actor[property] = value;
		}
	},
	
	// todo: add playOnce???
	// todo: add blending!!!!
	play : function(name /*, fade*/) // true or false
	{
		this.playing = true;
		this.paused = false;
		this.currentAnim = name;
		this.clips[this.currentAnim].clip.reset();
	},

	pause : function()
	{
		this.paused = !this.paused;
	},

	stop : function()
	{
		this.playing = false;
		this.paused = false;
		this.currentAnim = "";
	},

	update : function(delta)
	{
		if(this.playing && !this.paused)
		{
			this.clips[this.currentAnim].clip.run(delta);
		}
	},

	destroy : function()
	{
		// what
		/*
		for(var i = 0;i < this.clips.length; i++)
		{
			this.clips[i].destroy();
		}	
		delete this.clips;    
		*/
	}

});


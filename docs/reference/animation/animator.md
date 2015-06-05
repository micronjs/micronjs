# <i class="fa fa-book"></i> Animator: Entity

<span class="label label-info">Class</span>

The animator is the class responsible for the actual animation: you need this one to 
play/pause/stop clips. You can have as many animators as you want, but shouldn't have 
more than one per entity. When adding AnimClips to the animator, the animator itself
sets as the father of the clips. If you try to animate the clips without an animator, 
it will fail because it is the animator the one that has the link actor > object.

IMPORTANT: you need to manually update it, or just do this.add(this_animator) to your 
entity/state/whatever.


## Members

---

### playing 

	playing : Boolean
	
A nice flag to know whether this animator is playing an animation or not.

---
	
### paused
	
	paused : Boolean
	
Another helpful flag to know whether the animator is paused or not. Kinda redundant, isn't it?
	
---	

### clips

	clips : Array
	
This array (holding simple objects actually) stores	the information of the actors for each clip.
This means that if you want to dynamically change the actors for a clip, this is where you can do it.

NOTE: at some point there will be functions to mess with this properly.

Each clip is an object of the form { clip: AnimClip, actors: Map } where the actors map is of the form:
{ "actorName" : actorObject, "anotherActor" : anotherObject, ... }
	
---	
	
### currentAnim
	
	currentAnim : String
	
The name of the current animation player. 
	
---	
	
## Methods

---

### constructor

    constructor : function()

---

### addClip
	
	addClip : function(animClip : AnimationClip, actorsMap : Map) 

Add a new clip to the animator object. Example:

    `this.animator.addClip(this.ninjaAnimationRun, { "actor" : this.ninjaObject } );`
	
---	

### remove
	
	remove : function(animClip)

Remove a clip by its reference. Should be useful to remove by name. Will be done, some day.	
	
---	

### removeAll
	
	removeAll : function()

Remove all clips. And obviusly stops animations.
	
---	

### getActor	

	getActor : function(actorName : String)	

The Animator is the actual piece of the puzzle that knows which "actors" must be updated for the animation.
So... this will return you whatever you put in the actors map under the given "actorName" string.

WARNING: if no actor is found, it will return null. Be careful with it pretty please.
	
---

### onActorUpdate
	
	onActorUpdate : function(actor : String, property : String, value : Number)

When easing is disabled, the frame data is passed to the actor through the animator. That is what this function
is for. You shouldn't be messing with it, but just in case you need it. 

NOTE: when easing is enabled, the values are modified directly on the actor object itself (the tween has a 
reference to the actor to save time).
	
---	
	
### play	
	
	play : function(name : String)
	
Play the given animation clip. Note that when doing play, it will reset the animation.

WARNING: there is no error check, so if you pass a non existant name, it might likely crash. Yeah.
	
---	

### pause

	pause : function()

Pause and unpause the animation. If you pause it and want to resume it, use this please. 
Using play will reset the animation.	
	
---	
	
### stop	
	
	stop : function()
	
Stop the current playback of the animation. Resuming via play will obviously start from the beginning.
Resuming via pause will not restart the animation obviously, but might keep it paused (so you can actually
pause it before start, to start paused).	
	


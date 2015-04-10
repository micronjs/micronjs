# <i class="fa fa-book"></i> AnimClip: Base

<span class="label label-info">Class</span>

An AnimClip is a single animation: a collection of keyframes. This keyframes are just
duration values wrapping something that happens to objects: can be done using easing or not.
Can be a value of a property, or a callback to function. A single animation clip can contain
the data for a single animation, ie. "walking", "dying", etc.

Note that the actor defined here is always an string (an id, a name) to make the animclips
*reusable* by other entities. This way, the animator can define a new object for the actor
and still use the data of another actor/entity/object.

In short: one clip is a single animation. It can animate any object or actor passed and
can have any number of keyframes. Keyframes can be mixed and disordered in its definition (you can
mix them up and they will be played still properly following the time they should trigger at).
Frames can define custom easing functions and you can add AnimKey's or AnimKeyCall's.

## Members

### name

	name : String

The name of the animation.

---

### loop

	loop : Boolean

Wheather or not the animation will be looped.

---

### ease

	ease : Boolean

When true, the frames will be eased using the defined easing function for each one.
When false, the frames will not be eased and just "jump" from one to the next.
AnimKeyCalls are never eased (it just makes no sense. Think about it).

---

### frames

	frames : Array

Each one and all of the frames for this clip. Have fun messing with it!

---

### currentTime

	currentTime : Number

I have no idea why you would want to mess with the current playback time, but here you go.


## Methods

### constructor

    constructor : function(name : String, loop : Boolean, ease : Boolean)

---

### addKey

	addKey : function(actor : String, startTime : Number, stopTime : Number, property : String, value : Number, [easing])

Add a new keyframe to this animation clip. 	The time is in seconds. For easing functions, check Utils.

---

### addKeyCall

	addKeyCall : function(actor : String, time : Number, func : Function, params : Array)

Add a new keyframe function callback. The time is in seconds, the function should not be empty and the array should contain
the actual parameter values for the callback.

WARNING: we do not check things here. If the function is empty or the things passed to the function are not ok, it is your fault ;)

---

### removeKeys

	removeKeys : function(startTime)

TODO

---

### run

	run : function(delta)

Used internally by the animator. You should never need it, but...

---

### reset

	reset : function()

Also used internally by the animator.

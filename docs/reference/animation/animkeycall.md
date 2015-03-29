# <i class="fa fa-book"></i> AnimKeyCall: Base

<span class="label label-info">Class</span>

If AnimKey is a basic data value for a keyframe duration, an AnimKeyCall is a holder for a function callback.
This type of keyframe value basically calls a function of any object you put as an actor and passes the parameters.
This is very powerful and allows you to do real animation based logic: for example, the type of thing you could see
on a game like Infinity Blade. In fact this is so powerful, that you can do an spritesheet animation based with this
just calling setUV and changing the proper values. Magic.

## Members

### func

func : Function

The function callback.

## Methods

### constructor

constructor (obj : String, time : Number, func : Function, params : Array)

A quite simple key for calling any method of any of your actors.

* obj: the actor name
* time: the time to trigger the call
* func: the function callback we will execute
* params: extra magic, an array. The array can hold any data that your function accepts as parameters.

### exec

exec : (who)

"Who" is any object or class you use as your "actor". This basically performs a call
on that object for the given method this key is holding.

WARNING: There are no error checking things here, be careful.
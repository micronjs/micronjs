# <i class="fa fa-book"></i> AnimKey: TweenObject

<span class="label label-info">Class</span>

An AnimKey is basically a data value for a keyframe. It can store any kind of value
for any kind of property. You can pass in an easing function to define how the property
will be tweened (if easing is enabled for the animation).

## Members

---

### stopTime

    stopTime : Number
    
The time at which the keyframe will end.

---

## Methods

---

### constructor

    constructor (obj : String, startTime : Number, stopTime : Number, property : Number, value : Number, [easing])

A quite complex key for a frame. Actually, it is not a single frame but rather a
duration in time between startTime and stopTime.

* obj: the actor name upon we will do things
* startTime: the time at which this key will start
* stopTime: the time at which this key will stop (if easing)
* property: what we will be changing. String, since this is a name too.
* value: the destination value the property will have. This has to match the actual property type you target.
* easing: any easing function to use (if easing). Check Utils.


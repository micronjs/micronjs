# <i class="fa fa-book"></i> Utils

<span class="label label-warning">Singleton</span>

Helper functions that simplify working with js.

## Members

    E_LINEAR_IN, E_LINEAR_OUT, E_LINEAR_INOUT, 
    E_SINE_IN, E_SINE_OUT, E_SINE_INOUT, 
    E_QUAD_IN, E_QUAD_OUT, E_QUAD_INOUT,
    E_EXPO_IN, E_EXPO_OUT, E_EXPO_INOUT, 
    E_ELASTIC_IN, E_ELASTIC_OUT, E_ELASTIC_INOUT, 
    E_CUBIC_IN, E_CUBIC_OUT, E_CUBIC_INOUT,
    E_CIRCULAR_IN, E_CIRCULAR_OUT, E_CIRCULAR_INOUT,
    E_BOUNCE_IN, E_BOUNCE_OUT, E_BOUNCE_INOUT, 
    E_BACK_IN,  E_BACK_OUT, E_BACK_INOUT

<span class="label label-danger">read-only</span>
Easing functions: linear (default), sine, quad, expo, elastic, cubic, circular, bounce, back.

**Example:** `Utils.E_ELASTIC_OUT`

One of the most important things of the Utils, are the tweens. Here is an example on how to use it:

**Example:** `Utils.tween(this.sprite, "x", 240.0, 0.5, Utils.E_BACK_IN, this.onSpriteMoved.bind(this));`

---

## Methods

### emptyFunc

    emptyFunc ()

Useful for initialization of empty callbacks.

---

### isEmpty

    isEmpty (v) : Boolean

Check undefined and null

---

### copyAttributes

    copyAttributes (clone, original) : Object

Copy the attributes of original into clone.

---

### checkExtension

    checkExtension (text, extension) : Boolean

**Example:** `Utils.checkExtension("lol.jpg", ".png")` > `false`

---

### indexToDecimal

    indexToDecimal (value) : Number

Convert number in range 0..1 into 0..255. Useful for converting numbers from floating point values to old school indices.

---

### rgbaToString

    rgbaToString (r,g,b,a) : String

Each value between 0..1

---

### invoke

    invoke (func, time)

Execute function func after time seconds.
**Note:** this function might change in the future.

---

### invokeRepeating

    invokeRepeating (func, time)

Execute function func each time seconds.
**Note:** this function might change in the future.

---

### distance

    distance (x1, y1, x2, y2) : Number

Return the distance between the two points.

---

### angle

    angle (x1, y1, x2, y2) : Number

Return the angle between two points.

--- 

### randRange

    randRange (min, max) : Number

Random between min and max (both included).

---

### intRandRange

    intRandRange (min, max)  : Number

Same as above, but returned as int.

---

### randSpread

    randSpread (range)  : Number

---

### randSign

    randSign () : Number

-1 or 1.

---

### randFlipCoin

    randFlipCoin () : Boolean

Face or ass. Which one is which?

---

### scalePercentWidth

    scalePercentWidth (value) : Number

A value between 0...1 will be returned as a value between 0...screen width/height.

---

### scalePercentHeight

    scalePercentHeight (value) : Number

---

### clamp

    clamp (min, value, max) : Number

---

### lerp

    lerp (initial, end, time) : Number

---

### perp

    perp (initial, end, time) : Number

---

### berp

    berp (initial, end, time) : Number

---

### smoothStep

    smoothStep (x) : Number

---

### tween

    tween( object, property, destination, time, easing, callback)

Object: the instance. Property: string, the name. Destination: value. Time: total. Easing: function, see [Utils](utils.md).

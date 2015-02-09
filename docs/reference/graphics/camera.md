# <i class="fa fa-book"></i> Camera

<span class="label label-warning">Singleton</span><span class="label label-info">Class</span>

The main and only camera singleton. Useful for doing things on the screen, like moving around, 
applying FX (**shake**, **fade-in/out** or adding an **overlay tint**).
**NOTE:** if you want to replace the main camera by one of your own, 
just extend the Camera class and then override the Camera object. Easy!

## Members

### x

    x : Number

The camera's position.

---

### y

    y : Number

---

### shaking

    shaking : false

---

### shakeStrength

    shakeStrength : Number

---

### shakeTime

    shakeTime : Number

---

### fading

    fading : Boolean

---

### overlayColor

    overlayColor : {r,g,b,a}

---

### drawOverlay

    drawOverlay : Boolean

---

## Methods

### constructor

    constructor ()

---

### shake

    shake (time, strength, shakeEndCallback)

---

### stopShake

    stopShake ()

---

### fade

    fade ( fromColor {r,g,b,a}, toColor {r,g,b,a}, time, [easing=Utils.E_LINEAR_IN], [fadeEndCallback=Utils.emptyFunc()] )

**Examples:**
- fade-out to black: Camera.fade( {0, 0, 0, 0}, {0, 0, 0, 1}, 3.5 )
- fade-in from white: Camera.fade( {1, 1, 1, 1}, {1, 1, 1, 0}, 3.0 )
- flash: Camera.fade( {0, 0, 0, 0}, {1, 1, 1, 1}, 0.3, Utils.E_BOUNCE_INOUT ) </i>

---

### update

    update ( delta )

---

### draw

    draw ()

---

### getX

    getX () : number

---

### getY

    getY () : number

---

### setOverlayColor

    setOverlayColor (r, g, b, a)

---

### clearOverlayColor

    clearOverlayColor ()

# <i class="fa fa-book"></i> Camera2d

<span class="label label-warning">Singleton</span><span class="label label-info">Class</span>

The main and only camera singleton. Useful for doing things on the screen, like moving around,
applying FX (**shake**, **fade-in/out** or adding an **overlay tint**).
**NOTE:** if you want to replace the main camera by one of your own,
just extend the Camera2d class and then override the Camera object. Easy!
And if you want to set a custom camera of your own, just set the Camera object. 

## Members

---

### x

    x : Number

The camera's position.

---

### y

    y : Number

Idem.

---

### shaking

    shaking : false

If the shake FX is used, this will be true. Don't set to false to stop shaking, use **stopShake** instead.

---

### shakeStrength

    shakeStrength : Number

---

### shakeTime

    shakeTime : Number

---

### fading

    fading : Boolean

True when fading is in progress, false otherwise.

---

### overlayColor

    overlayColor : {r,g,b,a}

A color used as full screen overlay. Useful for several FX (including fade in/out).

---

### drawOverlay

    drawOverlay : Boolean

Useful flag to enable/disable disable drawing the overlay object.

---

## Methods

---

### constructor

    constructor ()

---

### shake

    shake (time, strength, onShakeEndCallback)

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

Getter for the camera X position. Wraps inside the shake offset, useful to know the accurate position.

---

### getY

    getY () : number

Idem as above.

---

### setOverlayColor

    setOverlayColor (r, g, b, a)

---

### clearOverlayColor

    clearOverlayColor ()

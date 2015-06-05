# <i class="fa fa-book"></i> Button: Sprite

<span class="label label-info">Class</span>

Click things that go boom!

## Members

---

### onClickFunc

    onClickFunc : Function

Callback to execute when the click is performed.

---

### text

    text : Text

Some text to display.

---

### enabled

    enabled : Boolean

If true, the button will receive input and react to click/touches.    
    
---

## Methods

---

### constructor

    constructor (path, xpos, ypos, myOnClickFunc)

The path to the image (already loaded), the position on screen and the callback to execute on click.
    
---

### setText

    setText (str)

---

### draw

    draw ()

---

### drawDebug

    drawDebug (r, g, b)

---

### onClickInput

    onClickInput (x, y)

Buttons add themselves to the Input system, and then they get the input.

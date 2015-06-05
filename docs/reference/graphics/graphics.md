# <i class="fa fa-book"></i> Graphics

<span class="label label-warning">Singleton</span>

The heavy rendering part of Micron. **Graphics** groups all the drawXXX methods, as well as image loading and manipulation.

**IMPORTANT**: there are several considerations you should know:

* Color (**r, g, b, a** components for **Red**, **Green**, **Blue** and **Alpha**) are always normalized values between 0..1.
* Position: all the values you pass as position coordinates (**x, y**) are from the **upper left corner** of the image or primitive.
* Rotation and scale: the values passed for rotation and scaling are considered from the **center** of the image or primitive.

---

## Members

---

### canvas

    canvas : object{Canvas}

The basic ***canvas*** object. Feel free to manipulate it directly to suit your needs.

---

### context

    context : object{Canvas2DContext}

<span class="label label-danger">read-only</span>

---

### images

    images : Array

The list of all the images loaded by Graphics. Useful to have access to the raw ImageElement data.

---

### imagesMap

    imagesMap : {}

Same as above, but in form of map.

---

### autoClearScreen

    autoClearScreen : Boolean

Flag. When true (which it is, by default), it will clear the screen automatically before drawing. If false, the user will have to do it manually.
This is very useful to create several FX as blur (combined with drawing in full screen with low alpha values).

---

## Methods

---

### init

    init (width, height)

Called automatically by Core. No matter how big or small is your game window, you will always have **width,height** pixels in your app.

---

### pixelify

    pixelify (flag)

If flag is **true**, all the textures will be displayed using nearest filtering. Useful for 8bit/pixelart games.

---

### getWidth

    getWidth ()

Return the width of your virtual window (the same value you provided in init). The same as Core.width.

---

### getHeight

    getHeight ()

See above and change width by height.

---

### loadImage

    loadImage (alias, path)

All images loaded have an alias. The path can be any local image or link.

---

### getImage

    getImage (pathOrAlias)

Get an [Image] object previously loaded, using it's path or alias. Better use the alias (it's simpler).

---

### preDraw

    preDraw ()

You shouldn't have to touch these two, but in case you need to alter the default drawing of the entire engine: here's the place to do so.

---

### postDraw

    postDraw ()

---

### enableBlur

    enableBlur (size, r, g, b, a)

Start drawing "blur". It will create a blurry halo around everything you draw. It can kill performance.

---

### disableBlur

    disableBlur()

Stop using blur.

---

### drawText

    drawText (text, x, y, r, g, b, a, size : number, [font=defaultFont] : string)

**Example:** `Graphics.drawText("Hello world!", 0, 0, 1, 1, 1, 1, 32, "Arial");`

---

### drawRect

    drawRect (x, y, width, height, r, g, b, a, [mode="fill"])

For all the methods that have a "mode" parameter, it can always be either **"fill"** or **"stroke"**.

---

### drawFullScreenRect

    drawFullScreenRect (r,g,b,a)

Draws a rectangle in fullscreen, no matter where the Camera is.

---

### drawLine

    drawLine (x1, y1, x2, y2, r, g, b, a, lineWidth, [round])

If round is not empty, it will be used to define lineCap.

---

### drawArc

    drawArc (x, y, radius, startAngle, endAngle, r, g, b, a, lineWidth, [mode="fill"])

Draw an arc. Can be used to draw circles as well, but it is better to use drawCircle instead.

---

### drawCircle

    drawCircle (x, y, radius, r, g, b, a, [mode="fill"])

---

### drawSprite

    drawSprite (path, x, y, width, height, angle, scaleX, scaleY, alpha)

Path can be the full path to the image or the key used when the asset is loaded.
    
---

### drawSpriteCropped

    drawSpriteCropped (img:[Image], x, y, width, height, angle, scaleX, scaleY, alpha, uvX, uvY, uvW, uvH)

A **cropped** sprite displays a part of the texture defined by its uv in pixels.

---

### drawPolygon

    drawPolygon (points : array, x, y, r, g, b, a, [mode="fill"])

The **points** array must have a pair number of elements. Each succesive value is a pair (x,y).

---

### drawRegularPolygon

    drawRegularPolygon (x, y, numberOfSides, size, r, g, b, a, [mode="fill"])

A regular polygon is the one which has all sides equally long. From 3 up to infinite.

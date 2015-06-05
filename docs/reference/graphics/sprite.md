# <i class="fa fa-book"></i> Sprite : Entity

<span class="label label-info">Class</span> 

The base drawable object. Sprites are simple, single-texture images. 
You can draw them normally or **cropped**. You can change the [Image] the sprite uses
in real time, without any flops (**note**: the new image must be loaded as well).

Sprites are good for making animations (though there is no animation system - yet), 
characters, elements from the scene... sprites are for everything. They have basic
functionality for collision detection, however it is a bit shitty.
   
---
   
## Members

---

### img

    img : [Image]
    
---

### path

    path : String
	
If the sprite was created using the image's path, this will contain the path. 
If it was created using	the alias, this will be its alias.

---

### x

    x : Number
		 
---

### y

    y : Number

---

### width

    width : Number

---

### height

    height : Number

---

### angle

    angle : Number
		
---

### scale

    scale : {x, y}
		
---

### uv

    uv : {u, v, s, t}
		
---

### rect

    rect : {x, y, w, h}
		
---
		
### useBoundingBox        
        
    useBoundingBox : Boolean
    
When true, it will use the bounding box to calculate collisions. When false, it will calculate circle collisions.

---

### radius

    radius : Number
						
Used for calculation of circle based collisions.
		 
---

### center

    center : {x, y}
						
Useful both for circle based collisions and to get the image center.

---

### alpha

    alpha : 1.0
			
---
            
## Methods

---
	
### constructor    
    
    constructor (pathOrAlias) 		
    
The path or **alias** to the already loaded image. 
It should survive having an empty path (however it won't draw anything).

---

### draw

    draw ()
    
---

### drawDebug

    drawDebug ()
    				
Display the object's bounding area and other info.
		
---

### update

    update (delta)

Override to do funny things. Also: this updates the bounding rectangle or circle.
	
---

### recalculate

    recalculate ()

Force recalculate the object's bounding area. It is done automatically, 
but it is useful to force it after changing the image source (for example).

---

### setSource

    setSource (pathOrAlias)

Use this method to change the current image referenced.
		
---

### setUV

    setUV (x, y, w, h)			

UV used for cropping.

---

### resetUV

    resetUV ()				
    
When the UV are resetted, it will point to the default {0, 0, 1, 1} - the full image.
    
---

### collides

    collides (other : Sprite) : Boolean 	
    
Checks whether this sprite collides with other. Works more accurately when both use
the same bounding volume (either both are rectangles or circles).

---

### isPointInRect

    isPointInRect (x, y)			
    
Determine whether the point is inside the bounding rectangle of this sprite.
    
---

### isPointInCircle

    isPointInCircle (x, y)			
    
Like above, but with a circle instead.

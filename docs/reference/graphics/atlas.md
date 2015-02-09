# <i class="fa fa-book"></i> Atlas : Sprite

<span class="label label-info">Class</span> 

Atlases are good to pack textures together. 
Because canvas is not very optimized towards this kind of asset repackage, it won't change a lot in terms of
performance for your game. However, having atlases is always good, so here you are!
functionality for collision detection, however it is a bit shitty.
    
## Methods

### constructor

    constructor (pathOrAlias) 	

The path or **alias** of the already loaded image.

---

### getImage
		
    getImage (x, y, w, h) : Sprite
    
Return a new up-to-date Sprite with the base texture of the atlas and the provided uv info.

---

### drawTile

    drawTile (x, y, w, h, ux, uy, uw, uh)		
		
Simple helper for drawing on the screen any part of the texture atlas.		

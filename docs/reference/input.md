# Input

<span class="label label-warning">Singleton</span> 

The main Input module is reponsible for detecting and processing input events. On mobile devices, clicks are handled as touches (but work exactly the same).
You can register objects to the input system to receive "touch" events. 
**Example:** inside a class, do Input.addInputReceiver(this), and then override the method _onClickInput_.
    
## Members

    isClick : Boolean			

<span class="label label-danger">read-only</span>

---

### clickPosition : object{ x, y }	

<span class="label label-danger">read-only</span>

---

    mousePosition : { x, y }	

<span class="label label-danger">read-only</span>

---

    inputObjectsRegistered : Array	

<span class="label label-danger">read-only</span>

---

    supportsMultitouch : false	

<span class="label label-danger">read-only</span>

---    

**Example:** `Input.isKeyPressed( Input.KEY_ESC );`

KEY_BACK KEY_TAB KEY_ENTER KEY_SHIFT KEY_CTRL  KEY_ALT  KEY_PAUSE  KEY_CLOCK  KEY_ESC  KEY_SPACE KEY_PGUP KEY_PGDOWN KEY_END KEY_HOME
KEY_LEFT KEY_UP	KEY_RIGHT KEY_DOWN KEY_INSERT KEY_DEL KEY_0	KEY_1 KEY_2 KEY_3 KEY_4	KEY_5 KEY_6	KEY_7 KEY_8	KEY_9 KEY_A	KEY_B KEY_C	
KEY_D KEY_E KEY_F KEY_G	KEY_H KEY_I KEY_J KEY_K	KEY_L KEY_M	KEY_N KEY_O	KEY_P KEY_Q	KEY_R KEY_S	KEY_T KEY_U	KEY_V KEY_W	KEY_X KEY_Y		
KEY_Z KEY_NUM0 KEY_NUM1 KEY_NUM2 KEY_NUM3 KEY_NUM4 KEY_NUM5 KEY_NUM6 KEY_NUM7 KEY_NUM8 KEY_NUM9 KEY_MUL KEY_ADD KEY_SUB KEY_POINT KEY_DIV 

<span class="label label-danger">read-only</span>

---

## Methods	

    checkMulitouchSupport () : Boolean
	
---
	
    addInputReceiver (object)			
	
When registering your object to receive touch/click input, don't forget to override in your object the method `onClickInput(x, y)`

**Example**: 

```js
onClickInput : function(x, y){ 
    if(this.isPointInRect(...){ 
        console.log("click!"); 
    }
};
```
---

    isKeyPressed (key) : bool
	
---
	
    isMousePressed () : bool
	
---	
    
	isMouseReleased () : bool
	
---	

    generateClick (xpos, ypos)

---
	
    releaseClick ()

---	
	
    mouseMoved (x, y)

---	
	
    getMousePosition () : object{x, y}

---
	
    getMousePositionInWorld () : object{x, y}

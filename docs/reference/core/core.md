# <i class="fa fa-book"></i> Core

<span class="label label-warning">Singleton</span> 

The Core is the... core of the framework: it links all the submodules together. 
This is the one that controls the actual game and the state machine.
You won't likely have to modify this class.
    
## Members

---

### currentState

    currentState : State
    
		
The current [State](state.md) in execution.
   
---

### width

    width : Number
    
<span class="label label-danger">read-only</span> 

---
  
### height

    height : Number
    
<span class="label label-danger">read-only</span>

---
	
### isStorageAvailable

    isStorageAvailable : Boolean
    
<span class="label label-danger">read-only</span> If localStorage is available, this flag is true.
    
---

### fps

    fps : Number
    
<span class="label label-danger">read-only</span> Mean of frames per second in the last second.
    
---

### totalTime

    totalTime : Number

Total time elapsed since the game started. Only counts when the game is not paused.
    
---

### delta
    
    delta : Number

<span class="label label-danger">read-only</span> The delta time between this frame and the previous one.
	
---
	
### timeScale

    timeScale : Number
			
This value controls how fast or slow things are updated. 1.0 is the default value.
    
**NOTE**: Bigger values will make things move faster, smaller values will make it move slower. 0 is totally paused.

---

### isPaused

    isPaused : Boolean
    
When this is **true**, the game is paused. False otherwise. Do not attempt to set this manually to pause the game, 
you must use [Core.pause](core.md) instead.
    
---

### assets

    assets : Object
 			
All the assets loaded. Kept in case someone wants just to iterate through assets quickly. 
There is a map version available, smartly named assetsMap.
    
---

### assetsLoaded

    assetsLoaded : Number

The amount of assets loaded at any given time. When core executes init in your gamestate, this should be >= assets.length.
    
---
    
## Methods	

---

### init

    init (width, height) 	

Pass the size the game should have on the screen. It will be rescaled and recentered automatically.
    
---

### update

    update (delta)

Everything is updated from here: the gamestate, the fps counter, the tweens, etc. This is the source of them all.

--- 

### draw

    draw ()

Like update, draw is the source method for all draw calls to happen in micron. 
If you need to do weird interstate drawing, pause or similar, this is your place.
    
---

### run

    run ()

An internal function, this is called by requestAnimFrame to update and draw everything. This is the heart of the loop.
    
---

### pause

    pause (flag : Boolean)

A handy method for pausing the game from code.    
    
---
    
### setState

    setState (state)			

Switch the current state. It will delete the previous one, but not the underlaying assets in Core - you have to wipe them manually.
    
---

### getFPS

    getFPS ()
    
Return the current internal fps amount. Note that this is a bit innacurate. 
    
---

### addAsset

    addAsset (pathOrArray)			
    
Example: `Core.addAsset([ "empty", "gfx/empty.jpg" ]);` The first parameter is the **key**, the second, the path.

---

### loadAndRun

    loadAndRun ()				
    
Call after adding all your assets to start executing the current state.
You can also call this without loading any asset - it will just start running your app/game/thing.
    
---

### hasStorageSupport

    hasStorageSupport ()
    
Returns **true** if your browser supports local storage.
    
---

### saveToStorage

    saveToStorage (name, value)
    
A simple way to save things to local storage. Example: `Core.saveToStorage( "MyPlayer", { x: 10, y: 20, name: "Hodor" } ]);`    
    
---

### readFromStorage

    readFromStorage (name)

Returns the object/value by that name. If nothing is found by that name key, it returns **null**.

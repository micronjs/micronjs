# Core

<span class="label label-warning">Singleton</span> 

The Core is the... core of the framework: it links all the submodules together. This is the one that controls the actual game and the state machine.
You won't likely have to modify this class.
    
## Members

    currentState : State
    
		
The current [State](state.md) in execution.
   
---

    width : Number
    
<span class="label label-danger">read-only</span> 

---
   
    height : Number
    
<span class="label label-danger">read-only</span>

---
		
    storage : Boolean
    
<span class="label label-danger">read-only</span> If localStorage is available, this flag is true.
    
---

    fps : Number
    
<span class="label label-danger">read-only</span> Mean of frames per second in the last second.
    
---

fpsCounter : Number

---

    totalTime : Number

Total time elapsed since the game started. Only counts when the game is not paused.
    
---
    
    delta : Number

<span class="label label-danger">read-only</span> The delta time between this frame and the previous one.
	
---
	
    timeScale : Number
			
This value controls how fast or slow things are updated. 1 is the default value.
    
**NOTE**: Bigger values will make things move faster, smaller values will make it move slower. 0 is totally paused.
    
---
    
    date : Date

---

    dateNow : Date

---

    dateThen : Date

---

    loaded : Boolean
    
<span class="label label-danger">read-only</span>

---

    assets : Object
 			
All the assets loaded. Kept in case someone wants just to iterate through assets quickly.
    
---

    assetsMap : Object

---

    assetsLoaded : Number

## Methods	

    init (width, height) 	

Pass the size the game should have on the screen. It will be rescaled and recentered automatically.
    
---

    update (delta)
   
--- 

    draw ()

---

    run ()

---

    setState (state)			

Switch the current state. It will delete the previous one, but not the underlaying assets in Core.
    
---

    getFPS ()
    
---

    addAsset (pathOrArray)			
    
Example: `Core.addAsset([ "empty", "gfx/empty.jpg" ]);` The first parameter is the **key**, the second, the path.

---

    loadAndRun ()				
    
Call after adding all your assets to start executing the current state.
    
---

    hasStorageSupport ()
    
---

    saveToStorage (object, value)
    
---

    readFromStorage (object)

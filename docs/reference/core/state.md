# State : Entity

<span class="label label-info">Class</span> 

State is an encapsulation of a "game" state: for example, 
the screens on a game. They should hold the logic for each screen and manipulate high level entities.

**IMPORTANT**: you must create your objects that depend on resources in your _init_ method, 
since this is the one called when all resources are ready.
		
## Methods
	
    constructor ()
     
---
 
    init () 				
    
Override to create here the objects that require fully loaded resources. 
Everything else can go to the constructor.

---

    onPause (flag)	
    			
Override this method to control what happens when the application is paused or not 
(that's what the flag is for: it receives true when paused).
	

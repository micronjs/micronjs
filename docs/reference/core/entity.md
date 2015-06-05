# <i class="fa fa-book"></i> Entity

<span class="label label-info">Class</span>

The mother of all other things in the engine. GameStates, Sprites, Atlases, Sounds (ok, maybe not sounds) but everything is an entity.
Entities have the most basic behavior: they are holders of entities. As such, they have **init, update** and **draw** methods.
Entities also can be **pooled, cloned** or **destroyed**.
If you don't know what kind of class you need but you know you will have to update it or make it a cointainer for other things, this is the class you must extend.
For everything else, you should extend from <i>Base</i>.

## Members

---

### name

    name : String

An identifier to easily find your object.
    
---

### entities

    entities : Array

The array with all your entities added to this entity.    
    
---

### inUse

    inUse : true

This is true to keep consistency with non-pooled object. And yes, this flag is used when pooling.

---

## Methods

---

### constructor

    constructor (name)

---

### spawn

    spawn ()

Override when pooling.

---

### add

    add (entity)

Add another entity inside this one as child. This means that doing callParent in update and draw for this entity,
will also call automatically update and draw for the child entities of this one. 
Handy for creating hierarchies of entities quickly and avoid calling manually **update** and **draw**.
    
---

### remove

    remove (entity)

Removes the given entity (if exists). This doesn't destroy the removed object, it just removes it from the hierarchy.
    
---


### removeAll

    removeAll ()

Like remove, but for all children items.
    
---

### clone

    clone ()

A simple method that returns a new object which has all its attributes with the same value as the one cloned.
Useful for creating duplicated instances of the same object to modify later.
    
---

### update

    update (delta)

If your entity was added to the state or another one added to state, then this will be called automatically once per frame.
If not, you must call this manually to "tick" your entity.
Remember to do **this.callParent(delta)** inside your update if you want to tick the **children** entities of this.
    
---

### draw

    draw ()

Exactly like the case for update, but for this we control what we draw.    
    
---

### destroy

    destroy ()

Calls destroy on all of its children. Useful to release/delete what no longer is needed to destroy your entity (and its children).
    
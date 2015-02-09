# <i class="fa fa-book"></i> Entity

<span class="label label-info">Class</span>

The mother of all other things in the engine. GameStates, Sprites, Atlases, Sounds (ok, maybe not sounds) but everything is an entity.
Entities have the most basic behavior: they are holders of entities. As such, they have **init, update** and **draw** methods.
Entities also can be **pooled, cloned** or **destroyed**.
If you don't know what kind of class you need but you know you will have to update it or make it a cointainer for other things, this is the class you must extend.
For everything else, you should extend from <i>Base</i>.

## Members

### name

    name : String

---

### entities

    entities : Array

---

### inUse

    inUse : true

This is true to keep consistency with non-pooled object. And yes, this flag is used when pooling.

---

## Methods

### constructor

    constructor (name)

---

### spawn

    spawn ()

Override when pooling.

---

### add

    add (entity)

---

### remove

    remove (entity)

---


### removeAll

    removeAll ()

---

### clone

    clone ()

---

### update

    update (delta)

---

### draw

    draw ()

---

### destroy

    destroy ()

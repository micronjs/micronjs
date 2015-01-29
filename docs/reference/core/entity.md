# Entity

<span class="label label-info">Class</span>

The mother of all other things in the engine. GameStates, Sprites, Atlases, Sounds (ok, maybe not sounds) but everything is an entity.
Entities have the most basic behavior: they are holders of entities. As such, they have **init, update** and **draw** methods.
Entities also can be **pooled, cloned** or **destroyed**.
If you don't know what kind of class you need but you know you will have to update it or make it a cointainer for other things, this is the class you must extend.
For everything else, you should extend from <i>Base</i>.

## Members

    name : String

---

    entities : Array

---

    inUse : true

This is true to keep consistency with non-pooled object. And yes, this flag is used when pooling.

---

## Methods

    constructor (name)

---

    spawn ()

Override when pooling.

---

    add (entity)

---

    remove (entity)

---

    removeAll ()

---

    clone ()

---

    update (delta)

---

    draw ()

---

    destroy ()

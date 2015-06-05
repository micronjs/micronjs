# <i class="fa fa-book"></i> Pool : Entity

<span class="label label-info">Class</span>

Pools are extremely simple... erh... pools of [**Entities**](entity.md). When making a pool for your objects, they must have:
- a flag to determine the state of the object (**inUse**).
- a method to re-spawn the object when it's back to the world (**spawn**).

## Methods

---

### constructor

    constructor ()

---

### addToPool

    addToPool (object, amount)

Before pooling objects, you must first add the "model" ones.
Just put any poolable object and how many "unique" objects you want.

---

### spawn

    spawn (amount)

Determine how many death objects should be respawned.
It will spawn as many as possible. If there won't be enough, it will do nothing.

---

### spawn

    update (delta)

---

### draw

    draw ()


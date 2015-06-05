# <i class="fa fa-book"></i> Physics : Entity

<span class="label label-warning">Singleton</span>

An extremely simple yet effective way to handle collision detection and response.
This system provides support for 2d circles and squares with mass, friction, velocity and other paramenters.
Suitable for top down or platformer games. If you need more advanced features, check the hello_matterjs sample.
There are no speed up structures (quadtree or similar), which means this can become slow when too many objects
are in the simulation. Try to keep them to a minimum.

**IMPORTANT**: this is a somewhat "external" module. If you want to use this physics module, you will have to add
the **Physics** entity to your gamestates by doing: `this.add(Physics)` **or** by doing Physics.update(delta).

---

## Members

---

### gravity

    gravity : { x: 0, y: -10 }

The simulation gravity.

---

### bodies

    bodies : Array

The [Bodies](body.md) in the simulation.

---

### V_AABB

    V_AABB

<span class="label label-danger">read-only</span>

A constant used to define an axis aligned bounding box type object.

---

### V_SPHERE

    V_SPHERE

The same as V_AABB, but for bounding circles.

---

## Methods

---

### addBody

    addBody (body)

Method used internally by [Body](body.md). You can call it manually to add a new Body to the simulation
(in case you don't want to use **Physics.newBody**).

---

### newBody

    newBody (group)

Main entry point. Use to get a new Body in your simulation.

---

### removeBody

    removeBody (body)

If the body exists, it will be removed from the simulation.

---

### setGravity

    setGravity (x, y)

---

### testAABBvsAABB

    testAABBvsAABB (first, second)

Test method to determine whether 2 AABB collide. The returned object will contain 3 fields:
- result (true or false)
- thisObj {x,y} (an object with the position of the collision for *first*)
- otherObj {x,y} (an object with the position of the collision for *second*)

---

### testSPHEREvsSPHERE

    testSPHEREvsSPHERE (first, second)

Test method to determine whether 2 circles collide. The returned object is the same like in testAABBvsAABB.

---

### testAABBvsSPHERE

    testAABBvsSPHERE (first, second)

A fake circle vs aabb test: it will check the collision between the sphere but converted as aabb.

---

### update

    update (delta)

All the collisions are handled here, so you **must** remember to either add Physics to your gamestates or call this method manually.

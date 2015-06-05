# <i class="fa fa-book"></i> Body : Entity

<span class="label label-info">Class</span>

A very simple 2d "rigid" body.

While the physics system presented in micron is extremely simple (there are no joints for example nor rotations),
each body behaves as a rigid body. It can be **solid** (things collide with it) or **dynamic** (forces affect it, like velocity
or collisions with other objects). Non solid objects will be moved through others, and non dynamic cannot react to forces (like
velocity or gravity).

Furthermore, each object belongs to a given "collision group". Each object can set one callback to interact with each different
group, and it is possible to set a collision with its own group. Whether the object is solid/passable, dynamic/static, the callback
will be triggered. It is also possible to skip groups to avoid all callbacks and collision info whatsoever.

Setting the **velocity** manually works, as well as using **addImpulse*. However the latter uses the mass. **Friction** is used both
for "air friction" and friction against objects (for now). **Elasticity** controls how much "bounciness" an object has when colliding
with another. **Mass** is also important to determine how much objects bounce with each other.

---

## Members

---

### group

    group : String

"default" is the default value.

---

### type

    type

V_AABB by default (a rectangle).

---

### x

    x : Number

The position of the body.

**WARNING**: in the physics module, the position is **AT THE CENTER OF THE OBJECT**, and not the top left corner.

---

### y

    y : Number

Idem above.

---

### w

    w : Number

Width of the object. Used for AABB vs AABB and AABB vs Circle.

---

### h

    h : Number

Height of the object.

---

### extents

    extents : { x: 0.5, y: 0.5 }

Half the size in each axis.

---

### radius

    radius : Number

Used only when type === V_SPHERE.

---

### mass

    mass : Number

---

### elasticity

    elasticity : Number

1.0 or bigger means a very "jumpy" object. Less than 1.0 means a less "reactive" object.

---

### friction

    friction : Number

Use wisely to control velocity decay ("air friction"), and friction against other objects.

---

### velocity

    velocity : { x: 0, y:0 }

---

### isDynamic

    isDynamic : Boolean

When true, the object reacts to forces (like gravity and impulses). When false, it will stay in place unmovable.

---

### isSolid

    isSolid : Boolean

Solid objects can collide with others. Non solid objects are passable. Either way, onCollision callbacks are always triggered, even when non solid.

---

### skippedGroups

    skippedGroups : Array

List of all skippable groups (all objects of those groups won't trigger collision nor callbacks).

---

### groupsOnCallbacks

    groupsOnCallbacks : Map

An internal map used to hold all the callbacks for this object.

---

## Methods

---

### constructor ()

    constructor (group)

---

### destroy

    destroy ()

Either this method has to be called in the body to release it inside Physics, or Physics.removeBody(this).

---

### makeCircle

    makeCircle (x, y, radius)

Helper to quickly create a circular shaped body.

---

### makeRect

    makeRect (x, y, w, h)

Helper to quickly create a rectangular shaped body. Note that rectangle is the shape by default.

---

### setPosition

    setPosition (x, y)

---

### setSize

    setSize (w, h)

---

### setRadius

    setRadius (r)

---

### skipGroup

    skipGroup (otherGroup)

Mark **otherGroup** as skippable.

---

### skipSelfGroup

    skipSelfGroup (flag)

Mark the own group as skippable (for example, avoid entirely collisions between walls in a map).

---

### unskipGroup

    unskipGroup (otherGroup)

Remove **otherGroup** from the list of skippable objects.
    
---

### canSkip

    canSkip (otherGroup)

Returns **true** if the other group can be skipped. False otherwise.
    
---

### onCollision

    onCollision (group, callback)

Setter for a **callback** against the given **group**.
Example: `this.onCollision("coin", this.onGetCoin.bind(this));`
    
---

### intersects

    intersects (other)

Returns **collision data** after checking if there is an intersection with **other**.
    
---

### processCollision

    processCollision (other, data)

Given the other object and the intersection data, this method calculates the new positions and forces for both of them.    
    
---

### execCallback

    execCallback (other)

Execute the callback for the group of the **other** object.
    
---

### isPointInside

    isPointInside (x, y)

Returns whether the given point is inside the Body.
    
---

### addImpulse

    addImpulse (x, y)

Add an ongoing impulse in the direction provided by the vector (x, y). This vector will be divided by this object's **mass**.
Note that a similar effect can be achieved by setting the velocity directly.
    
---

### resetVelocity

    resetVelocity ()

---

### update

    update (delta)

If the object is not dynamic, there is no need to update. However it is recommended. If the object was added to Physics, this will be done automatically.    
    
---

### drawDebug

    drawDebug (r, g, b, a)


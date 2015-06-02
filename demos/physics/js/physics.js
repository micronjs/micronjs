
var V_AABB = 1000
var V_SPHERE = 2000

var Body = Entity.extend({

    group : "",
    type : V_AABB,
    x : 0.0,
    y : 0.0,
    w : 1.0,
    h : 1.0,
    extents: null,
    min : null,
    max : null,
    radius : 0.0,
    mass : 1.0,
    elasticity : 0.35,
    friction : 0.92,
    velocity : null,
    isDynamic : true,
    isSolid : true,
    skippedGroups : null,
    groupsOnCallbacks : null,

    constructor : function(group)
    {
        this.callParent();

        this.group = group || "default";
        this.extents = { x: 0, y: 0 };
        this.min = { x: 0, y: 0 };
        this.max = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.skippedGroups = [];
        this.groupsOnCallbacks = {};

        Physics.addBody(this);
    },

    // TEST ME! (and after doing destroy, please also null this object)
    destroy : function()
    {
        Physics.removeBody(this);
    },

    // IMPORTANT! the position in physics object is stored FROM THE CENTER of the object! (perhaps this should be changed to match micron???)
    setPosition : function(x, y)
    {
        this.x = x;
        this.y = y;
    },

    setSize : function(w, h)
    {
        this.extents.x = w / 2;
        this.extents.y = h / 2;
        this.w = w;
        this.h = h;
    },

    // TEST ME
	skipGroup : function(otherGroup)
    {
        this.skippedGroups.push(otherGroup);
    },

    // TEST ME
    skipSelfGroup : function(flag)
    {
        if(flag)
        {
            this.skipGroup(this.group);
        }
        else
        {
            this.unskipGroup(this.group);
        }
    },

    // TEST ME
    unskipGroup : function(otherGroup)
    {
        var index = this.skippedGroups.indexOf(otherGroup);
        if(index >= 0)
        {
            this.bodies.splice(index, 1);
        }
    },

    // TEST ME
    canSkip : function(otherGroup)
    {
        if(this.skippedGroups.indexOf(otherGroup) !== -1)
        {
            return true;
        }

        return false;
    },

    onCollision : function(group, callback)
    {
        this.groupsOnCallbacks[group] = callback;
    },

    intersects : function(other)
    {
        if(this.type === V_SPHERE && other.type === V_SPHERE)
        {
            return Physics.testSPHEREvsSPHERE(this, other);
        }
        else if(this.type === V_AABB && other.type === V_AABB)
        {
            return Physics.testAABBvsAABB(this, other);
        }
        else
        {
            return Physics.testAABBvsSPHERE(this, other);
        }
    },

    processCollision : function(other, data)
    {
        var N = { x: data.otherObj.x - data.thisObj.x, y: data.otherObj.y - data.thisObj.y };
        var fRatio1, fRatio2;
        var massRatio = this.calculateMassRatio(other, true);

        if(!massRatio.result)
        {
            return;
        }

        fRatio1 = massRatio.thisObj;
        fRatio2 = massRatio.otherObj;

        this.x += N.x * fRatio1;
        this.y += N.y * fRatio1;

        other.x -= N.x * fRatio2;
        other.y -= N.y * fRatio2;

        var xVel = { x: this.velocity.x - other.velocity.x, y: this.velocity.y - other.velocity.y };
        var nv = (N.x * xVel.x) + (N.y * xVel.y);

        if (nv > 0.0) // the objects move away from each other
        {
            return;
        }

        var n2 = (N.x * N.x) + (N.y * N.y);

        if (n2 < 0.00001)
        {
            return;
        }

        massRatio = this.calculateMassRatio(other, false);
        fRatio1 = massRatio.thisObj;
        fRatio2 = massRatio.otherObj;

        var fElasticity = this.elasticity;
        var fFriction   = this.friction;

        var Vn = { x: N.x * (nv / n2), y: N.y * (nv / n2) };
        var Vt = { x: xVel.x - Vn.x, y: xVel.y - Vn.y };

        //----------------------------------------------
        // apply response
        // V = -Vn . (1.0f + CoR) + Vt . CoF
        //----------------------------------------------
        this.velocity.x -= ((1.0 + this.elasticity) * fRatio1) * Vn.x + Vt.x + this.friction;
        this.velocity.y -= ((1.0 + this.elasticity) * fRatio1) * Vn.y + Vt.y + this.friction;

        // this is fucking up everything, keep commented please
        //other.velocity.x -= ((1.0 + other.elasticity) * fRatio1) * Vn.x + Vt.x + other.friction;
        //other.velocity.y -= ((1.0 + other.elasticity) * fRatio1) * Vn.y + Vt.y + other.friction;

        if(other.group in this.groupsOnCallbacks)
        {
            this.groupsOnCallbacks[other.group](other); // execute the callback - if any
        }
    },

    // TEST ME
    isPointInside : function(x, y)
    {
        switch(this.type)
        {
            case V_SPHERE:
                //if(Vec3Distance(x, y, z, m_pos.x, m_pos.y, m_pos.z) > m_radius)
                if(Math.sqrt((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y2)) > this.radius)
                {
                    return true;
                }
            break;
            case V_AABB:
            default:
                var minx = this.x - this.extents.x,
                    miny = this.y - this.extents.y;

                var maxx = this.x + this.extents.x,
                    maxy = this.y + this.extents.y;

                if(x >= minx && x <= maxx && y >= miny && y <= maxy)
                {
                    return true;
                }
            break;
        }
    },

    calculateMassRatio : function(other, normalize)
    {
        var ret = {
            result: false,
            thisObj : 0.0,
            otherObj : 0.0
        };

        var fRatio1 = 0.0;
        var fRatio2 = 0.0;
        var m = (this.mass + other.mass);

        if (m < 0.000001)
        {
            return ret;
        }
        else if (other.mass < 0.0000001 || other.isDynamic === false)
        {
            fRatio1 = 1.0;
            fRatio2 = 0.0;
        }
        else if (this.mass < 0.0000001 || this.isDynamic === false)
        {
            fRatio1 = 0.0;
            fRatio2 = 1.0;
        }
        else
        {
            if (normalize)
            {
                fRatio1 = 0.5;
                fRatio2 = 1.0 - fRatio1;
            }
            else
            {
                fRatio1 = other.mass / m;
                fRatio2 = 1.0 - fRatio1;
            }
        }

        ret.result      = true;
        ret.thisObj     = fRatio1;
        ret.otherObj    = fRatio2;
        return ret;
    },

    // TODO: add other... better... stuff...
    addImpulse : function(x, y)
    {
        // velocity = velocity + (force / mass)
        this.velocity.x += x / this.mass;
        this.velocity.y += y / this.mass;
    },

    resetVelocity : function()
    {
        this.velocity.x = 0.0;
        this.velocity.y = 0.0;
    },

    update : function(delta)
    {
        this.callParent(delta);
        if(this.isDynamic && this.isSolid)
        {
            this.velocity.x += Physics.gravity.x * this.friction;
            this.velocity.y += Physics.gravity.y * this.friction * -1.0;

            this.x += this.velocity.x * delta;
            this.y += this.velocity.y * delta;
        }
    },

    // basic debug stuff
    debugDraw : function(r, g, b, a)
    {
        Graphics.drawRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h, r, g, b, a);
    }

});


var PhysicsDef = Entity.extend({

    gravity : null,
    bodies : null,

    constructor : function()
    {
        this.callParent();
        this.gravity = { x: 0.0, y: -10.0 };
        this.bodies = [];
    },

    addBody : function(body) // used automatically when creating a new body (to register itself). what happens when something is destroyed? > call destroy
    {
        this.add(body);
        this.bodies.push(body);
    },

    newBody : function(group)
    {
        var ret = new Body(group);
        return ret;
    },

    // TEST ME
    removeBody : function(body)
    {
        var index = this.bodies.indexOf(body);
        if(index >= 0)
        {
            this.bodies.splice(index, 1);
            this.remove(body);
        }
    },

    setGravity : function(x, y)
    {
        this.gravity.x = x;
        this.gravity.y = y;
    },

    axisIntersect : function(min0, max0, min1, max1, d)
    {
        var d0 = max1 - min0;
        var d1 = max0 - min1;

        if (d0 < 0.0 || d1 < 0.0)
        {
            return [false];
        }

        if (d0 < d1)
        {
            d = d0;
        }
        else
        {
            d = -d1
        }

        return [true, d];
    },

    testAABBvsAABB : function(first, second)
    {
        var ret = {
            result : false,
            thisObj : {},
            otherObj : {}
        }

        var xMin0 = { x: first.x - first.extents.x, y: first.y - first.extents.y };
        var xMax0 = { x: first.x + first.extents.x, y: first.y + first.extents.y };
        var xMin1 = { x: second.x - second.extents.x, y: second.y - second.extents.y };
        var xMax1 = { x: second.x + second.extents.x, y: second.y + second.extents.y };

        var N = { x: 0, y: 0 };

        var xAxis = this.axisIntersect(xMin0.x, xMax0.x, xMin1.x, xMax1.x, N.x);
        var yAxis = this.axisIntersect(xMin0.y, xMax0.y, xMin1.y, xMax1.y, N.y);

        if( !xAxis[0] || !yAxis[0])
        {
            return ret;
        }

        N.x = xAxis[1];
        N.y = yAxis[1];

        var mindist = Math.abs(N.x);

        if (Math.abs(N.y) < mindist)
        {
            mindist = Math.abs(N.y);
            N.x = 0.0;
        }
        else
        {
            N.y = 0.0;
        }

        ret.result 		= true;
        ret.thisObj     = { x: 0.0, y: 0.0 };
        ret.otherObj    = N;
        return ret;
    },

    testSPHEREvsSPHERE : function(first, second)
    {
        var ret = {
            result : false,
            thisObj : {},
            otherObj : {}
        }

        (x * V.x) + (y * V.y)

        var pDist = {x: second.x - first.x, y: second.y - first.y };
        var dist2 = (pDist.x * pDist.x) + (pDist.y * pDist.y);
        var r = first.radius + second.radius;
        var r2 = r * r;

        if (dist2 > r2)
        {
            return ret;
        }

        pDist /= Math.sqrt(dist2);

        ret.thisObj     = { x: first.x + pDist.x * first.radius, y: first.y + pDist.y * first.radius }; //first->getPosition() + pDist * first->getRadius();
        ret.otherObj    = { x: second.x - pDist.x * second.radius, y: second.y - pDist.y * second.radius }; // second->getPosition() - pDist * second->getRadius();
        ret.result      = true;
        return ret;
    },

    // THIS IS UTTER SHIT
    // Just treat them like AABB vs AABB and fuck it
    testAABBvsSPHERE : function(first, second)
    {
        return this.testAABBvsAABB(first, second);
    },

    update : function(delta)
    {
        this.callParent(delta);

        for(var i = 0; i < this.bodies.length; i++)
        {
            for(var j = 0; j < this.bodies.length; j++)
            {
                if(i == j) continue;

                var first = this.bodies[i],
                    second = this.bodies[j];

                    // FINISH THIS SHIT
                //if(first.isDynamic && first.isSolid && !first.canSkip(second) && second.isSolid)
                if(!first.canSkip(second.group))
                {
                    var data = first.intersects(second);
                    if(data.result === true)
                    {
                        first.processCollision(second, data);
                    }
                }
            }
        }
    }

});

var Physics = new PhysicsDef();

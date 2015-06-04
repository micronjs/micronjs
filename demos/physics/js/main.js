
var StateGame = State.extend({

    body : null,
    ground : null,
    circle : null,
    circle2 : null,
    counter : 0,
    gravityEnabled : false,

    constructor : function()
    {
        this.callParent();
    },

    init : function()
    {

        this.body = Physics.newBody();
        this.body.setSize(100, 100);
        this.body.mass = 1;
        this.body.x = 350;
        this.body.onCollision("ground", this.testCollision.bind(this) );
        this.friction = 0.01;
        //this.body.isDynamic = false;

        this.circle = new Physics.newBody();
        this.circle.type = Physics.V_SPHERE;
        this.circle.setRadius(25);
        this.circle.x = 60;
        this.circle.y = 200;
        this.circle.mass = 2000;
        this.circle.elasticity = 0.93;
        this.circle.isDynamic = false;

        this.circle2 = new Physics.newBody();
        this.circle2.type = Physics.V_SPHERE;
        this.circle2.setRadius(35);
        this.circle2.x = 80;
        this.circle2.y = 140;
        this.circle2.mass = 0.1;
        this.circle2.elasticity = 0.86;
        this.circle2.friction = 0.94;

        this.ground = Physics.newBody("ground");
        this.ground.setSize(500, 50);
        this.ground.x = 300;
        this.ground.y = 420;
        this.ground.isDynamic = false;

        this.setGravity(this.gravityEnabled);
        this.add(Physics);
    },

    testCollision : function(a)
    {
        this.counter++;

        if(this.counter > 3)
        {
            this.ground.destroy();
            this.ground = null;
        }
    },

    setGravity : function(flag)
    {
        if(flag)
        {
            Physics.setGravity(0, -10);
        }
        else
        {
            Physics.setGravity(0, 0);
        }
    },

    // note: you can also set manually the velocity - works also, but then you can make it constant
    moveBody : function()
    {
        var moved = false;

        //this.body.resetVelocity();

        if(Input.isKeyPressed(Input.KEY_A))
        {
            moved = true;
            //this.body.velocity.x = -50;
            this.body.addImpulse(-25, 0);
        }
        if(Input.isKeyPressed(Input.KEY_D))
        {
            moved = true;
            //this.body.velocity.x = 50;
            this.body.addImpulse(25, 0);
        }

        if(Input.isKeyPressed(Input.KEY_S))
        {
            moved = true;
            //this.body.velocity.y = 50;
            this.body.addImpulse(0, 25);
        }

        if(Input.isKeyPressed(Input.KEY_W))
        {
            moved = true;
            //this.body.velocity.y = -50;
            this.body.addImpulse(0, -25);
        }

        return moved;
    },

    update : function(delta)
    {
        this.callParent(delta);

        // TEST IMPULSES!
        /*
        if(Input.isKeyPressed(Input.KEY_A))          this.body.addImpulse(-50, 0); //this.body.velocity.x = -50;   // this.body.addImpulse(-5.0, 0.0);
        else if(Input.isKeyPressed(Input.KEY_D))     this.body.velocity.x = 50;   // this.body.addImpulse(5.0, 0.0);
        else if(Input.isKeyPressed(Input.KEY_S))     this.body.velocity.y = 50;   // this.body.addImpulse(0.0, 5.0);
        else if(Input.isKeyPressed(Input.KEY_W))     this.body.velocity.y = -50;   // this.body.addImpulse(0.0, -5.0);
        //else this.body.resetVelocity();
        */

        if(Input.isKeyPressed(Input.KEY_SPACE))
        {
            this.gravityEnabled = !this.gravityEnabled;
            this.setGravity(this.gravityEnabled);
        }

        if(!this.moveBody() && !this.gravityEnabled)
        {
          //  this.body.resetVelocity();
        }

    },

    draw : function()
    {
        this.callParent();
        Graphics.drawFullScreenRect(0, 0, 1, 1.0);
        this.body.drawDebug(1, 0, 0, 1);
        this.circle.drawDebug(1, 0, 1, 1);
        this.circle2.drawDebug(1, 1, 0, 1);

        if(this.ground)
        {
            this.ground.drawDebug(0, 1, 0, 1);
        }

        Graphics.drawText("Gravity: " + (this.gravityEnabled ? "ON" : "OFF"), 10, 10, 1, 1, 1, 1, 24);
        Graphics.drawText("Touch the ground with the red square to remove it.", 10, 48, 1, 1, 1, 1, 24);
    }
});

Core.init(640, 480);
Core.setState(new StateGame());
Core.loadAndRun();

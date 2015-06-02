
var StateGame = State.extend({

    body : null,
    ground : null,

    constructor : function()
    {
        this.callParent();
    },

    init : function()
    {
        this.body = Physics.newBody();
        this.body.setSize(100, 100);
        this.body.mass = 10;
        this.body.x = 350;
        this.body.onCollision("default", this.testCollision.bind(this) );
        //this.body.skipGroup("default"); // NOT WORKING!

        // TEST SOLID, NON SOLID, DYNAMIC AND NON DYNAMIC!
        this.ground = Physics.newBody();
        this.ground.setSize(500, 50);
        this.ground.x = 300;
        this.ground.y = 140;
        this.ground.isDynamic = false;

        Physics.setGravity(0.0, 0.0);
        this.add(Physics);
    },
    
    testCollision : function(a)
    {
        console.log("collision! ", a);
    },

    update : function(delta)
    {
        this.callParent(delta);
        
        // TEST IMPULSES!
        if(Input.isKeyPressed(Input.KEY_A))          this.body.velocity.x = -50;   // this.body.addImpulse(-5.0, 0.0);
        else if(Input.isKeyPressed(Input.KEY_D))     this.body.velocity.x = 50;   // this.body.addImpulse(5.0, 0.0);
        else if(Input.isKeyPressed(Input.KEY_S))     this.body.velocity.y = 50;   // this.body.addImpulse(0.0, 5.0);
        else if(Input.isKeyPressed(Input.KEY_W))     this.body.velocity.y = -50;   // this.body.addImpulse(0.0, -5.0);
        else this.body.resetVelocity();
    },

    draw : function()
    {
        this.callParent();
        Graphics.drawFullScreenRect(0, 0, 1, 1.0);
        this.body.debugDraw(1, 0, 0, 1);
        this.ground.debugDraw(0, 1, 0, 1);
    }
});

Core.init(640, 480);
Core.setState(new StateGame());
Core.loadAndRun();

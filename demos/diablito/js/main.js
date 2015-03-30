
/*
Taken directly from https://github.com/ertrzyiks/micronjs-mini-game
*/

var StateGame = State.extend({
		
	player : null,
	healthBar : null,
	map : null,
		
    constructor : function() 
	{
		this.callParent();
        //this.entities = [];

        this.player = new Player();
        this.healthBar = new HealthBar(100);
        this.healthBar.x = 10;
        this.healthBar.y = 10;

        this.map = new GameMap();
        this.map.setPlayer(this.player);

        this.add(this.map);
    },

    init : function()
	{
		this.callParent();
        Camera.fade( {r:0, g:0, b:0, a:1}, {r:0, g:0, b:0, a:0}, 1);
        Camera.add(this.healthBar);
    },

    update : function(delta) 
	{
        this.callParent(delta);

        if (Input.isKeyPressed(Input.KEY_S)) 
		{
            this.player.moveDown();
        }
        else if (Input.isKeyPressed(Input.KEY_W)) 
		{
            this.player.moveUp();
        }

        if (Input.isKeyPressed(Input.KEY_A)) 
		{
            this.player.moveLeft();
        }
        else if (Input.isKeyPressed(Input.KEY_D)) 
		{
            this.player.moveRight();
        }

        this.map.fixPlayerPosition();
        this.repositionCamera();
    },

    repositionCamera : function()
	{
        var SCREEN_X = Graphics.width,
            SCREEN_Y = Graphics.height,
            SCREEN_X_OFFSET = SCREEN_X / 2,
            SCREEN_Y_OFFSET = SCREEN_Y / 2;

        Camera.x = this.player.x - SCREEN_X_OFFSET;
        Camera.y = this.player.y - SCREEN_Y_OFFSET;

        if (this.player.x > (this.map.width - SCREEN_X_OFFSET)) 
		{
            Camera.x = (this.map.width - SCREEN_X);
        }

        if (this.player.y > (this.map.height - SCREEN_Y_OFFSET)) 
		{
            Camera.y = (this.map.height - SCREEN_Y);
        }

        if (Camera.x < 0) 
		{
            Camera.x = 0;
        }

        if (Camera.y < 0) 
		{
            Camera.y = 0;
        }
    },

    draw : function() 
	{
        this.callParent();
        //this.map.draw();
    }
});

Core.init(APP_WIDTH, APP_HEIGHT);
Core.setState(new StateGame());
//Core.addAsset([	'empty', 'img/empty.jpg' ]);
Core.loadAndRun();


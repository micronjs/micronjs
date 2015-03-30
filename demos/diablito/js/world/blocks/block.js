
var Block = Entity.extend({

	hasPlayer : false,
	type : "",
	col : 0,
	row : 0,
	x : 0,
	y : 0,

    constructor : function(type, col, row) 
	{
        this.callParent();

        this.hasPlayer = false;
        this.type = type;
        this.col = col;
        this.row = row;
        this.x = col * BLOCKSIZE;
        this.y = row * BLOCKSIZE;

        switch(this.type) 
		{
            case 'D':
                this.color = { r: 120/255, g: 120/255, b: 0 };
                break;

            case 'W':
                this.color = { r: 84/255, g: 16/255, b: 16/255 };
                break;

            case 'L':
                this.color = { r: 120/255, g: 0, b: 0 };
                break;
        }
    },

    draw : function()
	{
		this.callParent();		
        Graphics.drawRect(this.x, this.y, BLOCKSIZE, BLOCKSIZE, this.color.r, this.color.g, this.color.b, 0.5);
    }
});

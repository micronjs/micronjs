
var HealthBar = Entity.extend({

	border : 1, 
	padding : 1,
	width : 140,
	height : 20,
	maxHp : 100,
	hp : 100,

    constructor : function(maxHp) 
	{
        this.callParent();

        this.maxHp = maxHp;
        this.hp = maxHp;
    },

    update : function(delta)
	{
		this.callParent();
        this.hpPercentage = this.hp / this.maxHp;
    },

    draw : function() 
	{
        Graphics.drawRect(this.x, this.y, this.width, this.height, 1, 1, 1, 0.5);

        Graphics.drawRect(this.x + this.border, this.y + this.border, this.width - this.border - this.border, this.height - this.border - this.border, 0, 0, 0, 1.0);

        Graphics.drawRect(this.x + this.border + this.padding, this.y + this.padding + this.border,
            (this.width - this.padding - this.padding - this.border - this.border) * this.hpPercentage,
            this.height - this.padding - this.padding - this.border - this.border, 0, 0.5, 0, 1.0);
    }
});

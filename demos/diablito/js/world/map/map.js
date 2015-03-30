
var GameMap = Entity.extend({

	blocks : null,
	lastPlayerPosition : null,
	blocksLayout : null,
	width : 0,
	height : 0,

    constructor : function() 
	{
        this.callParent();

        this.blocks = {};
        this.lastPlayerPosition = { x: 0, y: 0 };

        this.blocksLayout = [
            "WWWWWWWWWWWWWWWWW",
            "WPPPPPPPPPPPPPPPW",
            "WPPPPPPPPPPPPPPPW",
            "WPPWWWWWWWWWLPPLW",
            "WPPWWWWWWWWWLPPLW",
            "WPPWWWWWWWWWLPPLW",
            "WPPWWWWWWWWWLPPPW",
            "WPPWWWWWWWWWLPPPW",
            "WPPWWWWWWWWWLLLLW",
            "WPPWWWWWWWWWPPPPW",
            "WPPWWWWWWWWWPPPPW",
            "WPPPPPPPPPPPPPPPW",
            "WWWWWWWWWWWWWWWWW"
        ];

		var that = this;
        this.blocksLayout.map(function (row, rowNum) {
            var key;

            for (var colNum = 0; colNum < row.length; colNum++) 
			{
                if (row[colNum] === 'P') continue;

                key = colNum + "|" + rowNum;

                that.blocks[key] = new Block(row[colNum], colNum, rowNum);

                that.add(that.blocks[key]);
            }
        });
				
        this.width = this.blocksLayout[0].length * BLOCKSIZE;
        this.height = this.blocksLayout.length * BLOCKSIZE;
		
    },

    setPlayer : function(player) 
	{
        this.player = player;
        this.add(player);
    },

    canStand : function(row, col) 
	{
        var key = col + "|" + row;
        if ('undefined' === typeof this.blocks[key]) 
		{
            return true;
        }
        return false;
    },

    getNewPlayerPositionX : function(playerX, playerY) 
	{
        var player = this.player,
            baseCol2RightBottom, baseRow2RightBottom, baseCol2RightTop, baseRow2RightTop,
            baseCol2LeftTop, baseRow2LeftTop, baseCol2LeftBottom, baseRow2LeftBottom;

        baseCol2RightBottom = Math.floor((playerX + player.width - 1.0) / BLOCKSIZE);
        baseRow2RightBottom = Math.floor((playerY + player.height - 1.0) / BLOCKSIZE);
        baseCol2RightTop = Math.floor((playerX + player.width - 1.0) / BLOCKSIZE);
        baseRow2RightTop = Math.floor((playerY + 1.0) / BLOCKSIZE);

        baseCol2LeftTop = Math.floor((playerX + 1.0) / BLOCKSIZE);
        baseRow2LeftTop = Math.floor((playerY + 1.0) / BLOCKSIZE);
        baseCol2LeftBottom = Math.floor((playerX + 1.0) / BLOCKSIZE);
        baseRow2LeftBottom = Math.floor((playerY + player.height - 1.0) / BLOCKSIZE);

        if (player.velocity.x > 0) 
		{
            if(this.canStand(baseRow2RightBottom, baseCol2RightBottom - 1) &&
                !this.canStand(baseRow2RightBottom, baseCol2RightBottom)) 
			{
                return (baseCol2RightBottom) * BLOCKSIZE - player.width;
            }
            else if (this.canStand(baseRow2RightTop, baseCol2RightTop - 1) &&
                !this.canStand(baseRow2RightTop, baseCol2RightTop)) 
			{
                return (baseCol2RightTop) * BLOCKSIZE - player.width;
            }
        }

        if (player.velocity.x < 0) 
		{
            if(this.canStand(baseRow2LeftBottom, baseCol2LeftBottom + 1) &&
                !this.canStand(baseRow2LeftBottom, baseCol2LeftBottom)) 
			{
                return (baseCol2LeftBottom + 1) * BLOCKSIZE;

            }
            else if (this.canStand(baseRow2LeftTop, baseCol2LeftTop + 1) &&
                !this.canStand(baseRow2LeftTop, baseCol2LeftTop)) 
			{
                return (baseCol2LeftTop + 1) * BLOCKSIZE;
            }
        }
        return playerX;
    },

    getNewPlayerPositionY : function(playerX, playerY) 
	{
        var player = this.player,
            baseCol2RightBottom, baseRow2RightBottom, baseCol2RightTop, baseRow2RightTop,
            baseCol2LeftTop, baseRow2LeftTop, baseCol2LeftBottom, baseRow2LeftBottom;

        baseCol2RightBottom = Math.floor((playerX + player.width - 1.0) / BLOCKSIZE);
        baseRow2RightBottom = Math.floor((playerY + player.height - 1.0) / BLOCKSIZE);
        baseCol2RightTop = Math.floor((playerX + player.width - 1.0) / BLOCKSIZE);
        baseRow2RightTop = Math.floor((playerY + 1.0) / BLOCKSIZE);

        baseCol2LeftTop = Math.floor((playerX + 1.0) / BLOCKSIZE);
        baseRow2LeftTop = Math.floor((playerY + 1.0) / BLOCKSIZE);
        baseCol2LeftBottom = Math.floor((playerX + 1.0) / BLOCKSIZE);
        baseRow2LeftBottom = Math.floor((playerY + player.height - 1.0) / BLOCKSIZE);

        if (player.velocity.y > 0) 
		{
            if(this.canStand(baseRow2LeftBottom - 1, baseCol2LeftBottom) &&
                !this.canStand(baseRow2LeftBottom, baseCol2LeftBottom)) 
			{
                return (baseRow2LeftBottom) * BLOCKSIZE - player.height;
            }
            else if(this.canStand(baseRow2RightBottom - 1, baseCol2RightBottom) &&
                !this.canStand(baseRow2RightBottom, baseCol2RightBottom)) 
			{
                return (baseRow2RightBottom) * BLOCKSIZE - player.height;
            }
        }

        if (player.velocity.y < 0) 
		{
            if(this.canStand(baseRow2LeftTop + 1, baseCol2LeftTop) &&
                !this.canStand(baseRow2LeftTop, baseCol2LeftTop)) 
			{
                return (baseRow2LeftTop + 1) * BLOCKSIZE;
            }
            else if(this.canStand(baseRow2RightTop + 1, baseCol2RightTop) &&
                !this.canStand(baseRow2RightTop, baseCol2RightTop)) 
			{
                return  (baseRow2RightTop + 1) * BLOCKSIZE;
            }
        }
        return playerY;
    },

    fixPlayerPosition : function() 
	{
        var player = this.player,
            playerX = player.x,
            playerY = player.y,

            playerX1 = playerX,
            playerY1 = playerY,

            playerX2 = playerX,
            playerY2 = playerY;

        playerX1 = this.getNewPlayerPositionX(playerX1, playerY1);
        playerY1 = this.getNewPlayerPositionY(playerX1, playerY1);

        playerY2 = this.getNewPlayerPositionY(playerX2, playerY2);
        playerX2 = this.getNewPlayerPositionX(playerX2, playerY2);

        var distance1 = Utils.distance(this.lastPlayerPosition.x, this.lastPlayerPosition.y, playerX1, playerY1);
        var distance2 = Utils.distance(this.lastPlayerPosition.x, this.lastPlayerPosition.y, playerX2, playerY2);

        if (distance1 < distance2) 
		{
            playerX = playerX1;
            playerY = playerY1;
        }
		else 
		{
            playerX = playerX2;
            playerY = playerY2;
        }

        if (player.x != playerX) 
		{
            player.x = playerX;
            player.velocity.x = 0;
        }

        if (player.y != playerY) 
		{
            player.y = playerY;
            player.velocity.y = 0;
        }

        this.lastPlayerPosition.x = player.x;
        this.lastPlayerPosition.y = player.y;
    }
});


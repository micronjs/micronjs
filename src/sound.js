
// Sound.js

// todo: check for specific supported types
// todo: integrate with asset loader and pause sounds when the app is paused (and such other things)
var SoundDef = Base.extend({

    soundSupported : false,

    constructor : function()
    {
        this.soundSupported = !!(document.createElement("audio").canPlayType);
    },

    hasSound : function()
    {
        return this.soundSupported;
    }
});

var Sound = new SoundDef();

// mp3, wav, etc
var Song = Base.extend({

    path : "",
    loops : false,
    song : null,
    playing : false,

    constructor : function(path, loop)
    {
        this.path = path;
        this.loops = loop;
        this.song = document.createElement("audio");
        this.song.setAttribute("src", this.path);
        if(this.loops)
        {
            this.song.setAttribute("loop", true);
        }
    },

    play : function()
    {
        if(Audio.hasSound() && this.song !== null)
        {
            this.playing = true;
            this.song.play();
        }
    },

    pause : function()
    {
        if(Audio.hasSound() && this.song !== null)
        {
            this.playing = false;
            this.song.pause();
        }
    },

    stop : function()
    {
        if(Audio.hasSound() && this.song !== null)
        {
            this.playing = false;
            this.song.pause();
            if(!isNaN(this.song.duration)) // avoid "not fully loaded yet" issues
            {
                this.song.currentTime = 0;
            }
        }
    },

    setVolume : function(value)
    {
        if(Audio.hasSound() && this.song !== null)
        {
            this.song.volume = value;
        }
    }
});

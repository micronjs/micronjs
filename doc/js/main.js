(function () {

	// Small and not very good code to change the secret/super/happy message text.
	var texts = [	"Welcome my friend!",
					"Happiness awaits!",
					"A good day to make good games.",
					"Dragonporn!",
					"HODOR!",
					"Sit down and enjoy.",
					"A good coffee, a pair of glasses and...",
					"3d anyone?",
					"The princess is in da house.",
					"Welcome back, Sirius!",
					" :D ",
					"I AM YOUR..."];

	var what = parseInt(Math.random() * texts.length);
	document.getElementById('super_msg').innerHTML = texts[what];

})();

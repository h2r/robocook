var gameSceneSplash = {
	Init : function() {
		console.log("Splash initializing.");
		$("body").append("<h1 id='splashTitle'>" + gameConfig.Title + "</h1>");
		console.log("Generating splash title at " + gamePos.TitleY + " " + gamePos.TitleX);
		$("#splashTitle").css({
			"color": gameConfig.TitleColor,
			"font-size": gameConfig.TitleSize,
			"position":"absolute",
			"top":gamePos.TitleY,
			"left":gamePos.TitleX});
		console.log("Generating start button at " + gamePos.StartY + " " + gamePos.StartX);
		$("body").append("<button id='splashButton' type='button'>" + gameConfig.StartButton + "</button>");
		$("#splashButton").css({
			"position":"absolute",
			"top":gamePos.StartY,
			"left":gamePos.StartX});
	}
}
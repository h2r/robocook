var gameSceneSplash = {
	Init : function() {
		console.log("Splash Scene -> Initializing.");
		$("body").append("<div id='"+gameConfig.SceneSplashName+"'></div>");
		$("#"+gameConfig.SceneSplashName).append("<h1 id='splashTitle'>" + gameConfig.Title + "</h1>");
		console.log("Splash Scene -> Generating Title at " + gamePos.TitleY + " " + gamePos.TitleX);
		$("#splashTitle").css({
			"color": gameConfig.TitleColor,
			"font-size": gameConfig.TitleSize,
			"position":"absolute",
			"top":gamePos.TitleY,
			"left":gamePos.TitleX});
		console.log("Splash Scene -> Generating Start button at " + gamePos.StartY + " " + gamePos.StartX);
		$("#splashScene").append("<button id='splashButton' type='button'>" + gameConfig.StartButton + "</button>");
		$("#splashButton").css({
			"position":"absolute",
			"top":gamePos.StartY,
			"left":gamePos.StartX})
			.click(function(event) {
				event.preventDefault();
				console.log("Splash Scene -> Start button clicked!");
				RegisterCommand(gameConfig.SceneSplashName, EnumGameCommands.Start);
			});
		CurrentGameState = EnumGameState.SplashIdle;
		console.log("Splash Scene -> Setting game state to idle.");
	},
	
	Start : function() {
		console.log("Splash Scene -> Processing splash start command...");
		CurrentGameState = EnumGameState.SplashTrans;
		console.log("Splash Scene -> Setting game state to transition.");
	},
	
	Trans : function() {
		console.log("Splash Scene -> Transitioning to Main Menu.");
		//Destroy existing scene
		$("#"+gameConfig.SceneSplashName).remove();
		CurrentGameState = EnumGameState.MainMenuInit;
	}
};

var gameSceneMainMenu = {
	Init: function() {
	},
	
	Trans: function() {
	}
};

var gameSceneMatchmaking = {
	Init: function() {
	},
	
	Trans: function() {
	}
};

var gameSceneMatch = {
	Init: function() {
	},
	
	Trans: function() {
	}
};

var gameScenePostMatch = {
	Init: function() {
	},
	
	Trans: function() {
	}
};
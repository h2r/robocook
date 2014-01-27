var EnumGameMode = {
	None: 0,
	Singleplayer: 1,
	Multiplayer: 2
};

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
		$("#"+gameConfig.SceneSplashName).append("<button id='splashButton' type='button'>" + gameConfig.StartButton + "</button>");
		$("#splashButton").css({
			"position":"absolute",
			"top":gamePos.StartY,
			"left":gamePos.StartX})
			.click(function(event) {
				event.preventDefault();
				console.log("Splash Scene -> Start button clicked!");
				RegisterCommand(gameConfig.SceneSplashName, EnumGameCommands.Start);
			});
		//Game state change
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
	//Methods
	Init: function() {
		console.log("Main Menu Scene -> Initializing.");
		$("body").append("<div id='"+gameConfig.SceneMainMenuName+"'></div>");
		$("#"+gameConfig.SceneMainMenuName).append("<h1 id='mainTitle'>" + gameConfig.Title + "</h1>");
		console.log("Main Menu Scene -> Generating Title at " + gamePos.MainTitleY + " " + gamePos.MainTitleX);
		$("#mainTitle").css({
			"color": gameConfig.TitleColor,
			"font-size": gameConfig.TitleSize,
			"position":"absolute",
			"top":gamePos.MainTitleY,
			"left":gamePos.MainTitleX});
		console.log("Main Menu Scene -> Generating Singleplayer button at " + gamePos.MainSPBtnY + " " + gamePos.MainSPBtnX);
		$("#"+gameConfig.SceneMainMenuName).append("<button id='mainSPBtn' type='button'> "+gameConfig.SPBtn+" </button>");
		$("#mainSPBtn").css({
			"position":"absolute",
			"top":gamePos.MainSPBtnY,
			"left":gamePos.MainSPBtnX})
			.click(function(event) {
				event.preventDefault();
				console.log("Main Menu Scene -> Singleplayer button clicked!");
				RegisterCommand(gameConfig.SceneMainMenuName, EnumGameCommands.Singleplayer);
			});
				console.log("Main Menu Scene -> Generating Multiplayer button at " + gamePos.MainMPBtnY + " " + gamePos.MainMPBtnX);
		$("#"+gameConfig.SceneMainMenuName).append("<button id='mainMPBtn' type='button'> "+gameConfig.MPBtn+" </button>");
		$("#mainMPBtn").css({
			"position":"absolute",
			"top":gamePos.MainMPBtnY,
			"left":gamePos.MainMPBtnX})
			.click(function(event) {
				event.preventDefault();
				console.log("Main Menu Scene -> Multiplayer button clicked!");
				RegisterCommand(gameConfig.SceneMainMenuName, EnumGameCommands.Multiplayer);
			});
				console.log("Main Menu Scene -> Generating Exit button at " + gamePos.MainExitBtnY + " " + gamePos.MainExitBtnX);
		$("#"+gameConfig.SceneMainMenuName).append("<button id='mainExitBtn' type='button'> "+gameConfig.ExitBtn+" </button>");
		$("#mainExitBtn").css({
			"position":"absolute",
			"top":gamePos.MainExitBtnY,
			"left":gamePos.MainExitBtnX})
			.click(function(event) {
				event.preventDefault();
				console.log("Main Menu Scene -> Exit button clicked!");
				RegisterCommand(gameConfig.SceneMainMenuName, EnumGameCommands.Exit);
			});
		//Change state
		CurrentGameState = EnumGameState.MainMenuIdle;
	},
	
	Singleplayer: function () {
		console.log("Main Menu Scene -> Processing singleplayer command...");
		gameSceneMatch.GameMode = EnumGameMode.Singleplayer;	//Set game mode to SP
		console.log("Main Menu Scene -> Setting game mode to singleplayer.");
		CurrentGameState = EnumGameState.MainMenuTrans;		
		console.log("Main Menu Scene -> Setting game state to transition.");
	},
	
	Multiplayer: function () {
	},
	
	Exit: function () {
	},
	
	Trans: function() {
		console.log("Main Menu Scene -> Cleaning up...");
		//Destroy existing scene
		$("#"+gameConfig.SceneMainMenuName).remove();
		switch (gameSceneMatch.GameMode)
		{
			case EnumGameMode.Singleplayer:
				console.log("Main Menu Scene -> Transitioning to active Match.");
				CurrentGameState = EnumGameState.MatchInit;
				break;
			case EnumGameMode.Multiplayer:
				console.log("Main Menu Scene -> Transitioning to Matchmaking.");
				CurrentGameState = EnumGameState.MatchInit;
				break;
		}
	}
};

var gameSceneMatchmaking = {
	Init: function() {
		throw ("Not yet implemented!");
	},
	
	Trans: function() {
		throw ("Not yet implemented!");
	}
};

////////////////////
//Post Match Scene//
////////////////////
var gameScenePostMatch = {
	Init: function() {
		throw ("Not yet implemented!");
	},
	
	Trans: function() {
		throw ("Not yet implemented!");
	}
};
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

var gameSceneMatch = {
	GameMode: 0,
	
	Init: function() {
		console.log("Match Scene -> Initializing.");
		/*$("body").append("<div id='"+gameConfig.SceneMatchName+"'></div>");
		$("#"+gameConfig.SceneMatchName).append("<div id='background'></div>")
		$("#background").css({
				"position":"absolute",
				"top":"10px",
				"left":"10px",
				"width":gameConfig.StageWidth + "px",
				"height":gameConfig.StageHeight + "px",
				"background-image":"url("+gameSprites["MatchBackground"]+")"
			});*/
		
		//Initialize sprites
		var background1 = new $.gameQuery.Animation({imageURL: gameSprites["MatchBackground"]});
		var animOven = new $.gameQuery.Animation({imageURL: gameSprites["AppOven"]});
		var animStoveTop = new $.gameQuery.Animation({imageURL: gameSprites["AppStoveTop"]});
		var animBowlLarge = new $.gameQuery.Animation({imageURL: gameSprites["ContBowlLarge"]});
		var animCuttingBoard = new $.gameQuery.Animation({imageURL: gameSprites["ContCuttingBoard"]});
		var animPotLarge = new $.gameQuery.Animation({imageURL: gameSprites["ContPotLarge"]});
		var animHands = new $.gameQuery.Animation({imageURL: gameSprites["ToolHands"]});
		var animMasher = new $.gameQuery.Animation({imageURL: gameSprites["ToolMasher"]});
		var animPeeler = new $.gameQuery.Animation({imageURL: gameSprites["ToolPeeler"]});
		var animKnife = new $.gameQuery.Animation({imageURL: gameSprites["ToolKnife"]});
		var animEgg = new $.gameQuery.Animation({imageURL: gameSprites["IngEgg"]});
		var animPotato = new $.gameQuery.Animation({imageURL: gameSprites["IngPotato"]});
		var animCupOfFlour = new $.gameQuery.Animation({imageURL: gameSprites["IngCupOfFlour"]});
		var animWater = new $.gameQuery.Animation({imageURL: gameSprites["IngWater"]});
		var animSaltTbsp = new $.gameQuery.Animation({imageURL: gameSprites["IngSaltTbsp"]});
		var animSaltDash = new $.gameQuery.Animation({imageURL: gameSprites["IngSaltDash"]});		
		
		//Initialize groups, add sprites
		$.playground().addGroup("background", {width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.addSprite("background", {animation: background1, width: gameConfig.StageWidth, height: gameConfig.StageHeight}).end()
			.addGroup("appliances", {width: 384, height: 128, posx: 0, posy: 256})
				.addSprite("app1", {animation: animStoveTop, width: 128, height: 128})
				.addSprite("app2", {animation: animOven, width: 128, height: 128, posx: 128}).end()
			.addGroup("containers", {width: 384, height: 128, posx: 384, posy: 256})
				.addSprite("cont1", {animation: animBowlLarge, width: 64, height: 64})
				.addSprite("cont1", {animation: animCuttingBoard, width: 64, height: 64, posx: 64})
				.addSprite("cont1", {animation: animBowlLarge, width: 64, height: 64, posx: 128}).end()
			.addGroup("ingredients", {width: 768, height: 128, posx: gamePos.MatchDivIngsX, posy: gamePos.MatchDivIngsY})
				.addSprite("ing1",{animation: animHands, width: 64, height: 64, posx: 0, posy: 0})
				.addSprite("ing2",{animation: animMasher, width: 64, height: 64, posx: 64, posy: 0})
				.addSprite("ing3",{animation: animPeeler, width: 64, height: 64, posx: 64*2, posy: 0})
				.addSprite("ing4",{animation: animKnife, width: 64, height: 64, posx: 64*3, posy: 0})
				.addSprite("ing5",{animation: animEgg, width: 64, height: 64, posx: 64*4, posy: 0})
				.addSprite("ing6",{animation: animPotato, width: 64, height: 64, posx: 64*5, posy: 0})
				.addSprite("ing7",{animation: animPotato, width: 64, height: 64, posx: 64*6, posy: 0})
				.addSprite("ing8",{animation: animCupOfFlour, width: 64, height: 64, posx: 64*7, posy: 0})
				.addSprite("ing9",{animation: animCupOfFlour, width: 64, height: 64, posx: 64*8, posy: 0})
				.addSprite("ing10",{animation: animWater, width: 64, height: 64, posx: 64*9, posy: 0})
				.addSprite("ing11",{animation: animSaltTbsp, width: 64, height: 64, posx: 64*10, posy: 0})
				.addSprite("ing12",{animation: animSaltDash, width: 64, height: 64, posx: 64*11, posy: 0});
				
		//Functionality
		$("#app1").click(function () {
			
		});
		
		//Advance game state to intro
		CurrentGameState = EnumGameState.MatchIntro;
	},
	
	Active: function () {
		throw ("Not yet implemented!");
	},
	
	Trans: function() {
		throw ("Not yet implemented!");
	}
};

var gameScenePostMatch = {
	Init: function() {
		throw ("Not yet implemented!");
	},
	
	Trans: function() {
		throw ("Not yet implemented!");
	}
};
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
		
		//Console div
		$("#stage").append("<div id='consoleDiv'></div>");
		$("#consoleDiv").css({
			"position":"absolute",
			"width":"384px",
			"height":"192px",
			"top":"64px",
			"left":"0px",
			"background-color":"black"
		});
		
		//Command div
		$("#stage").append("<div id='commandDiv'></div>");
		$("#commandDiv").css({
			"position":"absolute",
			"width":"384px",
			"height":"192px",
			"top":"64px",
			"left":"384px",
			"background-color":"blue"
		});
		
		//Initialize groups, add sprites
		$.playground().addGroup("background", {width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.addSprite("background", {animation: gameAnimations.background1, width: gameConfig.StageWidth, height: gameConfig.StageHeight}).end()
			.addGroup("appliances", {width: 384, height: 128, posx: 0, posy: 256})
				.addSprite("app1", {animation: gameAnimations.animStoveTop, width: 128, height: 128})
				.addSprite("app2", {animation: gameAnimations.animOven, width: 128, height: 128, posx: 128}).end()
			.addGroup("containers", {width: 384, height: 128, posx: 384, posy: 256})
				.addSprite("cont1", {animation: gameAnimations.animBowlLarge, width: 64, height: 64})
				.addSprite("cont2", {animation: gameAnimations.animCuttingBoard, width: 64, height: 64, posx: 64})
				.addSprite("cont3", {animation: gameAnimations.animPotLarge, width: 64, height: 64, posx: 128}).end()
			.addGroup("ingredients", {width: 768, height: 128, posx: gamePos.MatchDivIngsX, posy: gamePos.MatchDivIngsY})
				.addSprite("ing1",{animation: gameAnimations.animHands, width: 64, height: 64, posx: 0, posy: 0})
				.addSprite("ing2",{animation: gameAnimations.animMasher, width: 64, height: 64, posx: 64, posy: 0})
				.addSprite("ing3",{animation: gameAnimations.animPeeler, width: 64, height: 64, posx: 64*2, posy: 0})
				.addSprite("ing4",{animation: gameAnimations.animKnife, width: 64, height: 64, posx: 64*3, posy: 0})
				.addSprite("ing5",{animation: gameAnimations.animEgg, width: 64, height: 64, posx: 64*4, posy: 0})
				.addSprite("ing6",{animation: gameAnimations.animPotato, width: 64, height: 64, posx: 64*5, posy: 0})
				.addSprite("ing7",{animation: gameAnimations.animPotato, width: 64, height: 64, posx: 64*6, posy: 0})
				.addSprite("ing8",{animation: gameAnimations.animCupOfFlour, width: 64, height: 64, posx: 64*7, posy: 0})
				.addSprite("ing9",{animation: gameAnimations.animCupOfFlour, width: 64, height: 64, posx: 64*8, posy: 0})
				.addSprite("ing10",{animation: gameAnimations.animWater, width: 64, height: 64, posx: 64*9, posy: 0})
				.addSprite("ing11",{animation: gameAnimations.animSaltTbsp, width: 64, height: 64, posx: 64*10, posy: 0})
				.addSprite("ing12",{animation: gameAnimations.animSaltDash, width: 64, height: 64, posx: 64*11, posy: 0}).end()
			.addGroup("selections", {width: 768, height: 256, posx: 0, posy: 256})
				.addSprite("app1sel", {width: 64, height: 64, posx: 32, posy: 32})
				.addSprite("app2sel", {width: 64, height: 64, posx: 160, posy: 32})
				.addSprite("cont1sel", {width: 64, height: 64, posx: 384})
				.addSprite("cont2sel", {width: 64, height: 64, posx: 448})
				.addSprite("cont3sel", {width: 64, height: 64, posx: 512})
				.addSprite("ing1sel",{width: 64, height: 64, posx: 0, posy: 128})
				.addSprite("ing2sel",{width: 64, height: 64, posx: 64, posy: 128})
				.addSprite("ing3sel",{width: 64, height: 64, posx: 64*2, posy: 128})
				.addSprite("ing4sel",{width: 64, height: 64, posx: 64*3, posy: 128})
				.addSprite("ing5sel",{width: 64, height: 64, posx: 64*4, posy: 128})
				.addSprite("ing6sel",{width: 64, height: 64, posx: 64*5, posy: 128})
				.addSprite("ing7sel",{width: 64, height: 64, posx: 64*6, posy: 128})
				.addSprite("ing8sel",{width: 64, height: 64, posx: 64*7, posy: 128})
				.addSprite("ing9sel",{width: 64, height: 64, posx: 64*8, posy: 128})
				.addSprite("ing10sel",{width: 64, height: 64, posx: 64*9, posy: 128})
				.addSprite("ing11sel",{width: 64, height: 64, posx: 64*10, posy: 128})
				.addSprite("ing12sel",{width: 64, height: 64, posx: 64*11, posy: 128});
				
		//Functionality
		$("#app1sel").click(function () {
			console.log("Match Scene -> App1 clicked.");
			ToggleSelect("app1");
		});
		$("#app2sel").click(function () {
			console.log("Match Scene -> App2 clicked.");
			ToggleSelect("app2");
		});
		$("#cont1sel").click(function () {
			console.log("Match Scene -> Cont1 clicked.");
			ToggleSelect("cont1");
		});
		$("#cont2sel").click(function () {
			console.log("Match Scene -> Cont2 clicked.");
			ToggleSelect("cont2");
		});
		$("#cont3sel").click(function () {
			console.log("Match Scene -> Cont3 clicked.");
			ToggleSelect("cont3");
		});
		$("#ing1sel").click(function () {
			console.log("Match Scene -> Ing1 clicked.");
			ToggleSelect("ing1");
		});
		$("#ing2sel").click(function () {
			console.log("Match Scene -> Ing2 clicked.");
			ToggleSelect("ing2");
		});
		$("#ing3sel").click(function () {
			console.log("Match Scene -> Ing3 clicked.");
			ToggleSelect("ing3");
		});
		$("#ing4sel").click(function () {
			console.log("Match Scene -> Ing4 clicked.");
			ToggleSelect("ing4");
		});
		$("#ing5sel").click(function () {
			console.log("Match Scene -> Ing5 clicked.");
			ToggleSelect("ing5");
		});
		$("#ing6sel").click(function () {
			console.log("Match Scene -> Ing6 clicked.");
			ToggleSelect("ing6");
		});
		$("#ing7sel").click(function () {
			console.log("Match Scene -> Ing7 clicked.");
			ToggleSelect("ing7");
		});
		$("#ing8sel").click(function () {
			console.log("Match Scene -> Ing8 clicked.");
			ToggleSelect("ing8");
		});
		$("#ing9sel").click(function () {
			console.log("Match Scene -> Ing9 clicked.");
			ToggleSelect("ing9");
		});
		$("#ing10sel").click(function () {
			console.log("Match Scene -> Ing10 clicked.");
			ToggleSelect("ing10");
		});
		$("#ing11sel").click(function () {
			console.log("Match Scene -> Ing11 clicked.");
			ToggleSelect("ing11");
		});
		$("#ing12sel").click(function () {
			console.log("Match Scene -> Ing12 clicked.");
			ToggleSelect("ing12");
		});
		
		//Advance game state to intro
		console.log("Match Scene -> Transitioning out of init to intro.");
		CurrentGameState = EnumGameState.MatchIntro;
	},
	
	Intro: function () {
		console.log("Match Scene -> Transitioning out of intro to active.");
		CurrentGameState = EnumGameState.MatchActive;
	},
	
	Active: function () {
		//console.log("Match Scene -> Entering active state.");
	},
	
	Trans: function() {
		throw ("Not yet implemented!");
	}
};

////////////
//Selector//
////////////
var TileSelected = {
	"app1":false,
	"app2":false,
	"cont1":false,
	"cont2":false,
	"cont3":false,
	"ing1":false,
	"ing2":false,
	"ing3":false,
	"ing4":false,
	"ing5":false,
	"ing6":false,
	"ing7":false,
	"ing8":false,
	"ing9":false,
	"ing10":false,
	"ing11":false,
	"ing12":false
};

function ToggleSelect(tileName)
{
	if (TileSelected[tileName] === true)
	{
		console.log("Selector -> Deselecting tile " + tileName);
		//Clear if true
		$("#" + tileName + "sel").setAnimation();
		TileSelected[tileName] = false;
		UpdateCommands();

	} else {
		console.log("Selector -> Selecting tile " + tileName);
		//Select if false
		$("#" + tileName + "sel").setAnimation(gameAnimations.overSelectionP1);
		TileSelected[tileName] = true;
		UpdateCommands();
	}
};

function UpdateCommands()
{
	$("#commandDiv").empty();
	if (TileSelected["app1"]===true)
	{
		$("#commandDiv").append("<button id='btnExamine'>Examine</button>");
		$("#commandDiv").append("<button id='btnTurnOn'>Turn On</button>");
	}
	if (TileSelected["app2"]===true)
	{
		$("#commandDiv").append("<button id='btnExamine'>Examine</button>");
		$("#commandDiv").append("<button id='btnPreHeat350'>Pre-heat to 350F</button>");
		$("#commandDiv").append("<button id='btnPreHeat375'>Pre-heat to 375F</button>");
		$("#commandDiv").append("<button id='btnPreHeat400'>Pre-heat to 400F</button>");
		$("#commandDiv").append("<button id='btnPreHeat425'>Pre-heat to 425F</button>");
		$("#commandDiv").append("<button id='btnPreHeat450'>Pre-heat to 450F</button>");
		$("#commandDiv").append("<button id='btnPreHeat500'>Pre-heat to 500F</button>");
	}
}


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
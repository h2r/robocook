var gameConfig = {
	//Title config
	Title: "Robocook",
	TitleColor: "red",
	TitleFont: "Arial", //Not used yet
	TitleSize: 60,
	StartButton: "Start!",
	//Main Menu configs
	SPBtn: "Singleplayer",
	MPBtn: "Multiplayer",
	ExitBtn: "Exit",
	//Match configs
	//Stage config
	StageHeight: 512,
	StageWidth: 768,
	StageBgColor: "black",
	//Metagame control
	GameLoopInterval: 100,
	//General game positions
	StageX: 0,
	StageY: 0,
	//Scenes
	SceneSplashName : "splashScene",
	SceneMainMenuName : "mainMenuScene",
	SceneMatchName: "matchScene"
};

var gamePos = new Object();
gamePos.StageX = gameConfig.StageX + "px";
gamePos.StageY = gameConfig.StageY + "px";
gamePos.StageCenterX = (gameConfig.StageX + (gameConfig.StageWidth/2)) + "px";
gamePos.StageCenterY = (gameConfig.StageY + (gameConfig.StageHeight/2)) + "px";
gamePos.TitleX = "250px";
gamePos.TitleY = "150px";
gamePos.StartX = "350px";
gamePos.StartY = "270px";
gamePos.MainTitleX = "250px";
gamePos.MainTitleY = "50px";
gamePos.MainSPBtnX = "327px";
gamePos.MainSPBtnY = "175px";
gamePos.MainMPBtnX = "330px";
gamePos.MainMPBtnY = "225px";
gamePos.MainExitBtnX = "350px";
gamePos.MainExitBtnY = "275px";
gamePos.MatchDivConsX = 0;
gamePos.MatchDivConsY = 64;
gamePos.MatchDivCmdsX = 384;
gamePos.MatchDivCmdsY = 64;
gamePos.MatchDivAppsX = 0;
gamePos.MatchDivAppsY = 256;
gamePos.MatchDivContsX = 384;
gamePos.MatchDivContsY = 256;
gamePos.MatchDivIngsX = 0;
gamePos.MatchDivIngsY = 384;

var gameSprites = {};
gameSprites["MatchBackground"] = "./Sprites/MatchBackground_PH.JPG";
gameSprites["IngEgg"] = "./Sprites/IngEgg.PNG";
gameSprites["IngPotato"] = "./Sprites/IngPotato.PNG";
gameSprites["IngCupOfFlour"] = "./Sprites/IngCupOfFlour.PNG";
gameSprites["IngWater"] = "./Sprites/IngWater.PNG";
gameSprites["IngSaltTbsp"] = "./Sprites/IngSaltTbsp.PNG";
gameSprites["IngSaltDash"] = "./Sprites/IngSaltDash.PNG";
gameSprites["AppOven"] = "./Sprites/AppOven128.PNG";
gameSprites["AppStoveTop"] = "./Sprites/AppStoveTop128.PNG";
gameSprites["ContBowlLarge"] = "./Sprites/ContBowlLarge.PNG";
gameSprites["ContPotLarge"] = "./Sprites/ContPotLarge.PNG";
gameSprites["ContCuttingBoard"] = "./Sprites/ContCuttingBoard.PNG";
gameSprites["ToolMasher"] = "./Sprites/ToolMasher.PNG";
gameSprites["ToolPeeler"] = "./Sprites/ToolPeeler.PNG";
gameSprites["ToolKnife"] = "./Sprites/ToolKnife.PNG";
gameSprites["ToolHands"] = "./Sprites/ToolHands.PNG";

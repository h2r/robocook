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

//All objects loaded by the game by default
var gameObjects = {};
gameObjects["Empty"] = new gameObject("Empty", "Nothing", EnumGOType.Empty, "");
gameObjects["AppOven"] = new gameObject("AppOven", "Oven", EnumGOType.App, "AppOven.PNG");
gameObjects["AppStoveTop"] = new gameObject("AppStoveTop", "Stove Top", EnumGOType.App, "AppStoveTop.PNG");
gameObjects["AppCounterTop"] = new gameObject("AppCounterTop", "Kitchen Counter", EnumGOType.App, "AppCounterTop.PNG");
gameObjects["ContBowlLarge"] = new gameObject("ContBowlLarge", "Large Bowl", EnumGOType.Cont, "ContBowlLarge.PNG");
gameObjects["ContPotLarge"] = new gameObject("ContPotLarge", "Large Pot", EnumGOType.Cont, "ContPotLarge.PNG");
gameObjects["ContCuttingBoard"] = new gameObject("ContCuttingBoard", "Cutting Board", EnumGOType.Cont, "ContCuttingBoard.PNG");
gameObjects["ToolMasher"] = new gameObject("ToolMasher", "Masher", EnumGOType.Tool, "ToolMasher.PNG");
gameObjects["ToolPeeler"] = new gameObject("ToolPeeler", "Peeler", EnumGOType.Tool, "ToolPeeler.PNG");
gameObjects["ToolKnife"] = new gameObject("ToolKnife", "Knife", EnumGOType.Tool, "ToolKnife.PNG");
gameObjects["ToolHands"] = new gameObject("ToolHands", "Hands", EnumGOType.Tool, "ToolHands.PNG");


var gameSprites = {};
gameSprites["MatchBackground"] = "./Sprites/MatchBackground_PH.JPG";
gameSprites["OverlaySelectionP1"] = "./Sprites/OverlaySelectionP1.PNG";

var gameAnimations = {
	background1: new $.gameQuery.Animation({imageURL: gameSprites["MatchBackground"]}),
	overSelectionP1: new $.gameQuery.Animation({imageURL: gameSprites["OverlaySelectionP1"]})
};

var recipeGnocchi = [
	"IngEgg", "Egg", 
	"IngPotato", "Potato", 
	"IngPotato", "Potato", 
	"IngCupOfFlour", "Cup of Flour", 
	"IngCupOfFlour", "Cup of Flour", 
	"IngWater", "Water", 
	"IngWater", "Water", 
	"IngSaltTbsp", "Tablespoon of Salt",
	"IngSaltDash", "Dash of Salt"
];
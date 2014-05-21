var gameConfig = {
	//Title config
	Title: "",
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
gamePos.TitleX = "150px";
gamePos.TitleY = "120px";
gamePos.StartX = "326px";
gamePos.StartY = "280px";
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
gameObjects["IngEmpty"] = new gameIngredient("IngEmpty", "Empty Dish", "OverlaySelectionP1.PNG");
gameObjects["AppOven"] = new gameAppliance("AppOven", "Oven", "AppOven.PNG");
gameObjects["AppOvenOn"] = new gameAppliance("AppOvenOn", "Heated Oven", "AppOvenOn.PNG");
gameObjects["AppStoveTop"] = new gameAppliance("AppStoveTop", "Stove Top", "AppStoveTop.PNG");
gameObjects["AppStoveTopOn"] = new gameAppliance("AppStoveTopOn", "Stove Top with Burner On", "AppStoveTopOn.PNG");
gameObjects["AppCounterTop"] = new gameAppliance("AppCounterTop", "Kitchen Counter", "AppCounterTop.PNG");
gameObjects["AppMicrowave"] = new gameAppliance("AppMicrowave", "Microwave Oven", "AppMicrowave.PNG");
gameObjects["ContBowlLarge"] = new gameContainer("ContBowlLarge", "Large Bowl", "ContBowlLarge.PNG");
gameObjects["ContPotLarge"] = new gameContainer("ContPotLarge", "Large Pot", "ContPotLarge.PNG");
gameObjects["ContSaucepanLarge"] = new gameContainer("ContSaucepanLarge", "Large Saucepan", "ContSaucepanLarge.PNG");
gameObjects["ContCuttingBoard"] = new gameContainer("ContCuttingBoard", "Cutting Board", "ContCuttingBoard.PNG");
gameObjects["ContCuttingBoardFloured"] = new gameContainer("ContCuttingBoardFloured", "Floured Cutting Board", "ContCuttingBoard.PNG");
gameObjects["ContBakingDish"] = new gameContainer("ContBakingDish", "Baking Dish", "ContBakingDish.PNG");
gameObjects["ContBakingDishGreased"] = new gameContainer("ContBakingDishGreased", "Greased Baking Dish", "ContBakingDish.PNG");
gameObjects["ContBakingDishFloured"] = new gameContainer("ContBakingDishFloured", "Floured Baking Dish", "ContBakingDish.PNG");
gameObjects["ContBakingDishGreasedFloured"] = new gameContainer("ContBakingDishGreasedFloured", "Greased and Floured Baking Dish", "ContBakingDish.PNG");
//gameObjects["ToolMasher"] = new gameObject("ToolMasher", "Masher", EnumGOType.Tool, "ToolMasher.PNG");
//gameObjects["ToolPeeler"] = new gameObject("ToolPeeler", "Peeler", EnumGOType.Tool, "ToolPeeler.PNG");
//gameObjects["ToolKnife"] = new gameObject("ToolKnife", "Knife", EnumGOType.Tool, "ToolKnife.PNG");
//gameObjects["ToolHands"] = new gameObject("ToolHands", "Hands", EnumGOType.Tool, "ToolHands.PNG");
//gameObjects["IngDish"] = new gameObject("IngDish", "Dish", "OverlaySelectionP1.PNG");


var gameSprites = {};
gameSprites["MatchBackground"] = "./Sprites/MatchBackground_PH.JPG";
gameSprites["OverlaySelectionP1"] = "./Sprites/OverlaySelectionP1.PNG";
gameSprites["VictoryScreen"] = "./Sprites/Win.PNG";
gameSprites["ActUse"] = "./Sprites/ActUse.PNG";
gameSprites["ActMix"] = "./Sprites/ActMix.PNG";
gameSprites["ActSpread"] = "./Sprites/ActSpread.PNG";
gameSprites["ActTurnOnOff"] = "./Sprites/ActTurnOnOff.PNG";
gameSprites["ActLook"] = "./Sprites/ActLook.PNG";
gameSprites["ActCut"] = "./Sprites/ActCut.PNG";
gameSprites["ActShape"] = "./Sprites/ActShape.PNG";
gameSprites["ActPeel"] = "./Sprites/ActPeel.PNG";

var gameAnimations = {
	background1: new $.gameQuery.Animation({imageURL: gameSprites["MatchBackground"]}),
	overSelectionP1: new $.gameQuery.Animation({imageURL: gameSprites["OverlaySelectionP1"]}),
	victoryScreen: new $.gameQuery.Animation({imageURL: gameSprites["VictoryScreen"]}),
	actUse: new $.gameQuery.Animation({imageURL: gameSprites["ActUse"]}),
	actMix: new $.gameQuery.Animation({imageURL: gameSprites["ActMix"]}),
	actSpread: new $.gameQuery.Animation({imageURL: gameSprites["ActSpread"]}),
	actTurnOnOff: new $.gameQuery.Animation({imageURL: gameSprites["ActTurnOnOff"]}),
	actLook: new $.gameQuery.Animation({imageURL: gameSprites["ActLook"]}),
	actCut: new $.gameQuery.Animation({imageURL: gameSprites["ActCut"]}),
	actShape: new $.gameQuery.Animation({imageURL: gameSprites["ActShape"]}),
	actPeel: new $.gameQuery.Animation({imageURL: gameSprites["ActPeel"]})
};
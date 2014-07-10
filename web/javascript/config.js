"use strict";

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
    SceneMatchName: "matchScene",
	//Paths
	SpritePath: "./../Sprites/"
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
//gameObjects["Empty"] = new gameObject("Empty", "Nothing", EnumGOType.Empty, "");


var gameSprites = {};
gameSprites["MatchBackground"] = gameConfig.SpritePath + "MatchBackground_PH.JPG";
gameSprites["OverlaySelectionP1"] = gameConfig.SpritePath + "OverlaySelectionP1.PNG";
gameSprites["VictoryScreen"] = gameConfig.SpritePath + "Win.PNG";
gameSprites["ActUse"] = gameConfig.SpritePath + "ActUse.PNG";
gameSprites["ActMix"] = gameConfig.SpritePath + "ActMix.PNG";
gameSprites["ActSpread"] = gameConfig.SpritePath + "ActSpread.PNG";
gameSprites["ActTurnOnOff"] = gameConfig.SpritePath + "ActTurnOnOff.PNG";
gameSprites["ActLook"] = gameConfig.SpritePath + "ActLook.PNG";
gameSprites["ActCut"] = gameConfig.SpritePath + "ActCut.PNG";
gameSprites["ActShape"] = gameConfig.SpritePath + "ActShape.PNG";
gameSprites["ActPeel"] = gameConfig.SpritePath + "ActPeel.PNG";

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
var gameConfig = {
	//Title config
	Title: "Robocook",
	TitleColor: "red",
	TitleFont: "Arial", //Not used yet
	TitleSize: 60,
	StartButton: "Start!",
	//Stage config
	StageHeight: 512,
	StageWidth: 768,
	StageBgColor: "black",
	//Metagame control
	GameLoopInterval: 60,
	//General game positions
	StageX: 0,
	StageY: 0
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
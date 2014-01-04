/*
*	GameController.js
*	Robocook main logic controller
*   by: Lee Painton
*	Development version
*
*/

var EnumGameState = {
	Init: 0,		//Game initializing, precache
	Splash: 1,		//Splash intro
	MainMenu: 2,	//Main menu active
	Matchmaking: 3,	//Matchmaking step, connection to server
	MatchStart: 4,	//Main play started > intro state
	MatchActive: 5,	//Main play started > active play state
	MatchEnd: 6,	//Main play finished > success or failure
	PostMatch: 7	//Post main play conditions, restart?
}

var CurrentGameState = EnumGameState.Init;

function fnMain(jQuery){
	//Configure game
	$("title").html(gameConfig.Title);
	
	//Stage config
	$("#stage").height(gameConfig.StageHeight).width(gameConfig.StageWidth)
		.css("background-color",""+gameConfig.StageBgColor);
		
	//Setup main loop
	SetInterval(gameLoop, gameConfig.GameLoopInterval); 
}

function fnGameLoop() {
	switch(CurrentGameState)
	{
		case EnumGameState.Init:
			fnSceneSplash
			break;
	}
}

//Function for the splash scene
function fnSceneSplash() {
}

//Function for the main menu scene
function fnSceneMainMenu() {
}
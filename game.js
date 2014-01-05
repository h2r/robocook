/*
*	GameController.js
*	Robocook main logic controller
*   by: Lee Painton
*	Development version
*
*/

var EnumGameState = {
	GameInit: 0,		//Game initializing, precache
	SplashInit: 10,		//Splash intro
	SplashIdle: 11,
	SplashTrans: 12,	//Splash transition out
	MainMenuInit: 20,	//Main menu active
	MainMenuIdle: 21,
	MainMenuTrans: 22,
	MatchmakingInit: 30,	//Matchmaking step, connection to server
	MatchInit: 40,	//Main play started > init state
	MatchIntro: 50,	//Main intro display
	MatchActive: 60,	//Main active play state
	MatchEnd: 70,	//Main play finished success or failure
	MatchTrans: 71,	//Match transition out
	PostMatch: 80	//Post main play conditions, restart?
};

var CurrentGameState = EnumGameState.GameInit;

function fnMain(jQuery){
	//Configure game
	$("title").html(gameConfig.Title);
	
	//Stage config
	$("#stage").height(gameConfig.StageHeight).width(gameConfig.StageWidth)
		.css("background-color",""+gameConfig.StageBgColor).
		playground({height: gameConfig.StageHeight, width: gameConfig.StageWidth, refreshRate: gameConfig.GameLoopInterval});
		
	//Setup main loop
	$.playground().registerCallback(fnGameLoop, gameConfig.GameLoopInterval); 
	
	//Start game
	$.playground().startGame();
}

function fnGameLoop() {
	if (CurrentGameState === EnumGameState.GameInit) {
		console.log("Main loop initialized.")
	}
	
	switch(CurrentGameState)
	{
		case EnumGameState.GameInit:
			console.log("Entering switch on GameInit state.");
			CurrentGameState = EnumGameState.SplashInit;
			fnSceneSplash();
			break;
			
		case EnumGameState.SplashIdle:
			fnSceneSplash();
			break;
	}
}

//Function for the splash scene
function fnSceneSplash() {
	switch(CurrentGameState)
	{
		case EnumGameState.SplashInit:
			gameSceneSplash.Init();
			break;
			
		case EnumGameState.SplashIdle:
			while(gameCommandQueue.IsEmpty() === false) {
				console.log("Splash Scene -> Fetching command!");
				var command = FetchNextCommand();
				console.log("Splash Scene -> Processing command "+command.Command+" for target "+command.Target);
				if (command.Target === gameConfig.SceneSplashName) {
					if (command.Command === EnumGameCommands.Start) {
						gameSceneSplash.Start();
					}
				}
			}

			break;
	}
}

//Function for the welcome

//Function for the main menu scene
function fnSceneMainMenu() {
}
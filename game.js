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
	MatchmakingIdle: 31,
	MatchmakingTrans: 32,
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
		.css({
			"background-color":""+gameConfig.StageBgColor,
			"position":"absolute",
			"top":"10px",
			"left":"10px"
		}).playground({height: gameConfig.StageHeight, width: gameConfig.StageWidth, refreshRate: gameConfig.GameLoopInterval});
		
	//Setup main loop
	$.playground().registerCallback(fnGameLoop, gameConfig.GameLoopInterval); 
	
	//Start game
	$.playground().startGame();
}

function fnGameLoop() {
	//Debugging code
	if (CurrentGameState === EnumGameState.GameInit) {
		console.log("Main loop initialized.")
	}
	
	//This is the entry point for decision making in the game loop.
	//All possible game states should be reflected here.
	switch(CurrentGameState)
	{
		case EnumGameState.GameInit:
			console.log("Entering switch on GameInit state.");
			CurrentGameState = EnumGameState.SplashInit;
			fnSceneSplash();
			break;
		//Splash states	
		case EnumGameState.SplashIdle:
			fnSceneSplash();
			break;
		case EnumGameState.SplashTrans:
			fnSceneSplash();
			break;
		//Main menu states
		case EnumGameState.MainMenuInit:
			fnSceneMainMenu();
			break;
		case EnumGameState.MainMenuIdle:
			fnSceneMainMenu();
			break;
		case EnumGameState.MainMenuTrans:
			fnSceneMainMenu();
			break;
		//Matchmaking states
		case EnumGameState.MatchmakingInit:
			fnSceneMainMenu();
			break;
		case EnumGameState.MatchmakingIdle:
			fnSceneMainMenu();
			break;
		case EnumGameState.MatchmakingTrans:
			fnSceneMainMenu();
			break;
		//Match states
		case EnumGameState.MatchInit:
			fnSceneMatch();
			break;
		case EnumGameState.MatchIntro:
			fnSceneMatch();
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
			
		case EnumGameState.SplashTrans:
			gameSceneSplash.Trans();
			break;
	}
}

//Function for the main menu scene
function fnSceneMainMenu() {
	switch(CurrentGameState)
	{
		case EnumGameState.MainMenuInit:
			gameSceneMainMenu.Init();
			break;
			
		case EnumGameState.MainMenuIdle:
			while(gameCommandQueue.IsEmpty() === false) {
				console.log("Main Menu Scene -> Fetching command!");
				var command = FetchNextCommand();
				console.log("Main Menu Scene -> Processing command "+command.Command+" for target "+command.Target);
				if (command.Target === gameConfig.SceneMainMenuName) {
					if (command.Command === EnumGameCommands.Singleplayer) {
						gameSceneMainMenu.Singleplayer();
					}
					if (command.Command === EnumGameCommands.Multiplayer) {
						gameSceneMainMenu.Multiplayer();
					}
					if (command.Command === EnumGameCommands.Exit) {
						gameSceneMainMenu.Exit();
					}
				}
			}
			break;
			
		case EnumGameState.MainMenuTrans:
			gameSceneMainMenu.Trans();
			break;
	}
}

/*
function fnSceneMatchmaking() {
	switch(CurrentGameState)
	{
		case EnumGameState.MainMenuInit:
			gameSceneMainMenu.Init();
			break;
			
		case EnumGameState.MainMenuIdle:
			while(gameCommandQueue.IsEmpty() === false) {
				console.log("Main Menu Scene -> Fetching command!");
				var command = FetchNextCommand();
				console.log("Main Menu Scene -> Processing command "+command.Command+" for target "+command.Target);
				if (command.Target === gameConfig.SceneSplashName) {
					//Process commands here
				}
			}
			break;
			
		case EnumGameState.MainMenuTrans:
			gameSceneSplash.Trans();
			break;
	}
}*/


function fnSceneMatch() {
	switch(CurrentGameState)
	{
		case EnumGameState.MatchInit:
			gameSceneMatch.Init();
			break;
			
		case EnumGameState.MatchIntro:
			//Command monitoring code
			while(gameCommandQueue.IsEmpty() === false) {
				console.log("Main Menu Scene -> Fetching command!");
				var command = FetchNextCommand();
				console.log("Main Menu Scene -> Processing command "+command.Command+" for target "+command.Target);
				if (command.Target === gameConfig.SceneMatchName) {
					//Process commands here
				}
			}
			break;
			
		case EnumGameState.MatchActive:
			break;
			
		case EnumGameState.MatchEnd:
			break;
			
		case EnumGameState.MatchTrans:
			break;
	}
}

/*
function fnScenePostMatch() {
	switch(CurrentGameState)
	{
		case EnumGameState.MainMenuInit:
			gameSceneMainMenu.Init();
			break;
			
		case EnumGameState.MainMenuIdle:
			while(gameCommandQueue.IsEmpty() === false) {
				console.log("Main Menu Scene -> Fetching command!");
				var command = FetchNextCommand();
				console.log("Main Menu Scene -> Processing command "+command.Command+" for target "+command.Target);
				if (command.Target === gameConfig.SceneSplashName) {
					//Process commands here
				}
			}
			break;
			
		case EnumGameState.MainMenuTrans:
			gameSceneSplash.Trans();
			break;
	}
}*/
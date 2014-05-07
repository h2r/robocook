/*
*	GameController.js
*	Robocook main logic controller
*   by: Lee Painton
*	Development version
*
*/

//Cookies
//Meatloaf
//Brownies
//Gnocchi

/*TODO
* Implement console
* Add big friendly reset button
* Implement tutorial
*/

//Enum game state below tells the game what its current state is
//To change state set CurrentGameState to the appropriate state
//Note that game scenes may need to be reset() as well
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

//Connect to server here
//gameConnect.wsurl="ws://127.0.0.1:8080";
gameConnect.Init();

//Set initial game state
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
	$.playground().registerCallback(serverSimulator.Main, gameConfig.GameLoopInterval); 
	//$.playground().registerCallback(mouseTracker.Update, 10);
	
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
		case EnumGameState.MatchActive:
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
}
*/

function fnSceneMatch() {
	switch(CurrentGameState)
	{
		case EnumGameState.MatchInit:
			gameSceneMatch.Init();
			break;
			
		case EnumGameState.MatchIntro:
			gameSceneMatch.Intro();
			//Command monitoring code
			while(gameCommandQueue.IsEmpty() === false) {
				console.log("Match Scene -> Fetching command!");
				var command = FetchNextCommand();
				console.log("Match Scene -> Processing command "+command.Command+" for target "+command.Target);
				if (command.Target === gameConfig.SceneMatchName) {
					//Process commands
				}
			}
			break;
			
		case EnumGameState.MatchActive:
			if (gameCommandQueue.IsEmpty()) { gameSceneMatch.Active(); }
			else {
				while(!gameCommandQueue.IsEmpty()) {
					console.log("Match Scene -> Fetching command!");
					var command = FetchNextCommand();
					console.log("Match Scene -> Processing command "+command.Command+" for target "+command.Target);
					if (command.Target === gameConfig.SceneMatchName) {
						if (command.Command === EnumGameCommands.MatchReset) {
							CurrentGameState = EnumGameState.MatchInit;
						}
					} else if (EnumActions.IsAction(command.Command)) {
							console.log("Command is action!");
							actionHandler.HandleAction(command.Target, command.Predicate, command.Command)
					}
				}
			}
			break;
			
		case EnumGameState.MatchEnd:
			break;
			
		case EnumGameState.MatchTrans:
			break;
	}
}

function GetKeyByValue(value, array) {
    for( var prop in array ) {
        if( array.hasOwnProperty(prop) ) {
             if( array[ prop ] === value )
                 return prop;
        }
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
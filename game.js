/*
*   GameController.js
*   Robocook main logic controller
*   by: Lee Painton
*   Development version
*
*/


//Cookies
//Meatloaf
//Brownies
//Gnocchi

//Enum game state below tells the game what its current state is
//To change state set CurrentGameState to the appropriate state
//Note that game scenes may need to be reset() as well
var EnumGameState = {
    GameInit: 0,        //Game initializing, precache
    SplashInit: 10,     //Splash intro
    SplashIdle: 11,
    SplashTrans: 12,    //Splash transition out
    MainMenuInit: 20,   //Main menu active
    MainMenuIdle: 21,
    MainMenuTrans: 22,
    MatchmakingInit: 30,    //Matchmaking step, connection to server
    MatchmakingIdle: 31,
    MatchmakingTrans: 32,
    MatchInit: 40,  //Main play started > init state
    MatchIntro: 50, //Main intro display
    MatchActive: 60,    //Main active play state
    MatchEnd: 70,   //Main play finished success or failure
    MatchTrans: 71, //Match transition out
    PostMatch: 80   //Post main play conditions, restart?
};

//Set initial game state
var PlayerName = "";

var CurrentGameState = EnumGameState.GameInit;

function fnMain(jQuery) {
    "use strict";
    var game = new Game();
    game.go();    
}

var Game = function() {
    "use strict";
    //var CurrentGameState = EnumGameState.GameInit;

    var actionHandler = new GeneralHandler(),
        gameSceneSplash = new GameSceneSplash(actionHandler),
        gameSceneMainMenu = new GameSceneMainMenu(actionHandler),
        inventoryGrid = new InventoryGrid(),
        gameSceneMatch,
        playground;
        


    this.go = function() {
        $("#stage").height(gameConfig.StageHeight).width(gameConfig.StageWidth).css({
            "background-color" : gameConfig.StageBgColor,
            "background-image" : "url('./Sprites/MatchBackground_PH.JPG')",
            "position" : "absolute",
            "top" : "10px",
            "left" : "10px"
        }).playground({height: gameConfig.StageHeight, width: gameConfig.StageWidth, refreshRate: gameConfig.GameLoopInterval});

        //Setup main loop
        $.playground().registerCallback(this.loop, gameConfig.GameLoopInterval); 
        $.playground().registerCallback(serverSimulator.Main, gameConfig.GameLoopInterval); 
        //$.playground().registerCallback(mouseTracker.Update, 10);
        
        //Start game
        $.playground().startGame();
        playground = $.playground();
    };

    this.loop = function() {

        //Debugging code
        if (CurrentGameState === EnumGameState.GameInit) {
            console.log("Main loop initialized.");
        }
        
        //This is the entry point for  decision making in the game loop.
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
            default:
                break;
        }
    };

    var fnSceneSplash = function() {

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
            default:
                break;
        }
    }

    //Function for the main menu scene
    var fnSceneMainMenu = function() {
 
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
            default:
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

    var fnSceneMatch = function() {

        var command;
        
        switch(CurrentGameState)
        {
            case EnumGameState.MatchInit:
                gameSceneMatch = new GameSceneMatch(playground, actionHandler, inventoryGrid)
                gameSceneMatch.Init();
                CurrentGameState = EnumGameState.MatchIntro;
                break;
                
            case EnumGameState.MatchIntro:
                gameSceneMatch.Intro();
                //Command monitoring code
                while(gameCommandQueue.IsEmpty() === false) {
                    console.log("Match Scene -> Fetching command!");
                    command = FetchNextCommand();
                    console.log("Match Scene -> Processing command "+command.Command+" for target "+command.Target);
                    //if (command.Target === gameConfig.SceneMatchName) {
                        //Process commands
                    //}
                }
                break;
                
            case EnumGameState.MatchActive:
                if (gameCommandQueue.IsEmpty()) { gameSceneMatch.Active(); }
                else {
                    while(!gameCommandQueue.IsEmpty()) {
                        console.log("Match Scene -> Fetching command!");
                        command = FetchNextCommand();
                        console.log("Match Scene -> Processing command "+command.Command+" for target "+command.Target);
                        if (command.Target === gameConfig.SceneMatchName) {
                            if (command.Command === EnumGameCommands.MatchReset) {
                                CurrentGameState = EnumGameState.MatchInit;
                            }
                        } else if (EnumActions.IsAction(command.Command)) {
                                console.log("Command is action!");
                                actionHandler.HandleAction(command.Target, command.Predicate, command.Command);
                        }
                    }
                }
                break;
                
            case EnumGameState.MatchEnd:
                break;
                
            case EnumGameState.MatchTrans:
                break;
            default:
                break;
        }
    }
};
/*
function fnGameLoop() {
    "use strict";

    //Debugging code
    if (CurrentGameState === EnumGameState.GameInit) {
        console.log("Main loop initialized.");
    }
    
    //This is the entry point for  decision making in the game loop.
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
        default:
            break;
    }
}

//Function for the splash scene
function fnSceneSplash() {
    "use strict";

    var actionHandler = new GeneralHandler();
    var gameSceneSplash = new GameSceneSplash(actionHandler);
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
        default:
            break;
    }
}

//Function for the main menu scene
function fnSceneMainMenu() {
    "use strict";

    var actionHandler = new GeneralHandler();
    var gameSceneMainMenu = new GameSceneMainMenu(actionHandler);
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
        default:
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

/*
function fnSceneMatch() {
    "use strict";

    var command;
    var actionHandler = new GeneralHandler();
    var inventoryGrid = new InventoryGrid();
    var gameSceneMatch = new GameSceneMatch(actionHandler, inventoryGrid);

    switch(CurrentGameState)
    {
        case EnumGameState.MatchInit:
            gameSceneMatch.Init();
            CurrentGameState = EnumGameState.MatchIntro;
            break;
            
        case EnumGameState.MatchIntro:
            gameSceneMatch.Intro();
            //Command monitoring code
            while(gameCommandQueue.IsEmpty() === false) {
                console.log("Match Scene -> Fetching command!");
                command = FetchNextCommand();
                console.log("Match Scene -> Processing command "+command.Command+" for target "+command.Target);
                //if (command.Target === gameConfig.SceneMatchName) {
                    //Process commands
                //}
            }
            break;
            
        case EnumGameState.MatchActive:
            if (gameCommandQueue.IsEmpty()) { gameSceneMatch.Active(); }
            else {
                while(!gameCommandQueue.IsEmpty()) {
                    console.log("Match Scene -> Fetching command!");
                    command = FetchNextCommand();
                    console.log("Match Scene -> Processing command "+command.Command+" for target "+command.Target);
                    if (command.Target === gameConfig.SceneMatchName) {
                        if (command.Command === EnumGameCommands.MatchReset) {
                            CurrentGameState = EnumGameState.MatchInit;
                        }
                    } else if (EnumActions.IsAction(command.Command)) {
                            console.log("Command is action!");
                            actionHandler.HandleAction(command.Target, command.Predicate, command.Command);
                    }
                }
            }
            break;
            
        case EnumGameState.MatchEnd:
            break;
            
        case EnumGameState.MatchTrans:
            break;
        default:
            break;
    }
}

function GetKeyByValue(value, array) {
    "use strict";

    for( var prop in array ) {
        if( array.hasOwnProperty(prop) ) {
             if( array[ prop ] === value )
                 return prop;
        }
    }
    return -1;
}*/

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

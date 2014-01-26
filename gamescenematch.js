var gameSceneMatch = {
	GameMode: 0,	

	SlotsEnum: [
		"app1", "app2", "app3",
		"cont1", "cont2", "cont3", "cont4",	"cont5", "cont6",
		"cont7", "cont8", "cont9", "cont10", "cont11", "cont12",
		"ing1",	"ing2",	"ing3",	"ing4",	"ing5",	"ing6",
		"ing7",	"ing8",	"ing9",	"ing10", "ing11", "ing12",
		"ing13", "ing14", "ing15", "ing16", "ing17", "ing18",
		"ing19", "ing20", "ing21", "ing22",	"ing23", "ing24"
	],

	GameObjects: {},
	
	/*AddSlot: function (group, slotName, w, h, x, y) {
		$("#"+group).addSprite(slotName, {animation: this.GameObjects[slotName].Anim, width: w, height: h, posx: x, posy: y})
	},*/
	
	Init: function() {
		console.log("Match Scene -> Initializing.");
		//Initialize tile selector
		tileSelector.Init(gameSceneMatch.SlotsEnum);
		
		//Initialize game objects
		for (var i=0; i<this.SlotsEnum.length; i++) { 
			this.GameObjects[this.SlotsEnum[i]] = gameObjects["Empty"]; 
			tileSelector.TileSelected[this.SlotsEnum[i]] = false;
		}
		//Load kitchen
		this.GameObjects["app1"] = gameObjects["AppCounterTop"];
		this.GameObjects["app2"] = gameObjects["AppStoveTop"];
		this.GameObjects["app3"] = gameObjects["AppOven"];
		this.GameObjects["cont1"] = gameObjects["ContBowlLarge"];
		this.GameObjects["cont2"] = gameObjects["ContPotLarge"];
		this.GameObjects["cont3"] = gameObjects["ContCuttingBoard"];
		/*this.GameObjects["ing1"] = gameObjects["ToolHands"];
		this.GameObjects["ing2"] = gameObjects["ToolKnife"];
		this.GameObjects["ing3"] = gameObjects["ToolPeeler"];
		this.GameObjects["ing4"] = gameObjects["ToolMasher"];*/
		
		//Load recipe
		for (var i=0; i<(recipeGnocchi.length/2); i++)
		{
			this.GameObjects[this.SlotsEnum[i+15]] = new gameObject(recipeGnocchi[i*2], recipeGnocchi[(i*2)+1], EnumGOType.Ing, recipeGnocchi[i*2]+".PNG");
		}
		
		var j=0;
		//Initialize groups, add tiles as sprites
		$.playground()
			.addGroup("background", {width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.addSprite("background", {animation: gameAnimations.background1, width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.end()
			.addGroup("infoDiv",{width: 768, height: 64, posx: 0, posy: 0})
				.css({"background-color":"red", "font-size":"8pt", "color":"black"})
				.append("ROBOCOOK<br/>Prototype v0.3<br />Recipe: Gnocchi")
				.end()
			.addGroup(matchConsole.DisplayDiv, {width: 384, height: 192, posx: 0, posy: 64})
				.css({"background-color":"black", "font-size":"8pt", "color":"green"})
				.end()
			.addGroup("commandDiv", {width: 384, height: 192, posx: 384, posy: 64})
				.css({"background-color":"blue"})
				.end()
			.addGroup("appliances", {width: 384, height: 128, posx: 0, posy: 256})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 128, height: 128})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 128, height: 128, posx: 128})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 128, height: 128, posx: 256})
				.end()
			.addGroup("containers", {width: 384, height: 128, posx: 384, posy: 256})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 128})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 192})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 256})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 320})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 128, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 192, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 256, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 320, posy: 64})
				.end()
			.addGroup("ingredients", {width: 768, height: 128, posx: gamePos.MatchDivIngsX, posy: gamePos.MatchDivIngsY})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 0, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*2, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*3, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*4, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*5, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*6, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*7, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*8, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*9, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*10, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*11, posy: 0})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 0, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*2, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*3, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*4, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*5, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*6, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*7, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*8, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*9, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*10, posy: 64})
				.addSprite(this.SlotsEnum[j], {animation: this.GameObjects[this.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*11, posy: 64})
				.end()
			.addGroup("holding", {width: 756, height: 512, posx: 0, posy: 0})
				.addSprite("holdingBox",{animation: gameAnimations.overSelectionP1, width: 64, height: 64, posx: 0, posy: 0})
				.end()
			.addGroup("selectionDiv", {width: 756, height: 512, posx: 0, posy: 0})
				.mousemove(mouseTracker.RecordMousePos)
				.click(mouseTracker.RegisterClick)
				.end();
		
		
		//Init console
		matchConsole.Display();
		
		//Init mouse tracker
		mouseTracker.Init();
		
		//Advance game state to intro
		console.log("Match Scene -> Transitioning out of init to intro.");
		CurrentGameState = EnumGameState.MatchIntro;
	},
	
	Intro: function () {
		console.log("Match Scene -> Transitioning out of intro to active.");
		CurrentGameState = EnumGameState.MatchActive;
	},
	
	Active: function () {
		//console.log("Match Scene -> Entering active state.");
		mouseTracker.Update();
	},
	
	Trans: function() {
		throw ("Not yet implemented!");
	}
};

/////////////////
//Mouse Tracker//
/////////////////
var mouseTracker = {
	Target: "",
	ClickTicks: 0,
	Holding: null,
	OffsetX: 0,
	OffsetY: 0,
	X: 0,
	Y: 0,
	//Below X and Y are translated from absolute X and Y to grid coordinates
	GridX: 0,
	GridY: 0,
	
	RegisterClick: function(event) {
		console.log("Click at " + mouseTracker.X + " " + mouseTracker.Y);
		var gx = mouseTracker.X >>> 6;
		var gy = mouseTracker.Y >>> 6;
		if (gx === mouseTracker.GridX && gy === mouseTracker.GridY) {
			mouseTracker.DoubleClick(gx, gy);
		} else {
			mouseTracker.GridX = gx;
			mouseTracker.GridY = gy;
			mouseTracker.ClickTicks = 0;
		}
		console.log("Grid coords: " + mouseTracker.GridX + "x" + mouseTracker.GridY);
	},
	
	RecordMousePos: function(event) {
		//console.log(event.pageX+" "+event.pageY);
		mouseTracker.X = event.pageX - mouseTracker.OffsetX;
		mouseTracker.Y = event.pageY - mouseTracker.OffsetY;
	},
	
	Update: function() {
		//Doubleclick tracking
		if (mouseTracker.GridX && mouseTracker.GridY) {
			mouseTracker.ClickTicks++;
			console.log("" + mouseTracker.ClickTicks);
			if (mouseTracker.ClickTicks > 5) {
				var gx = mouseTracker.GridX;
				var gy = mouseTracker.GridY;
				mouseTracker.GridX = 0;
				mouseTracker.GridY = 0;
				mouseTracker.ClickTicks = 0;
				mouseTracker.SingleClick(gx, gy);
			}
		}
		$("#holdingBox").x(mouseTracker.X-32).y(mouseTracker.Y-32);
	},
	
	Init: function() {
		$.playground().registerCallback(mouseTracker.Update, 1); 
	},
	
	SingleClick: function(gx, gy) {
		throw "Not yet implemented!";
	},
	
	DoubleClick: function(gx, gy) {
		throw "Not yet implemented!";
	}
};

///////////
//Console//
///////////
var matchConsole = {
	DisplayDiv: "consoleDiv",
	Lines: [ 
		"Welcome to ROBOCOOK!", 
		"-", 
		"-", 
		"-", 
		"-",
		"-",
		"-",
		"-",
		"-",
		"-",
		"-",
		"-",
	],
	
	Write: function(line) {
		this.Lines.shift();
		this.Lines.push(line);
		this.Display();
	},
	
	Display: function() {
		$("#"+this.DisplayDiv).empty();
		$("#"+this.DisplayDiv).append("<br/>");
		for (var i=0; i<this.Lines.length; i++) {
			$("#"+this.DisplayDiv).append(this.Lines[i] + "<br/>");
		}
	}
};




///////////
//Actions//
///////////
var actionManager = {
	CommandDiv: "#commandDiv",

	Update: function (selections) {
		$(this.CommandDiv).empty();
		
		switch (selections.length)
		{
			case 0:
				return;
				break;
			case 1:
				this.SingularActions(selections[0]);
				break;
			case 2:
				this.DualActions(selections[0], selections[1]);
				break;
		}
	},
	
	SingularActions: function(obj1) {
		switch (obj1.Name)
		{
			case "Stove Top":
				this.AddActionButton("action1","Turn On High", new ActionHandler(obj1, null, function(event) { 
						event.preventDefault();
						console.log("Action -> Turn on button clicked!");
						tileSelector.Clear();
						var tileSlot1 = GetKeyByValue(obj1, gameSceneMatch.GameObjects);
						var gO = new gameObject("AppStoveTopHigh", "Stove Top on High", EnumGOType.App, "AppStoveTopHigh.PNG");
						gameSceneMatch.GameObjects[tileSlot1] = gO;
						$("#"+tileSlot1).setAnimation(gO.Anim);
						matchConsole.Write("Player 1 turned on the "+obj1.Name); 
					}));
				break;
				
			case "Oven":
				this.AddActionButton("action1","Preheat to 375F", new ActionHandler(obj1, null, function(event) { 
						event.preventDefault();
						console.log("Action -> Turn on button clicked!");
						tileSelector.Clear();
						var tileSlot1 = GetKeyByValue(obj1, gameSceneMatch.GameObjects);
						var gO = new gameObject("AppOven375", "Oven at 375 degrees", EnumGOType.App, "AppOven375.PNG");
						gameSceneMatch.GameObjects[tileSlot1] = gO;
						$("#"+tileSlot1).setAnimation(gO.Anim);
						matchConsole.Write("Player 1 preheated the "+obj1.Name+" to 375 degrees!"); 
					}));
				break;
		}
	},
	
	DualActions: function(obj1, obj2) {
		throw ("Dual actions not yet implemented!");
	},
	
	AddActionButton: function(id, name, handler) {
		$(this.CommandDiv).append("<button id='"+id+"' type='button'>"+name+"</button>");
		$("#"+id).click(handler.Handler);
	}
};

function ActionHandler(obj1, obj2, handler)
{
	this.GameObject1 = obj1;
	this.GameObject2 = obj2;
	this.Handler = handler;
}


////////////
//Selector//
////////////
/*
Selection Rules: Only 2 selections allowed at a time.
*/
var tileSelector = {
	TileSelected: [],
	Selections: [],
	
	Init: function(slotenum) {
		console.log("Tile Selector -> Initializing...");
		for (var i = 0; i < slotenum.length; i++) {
			//console.log(slotenum[i]+" = false");
			this.TileSelected[slotenum[i]] = false;
		}
	},

	AttemptSelect: function(tileName)
	{
		this.SelectObject(tileName);		
	},
	
	SelectObject: function(tileName)
	{
		//Unpackage slot
		gameObj = gameSceneMatch.GameObjects[tileName];
		if (this.TileSelected[tileName]) {
			//De-select
			//matchConsole.Write("Player 1 deselected "+gameObj.Name+"...");
			this.TileSelected[tileName] = false;
			var index = this.Selections.indexOf(gameObj)
			this.Selections.splice(index, 1);
			$("#"+tileName+"sel").setAnimation();
		} else {
			//Check for selection max
			if (this.Selections.length === 1) {
				//matchConsole.Write("You cannot have more than 1 object selected!");
				return false;
			}
			this.TileSelected[tileName] = true;
			//matchConsole.Write("Player 1 selected "+gameObj.Name+"...");
			this.Selections.push(gameObj);
			$("#"+tileName+"sel").setAnimation(gameAnimations.overSelectionP1);
		}
		actionManager.Update(this.Selections);
	},
	
	Clear: function ()
	{
		var slotenum = gameSceneMatch.SlotsEnum;
		
		for (var i = 0; i < slotenum.length; i++) {
			this.TileSelected[slotenum[i]] = false;
			$("#"+slotenum[i]+"sel").setAnimation();
		}
		this.Selections.length = 0;
		actionManager.Update(this.Selections);
	}
};

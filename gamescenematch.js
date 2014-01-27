var gameSceneMatch = {
	GameMode: 0,	
		
	Init: function() {
		console.log("Match Scene -> Initializing.");
		//Initialize tile selector
		tileSelector.Init(inventoryGrid.SlotsEnum);
		
		//Load kitchen
		inventoryGrid.Init();
		
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
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 128, height: 128})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 128, height: 128, posx: 128})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 128, height: 128, posx: 256})
				.end()
			.addGroup("containers", {width: 384, height: 128, posx: 384, posy: 256})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 128})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 192})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 256})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 320})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 128, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 192, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 256, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 320, posy: 64})
				.end()
			.addGroup("ingredients", {width: 768, height: 128, posx: gamePos.MatchDivIngsX, posy: gamePos.MatchDivIngsY})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 0, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*2, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*3, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*4, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*5, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*6, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*7, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*8, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*9, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*10, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*11, posy: 0})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 0, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*2, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*3, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*4, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*5, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*6, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*7, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*8, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*9, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*10, posy: 64})
				.addSprite(inventoryGrid.SlotsEnum[j], {animation: inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[j++]].Anim, width: 64, height: 64, posx: 64*11, posy: 64})
				.end()
			.addGroup("holding", {width: 756, height: 512, posx: 0, posy: 0})
				.addSprite("holdingBox",{animation: gameAnimations.overSelectionP1, width: 64, height: 64, posx: 0, posy: 0})
				.end()
			.addGroup("selectionDiv", {width: 756, height: 512, posx: 0, posy: 0})
				.mousemove(mouseTracker.RecordMousePos)
				//.click(mouseTracker.RegisterClick)
				.mousedown(mouseTracker.RegisterDown)
				.mouseup(mouseTracker.RegisterUp)
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

//////////////////
//Inventory Grid//
//////////////////
var inventoryGrid = {
	SlotsEnum: [
		"app1", "app2", "app3",
		"cont1", "cont2", "cont3", "cont4",	"cont5", "cont6",
		"cont7", "cont8", "cont9", "cont10", "cont11", "cont12",
		"ing1",	"ing2",	"ing3",	"ing4",	"ing5",	"ing6",
		"ing7",	"ing8",	"ing9",	"ing10", "ing11", "ing12",
		"ing13", "ing14", "ing15", "ing16", "ing17", "ing18",
		"ing19", "ing20", "ing21", "ing22",	"ing23", "ing24"
	],

	Grid: [
		"","","","","","","","","","","","",		//row1
		"","","","","","","","","","","","",		//row2
		"","","","","","","","","","","","",		//row3
		"","","","","","","","","","","","",		//row4
		"app1","app1","app2","app2","app3","app3","cont1","cont2","cont3","cont4","cont5","cont6",			//row5
		"app1","app1","app2","app2","app3","app3","cont7","cont8","cont9","cont10","cont11","cont12",		//row6
		"ing1","ing2","ing3","ing4","ing5","ing6","ing7","ing8","ing9","ing10","ing11","ing12",				//row7
		"ing13","ing14","ing15","ing16","ing17","ing18","ing19","ing20","ing21","ing22","ing23","ing24",	//row8
	],
	
	GameObjects: {},
	
	GetSlot: function(gx, gy) {
		return inventoryGrid.Grid[(gy*12)+gx];
	},
	
	Init: function() {
		
		//Initialize
		for (var i=0; i<inventoryGrid.SlotsEnum.length; i++) { 
			inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[i]] = gameObjects["Empty"]; 
			tileSelector.TileSelected[inventoryGrid.SlotsEnum[i]] = false;	
		}
		
		//Load defaults
		inventoryGrid.GameObjects["app1"] = gameObjects["AppCounterTop"];
		inventoryGrid.GameObjects["app2"] = gameObjects["AppStoveTop"];
		inventoryGrid.GameObjects["app3"] = gameObjects["AppOven"];
		inventoryGrid.GameObjects["cont1"] = gameObjects["ContBowlLarge"];
		inventoryGrid.GameObjects["cont2"] = gameObjects["ContPotLarge"];
		inventoryGrid.GameObjects["cont3"] = gameObjects["ContCuttingBoard"];
		
		//Load recipe
		for (var i=0; i<(recipeGnocchi.length/2); i++) {
			inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[i+15]] =
				new gameObject(recipeGnocchi[i*2], recipeGnocchi[(i*2)+1], EnumGOType.Ing, recipeGnocchi[i*2]+".PNG");
		}
	},
	
	IsSlotEmpty: function(slot) {
		var obj = inventoryGrid.GameObjects[slot];
		if (!obj) throw "Error retrieving object in " + slot;
		else return (obj === gameObjects["Empty"]);
	},
	
	FetchObj: function(slot) {
		console.log("Fetching object in " + slot);
		var obj = inventoryGrid.GameObjects[slot];
		inventoryGrid.GameObjects[slot] = gameObjects["Empty"];
		$("#"+slot).setAnimation();
		return obj;
	},
	
	//Gets the description of the gameObject in slot
	GetObjDesc: function(slot) {
		var obj = inventoryGrid.GameObjects[slot];
		return (inventoryGrid.IsSlotEmpty(slot)) ? false : obj.Desc();
	},
	GetObjType: function(slot) {
		var obj = inventoryGrid.GameObjects[slot];
		return (inventoryGrid.IsSlotEmpty(slot)) ? false : obj.Type;
	}
};

/////////////////
//Mouse Tracker//
/////////////////
var mouseTracker = {
	Target: "",
	Dragging: false,
	Down: false,
	Clicked: false,
	ClickTicks: 0,
	DragTicks: 0,
	Holding: null,
	OffsetX: 0,
	OffsetY: 0,
	X: 0,
	Y: 0,
	//Below X and Y are translated from absolute X and Y to grid coordinates
	GridX: 0,
	GridY: 0,
	DownX: 0,
	DownY: 0,
	//The grid is 8x12 and indicates which slots occupy each 64x64 pixel grid square

	
	RegisterClick: function() {
		console.log("Click at " + mouseTracker.X + " " + mouseTracker.Y);
		if (mouseTracker.Clicked) {
			mouseTracker.Clicked = false;
			mouseTracker.DoubleClick(mouseTracker.GridX, mouseTracker.GridY);
		} else {
			mouseTracker.ClickTicks = 0;
			mouseTracker.Clicked = true;
		}
		console.log("Grid coords: " + mouseTracker.GridX + "x" + mouseTracker.GridY);
	},
	
	RegisterDown: function() {
		console.log("Mouse down!");		
		if (!mouseTracker.Dragging) {
			mouseTracker.DownX = mouseTracker.GridX;
			mouseTracker.DownY = mouseTracker.GridY;
			mouseTracker.Down = true;
			mouseTracker.DragTicks = 0;
		}
	},
	
	RegisterUp: function() {
		console.log("Mouse up!");
		mouseTracker.Down = false;
		if(!mouseTracker.Dragging) {
			if(mouseTracker.GridX === mouseTracker.DownX && mouseTracker.GridY === mouseTracker.DownY) {
				mouseTracker.RegisterClick();
			}
		} else {
			mouseTracker.PutDownObj();
		}		
	},
	
	RecordMousePos: function(event) {
		//console.log(event.pageX+" "+event.pageY);
		mouseTracker.X = event.pageX - mouseTracker.OffsetX;
		mouseTracker.Y = event.pageY - mouseTracker.OffsetY;
		mouseTracker.GridX = mouseTracker.X >>> 6;
		mouseTracker.GridY = mouseTracker.Y >>> 6;
	},
	
	Update: function() {	
		//Drag tracking
		if (mouseTracker.Down && !mouseTracker.Dragging) { mouseTracker.DragTicks++;
			if (mouseTracker.DragTicks >= 3) {
				mouseTracker.DragTicks = 0;
				mouseTracker.MouseDrag();
			}
		}
		
		//Click tracking
		if (mouseTracker.Clicked) {mouseTracker.ClickTicks++;
			console.log("" + mouseTracker.ClickTicks);
			if (mouseTracker.ClickTicks >= 6) {
				mouseTracker.ClickTicks = 0;
				mouseTracker.Clicked = false;
				mouseTracker.SingleClick(mouseTracker.GridX, mouseTracker.GridY);
			}
		}
		
		//Update holding box position
		$("#holdingBox").x(mouseTracker.X-32).y(mouseTracker.Y-32);
	},
	
	Init: function() {
		$.playground().registerCallback(mouseTracker.Update, 1); 
	},
	
	PickUpObj: function(slot) {
		if (!inventoryGrid.IsSlotEmpty(slot)) {
			mouseTracker.Holding = inventoryGrid.FetchObj(slot);
			$("#holdingBox").setAnimation(mouseTracker.Holding.Anim);
		}
	},
	
	PutDownObj: function() {
		mouseTracker.Dragging = false;
		mouseTracker.Holding = null;
		throw "Putting down objects not implemented!";
	},
	
	//Mouse actions
	SingleClick: function(gx, gy) {
		var slot = inventoryGrid.GetSlot(gx, gy);
		var desc = inventoryGrid.GetObjDesc(slot);
		if (desc) matchConsole.Write(desc);
	},
	
	DoubleClick: function(gx, gy) {
		throw "Doubleclick not yet implemented!";
	},
	
	MouseDrag: function() {
		var slot = inventoryGrid.GetSlot(mouseTracker.GridX, mouseTracker.GridY);
		if (slot) {
			var gotype = inventoryGrid.GetObjType(slot);
			if (gotype === EnumGOType.Ing || gotype === EnumGOType.Cont) {
				mouseTracker.Dragging = true;
				mouseTracker.PickUpObj(slot);
			}
		}
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
						var tileSlot1 = GetKeyByValue(obj1, inventoryGrid.GameObjects);
						var gO = new gameObject("AppStoveTopHigh", "Stove Top on High", EnumGOType.App, "AppStoveTopHigh.PNG");
						inventoryGrid.GameObjects[tileSlot1] = gO;
						$("#"+tileSlot1).setAnimation(gO.Anim);
						matchConsole.Write("Player 1 turned on the "+obj1.Name); 
					}));
				break;
				
			case "Oven":
				this.AddActionButton("action1","Preheat to 375F", new ActionHandler(obj1, null, function(event) { 
						event.preventDefault();
						console.log("Action -> Turn on button clicked!");
						tileSelector.Clear();
						var tileSlot1 = GetKeyByValue(obj1, inventoryGrid.GameObjects);
						var gO = new gameObject("AppOven375", "Oven at 375 degrees", EnumGOType.App, "AppOven375.PNG");
						inventoryGrid.GameObjects[tileSlot1] = gO;
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
		gameObj = inventoryGrid.GameObjects[tileName];
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
		var slotenum = inventoryGrid.SlotsEnum;
		
		for (var i = 0; i < slotenum.length; i++) {
			this.TileSelected[slotenum[i]] = false;
			$("#"+slotenum[i]+"sel").setAnimation();
		}
		this.Selections.length = 0;
		actionManager.Update(this.Selections);
	}
};

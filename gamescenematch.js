var actionHandler = null;
var gameRecipe = null;
var gameIngList = null;
var gameTitle = null;
var winFlag = false;

var gameSceneMatch = {
	GameMode: 0,	
		
	Init: function() {
		console.log("Match Scene -> Initializing.");
		
		//Load kitchen
		inventoryGrid.Init();
		
		var j=0;
		//Initialize groups, add tiles as sprite
		$.playground()
			.pauseGame().clearScenegraph().startGame()
			.addGroup("background", {width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.addSprite("background", {animation: gameAnimations.background1, width: gameConfig.StageWidth, height: gameConfig.StageHeight})
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
				.addSprite("app1Box",{animation: gameAnimations.overSelectionP1, width: 64, height: 64, posx: 32, posy: 288})
				.addSprite("app2Box",{animation: gameAnimations.overSelectionP1, width: 64, height: 64, posx: 160, posy: 288})
				.addSprite("app3Box",{animation: gameAnimations.overSelectionP1, width: 64, height: 64, posx: 288, posy: 288})
				.addSprite("holdingBox",{animation: gameAnimations.overSelectionP1, width: 64, height: 64, posx: 0, posy: 0})
				.end()
			.addGroup("selectionDiv", {width: 756, height: 512, posx: 0, posy: 0})
				.mousemove(mouseTracker.RecordMousePos)
				//.click(mouseTracker.RegisterClick)
				.mousedown(mouseTracker.RegisterDown)
				.mouseup(mouseTracker.RegisterUp)
				.end()
			.addGroup("infoDiv",{width: 768, height: 64, posx: 0, posy: 0})
				.css({"background-color":"red", "font-size":"8pt", "color":"black"})
				.append("ROBOCOOK<br/>Prototype v0.3<br />Recipe: " + gameTitle)
				.append("<button id='matchResetBtn' type='button'>Reset</button>")
				.end()
			.addGroup("recipeDiv", {width: 384, height: 192, posx: 384, posy: 64})
				.css({"background-color":"blue", "font-size":"8pt", "color":"red", "overflow":"auto"})
				.end()
			.addGroup(matchConsole.DisplayDiv, {width: 384, height: 192, posx: 0, posy: 64})
				.css({"background-color":"black", "font-size":"8pt", "color":"green", "overflow":"auto"})
				.end();
				
		//Configure reset button
		$("#matchResetBtn").css({
			"position":"absolute",
			"top":16,
			"left":700})
			.click(function(event) {
				event.preventDefault();
				console.log("Match Scene -> Reset button clicked!");
				RegisterCommand(gameConfig.SceneMatchName, EnumGameCommands.MatchReset);
			});		
		
		//Init console
		matchConsole.Display();
		
		//Init mouse tracker
		mouseTracker.Init();
		
		//Init recipe display
		$("#recipeDiv").append("<ol>");
		for (var i=0; i<gameRecipe.length; i++) {
				$("#recipeDiv").append("<li id='rlist"+i+"'>"+gameRecipe[i]+"</li>");
		}
		$("#recipeDiv").append("</ol>");
		
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
		if (!winFlag) {
			mouseTracker.Update();
			actionHandler.UpdateAppliances();
		} else {
			$.playground()
				.addGroup("endgame", {width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.addSprite("victory", {animation: gameAnimations.victoryScreen, width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.end();
		}
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
	
	ChangeSlotAnim: function(slot, anim) {
		$("#"+slot).setAnimation(anim);
	},
	
	ClearSlotAnim: function(slot) {
		$("#"+slot).setAnimation();
	},
	
	Init: function() {
		
		//Initialize
		for (var i=0; i<inventoryGrid.SlotsEnum.length; i++) { 
			inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[i]] = gameObjects["Empty"]; 
		}
		
		//Load defaults
		inventoryGrid.GameObjects["app1"] = gameObjects["AppCounterTop"];
		inventoryGrid.GameObjects["app2"] = gameObjects["AppStoveTop"];
		inventoryGrid.GameObjects["app3"] = gameObjects["AppOven"];
		inventoryGrid.GameObjects["cont1"] = gameObjects["ContBowlLarge"];
		inventoryGrid.GameObjects["cont2"] = gameObjects["ContPotLarge"];
		inventoryGrid.GameObjects["cont3"] = gameObjects["ContCuttingBoard"];
		inventoryGrid.GameObjects["cont4"] = gameObjects["ContBakingDish"];
		inventoryGrid.GameObjects["cont5"] = gameObjects["ContSaucepanLarge"];
		
		//Empty gameobjects
		$.each(gameObjects, function(key, value) {
			if (value.Contains) {
				value.Contains.length = 0;
			}
		});
		
		//Load recipe
		for (var i=0; i<(gameIngList.length/3); i++) {
			inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[i+15]] = new gameIngredient(gameIngList[i*3], gameIngList[(i*3)+1], gameIngList[i*3]+".PNG", gameIngList[(i*3)+2]);
		}
	},
	
	IsSlotEmpty: function(slot) {
		var obj = inventoryGrid.GameObjects[slot];
		if (!obj) throw "Error retrieving object in " + slot;
		else return (obj === gameObjects["Empty"]);
	},
	
	IsSlotApp: function(slot) {
		return (inventoryGrid.GameObjects[slot].Type === EnumGOType.App);
	},
	
	FetchObj: function(slot) {
		console.log("Fetching object in " + slot);
		if (!inventoryGrid.IsSlotApp(slot)) {
			var obj = inventoryGrid.GameObjects[slot];
			inventoryGrid.GameObjects[slot] = gameObjects["Empty"];
			$("#"+slot).setAnimation();
		} else {
			if (inventoryGrid.GameObjects[slot].Contains.length === 0) throw "Appliance empty!";
			var obj = inventoryGrid.GameObjects[slot].Contains[0];
			inventoryGrid.GameObjects[slot].Contains.length = 0;
			inventoryGrid.ClearSlotAnim(slot + "Box");
			matchConsole.Write("Player 1 took the " + obj.Name + " off of the " + inventoryGrid.GameObjects[slot].Name);
			
		}
		return obj;
	},
	
	PlaceObj: function(obj, slot) {
		if (!slot) throw "Attempted to place in non slot!";
		//Place in non empty slot
		if (!inventoryGrid.IsSlotEmpty(slot)) { 
			var gobj = inventoryGrid.GameObjects[slot];
			var origin = inventoryGrid.GetSlot(mouseTracker.DownX, mouseTracker.DownY);
			obj.ActOn(gobj, slot, origin);
		} else {
			console.log(slot);
			if ((slot.charAt(0) === "c" ) === (obj.Type === EnumGOType.Ing)) {
				throw "Placing object in mismatched slot!";
			} else {
				inventoryGrid.GameObjects[slot] = obj;
				$("#"+slot).setAnimation(obj.Anim);
			}
		}
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
		try {
			var slot = inventoryGrid.GetSlot(mouseTracker.GridX, mouseTracker.GridY);
			inventoryGrid.PlaceObj(mouseTracker.Holding, slot);
		} catch (err) {
			var slot = inventoryGrid.GetSlot(mouseTracker.DownX, mouseTracker.DownY);
			inventoryGrid.PlaceObj(mouseTracker.Holding, slot);
		}
		mouseTracker.Dragging = false;
		mouseTracker.Holding = null;
		$("#holdingBox").setAnimation();
	},
	
	//Mouse actions
	SingleClick: function(gx, gy) {
		var slot = inventoryGrid.GetSlot(gx, gy);
		var desc = inventoryGrid.GetObjDesc(slot);
		if (desc) matchConsole.Write(desc);
	},
	
	DoubleClick: function(gx, gy) {
		var slot = inventoryGrid.GetSlot(gx, gy);
		var obj = inventoryGrid.GameObjects[slot];
		actionHandler.HandleAction(obj, slot);
	},
	
	MouseDrag: function() {
		var slot = inventoryGrid.GetSlot(mouseTracker.DownX, mouseTracker.DownY);
		if (slot) {
			var gotype = inventoryGrid.GetObjType(slot);
			if (gotype === EnumGOType.Ing || gotype === EnumGOType.Cont) {
				mouseTracker.Dragging = true;
				mouseTracker.PickUpObj(slot);
			} else if (gotype === EnumGOType.App) {
				if (inventoryGrid.GameObjects[slot].Contains.length > 0) {
					mouseTracker.Dragging = true;
					mouseTracker.PickUpObj(slot);
				}
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
	],
	
	Write: function(line) {
		//this.Lines.shift();
		this.Lines.push(line);
		this.Display();
	},
	
	Display: function() {
		/*$("#"+this.DisplayDiv).empty();
		$("#"+this.DisplayDiv).append("<br/>");
		for (var i=0; i<this.Lines.length; i++) {
			$("#"+this.DisplayDiv).append(this.Lines[i] + "<br/>");
		}*/
		$("#"+this.DisplayDiv).prepend(this.Lines[this.Lines.length-1] + "<br/>");
	}
};

//////////////////
//Action Handler//
//////////////////
/*
var actionHandler = {
	HandleAction: function(gobj, slot)	{
		switch (gobj.ID) {
			case "IngPotatoes":
				matchConsole.Write("Player 1 peeled the potatoes.");
				var nobj = new gameIngredient("IngPotatoesPeeled", "Peeled Potatoes", "IngPotatoesPeeled.PNG");
				inventoryGrid.GameObjects[slot] = nobj;
				inventoryGrid.ChangeSlotAnim(slot, nobj.Anim);
				break;
				
			case "AppOven":
				matchConsole.Write("Player 1 turned the oven on.");
				actionHandler.SwapAppliances(slot, gameObjects["AppOven"], gameObjects["AppOvenOn"]);
				break;
				
			case "AppOvenOn":
				matchConsole.Write("Player 1 turned the oven off.");
				actionHandler.SwapAppliances(slot, gameObjects["AppOvenOn"], gameObjects["AppOven"]);
				break;
				
			case "AppStoveTop":
				matchConsole.Write("Player 1 turned the stove top on.");
				actionHandler.SwapAppliances(slot, gameObjects["AppStoveTop"], gameObjects["AppStoveTopOn"]);
				break;
				
			case "AppStoveTopOn":
				matchConsole.Write("Player 1 turned the stove top off.");
				actionHandler.SwapAppliances(slot, gameObjects["AppStoveTopOn"], gameObjects["AppStoveTop"]);
				break;
				
			case "ContPotLarge":
				if (actionHandler.VerifyContents(gobj, ["IngWater", "IngSaltTbsp"])) {
					matchConsole.Write("Player 1 mixed salted water in the large pot!");
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngSaltedWater", "Salted Water", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngWater", "IngSaltDash"])) {
					matchConsole.Write("Player 1 mixed lightly salted water in the large pot!");
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngSaltedWaterLight", "Lightly Salted Water", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngTenderPotatoes", "IngSaltedWater"])) {
					matchConsole.Write("Player 1 drained the water from the pot!");
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngTenderPotatoes", "Tender Potatoes", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngCookedGnocchi", "IngSaltedWaterLight"])) {
					matchConsole.Write("Player 1 drained the water from the pot!");
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngCookedGnocchi", "Cooked Gnocchi", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngTenderPotatoes"])) {
					matchConsole.Write("Player 1 mashed the tender potatoes!");
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngMashedPotatoes", "Mashed Potatoes", ""));
				}
				break;
				
			case "ContBowlLarge":
				if (actionHandler.VerifyContents(gobj, ["IngMashedPotatoes", "IngEgg", "IngCupOfFlour"])) {
					matchConsole.Write("Player 1 combined the ingredients into dough!");
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngDough", "Dough", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngDough"])) {
					matchConsole.Write("Player 1 kneaded the dough into a ball!");
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngDoughBall", "Ball of Dough", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngDoughBall"])) {
					matchConsole.Write("Player 1 shaped the dough into snakes!");
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngDoughSnakes", "Snakes of Dough", ""));
				}
				break;
				
			case "ContCuttingBoard":
				if (actionHandler.VerifyContents(gobj, ["IngCupOfFlour"])) {
					matchConsole.Write("Player 1 floured the cutting board!");
					gobj.Contains.length = 0;
					inventoryGrid.GameObjects[slot] = gameObjects["ContCuttingBoardFloured"];
				}
				break;
				
			case "ContCuttingBoardFloured":
				if (actionHandler.VerifyContents(gobj, ["IngDoughSnakes"])) {
					matchConsole.Write("Player 1 cut the snakes into half-inch pieces of raw gnocchi!");
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngRawGnocchi", "Raw Gnocchi", ""));
				}
				break;
		}
	},
	
	UpdateAppliances: function() {
		//Check stove top
		try {
			if (gameObjects["AppStoveTopOn"].Contains.length > 0) {
				//console.log("Stove top on!");
				//console.log(actionHandler.VerifyContents(inventoryGrid.GameObjects["app2"].Contains[0], ["IngSaltedWater", "IngPotatoesPeeled"]));
				if (actionHandler.VerifyContents(gameObjects["AppStoveTopOn"].Contains[0], ["IngSaltedWater", "IngPotatoesPeeled"])) {
					matchConsole.Write("The potatoes boiled in the salted water!  Now they are nice and tender.");
					gameObjects["AppStoveTopOn"].Contains[0].Contains.length = 0;
					gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngTenderPotatoes", "Tender Potatoes", ""));
					gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngSaltedWater", "Salted Water", ""));
				} else if (actionHandler.VerifyContents(gameObjects["AppStoveTopOn"].Contains[0], ["IngSaltedWaterLight", "IngRawGnocchi"])) {
					matchConsole.Write("The gnocchi cooked until they rose to the top!");
					gameObjects["AppStoveTopOn"].Contains[0].Contains.length = 0;
					gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngCookedGnocchi", "Cooked Gnocchi", ""));
					gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngSaltedWaterLight", "Lightly Salted Water", ""));
				}
			}
		} catch(err) {
			console.log("Error: " + err.message);
		}
	},
	
	SwapAppliances: function(slot, oapp, napp) {
		oapp.TransferTo(napp);
		inventoryGrid.GameObjects[slot] = napp;
		inventoryGrid.ChangeSlotAnim(slot, napp.Anim);
	},
	
	VerifyContents: function(gobj, arr) {
		if (gobj.Contains.length !== arr.length) return false;
		for (var i=0; i<arr.length; i++) {
			var found = false;
			for (var j=0; j<gobj.Contains.length; j++) {
				console.log(gobj.Contains[j].ID + " vs " + arr[i]);
				if (gobj.Contains[j].ID === arr[i]) {
					console.log("Match!");
					found = true;
				}
			}
			if (!found) return false;
		}
		return true;
	}
};*/
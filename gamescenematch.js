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
		this.GameObjects["ing1"] = gameObjects["ToolHands"];
		this.GameObjects["ing2"] = gameObjects["ToolKnife"];
		this.GameObjects["ing3"] = gameObjects["ToolPeeler"];
		this.GameObjects["ing4"] = gameObjects["ToolMasher"];
		
		//Load recipe		
		
		//Console div
		$("#stage").append("<div id='consoleDiv'></div>");
		$("#consoleDiv").css({
			"position":"absolute",
			"width":"384px",
			"height":"192px",
			"top":"64px",
			"left":"0px",
			"background-color":"black"
		});
		
		//Command div
		$("#stage").append("<div id='commandDiv'></div>");
		$("#commandDiv").css({
			"position":"absolute",
			"width":"384px",
			"height":"192px",
			"top":"64px",
			"left":"384px",
			"background-color":"blue"
		});
		
		var j=0;
		//Initialize groups, add sprites
		$.playground().addGroup("background", {width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.addSprite("background", {animation: gameAnimations.background1, width: gameConfig.StageWidth, height: gameConfig.StageHeight})
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
			.addGroup("selections", {width: 768, height: 256, posx: 0, posy: 256})
				.addSprite("app1sel", {width: 64, height: 64, posx: 32, posy: 32})
				.addSprite("app2sel", {width: 64, height: 64, posx: 160, posy: 32})
				.addSprite("app3sel", {width: 64, height: 64, posx: 288, posy: 32})
				.addSprite("cont1sel", {width: 64, height: 64, posx: 384})
				.addSprite("cont2sel", {width: 64, height: 64, posx: 448})
				.addSprite("cont3sel", {width: 64, height: 64, posx: 512})
				.addSprite("cont4sel", {width: 64, height: 64, posx: 576})
				.addSprite("cont5sel", {width: 64, height: 64, posx: 640})
				.addSprite("cont6sel", {width: 64, height: 64, posx: 704})
				.addSprite("cont7sel", {width: 64, height: 64, posx: 384, posy: 64})
				.addSprite("cont8sel", {width: 64, height: 64, posx: 448, posy: 64})
				.addSprite("cont9sel", {width: 64, height: 64, posx: 512, posy: 64})
				.addSprite("cont10sel", {width: 64, height: 64, posx: 576, posy: 64})
				.addSprite("cont11sel", {width: 64, height: 64, posx: 640, posy: 64})
				.addSprite("cont12sel", {width: 64, height: 64, posx: 704, posy: 64})
				.addSprite("ing1sel",{width: 64, height: 64, posx: 0, posy: 128})
				.addSprite("ing2sel",{width: 64, height: 64, posx: 64, posy: 128})
				.addSprite("ing3sel",{width: 64, height: 64, posx: 64*2, posy: 128})
				.addSprite("ing4sel",{width: 64, height: 64, posx: 64*3, posy: 128})
				.addSprite("ing5sel",{width: 64, height: 64, posx: 64*4, posy: 128})
				.addSprite("ing6sel",{width: 64, height: 64, posx: 64*5, posy: 128})
				.addSprite("ing7sel",{width: 64, height: 64, posx: 64*6, posy: 128})
				.addSprite("ing8sel",{width: 64, height: 64, posx: 64*7, posy: 128})
				.addSprite("ing9sel",{width: 64, height: 64, posx: 64*8, posy: 128})
				.addSprite("ing10sel",{width: 64, height: 64, posx: 64*9, posy: 128})
				.addSprite("ing11sel",{width: 64, height: 64, posx: 64*10, posy: 128})
				.addSprite("ing12sel",{width: 64, height: 64, posx: 64*11, posy: 128})
				.addSprite("ing13sel",{width: 64, height: 64, posx: 0, posy: 192})
				.addSprite("ing14sel",{width: 64, height: 64, posx: 64, posy: 192})
				.addSprite("ing15sel",{width: 64, height: 64, posx: 64*2, posy: 192})
				.addSprite("ing16sel",{width: 64, height: 64, posx: 64*3, posy: 192})
				.addSprite("ing17sel",{width: 64, height: 64, posx: 64*4, posy: 192})
				.addSprite("ing18sel",{width: 64, height: 64, posx: 64*5, posy: 192})
				.addSprite("ing19sel",{width: 64, height: 64, posx: 64*6, posy: 192})
				.addSprite("ing20sel",{width: 64, height: 64, posx: 64*7, posy: 192})
				.addSprite("ing21sel",{width: 64, height: 64, posx: 64*8, posy: 192})
				.addSprite("ing22sel",{width: 64, height: 64, posx: 64*9, posy: 192})
				.addSprite("ing23sel",{width: 64, height: 64, posx: 64*10, posy: 192})
				.addSprite("ing24sel",{width: 64, height: 64, posx: 64*11, posy: 192});
				
		//Functionality
		$("#app1sel").click(function () { console.log("Match Scene -> App1 clicked."); 
			tileSelector.ToggleSelect("app1"); 
		});
		$("#app2sel").click(function () { console.log("Match Scene -> App2 clicked."); 
			tileSelector.ToggleSelect("app2");
		});
		$("#app3sel").click(function () { console.log("Match Scene -> App3 clicked.");
			tileSelector.ToggleSelect("app3");
		});
		$("#cont1sel").click(function () { console.log("Match Scene -> Cont1 clicked."); 
			tileSelector.ToggleSelect("cont1");
		});
		$("#cont2sel").click(function () { console.log("Match Scene -> Cont2 clicked."); 
			tileSelector.ToggleSelect("cont2");
		});
		$("#cont3sel").click(function () { console.log("Match Scene -> Cont3 clicked."); 
			tileSelector.ToggleSelect("cont3");
		});
		$("#cont4sel").click(function () { console.log("Match Scene -> Cont4 clicked.");
			tileSelector.ToggleSelect("cont4");
		});
		$("#cont5sel").click(function () { console.log("Match Scene -> Cont5 clicked.");
			tileSelector.ToggleSelect("cont5");
		});
		$("#cont6sel").click(function () { console.log("Match Scene -> Cont6 clicked.");
			tileSelector.ToggleSelect("cont6");
		});
		$("#cont7sel").click(function () { console.log("Match Scene -> Cont7 clicked.");
			tileSelector.ToggleSelect("cont7");
		});
		$("#cont8sel").click(function () { console.log("Match Scene -> Cont8 clicked.");
			tileSelector.ToggleSelect("cont8");
		});
		$("#cont9sel").click(function () { console.log("Match Scene -> Cont9 clicked.");
			tileSelector.ToggleSelect("cont9");
		});
		$("#cont10sel").click(function () { console.log("Match Scene -> Cont10 clicked.");
			tileSelector.ToggleSelect("cont10");
		});
		$("#cont11sel").click(function () { console.log("Match Scene -> Cont11 clicked.");
			tileSelector.ToggleSelect("cont11");
		});
		$("#cont12sel").click(function () { console.log("Match Scene -> Cont12 clicked.");
			tileSelector.ToggleSelect("cont12");
		});
		$("#ing1sel").click(function () { console.log("Match Scene -> Ing1 clicked.");
			tileSelector.ToggleSelect("ing1");
		});
		$("#ing2sel").click(function () { console.log("Match Scene -> Ing2 clicked.");
			tileSelector.ToggleSelect("ing2");
		});
		$("#ing3sel").click(function () { console.log("Match Scene -> Ing3 clicked.");
			tileSelector.ToggleSelect("ing3");
		});
		$("#ing4sel").click(function () { console.log("Match Scene -> Ing4 clicked.");
			tileSelector.ToggleSelect("ing4");
		});
		$("#ing5sel").click(function () { console.log("Match Scene -> Ing5 clicked.");
			tileSelector.ToggleSelect("ing5");
		});
		$("#ing6sel").click(function () { console.log("Match Scene -> Ing6 clicked.");
			tileSelector.ToggleSelect("ing6");
		});
		$("#ing7sel").click(function () { console.log("Match Scene -> Ing7 clicked.");
			tileSelector.ToggleSelect("ing7");
		});
		$("#ing8sel").click(function () { console.log("Match Scene -> Ing8 clicked.");
			tileSelector.ToggleSelect("ing8");
		});
		$("#ing9sel").click(function () { console.log("Match Scene -> Ing9 clicked.");
			tileSelector.ToggleSelect("ing9");
		});
		$("#ing10sel").click(function () { console.log("Match Scene -> Ing10 clicked.");
			tileSelector.ToggleSelect("ing10");
		});
		$("#ing11sel").click(function () { console.log("Match Scene -> Ing11 clicked.");
			tileSelector.ToggleSelect("ing11");
		});
		$("#ing12sel").click(function () { console.log("Match Scene -> Ing12 clicked.");
			tileSelector.ToggleSelect("ing12");
		});
		$("#ing13sel").click(function () { console.log("Match Scene -> Ing13 clicked.");
			tileSelector.ToggleSelect("ing13");
		});
		$("#ing14sel").click(function () { console.log("Match Scene -> Ing14 clicked.");
			tileSelector.ToggleSelect("ing14");
		});
		$("#ing15sel").click(function () { console.log("Match Scene -> Ing15 clicked.");
			tileSelector.ToggleSelect("ing15");
		});
		$("#ing16sel").click(function () { console.log("Match Scene -> Ing16 clicked.");
			tileSelector.ToggleSelect("ing16");
		});
		$("#ing17sel").click(function () { console.log("Match Scene -> Ing17 clicked.");
			tileSelector.ToggleSelect("ing17");
		});
		$("#ing18sel").click(function () { console.log("Match Scene -> Ing18 clicked.");
			tileSelector.ToggleSelect("ing18");
		});
		$("#ing19sel").click(function () { console.log("Match Scene -> Ing19 clicked.");
			tileSelector.ToggleSelect("ing19");
		});
		$("#ing20sel").click(function () { console.log("Match Scene -> Ing20 clicked.");
			tileSelector.ToggleSelect("ing20");
		});
		$("#ing21sel").click(function () { console.log("Match Scene -> Ing21 clicked.");
			tileSelector.ToggleSelect("ing21");
		});
		$("#ing22sel").click(function () { console.log("Match Scene -> Ing22 clicked.");
			tileSelector.ToggleSelect("ing22");
		});
		$("#ing23sel").click(function () { console.log("Match Scene -> Ing23 clicked.");
			tileSelector.ToggleSelect("ing23");
		});
		$("#ing24sel").click(function () { console.log("Match Scene -> Ing24 clicked.");
			tileSelector.ToggleSelect("ing24");
		});
		
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
	},
	
	Trans: function() {
		throw ("Not yet implemented!");
	}
};

///////////
//Console//
///////////
/*var matchConsole = {
	DisplayDiv: "consoleDiv",
	Lines: [5],
	Update: function() {
		
	}
	
	Write: function(line) {
		
	}
};*/


////////////
//Selector//
////////////
var tileSelector = {
	TileSelected: {},
	Selections: {},

	AttemptSelect: function(tileName)
	{
		console.log("");
	},
	
	ToggleSelect: function(tileName)
	{
		if (this.TileSelected[tileName] === true)
		{
			console.log("Selector -> Deselecting tile " + tileName);
			//Clear if true
			$("#" + tileName + "sel").setAnimation();
			this.TileSelected[tileName] = false;
			UpdateCommands();

		} else {
			console.log("Selector -> Selecting tile " + tileName);
			//Select if false
			$("#" + tileName + "sel").setAnimation(gameAnimations.overSelectionP1);
			this.TileSelected[tileName] = true;
			UpdateCommands();
		}
	}
};

////////////
//Commands//
////////////
function UpdateCommands()
{
	$("#commandDiv").empty();
	if (tileSelector.TileSelected["app1"]===true)
	{
		$("#commandDiv").append("<button id='btnExamine'>Examine</button>");
		$("#commandDiv").append("<button id='btnTurnOn'>Turn On</button>");
	}
	if (tileSelector.TileSelected["app2"]===true)
	{
		$("#commandDiv").append("<button id='btnExamine'>Examine</button>");
		$("#commandDiv").append("<button id='btnPreHeat350'>Pre-heat to 350F</button>");
		$("#commandDiv").append("<button id='btnPreHeat375'>Pre-heat to 375F</button>");
		$("#commandDiv").append("<button id='btnPreHeat400'>Pre-heat to 400F</button>");
		$("#commandDiv").append("<button id='btnPreHeat425'>Pre-heat to 425F</button>");
		$("#commandDiv").append("<button id='btnPreHeat450'>Pre-heat to 450F</button>");
		$("#commandDiv").append("<button id='btnPreHeat500'>Pre-heat to 500F</button>");
	}
}

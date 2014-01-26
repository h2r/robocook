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
		this.GameObjects["ing1"] = gameObjects["ToolHands"];
		this.GameObjects["ing2"] = gameObjects["ToolKnife"];
		this.GameObjects["ing3"] = gameObjects["ToolPeeler"];
		this.GameObjects["ing4"] = gameObjects["ToolMasher"];
		
		//Load recipe
		for (var i=0; i<(recipeGnocchi.length/2); i++)
		{
			this.GameObjects[this.SlotsEnum[i+19]] = new gameObject(recipeGnocchi[i*2], recipeGnocchi[(i*2)+1], EnumGOType.Tool, recipeGnocchi[i*2]+".PNG");
		}
		
		//Info panel
		$("#stage").append("<div id='infoDiv'></div>");
		$("#infoDiv").css({
			"position":"absolute",
			"width":"768px",
			"height":"128px",
			"top":"0px",
			"left":"0px",
			"background-color":"red",
			"font-size":"8pt",
			"color":"black"
		})
		.append("ROBOCOOK<br/>Prototype v0.3<br />Recipe: Gnocchi");
		
		
		//Console panel
		$("#stage").append("<div id='consoleDiv'></div>");
		$("#" + matchConsole.DisplayDiv).css({
			"position":"absolute",
			"width":"384px",
			"height":"192px",
			"top":"64px",
			"left":"0px",
			"background-color":"black",
			"font-size":"8pt",
			"color":"green"
		});
		matchConsole.Display();
		
		//Command panel
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
		//Initialize groups, add tiles as sprites
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
			//.addGroup("selections", {width: 756, height: 512, posx: 0, posy: 0})
			//	.click(mouseTracker.RegisterClick);
			/*Clicky code
			$("#app1").click(function () { console.log("Match Scene -> App1 clicked."); 
				mouseTracker.RegisterClick("app1"); 
			});
			$("#app2").click(function () { console.log("Match Scene -> App2 clicked."); 
				mouseTracker.RegisterClick("app2");
			});
			$("#app3").click(function () { console.log("Match Scene -> App3 clicked.");
				mouseTracker.RegisterClick("app3");
			});
			$("#cont1").click(function () { console.log("Match Scene -> Cont1 clicked."); 
				mouseTracker.RegisterClick("cont1");
			});
			$("#cont2").click(function () { console.log("Match Scene -> Cont2 clicked."); 
				mouseTracker.RegisterClick("cont2");
			});
			$("#cont3").click(function () { console.log("Match Scene -> Cont3 clicked."); 
				mouseTracker.RegisterClick("cont3");
			});
			$("#cont4").click(function () { console.log("Match Scene -> Cont4 clicked.");
				mouseTracker.RegisterClick("cont4");
			});
			$("#cont5").click(function () { console.log("Match Scene -> Cont5 clicked.");
				mouseTracker.RegisterClick("cont5");
			});
			$("#cont6").click(function () { console.log("Match Scene -> Cont6 clicked.");
				mouseTracker.RegisterClick("cont6");
			});
			$("#cont7").click(function () { console.log("Match Scene -> Cont7 clicked.");
				mouseTracker.RegisterClick("cont7");
			});
			$("#cont8").click(function () { console.log("Match Scene -> Cont8 clicked.");
				mouseTracker.RegisterClick("cont8");
			});
			$("#cont9").click(function () { console.log("Match Scene -> Cont9 clicked.");
				mouseTracker.RegisterClick("cont9");
			});
			$("#cont10").click(function () { console.log("Match Scene -> Cont10 clicked.");
				mouseTracker.RegisterClick("cont10");
			});
			$("#cont11").click(function () { console.log("Match Scene -> Cont11 clicked.");
				mouseTracker.RegisterClick("cont11");
			});
			$("#cont12").click(function () { console.log("Match Scene -> Cont12 clicked.");
				mouseTracker.RegisterClick("cont12");
			});
			$("#ing1").click(function () { console.log("Match Scene -> Ing1 clicked.");
				mouseTracker.RegisterClick("ing1");
			});
			$("#ing2").click(function () { console.log("Match Scene -> Ing2 clicked.");
				mouseTracker.RegisterClick("ing2");
			});
			$("#ing3").click(function () { console.log("Match Scene -> Ing3 clicked.");
				mouseTracker.RegisterClick("ing3");
			});
			$("#ing4").click(function () { console.log("Match Scene -> Ing4 clicked.");
				mouseTracker.RegisterClick("ing4");
			});
			$("#ing5").click(function () { console.log("Match Scene -> Ing5 clicked.");
				mouseTracker.RegisterClick("ing5");
			});
			$("#ing6").click(function () { console.log("Match Scene -> Ing6 clicked.");
				mouseTracker.RegisterClick("ing6");
			});
			$("#ing7").click(function () { console.log("Match Scene -> Ing7 clicked.");
				mouseTracker.RegisterClick("ing7");
			});
			$("#ing8").click(function () { console.log("Match Scene -> Ing8 clicked.");
				mouseTracker.RegisterClick("ing8");
			});
			$("#ing9").click(function () { console.log("Match Scene -> Ing9 clicked.");
				mouseTracker.RegisterClick("ing9");
			});
			$("#ing10").click(function () { console.log("Match Scene -> Ing10 clicked.");
				mouseTracker.RegisterClick("ing10");
			});
			$("#ing11").click(function () { console.log("Match Scene -> Ing11 clicked.");
				mouseTracker.RegisterClick("ing11");
			});
			$("#ing12").click(function () { console.log("Match Scene -> Ing12 clicked.");
				mouseTracker.RegisterClick("ing12");
			});
			$("#ing13").click(function () { console.log("Match Scene -> Ing13 clicked.");
				mouseTracker.RegisterClick("ing13");
			});
			$("#ing14").click(function () { console.log("Match Scene -> Ing14 clicked.");
				mouseTracker.RegisterClick("ing14");
			});
			$("#ing15").click(function () { console.log("Match Scene -> Ing15 clicked.");
				mouseTracker.RegisterClick("ing15");
			});
			$("#ing16").click(function () { console.log("Match Scene -> Ing16 clicked.");
				mouseTracker.RegisterClick("ing16");
			});
			$("#ing17").click(function () { console.log("Match Scene -> Ing17 clicked.");
				mouseTracker.RegisterClick("ing17");
			});
			$("#ing18").click(function () { console.log("Match Scene -> Ing18 clicked.");
				mouseTracker.RegisterClick("ing18");
			});
			$("#ing19").click(function () { console.log("Match Scene -> Ing19 clicked.");
				mouseTracker.RegisterClick("ing19");
			});
			$("#ing20").click(function () { console.log("Match Scene -> Ing20 clicked.");
				mouseTracker.RegisterClick("ing20");
			});
			$("#ing21").click(function () { console.log("Match Scene -> Ing21 clicked.");
				mouseTracker.RegisterClick("ing21");
			});
			$("#ing22").click(function () { console.log("Match Scene -> Ing22 clicked.");
				mouseTracker.RegisterClick("ing22");
			});
			$("#ing23").click(function () { console.log("Match Scene -> Ing23 clicked.");
				mouseTracker.RegisterClick("ing23");
			});
			$("#ing24").click(function () { console.log("Match Scene -> Ing24 clicked.");
				mouseTracker.RegisterClick("ing24");
			});*/
				
				
			//Old Selector Code
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
				
		//Set selector click functions
		$("#app1sel").click(function () { console.log("Match Scene -> App1 clicked."); 
			tileSelector.AttemptSelect("app1"); 
		});
		$("#app2sel").click(function () { console.log("Match Scene -> App2 clicked."); 
			tileSelector.AttemptSelect("app2");
		});
		$("#app3sel").click(function () { console.log("Match Scene -> App3 clicked.");
			tileSelector.AttemptSelect("app3");
		});
		$("#cont1sel").click(function () { console.log("Match Scene -> Cont1 clicked."); 
			tileSelector.AttemptSelect("cont1");
		});
		$("#cont2sel").click(function () { console.log("Match Scene -> Cont2 clicked."); 
			tileSelector.AttemptSelect("cont2");
		});
		$("#cont3sel").click(function () { console.log("Match Scene -> Cont3 clicked."); 
			tileSelector.AttemptSelect("cont3");
		});
		$("#cont4sel").click(function () { console.log("Match Scene -> Cont4 clicked.");
			tileSelector.AttemptSelect("cont4");
		});
		$("#cont5sel").click(function () { console.log("Match Scene -> Cont5 clicked.");
			tileSelector.AttemptSelect("cont5");
		});
		$("#cont6sel").click(function () { console.log("Match Scene -> Cont6 clicked.");
			tileSelector.AttemptSelect("cont6");
		});
		$("#cont7sel").click(function () { console.log("Match Scene -> Cont7 clicked.");
			tileSelector.AttemptSelect("cont7");
		});
		$("#cont8sel").click(function () { console.log("Match Scene -> Cont8 clicked.");
			tileSelector.AttemptSelect("cont8");
		});
		$("#cont9sel").click(function () { console.log("Match Scene -> Cont9 clicked.");
			tileSelector.AttemptSelect("cont9");
		});
		$("#cont10sel").click(function () { console.log("Match Scene -> Cont10 clicked.");
			tileSelector.AttemptSelect("cont10");
		});
		$("#cont11sel").click(function () { console.log("Match Scene -> Cont11 clicked.");
			tileSelector.AttemptSelect("cont11");
		});
		$("#cont12sel").click(function () { console.log("Match Scene -> Cont12 clicked.");
			tileSelector.AttemptSelect("cont12");
		});
		$("#ing1sel").click(function () { console.log("Match Scene -> Ing1 clicked.");
			tileSelector.AttemptSelect("ing1");
		});
		$("#ing2sel").click(function () { console.log("Match Scene -> Ing2 clicked.");
			tileSelector.AttemptSelect("ing2");
		});
		$("#ing3sel").click(function () { console.log("Match Scene -> Ing3 clicked.");
			tileSelector.AttemptSelect("ing3");
		});
		$("#ing4sel").click(function () { console.log("Match Scene -> Ing4 clicked.");
			tileSelector.AttemptSelect("ing4");
		});
		$("#ing5sel").click(function () { console.log("Match Scene -> Ing5 clicked.");
			tileSelector.AttemptSelect("ing5");
		});
		$("#ing6sel").click(function () { console.log("Match Scene -> Ing6 clicked.");
			tileSelector.AttemptSelect("ing6");
		});
		$("#ing7sel").click(function () { console.log("Match Scene -> Ing7 clicked.");
			tileSelector.AttemptSelect("ing7");
		});
		$("#ing8sel").click(function () { console.log("Match Scene -> Ing8 clicked.");
			tileSelector.AttemptSelect("ing8");
		});
		$("#ing9sel").click(function () { console.log("Match Scene -> Ing9 clicked.");
			tileSelector.AttemptSelect("ing9");
		});
		$("#ing10sel").click(function () { console.log("Match Scene -> Ing10 clicked.");
			tileSelector.AttemptSelect("ing10");
		});
		$("#ing11sel").click(function () { console.log("Match Scene -> Ing11 clicked.");
			tileSelector.AttemptSelect("ing11");
		});
		$("#ing12sel").click(function () { console.log("Match Scene -> Ing12 clicked.");
			tileSelector.AttemptSelect("ing12");
		});
		$("#ing13sel").click(function () { console.log("Match Scene -> Ing13 clicked.");
			tileSelector.AttemptSelect("ing13");
		});
		$("#ing14sel").click(function () { console.log("Match Scene -> Ing14 clicked.");
			tileSelector.AttemptSelect("ing14");
		});
		$("#ing15sel").click(function () { console.log("Match Scene -> Ing15 clicked.");
			tileSelector.AttemptSelect("ing15");
		});
		$("#ing16sel").click(function () { console.log("Match Scene -> Ing16 clicked.");
			tileSelector.AttemptSelect("ing16");
		});
		$("#ing17sel").click(function () { console.log("Match Scene -> Ing17 clicked.");
			tileSelector.AttemptSelect("ing17");
		});
		$("#ing18sel").click(function () { console.log("Match Scene -> Ing18 clicked.");
			tileSelector.AttemptSelect("ing18");
		});
		$("#ing19sel").click(function () { console.log("Match Scene -> Ing19 clicked.");
			tileSelector.AttemptSelect("ing19");
		});
		$("#ing20sel").click(function () { console.log("Match Scene -> Ing20 clicked.");
			tileSelector.AttemptSelect("ing20");
		});
		$("#ing21sel").click(function () { console.log("Match Scene -> Ing21 clicked.");
			tileSelector.AttemptSelect("ing21");
		});
		$("#ing22sel").click(function () { console.log("Match Scene -> Ing22 clicked.");
			tileSelector.AttemptSelect("ing22");
		});
		$("#ing23sel").click(function () { console.log("Match Scene -> Ing23 clicked.");
			tileSelector.AttemptSelect("ing23");
		});
		$("#ing24sel").click(function () { console.log("Match Scene -> Ing24 clicked.");
			tileSelector.AttemptSelect("ing24");
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
	Clicks: [],
	Holding: null,
	
	RegisterClick: function() {
		
	},
	
	Update: function() {
		if (mouseTracker.holding === null) return;
	},
	
	Init: function() {
		//$.playground().registerCallback(mouseTracker.Update, 10); 
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
			matchConsole.Write("Player 1 deselected "+gameObj.Name+"...");
			this.TileSelected[tileName] = false;
			var index = this.Selections.indexOf(gameObj)
			this.Selections.splice(index, 1);
			$("#"+tileName+"sel").setAnimation();
		} else {
			//Check for selection max
			if (this.Selections.length === 1) {
				matchConsole.Write("You cannot have more than 1 object selected!");
				return false;
			}
			this.TileSelected[tileName] = true;
			matchConsole.Write("Player 1 selected "+gameObj.Name+"...");
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

var actionHandler = null;
var gameRecipe = null;
var gameIngList = null;
var gameTitle = null;
var winFlag = false;
var activeAction = 0;


var gameSceneMatch = {
	GameMode: 0,
		
	Init: function() {
		console.log("Match Scene -> Initializing.");
		
		//Connect to server
		//console.log("Attempting to connect to server.");
		//var lMyServerURL = "ws://elzar.cs.brown.edu:8787";
		//$.jws.open(lMyServerURL);
		
		//Load kitchen
		inventoryGrid.Init();
		matchConsole.Init();
		
		var j=0;
		//Initialize groups, add tiles as sprite
		$.playground()
			.pauseGame().clearScenegraph().startGame()
			.addGroup("background", {width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.addSprite("background", {animation: gameAnimations.background1, width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.end()
			.addGroup("appliances", {width: 384, height: 128, posx: 0, posy: 192}).end()
			.addGroup("containers", {width: 768, height: 128, posx: 0, posy: 320}).end()
			.addGroup("ingredients", {width: 768, height: 128, posx: gamePos.MatchDivIngsX, posy: gamePos.MatchDivIngsY}).end()
			.addGroup("holding", {width: 756, height: 512, posx: 0, posy: 0})
				.addSprite("app1Box",{width: 64, height: 64, posx: 32, posy: 288-64})
				.addSprite("app2Box",{width: 64, height: 64, posx: 160, posy: 288-64})
				.addSprite("app3Box",{width: 64, height: 64, posx: 288, posy: 288-64})
				.addSprite("holdingBox",{width: 64, height: 64, posx: 0, posy: 0})
				.end()
			.addGroup("selectionDiv", {width: 756, height: 512, posx: 0, posy: 0})
				.mousemove(mouseTracker.RecordMousePos)
				//.click(mouseTracker.RegisterClick)
				.mousedown(mouseTracker.RegisterDown)
				.mouseup(mouseTracker.RegisterUp)
				.end()
			.addGroup("recipeBackground", {width: 384, height: 192, posx: 384, posy: 0})
				.css({"background-image":"url('./Sprites/RecipeDivBG.PNG')", "overflow":"visible"})
				.addGroup("recipeDiv", {width: 374, height: 186, posx: 10, posy: 6})
					.css({"font-size":"10pt", "color":"black", "overflow":"auto"})
					.end().end()
			.addGroup("consoleBackground", {width: 384, height: 192, posx: 0, posy: 0})
				.css({"background-image":"url('./Sprites/TerminalDivBG.PNG')", "overflow":"visible"})
				.addGroup(matchConsole.DisplayDiv, {width: 374, height: 186, posx: 10, posy: 6})
					.css({"font-size":"10pt", "color":"green", "overflow":"auto"})
					//.append("Test")
					.end().end()
			.addGroup(actionBar.DisplayDiv,{width: 768, height: 64, posx: 0, posy: 448})
				.css({"font-size":"8pt", "color":"yellow", "overflow":"auto"})
				.addSprite("act1", {animation: gameAnimations.actLook, width: 64, height: 64, posx: 0})
				.addSprite("act2", {animation: gameAnimations.actTurnOnOff, width: 64, height: 64, posx: 64})
				.addSprite("act3", {animation: gameAnimations.actMix, width: 64, height: 64, posx: 128})
				.addSprite("act4", {animation: gameAnimations.actCut, width: 64, height: 64, posx: 192})
				.addSprite("act5", {animation: gameAnimations.actShape, width: 64, height: 64, posx: 256})
				.addSprite("act6", {animation: gameAnimations.actPeel, width: 64, height: 64, posx: 320})
				//.addSprite("act7", {animation: gameAnimations.actPeel, width: 64, height: 64, posx: 384})
				.addSprite("actSelector", {animation: gameAnimations.overSelectionP1, width: 64, height: 64, posx: 0})
				.append("<button id='matchResetBtn' type='button'>Reset</button>")
				.end()
			.addGroup(actionText.DisplayDiv, {width: 256, height: 64, posx: 448, posy: 448})
				.end();

		//Initialize action bars
		actionBar.Init([
			EnumActions.Look,
			EnumActions.TurnOnOff,
			EnumActions.Mix,
			//EnumActions.Spread,
			EnumActions.Cut,
			EnumActions.Shape,
			EnumActions.Peel,
		]);
		actionText.Init();
		activeAction = EnumActions.Look;
				
		//Configure reset button
		$("#matchResetBtn").css({
			"position":"absolute",
			"top":16,
			"left":708})
			.click(function(event) {
				event.preventDefault();
				//console.log("Match Scene -> Reset button clicked!");
				RegisterCommand(gameConfig.SceneMatchName, EnumGameCommands.MatchReset);
			});		
		
		//Init console
		matchConsole.Display();
		
		//Init mouse tracker
		mouseTracker.Init();
		
		//Init recipe display
		//$("#recipeDiv").append("<u>"+gameRecipe[0]+"</u>");
		//$("#recipeDiv").append("<ol>");
		//for (var i=1; i<gameRecipe.length; i++) {
		//		$("#recipeDiv").append("<li id='rlist"+(i-1)+"'>"+gameRecipe[i]+"</li>");
		//}
		//$("#recipeDiv").append("</ol>");
		
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

	Grid: {
	},

	ObjectsToIgnore: [
		"counter","shelf"
	],

	InfiniteIngredients: [
	],
	
	GameObjects: {},
	GameObjectCount: 0,
	SlotsPerRow: gameConfig.StageWidth / 64,
	
	GetSlot: function(gx, gy) {
		var width = inventoryGrid.SlotsPerRow;
		var rows = Math.floor(gy / 64);
		var columns = Math.floor(gx / 64);
		return rows * width + columns;
	},

	GetApplianceSlot: function(applianceX, applianceY, x ,y) {
		var width = 2;
		x -= applianceX;
		y -= applianceY;
		var rows = Math.floor(x / 64);
		var columns = Math.floor(y / 64);
		return rows * width + columns;
	},
	
	ChangeSlotAnim: function(slot, anim) {
		$("#"+slot.toString()).setAnimation(anim);
	},
	
	ClearAnimation: function(slot) {
		var poundSlot = "#" + slot.toString();
		$(poundSlot).setAnimation();
	},

	ClearSlotAnimation: function(slot) {
		$("#"+slot.toString()).setAnimation();
	},

	ClearSlotAnimations: function() {
		for (var slot in inventoryGrid.GameObjects) {

			var object = inventoryGrid.GameObjects[slot];
			if (object instanceof gameAppliance) {

			}
			inventoryGrid.ClearSlotAnimation(slot);
		}
		inventoryGrid.GameObjects = {};
	},

	LoadStateFromMsg: function(stateMsg)
	{
		inventoryGrid.ClearSlotAnimations();
		var objects= stateMsg.data;
		var startSlot = inventoryGrid.GetSlot($("#appliances").x(), $("#appliances").y())
		var appliances = this.GetObjectsOfClassFromMsg(objects, "space");
		inventoryGrid.LoadAppliancesFromMsg(startSlot, appliances);

		startSlot = inventoryGrid.GetSlot($("#containers").x(), $("#containers").y())
		var containers = this.GetObjectsOfClassFromMsg(objects, "container");
		var ingredients = this.GetObjectsOfClassFromMsg(objects, "simple_ingredient");
		var workingContainers = [];
		var ingredientContainers = [];

		// load worknig containers
		this.SeparateContainers(containers, ingredients, ingredientContainers, workingContainers);
		inventoryGrid.LoadContainersFromMsg(startSlot, workingContainers);

		// load ingredient containers
		startSlot = inventoryGrid.GetSlot($("#ingredients").x(), $("#ingredients").y())
		inventoryGrid.LoadIngredientContainersFromMsg(startSlot, ingredientContainers);
		//inventoryGrid.LoadIngredientsFromMsg(startSlot, ingredientContainers);

		inventoryGrid.UpdateAnimations();
	},

	LoadAppliancesFromMsg: function(startSlot, appliances)
	{
		for (var i=0; i < appliances.length; i++) {
			var appliance = appliances[i];
			var applianceObj = inventoryGrid.GetNewApplianceFromMsg(appliance);
			inventoryGrid.InsertObject(startSlot + i * 2, applianceObj);
		}
	},


	LoadContainersFromMsg: function(startSlot, containers)
	{
		for (var i = 0; i < containers.length; i++) {
			var container = containers[i];
			var containerObj = inventoryGrid.GetNewContainerFromMsg(container);
			containerObj.Contains = container.contains;
			inventoryGrid.InsertObject(startSlot + i, containerObj);
		}
	},

	LoadIngredientContainersFromMsg: function(startSlot, ingredientContainers) {
		for (var i = 0; i < ingredientContainers.length; i++) {
			var container = ingredientContainers[i];
			var ingredient = "";
			if (container.contains.length > 0) {
				ingredient = container.contains[0];
			}
			var containerObj = inventoryGrid.GetNewIngredientContainerFromMsg(container, ingredient);
			inventoryGrid.InsertObject(startSlot + i, containerObj);
		}
	},

	LoadIngredientsFromMsg: function(startSlot, ingredients)
	{
		for (var i = 0; i < ingredients.length; i++) {
			var ingredient = ingredients[i];
			var ingredientObj = inventoryGrid.GetNewIngredientFromMsg(ingredient);
			inventoryGrid.InsertObject(startSlot + i, ingredientObj);
		}
	},

	InsertObject: function(slot, object)
	{
		inventoryGrid.GameObjects[slot] = object;
		inventoryGrid.GameObjectCount++;
	},

	SeparateContainers: function(containers, ingredients, ingredientContainers, workingContainers) {
		var ingredientNames = inventoryGrid.GetIngredientNames(ingredients);
		for (var i = 0; i < containers.length; i++) {
			var containerName = containers[i].name;
			var index = containerName.indexOf("_bowl");
			if (index > -1) {
				var strippedName = containerName.substring(0, index);
				if (strippedName in ingredientNames) {
					ingredientContainers.push(containers[i]);
				}
				else {
					workingContainers.push(containers[i]);
				}
			}
			else {
				workingContainers.push(containers[i]);
			}
		}

	},

	GetIngredientNames: function(ingredients) {
		var ingredientNames = {};
		for (var i = 0; i < ingredients.length; i++) {
			ingredientNames[ingredients[i].name] = ingredients[i].name;
		}
		return ingredientNames;
	},

	GetObjectsOfClassFromMsg: function(objects, classStr)
	{
		var classObjects = [];
		for (var i = 0; i < objects.length; i++){
			var object = objects[i];
			if (object.class == classStr)
			{
				if ($.inArray(object.name, inventoryGrid.ObjectsToIgnore) == -1) {
					classObjects.push(object);
				}
			}
		}
		return classObjects;
	},

	GetNewApplianceFromMsg: function(appliance)
	{
		var name = appliance.name;
		var id = appliance.name;
		var sprite = name + ".PNG";
		var containers = appliance.contains
		return new gameAppliance(id, name, sprite, containers);
	},

	GetNewContainerFromMsg: function(container)
	{
		var name = container.name;
		var id = container.name;
		var sprite = name + ".PNG";
		return new gameContainer(id, name, sprite);
	},

	GetNewIngredientContainerFromMsg: function(container, ingredient) {
		var name = container.name;
		var id = container.name;
		var sprite = name + ".PNG";
		return new gameIngredientContainer(name, id, sprite, ingredient);
	},

	GetNewIngredientFromMsg: function(ingredient)
	{
		var name = ingredient.name;
		var id = ingredient.name;
		var sprite = name + ".PNG";
		var isInfinite = ($.inArray(name, inventoryGrid.InfiniteIngredients) > -1);
		return new gameIngredient(id, name, sprite, isInfinite);
	},

	UpdateAnimations: function()
	{
		var applianceX = 0;
		var applianceY = 0;
		var containerX = 0;
		var containerY = 0;
		var ingredientX = 0;
		var ingredientY = 0;

		ingredients = {};
		containers = {};
		appliances = {};
		inventoryGrid.DivideObjects(inventoryGrid.GameObjects, ingredients, containers, appliances);
		for (var slot in appliances)
		{
			var object = appliances[slot];
			inventoryGrid.UpdateAnimation("appliances", object, slot, 128, 128, applianceX, applianceY);

			var applianceGroup = inventoryGrid.GetApplianceGroup("appliances", object, applianceX, applianceY);
			var x = 0;
			var y = 0;
			for (var key in object.Contains) {
				var container = object.Contains[key];
				var containerObject = undefined;
				for (var cSlot in containers) {
					if (containers[cSlot].Name == container) {
						containerObject = containers[cSlot];
						delete containers[cSlot];
				
					}
				}
				//var containerObject = containers[container];
				inventoryGrid.UpdateApplianceContainerAnimation(applianceGroup, containerObject, key);
				x += 64;
				if (x >64) {
					x = 0;
					y += 64;
				}
			}
			
			applianceX += 128;
		}
		for (var slot in containers) {
			var object = containers[slot];
			inventoryGrid.UpdateAnimation("containers", object, slot, 64, 64, containerX, containerY);
			containerX += 64;
			if (containerX > 64*11 ) {
				containerX = 0;
				containerY += 64;
			}
		}
		for (var slot in ingredients) {
			var object = ingredients[slot];
			if (object.Contains.length > 0) {
				inventoryGrid.UpdateAnimation("ingredients", object, slot, 64, 64, ingredientX, ingredientY);
			}
			else {
				inventoryGrid.ClearAnimation(key);
			}
			ingredientX += 64;
			if (ingredientX > 64*11 ) {
				ingredientX = 0;
				ingredientY += 64;
			}
		}
	
		$.gameQuery.resourceManager.refresh();
	},

	DivideObjects: function(objects, ingredients, containers, appliances) {
		for (var key in inventoryGrid.GameObjects) {
			var object = inventoryGrid.GameObjects[key];
			if (object instanceof gameAppliance) {
				appliances[key] = object;
			}
			else if (object instanceof gameContainer) {
				containers[key] = object;
			}
			else if (object instanceof gameIngredientContainer) {
				ingredients[key] = object;
			}
		}
	},

	GetApplianceGroup: function(group, object, x, y) {
		var objectName = object.Name;
		var poundName = "#" + objectName;
		if ($(poundName).length ==  0) {
			$("#" + group).addGroup(objectName, {width: 128, height: 128,posx: x, posy: y}).end();
		}
		return objectName;
	},

	UpdateAnimation: function(group, object, slot, width, height, x, y)
	{
		var groupObj = $("#" + group);
		var groupX = groupObj.x();
		var groupY = groupObj.y();
		//var slot = inventoryGrid.GetSlot(x + groupX, y + groupY);
		var poundSlot = "#" + slot.toString();
		var sprite = $(poundSlot);
		var anim = object.Anim;
		
		inventoryGrid.UpdateAnimationSlot(group, anim, sprite, slot, groupX, groupY, x, y, width, height);
	},

	UpdateApplianceContainerAnimation: function(group, object, slot) {
		var applianceGroupObj = $("#appliances");
		var groupX = applianceGroupObj.x();
		var groupY = applianceGroupObj.y();
		var applianceObj = $("#" + group);
		groupX += applianceObj.x();
		groupY += applianceObj.y();
		var x = 64 * (slot % 2);
		var y = 64 * Math.floor(slot / 2);

		//var slot = inventoryGrid.GetSlot(x, y);
		var poundSlot = "#" + group + slot.toString();
		var sprite = $(poundSlot);
		var anim = object.Anim;

		inventoryGrid.UpdateAnimationSlot(group, anim, sprite, slot, groupX, groupY, x, y, 64, 64 );
	},

	UpdateAnimationSlot: function(group, animation, sprite, slot, groupX, groupY, x, y, width, height) {
		if (sprite.length == 0) {
			$("#" + group).addSprite(slot.toString(), {animation: animation, width: width, height: height, posx: x, posy: y});
			inventoryGrid.UpdateGrid(name, -1, -1, x+groupX, y+groupY, width, height);
		}
		else
		{
			var oldX = sprite.x();
			var oldY = sprite.y();
			sprite.x(x);
			sprite.y(y);
			inventoryGrid.ChangeSlotAnim(slot, animation);
			inventoryGrid.UpdateGrid(slot.toString(), oldX + groupX, oldY+groupY, x+groupX, y+groupY, width, height);
		}
	},

	UpdateApplianceAnimation: function(appliance) {


		for (var i = 0; i < 4; i++) {
			var obj = appliance.GetObject(i);
			if (typeof obj != 'undefined') {
				var oldX = sprite.x();
				var oldY = sprite.y();
				sprite.x(x);
				sprite.y(y);
				inventoryGrid.UpdateGrid(slot.toString(), oldX + groupX, oldY+groupY, x+groupX, y+groupY, width, height);
			}
		}
	},

	UpdateGrid: function(name, oldX, oldY, x, y, width, height) {
		//Checking if this needs to clear it's old position
		if (oldX > -1 && oldY > -1) {
			//Iterate over grid with tiles 64x64
			for (var i = oldX; i < oldX + width; i+= 64) {
				if (i in inventoryGrid.Grid) {
					for (var j = oldY; j < oldY + height; j += 64) {
						//If the name in this spot is actually the object's name, clean it up
						if (j in inventoryGrid.Grid[i] && inventoryGrid.Grid[i][j] == name) {
							inventoryGrid.Grid[i][j] = "";
						}
					}
				}
			}
		}
		//Iterate over grid
		for (var i = x; i < x + width; i+= 64) {
			// Do we need to add a new row to the map?
			if (!(i in inventoryGrid.Grid)) {
				inventoryGrid.Grid[i] = {};
			}
			// Add the name to all the spots in this map
			for (var j = y; j < y + height; j += 64) {
				inventoryGrid.Grid[i][j] = name;
			}
		}

	},

	updateRecipe: function(recipe) {
		$("#recipeDiv").html("");
		$("#recipeDiv").append("<u>"+recipe[0]+"</u>");
		$("#recipeDiv").append("<ol>");
		for (var i=1; i<recipe.length; i++) {
				$("#recipeDiv").append("<li id='rlist"+(i-1)+"'>"+recipe[i]+"</li>");
		}
		$("#recipeDiv").append("</ol>");
	},

	CleanName: function (name) {
		return name.replace(/\s+/g, '_');
	},

	onOpen: function() {

	},
	// WebSocket handler interface methods
	onMessage: function(msg) {
		matchConsole.Write(msg.update);
		if ('recipe' in msg) {
			this.updateRecipe(msg.recipe);
		}

		this.LoadStateFromMsg(msg.state);
		winFlag = msg.success;
	},

	onClose: function() {

	},

	onError: function(err) {

	},




	
	Init: function(state) {

		//inventoryGrid.Clear();	
		//inventoryGrid.LoadStateFromMsg(state);	
		
		//Initialize
		//for (var i=0; i<inventoryGrid.SlotsEnum.length; i++) { 
		//	inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[i]] = gameObjects["Empty"];
		//}
		
		//Load defaults
		/*
		inventoryGrid.GameObjects["app1"] = gameObjects["AppMicrowave"];
		inventoryGrid.GameObjects["app2"] = gameObjects["AppStoveTop"];
		inventoryGrid.GameObjects["app3"] = gameObjects["AppOven"];
		inventoryGrid.GameObjects["cont1"] = gameObjects["ContBowlLarge"];
		inventoryGrid.GameObjects["cont2"] = gameObjects["ContPotLarge"];
		inventoryGrid.GameObjects["cont3"] = gameObjects["ContCuttingBoard"];
		inventoryGrid.GameObjects["cont4"] = gameObjects["ContBakingDish"];
		inventoryGrid.GameObjects["cont5"] = gameObjects["ContSaucepanLarge"];
		*/
		//Empty gameobjects
		$.each(gameObjects, function(key, value) {
			if (value.Contains) {
				value.Contains.length = 0;
			}
		});
		
		/*
		//Load recipe
		for (var i=0; i<(gameIngList.length/3); i++) {
			inventoryGrid.GameObjects[inventoryGrid.SlotsEnum[i+15]] = new gameIngredient(gameIngList[i*3], gameIngList[(i*3)+1], gameIngList[i*3]+".PNG", gameIngList[(i*3)+2]);
		}
		*/
	},


	
	IsSlotEmpty: function(slot) {
		if (slot > 0) {
			var obj = inventoryGrid.GameObjects[slot];
			if (typeof obj == 'undefined' && !inventoryGrid.IsSlotApp(slot)) {
				return true;
			}
			return false;
		}
		return true;
	},
	
	IsSlotApp: function(slot) {
		return (typeof inventoryGrid.GetApplianceFromSlot(slot) != 'undefined');
	},

	GetApplianceFromSlot: function(slot) {
		var obj = inventoryGrid.GameObjects[slot];
		if (typeof obj == 'undefined') {
			obj = inventoryGrid.GameObjects[slot - 1];
		}
		var width = inventoryGrid.SlotsPerRow;
		if (typeof obj == 'undefined') {
			obj = inventoryGrid.GameObjects[slot - width];	
		}
		if (typeof obj == 'undefined') {
			obj = inventoryGrid.GameObjects[slot - (width + 1)];	
		}
		if (obj instanceof gameAppliance) {
			return obj;
		}
		return undefined;
	},

	GetSlotInAppliance: function(slot) {
		var obj = inventoryGrid.GameObjects[slot];
		if (obj instanceof gameAppliance) {
			return 0;
		}
		obj = inventoryGrid.GameObjects[slot - 1];
		if (obj instanceof gameAppliance) {
			return 1;
		}
		var width = inventoryGrid.SlotsPerRow;
		obj = inventoryGrid.GameObjects[slot - width];	
		if (obj instanceof gameAppliance) {
			return 2;
		}
		obj = inventoryGrid.GameObjects[slot - width - 1];	
		if (obj instanceof gameAppliance) {
			return 3;
		}
		return -1;	
	},

	GetObjFromSlot: function(slot) {
		var obj = inventoryGrid.GameObjects[slot];
		if (typeof obj == 'undefined') {
			obj = inventoryGrid.GetApplianceFromSlot(slot);
		}
		return obj;
	},
	
	FetchObj: function(slot) {
		if (inventoryGrid.IsSlotApp(slot)) {
			var appliance = inventoryGrid.GetApplianceFromSlot(slot);
			var applianceSlot = inventoryGrid.GetSlotInAppliance(slot);
			if (!appliance.IsEmpty(applianceSlot)) {
				appliance.GetObject(applianceSlot);
				var obj = appliance.GetObject(applianceSlot);
				//inventoryGrid.ClearSlotAnim(slot + "Box");
				return obj;
				//matchConsole.Write("Player 1 took the " + obj.Name + " off of the " + inventoryGrid.GameObjects[slot].Name);
			}
			else {
				return appliance;
			}
		}
		else {
			var obj = inventoryGrid.GameObjects[slot];
			//delete inventoryGrid.GameObjects[slot];
			//$("#"+slot).setAnimation();
			return obj;
		}
		return undefined;
	},
	
	PlaceObj: function(obj, slot) {
		if (slot < 0) throw "Attempted to place in non slot!";
		//Place in non empty slot
		if (!inventoryGrid.IsSlotEmpty(slot)) { 
			var gobj = inventoryGrid.FetchObj(slot);
			var origin = inventoryGrid.GetSlot(mouseTracker.DownX, mouseTracker.DownY);
			obj.ActOn(gobj, slot, origin);
		} else {
			console.log(slot);
			//if ((slot.charAt(0) === "c" ) === (obj.Type === EnumGOType.Ing)) {
			//	throw "Placing object in mismatched slot!";
			//} else {
			inventoryGrid.GameObjects[slot] = obj;
			$("#"+slot).setAnimation(obj.Anim);

			var action = inventoryGrid.GetMoveAction(obj, slot);

			//gameConnect.ReportCmdSucc(obj.ID, slot, action, "");
			//}
		}
	},

	GetMoveAction: function(object, target) {
		if (object instanceof gameIngredientContainer) {
			if (target instanceof gameIngredient) {
				return "";
			}
			else if (target instanceof gameContainer) {
				return "pour";
			}
			else if (target instanceof gameIngredientContainer) {
				return "pour";
			}
			else {
				return "";
			}
		}
		else if (object instanceof gameContainer) {
			if (target instanceof gameIngredient) {
				return "";
			}
			else if (target instanceof gameContainer) {
				return "pour";
			}
			else if (target instanceof gameIngredientContainer) {
				return "pour";
			}
			else {
				return "move";
			}
		}
		return "";
	},
	
	//Gets the description of the gameObject in slot
	GetObjDesc: function(slot) {
		var obj = inventoryGrid.GetObjFromSlot(slot);
		return (inventoryGrid.IsSlotEmpty(slot)) ? false : obj.Desc();
	},
	GetObjType: function(slot) {
		var obj = inventoryGrid.GetObjFromSlot(slot);		
		return (inventoryGrid.IsSlotEmpty(slot)) ? false : obj.Type;
	},
	GetObjName: function(slot) {
		var obj = inventoryGrid.GetObjFromSlot(slot);
		return (inventoryGrid.IsSlotEmpty(slot)) ? false : obj.Name;
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
		/*console.log("Click at " + mouseTracker.X + " " + mouseTracker.Y);
		if (mouseTracker.Clicked) {
			mouseTracker.Clicked = false;
			mouseTracker.DoubleClick(mouseTracker.GridX, mouseTracker.GridY);
		} else {
			mouseTracker.ClickTicks = 0;
			mouseTracker.Clicked = true;
		}
		console.log("Grid coords: " + mouseTracker.GridX + "x" + mouseTracker.GridY);*/
		mouseTracker.Down = false;
		mouseTracker.SingleClick(mouseTracker.GridX, mouseTracker.GridY);
	},
	
	RegisterDown: function() {
		//console.log("Mouse down!");		
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
		mouseTracker.GridX = mouseTracker.X //>>> 6;
		mouseTracker.GridY = mouseTracker.Y //>>> 6;
	},
	
	Update: function() {	
		//Mouse over tracking
		actionText.Clear();
		if (!mouseTracker.Down && !mouseTracker.Dragging) {
			try  {
				if (!inventoryGrid.IsSlotEmpty(inventoryGrid.GetSlot(mouseTracker.GridX, mouseTracker.GridY))) {
					text = EnumActions.ToString(activeAction);
					text += " ";
					var slot = inventoryGrid.GetSlot(mouseTracker.GridX, mouseTracker.GridY);
					text += inventoryGrid.GetObjName(slot);
					actionText.WriteTo(text);
				}
			} catch (error) {
				//console.log(error);
			}
		}
		
		//Drag tracking
		if (mouseTracker.Down && !mouseTracker.Dragging) { mouseTracker.DragTicks++;
			if (mouseTracker.DragTicks >= 6) {
				mouseTracker.DragTicks = 0;
				mouseTracker.MouseDrag();
			}
		}
		/*
		//Click tracking
		if (mouseTracker.Clicked) {mouseTracker.ClickTicks++;
			console.log("" + mouseTracker.ClickTicks);
			if (mouseTracker.ClickTicks >= 6) {
				mouseTracker.ClickTicks = 0;
				mouseTracker.Clicked = false;
				mouseTracker.SingleClick(mouseTracker.GridX, mouseTracker.GridY);
			}
		}*/
		
		//Update holding box position
		var mouseX = mouseTracker.X - 32;
		var mouseY = mouseTracker.Y - 32;
		$("#holdingBox").x(mouseX).y(mouseY);
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
		var slot = inventoryGrid.GetSlot(mouseTracker.GridX, mouseTracker.GridY);
		inventoryGrid.PlaceObj(mouseTracker.Holding, slot);
		//var slot = inventoryGrid.GetSlot(mouseTracker.DownX, mouseTracker.DownY);
		//inventoryGrid.PlaceObj(mouseTracker.Holding, slot);
		
		mouseTracker.Dragging = false;
		mouseTracker.Holding = null;
		$("#holdingBox").setAnimation();
	},
	
	//Mouse actions
	SingleClick: function(gx, gy) {
		var slot = inventoryGrid.GetSlot(gx, gy);
		if (activeAction === EnumActions.Look) {
			var desc = inventoryGrid.GetObjDesc(slot);
			if (desc) matchConsole.Write(desc);
		} else {
			if (slot != "") {
				var obj = inventoryGrid.GameObjects[slot];
				RegisterCommand(obj, activeAction, slot);
			}
			//actionHandler.HandleAction(obj, slot, activeAction);
		}
	},
	
	/*
	//Deprecated
	DoubleClick: function(gx, gy) {
		var slot = inventoryGrid.GetSlot(gx, gy);
		var obj = inventoryGrid.GameObjects[slot];
		actionHandler.HandleAction(obj, slot);
	},*/
	
	MouseDrag: function() {
		var slot = inventoryGrid.GetSlot(mouseTracker.DownX, mouseTracker.DownY);
		if (slot != "") {
			var gotype = inventoryGrid.GetObjType(slot);
			if (inventoryGrid.GameObjects[slot].IsMovable) {
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
	Lines: [],
	
	Init: function() {
		matchConsole.Lines = [
			"Welcome to ROBOCOOK!", 
			"-", 
			"-", 
			"-", 
			"-",
			"-",
			"-",
			"-",
			"-",
		];
	},
	
	Peek: function() {
		return this.Lines[this.Lines.length-1];
	},
	
	Write: function(line) {
		//this.Lines.shift();
		this.Lines.push(line);
		this.Display();
	},
	
	//Auto scroll down
	Display: function() {
		/*$("#"+this.DisplayDiv).empty();
		$("#"+this.DisplayDiv).append("<br/>");
		for (var i=0; i<this.Lines.length; i++) {
			$("#"+this.DisplayDiv).append(this.Lines[i] + "<br/>");
		}*/
		$("#"+this.DisplayDiv).append(this.Lines[this.Lines.length-1] + "<br/>")
			.scrollTop($("#"+this.DisplayDiv)[0].scrollHeight);
	}
};

//////////////
//Action Bar//
//////////////

var EnumActions = {
	Look: 70,
	Use: 71,
	Mix: 72,
	Spread: 73,
	TurnOnOff: 74,
	Peel: 75,
	Shape: 76,
	Cut: 77,
	
	ToString: function(cmd) {
		switch(cmd) {
			case EnumActions.Look:
				return "Look At";
				break;
			case EnumActions.Use:
				return "use";
				break;
			case EnumActions.Mix:
				return "mix";
				break;
			case EnumActions.Spread:
				return "spread";
				break;
			case EnumActions.TurnOnOff:
				return "switch";
				break;
			case EnumActions.Peel:
				return "peel";
				break;
			case EnumActions.Shape:
				return "shape";
				break;
			case EnumActions.Cut:
				return "caseut";
				break;
		}
		return "";
	},
	
	IsAction: function(cmd) {
		switch(cmd) {
			case EnumActions.Look:
				return true;
				break;
			case EnumActions.Use:
				return true;
				break;
			case EnumActions.Mix:
				return true;
				break;
			case EnumActions.Spread:
				return true;
				break;
			case EnumActions.TurnOnOff:
				return true;
				break;
			case EnumActions.Peel:
				return true;
				break;
			case EnumActions.Shape:
				return true;
				break;
			case EnumActions.Cut:
				return true;
				break;
		}
		return false;
	}
};

var actionBar = {
	DisplayDiv: "actionDiv",
	Actions: [],
	
	Init: function(actions) {
		actionBar.Actions = actions;
		//Reset selector
		activeAction = actionBar.Actions[0];
		$("#actSelector").x(0);
		
		$("#act1").click(function(event) 
		{
			activeAction = actionBar.Actions[0];
			$("#actSelector").x(0);
		});
		$("#act2").click(function(event) 
		{
			activeAction = actionBar.Actions[1];
			$("#actSelector").x(64);
		});
		$("#act3").click(function(event) 
		{
			activeAction = actionBar.Actions[2];
			$("#actSelector").x(128);
		});
		$("#act4").click(function(event) 
		{
			activeAction = actionBar.Actions[3];
			$("#actSelector").x(192);
		});
		$("#act5").click(function(event) 
		{
			activeAction = actionBar.Actions[4];
			$("#actSelector").x(256);
		});
		$("#act6").click(function(event) 
		{
			activeAction = actionBar.Actions[5];
			$("#actSelector").x(320);
		});
		/*$("#act7").click(function(event) 
		{
			activeAction = actionBar.Actions[6];
			$("#actSelector").x(384);
		});*/
	}
};

var actionText = {
	DisplayDiv: "actionTextDiv",
	
	Init: function() {
		$("#"+actionText.DisplayDiv)
			.css({
				"font-size":"10pt", 
				"color":"black", 
				"overflow":"auto",
				"vertical-align":"middle"
				});
	},
	
	WriteTo: function(text) {
		$("#"+actionText.DisplayDiv)
			.append(""+text);
	},
	
	Clear: function() {
		$("#"+actionText.DisplayDiv).empty();
	}
};
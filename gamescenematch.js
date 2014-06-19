var gameRecipe = null;
var gameIngList = null;
var gameTitle = null;
var winFlag = false;
var activeAction = 0;


var GameSceneMatch = function(actionHandler, grid){
	"use strict";
	if (GameSceneMatch.prototype._gameSceneMatch) {
        return GameSceneMatch.prototype._gameSceneMatch;
    }
    GameSceneMatch.prototype._gameSceneMatch = this;
    
    var handler = actionHandler;
	var inventoryGrid = grid;
	var gamePainter = new GamePainter();
	var mouseTracker = new MouseTracker();
	var recipe = new Recipe();
	var gameConnect = new GameConnect();
	var matchConsole = new MatchConsole();

	this.GameMode = 0;
	var actionBar = new ActionBar([
			EnumActions.Look,
			EnumActions.TurnOnOff,
			EnumActions.Mix,
			EnumActions.Peel
			//EnumActions.Spread,
			//EnumActions.Cut,
			//EnumActions.Shape,
		], mouseTracker);
	this.Init = function() {
		console.log("Match Scene -> Initializing.");
		
		//Load kitchen
		inventoryGrid.Init();
		inventoryGrid.addOnActionCallback(this);
		
		//Initialize groups, add tiles as sprite
		actionText.Init();
		
		gamePainter.init(mouseTracker);

		//Init mouse tracker
		mouseTracker.addOnMouseClick(inventoryGrid);
		mouseTracker.addOnMouseDown(inventoryGrid);
		mouseTracker.addOnMouseUp(inventoryGrid);
		mouseTracker.addOnMouseDrag(inventoryGrid);
		mouseTracker.addOnMouseDown(actionBar);

		
		var newPainters = this.GetPainters();
		gamePainter.addPainters(newPainters);

	    gameConnect.AddCallback(this);
	    gameConnect.Open();
	};
	
	this.Intro = function () {
		console.log("Match Scene -> Transitioning out of intro to active.");
		CurrentGameState = EnumGameState.MatchActive;
	};
	
	this.Active = function () {
		//console.log("Match Scene -> Entering active state.");
		if (!winFlag) {
			handler.UpdateAppliances();
		} else {
			$.playground()
				.addGroup("endgame", {width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.addSprite("victory", {animation: gameAnimations.victoryScreen, width: gameConfig.StageWidth, height: gameConfig.StageHeight})
				.end();
		}
		
	};

	this.onOpen = function() {
		var msg = {
                msgtype: "init",
                mode: "singleplayer"
            };
        gameConnect.Send(msg);
	};
	// WebSocket handler interface methods
	this.onMessage = function(msg) {
		if ('state' in msg) {
			inventoryGrid.onMessage(msg);
		}
		if ('recipe' in msg) {
			recipe.onMessage(msg);
		}
		if ('update' in msg) {
			matchConsole.Write(msg.update);
		}
		drawScreen();
	};

	this.onClose = function() {

	};

	this.onError = function(err) {

	};

	this.onAction = function(event) {
		gameConnect.ReportCmdSucc(event.ID, event.targetID, event.action, event.message);
	};
	
	this.Trans = function() {
		throw ("Not yet implemented!");
	};

	var drawScreen = function() {
		gamePainter.draw();
		$.gameQuery.resourceManager.refresh();
	};

	this.GetPainters = function() {
		var painters = [];
		var painters = inventoryGrid.GetPainters();
		painters.push(recipe.getPainter());
		painters.push(matchConsole.GetPainter());
		return painters;
	};
}

//////////////////
//Inventory Grid//
//////////////////
var InventoryGrid = function(matchCon) {
	"use strict";
	if (InventoryGrid.prototype._inventoryGrid) {
        return InventoryGrid.prototype._inventoryGrid;
    }
    InventoryGrid.prototype._inventoryGrid = this;

	var ObjectsToIgnore = [
		"counter","shelf"
	];

	var InfiniteIngredients = [
	];
	
	var GameObjects = {};
	var objectSlotLookup = {};
	this.GameActions = {};
	this.GameObjectCount = 0;
	var objectHolder = new ObjectHolder();
	var slotsPerRow = gameConfig.StageWidth / 64;
	var gridPainter = new GridPainter();
	var matchConsole = matchCon;
	var self = this;
	var onActionCallbacks = [];

	this.Init = function(state) {
		$.each(gameObjects, function(key, value) {
			if (value.Contains) {
				value.Contains.length = 0;
			}
		});
	};

	this.addOnActionCallback =function(callback) {
		onActionCallbacks.push(callback);
	};

	var performAction = function(event) {
		for (var i = 0; i < onActionCallbacks.length; i++) {
			onActionCallbacks[i].onAction(event);
		}
	};	
	
	var getSlot = function(gx, gy) {
		var width = slotsPerRow;
		var rows = Math.floor(gy / 64);
		var columns = Math.floor(gx / 64);
		var slot = rows * width + columns;

		var appliance = GetApplianceFromSlot(slot);
		if (typeof appliance != 'undefined') {
			var applianceSlot = GetSlotInAppliance(slot);
			if (appliance.IsEmpty(applianceSlot)) {
				return slot;
			}
			else {
				return appliance.Name + applianceSlot.toString();
			}
		}

		return slot;
	};

	this.GetApplianceSlot = function(applianceX, applianceY, x ,y) {
		var width = 2;
		x -= applianceX;
		y -= applianceY;
		var rows = Math.floor(x / 64);
		var columns = Math.floor(y / 64);
		return rows * width + columns;
	};

	this.GetActionSlot = function(x, y) {
		var columns = Math.floor(y / 64);
		return "action_" + columns.toString();
	};

	this.FindObjectByName = function(name) {
		for (var key in GameObjects) {
			var object = GameObjects[key];
			if (object.Name == name) {
				return object;
			}
		}
		return null;
	};
	
	this.ChangeSlotAnim = function(slot, anim) {
		$("#"+slot.toString()).setAnimation(anim);
	};
	
	this.ClearAnimation = function(slot) {
		var poundSlot = "#" + slot.toString();
		$(poundSlot).setAnimation();
	};

	this.ClearSlotAnimation = function(slot) {
		$("#"+slot.toString()).setAnimation();
	};

	this.ClearSlotAnimations = function() {
		for (var slot in GameObjects) {

			var object = GameObjects[slot];
			//if (object instanceof gameAppliance) {

			//}
			self.ClearSlotAnimation(slot);
		}
		GameObjects = {};
	};

	this.LoadStateFromMsg = function(stateMsg)
	{
		/*
		self.ClearSlotAnimations();
		var startSlot = self.GetSlot($("#appliances").x(), $("#appliances").y());
		var appliances = self.GetObjectsOfClassFromMsg(objects, "space");
		self.LoadAppliancesFromMsg(startSlot, appliances);

		startSlot = this.GetSlot($("#containers").x(), $("#containers").y());
		var containers = this.GetObjectsOfClassFromMsg(objects, "container");
		var ingredients = this.GetObjectsOfClassFromMsg(objects, "simple_ingredient");
		var workingContainers = [];
		var ingredientContainers = [];

		// load worknig containers
		self.SeparateContainers(containers, ingredients, ingredientContainers, workingContainers);
		self.LoadContainersFromMsg(startSlot, workingContainers);

		// load ingredient containers
		startSlot = this.GetSlot($("#ingredients").x(), $("#ingredients").y());
		self.LoadIngredientContainersFromMsg(startSlot, ingredientContainers);
		//this.LoadIngredientsFromMsg(startSlot, ingredientContainers);

		self.UpdateAnimations();

		*/



		var objects= stateMsg.data;
		var appliances = getObjectsOfClassFromMsg(objects, "space");
		var containers = getObjectsOfClassFromMsg(objects, "container");
		var ingredients = getObjectsOfClassFromMsg(objects, "simple_ingredient");
		var workingContainers = [];
		var ingredientContainers = [];

		// load worknig containers
		separateContainers(containers, ingredients, ingredientContainers, workingContainers);

		var applianceObjects = [],
			containerObjects = [],
			ingredientContainerObjects = [];

		loadAppliances(appliances, applianceObjects);
		loadContainers(workingContainers, containerObjects);
		loadIngredientContainers(ingredientContainers, ingredientContainerObjects);

		assignSlots(applianceObjects, containerObjects, ingredientContainerObjects);
		updatePainter();
	};

	var getGroupOfObject = function(object) {
		var group;
		if (object instanceof gameContainer) {
			group = "containers";
		}
		else if (object instanceof gameIngredientContainer) {
			group = "ingredients";
		}
		else if (object instanceof gameAppliance) {
			group = "appliances";
		}
		return group;
	}

	var getSlotPosition = function(slot) {
		slot = parseInt(slot);
		var row = Math.floor(slot / slotsPerRow),
			column = slot % slotsPerRow;

		var x = column * 64,
			y = row * 64;

		var group = getGroupOfObject()
		if (typeof group !== 'undefined') {
			var groupObj = $("#" + group.toString());
			if (groupObj.length != 0) {
				x -= groupObj.x();
				y -= groupObj.y();
			}
		}

		return {"x": x, "y": y};
	};

	var getObjectSlots = function(startSlot, width, numberRows) {
		var slots = [];
		var slot;
		for (var i = 0; i < numberRows; i++) {
			for (var j = 0; j < slotsPerRow; j+=width) {
				slot = startSlot + i * slotsPerRow + j;
				slots.push(slot);
			}
		}
		return slots;
	}

	var getGroupPosition = function(group) {
		if (typeof group !== 'undefined') {
			return {"x":$("#" + group.toString()).x(), "y": $("#" + group.toString()).y()};
		}
		return {"x": 0, "y":0};
	};

	var getObjectGroupPosition = function(obj) {
		var group;
		if (typeof obj !== 'undefined') {
			group = getGroupOfObject(obj);
		}
		return getGroupPosition(group);
	};

	var getApplianceSlots = function() {
		var startPosition = getGroupPosition("appliances");
		var startSlot = getSlot(startPosition.x, startPosition.y);
		return getObjectSlots(startSlot, 2, 1);
	};
	
	var getWorkingContainerSlots = function() {
		var startPosition = getGroupPosition("containers");
		var startSlot = getSlot(startPosition.x, startPosition.y);
		return getObjectSlots(startSlot, 1, 2);
	};

	var getIngredientContainerSlots = function() {
		var startPosition = getGroupPosition("ingredients");
		var startSlot = getSlot(startPosition.x, startPosition.y);
		return getObjectSlots(startSlot, 1, 2);
	};

	var removeObjectFromList = function(obj, list) {
		var position = $.inArray(obj, list);
		if (position > -1) {
			list.splice(position);
			return true;
		}
		return false;
	};

	var assignObjectSlots = function(objects, slots, lookup) {
		var i,
			slot,
			obj;
		for (i = 0; i < objects.length; i++) {
			obj = objects[i];
			slot = slots[i];
			lookup[slot] = obj;
			obj.setSlot(slot);
		}
	}

	var setPositions = function(objects) {
		var obj;
		var position;
		var groupPosition;
		for (var slot in objects) {
			obj = objects[slot];
			groupPosition = getObjectGroupPosition(obj);
			position = getSlotPosition(slot);
			obj.setPosition(position.x - groupPosition.x, position.y - groupPosition.y);
		}
	}

	var assignSlots = function(appliances, workingContainers, ingredientContainers) {
		var tempSlots = {};
		
		var applianceSlots = getApplianceSlots();
		var workingContainerSlots = getWorkingContainerSlots();
		var ingredientContainerSlots = getIngredientContainerSlots();

		var object;
		for (var slot in GameObjects) {
			object = GameObjects[slot];

			if (removeObjectFromList(object, appliances)) {
				tempSlots[slot] = object;
				removeObjectFromList(slot, applianceSlots);
			}
			else if (removeObjectFromList(object, workingContainers)) {
				tempSlots[slot] = object;
				removeObjectFromList(slot, workingContainerSlots);
			}
			else if (removeObjectFromList(object, ingredientContainers)) {
				tempSlot[slot] = object;
				removeObjectFromList(slot, ingredientContainerSlots);
			}
		}

		assignObjectSlots(appliances, applianceSlots, tempSlots);
		assignObjectSlots(workingContainers, workingContainerSlots, tempSlots);
		assignObjectSlots(ingredientContainers, ingredientContainerSlots, tempSlots);

		setPositions(tempSlots);
		GameObjects = tempSlots;
	};

	var loadAppliances = function(appliances, appliancesList) {
		for (var i=0; i < appliances.length; i++) {
			var applianceObj = getNewApplianceFromMsg(appliances[i]);
			appliancesList.push(applianceObj);
		}
	};

	var loadContainers = function(containers, containersList) {
		var container;
		for (var i = 0; i < containers.length; i++) {
			container = containers[i];
			var containerObj = getNewContainerFromMsg(container);
			containerObj.Contains = container.contains;
			containersList.push(containerObj);
		}
	};

	var loadIngredientContainers = function(ingredientContainers, ingredientContainersList) {
		for (var i = 0; i < ingredientContainers.length; i++) {
			var container = ingredientContainers[i];
			var ingredient = "";
			if (container.contains.length > 0) {
				ingredient = container.contains[0];
			}
			var containerObj = getNewIngredientContainerFromMsg(container, ingredient);
			ingredientContainersList.push(containerObj);
		}
	};

	var updatePainter = function() {
		gridPainter.clear();
		gridPainter.addPainter(objectHolder.getPainter());
		var obj;
		for (var slot in GameObjects) {
			obj = GameObjects[slot];
			gridPainter.addPainter(obj.getPainter());
		}
	};

	this.LoadIngredientsFromMsg = function(startSlot, ingredients)
	{
		for (var i = 0; i < ingredients.length; i++) {
			var ingredient = ingredients[i];
			var ingredientObj = this.GetNewIngredientFromMsg(ingredient);
			self.InsertObject(startSlot + i, ingredientObj);
		}
	};


	var separateContainers = function(containers, ingredients, ingredientContainers, workingContainers) {
		var ingredientNames = self.GetIngredientNames(ingredients);
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

	};

	this.GetIngredientNames = function(ingredients) {
		var ingredientNames = {};
		for (var i = 0; i < ingredients.length; i++) {
			ingredientNames[ingredients[i].name] = ingredients[i].name;
		}
		return ingredientNames;
	};

	var getObjectsOfClassFromMsg = function(objects, classStr)
	{
		var classObjects = [];
		for (var i = 0; i < objects.length; i++){
			var object = objects[i];
			if (object.class == classStr)
			{
				if ($.inArray(object.name, ObjectsToIgnore) == -1) {
					classObjects.push(object);
				}
			}
		}
		return classObjects;
	};

	var getNewApplianceFromMsg = function(appliance)
	{
		var name = appliance.name;
		var id = appliance.name;
		var sprite = name + ".PNG";
		var containers = appliance.contains
		return new gameAppliance(id, name, sprite, containers);
	};

	var getNewContainerFromMsg = function(container)
	{
		var name = container.name;
		var id = container.name;
		var sprite = name + ".PNG";
		return new gameContainer(id, name, sprite);
	};

	var getNewIngredientContainerFromMsg = function(container, ingredient) {
		var name = container.name;
		var id = container.name;
		var sprite = name + ".PNG";
		return new gameIngredientContainer(name, id, sprite, ingredient);
	};

	var getNewIngredientFromMsg = function(ingredient)
	{
		var name = ingredient.name;
		var id = ingredient.name;
		var sprite = name + ".PNG";
		var isInfinite = ($.inArray(name, this.InfiniteIngredients) > -1);
		return new gameIngredient(id, name, sprite, isInfinite);
	};

	this.UpdateAnimations = function()
	{
		/*
		var applianceX = 0;
		var applianceY = 0;
		var containerX = 0;
		var containerY = 0;
		var ingredientX = 0;
		var ingredientY = 0;

		var ingredients = {};
		var containers = {};
		var appliances = {};
		self.DivideObjects(GameObjects, ingredients, containers, appliances);
		for (var slot in appliances)
		{
			var object = appliances[slot];
			self.UpdateAnimation("appliances", object, slot, 128, 128, applianceX, applianceY);

			var applianceGroup = self.GetApplianceGroup("appliances", object, applianceX, applianceY);
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
				self.UpdateApplianceContainerAnimation(applianceGroup, containerObject, key);
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
			self.UpdateAnimation("containers", object, slot, 64, 64, containerX, containerY);
			containerX += 64;
			if (containerX > 64*11 ) {
				containerX = 0;
				containerY += 64;
			}
		}
		for (var slot in ingredients) {
			var object = ingredients[slot];
			if (object.Contains.length > 0) {
				self.UpdateAnimation("ingredients", object, slot, 64, 64, ingredientX, ingredientY);
			}
			else {
				self.ClearAnimation(key);
			}
			ingredientX += 64;
			if (ingredientX > 64*11 ) {
				ingredientX = 0;
				ingredientY += 64;
			}
		}
	*/
		//$.gameQuery.resourceManager.refresh();
	};
	/*
	this.DivideObjects = function(objects, ingredients, containers, appliances) {
		for (var key in GameObjects) {
			var object = GameObjects[key];
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
	};

	this.GetApplianceGroup = function(group, object, x, y) {
		var objectName = object.Name;
		var poundName = "#" + objectName;
		if ($(poundName).length ==  0) {
			$("#" + group).addGroup(objectName, {width: 128, height: 128,posx: x, posy: y}).end();
		}
		return objectName;
	};

	this.UpdateAnimation = function(group, object, slot, width, height, x, y)
	{
		var groupObj = $("#" + group);
		var groupX = groupObj.x();
		var groupY = groupObj.y();
		//var slot = this.GetSlot(x + groupX, y + groupY);
		var poundSlot = "#" + slot.toString();
		var sprite = $(poundSlot);
		var anim = object.Anim;
		
		this.UpdateAnimationSlot(group, anim, sprite, slot, groupX, groupY, x, y, width, height);
	};

	this.UpdateApplianceContainerAnimation = function(group, object, slot) {
		var applianceGroupObj = $("#appliances");
		var groupX = applianceGroupObj.x();
		var groupY = applianceGroupObj.y();
		var applianceObj = $("#" + group);
		groupX += applianceObj.x();
		groupY += applianceObj.y();
		var x = 64 * (slot % 2);
		var y = 64 * Math.floor(slot / 2);

		//var slot = this.GetSlot(x, y);
		var poundSlot = "#" + group + slot.toString();
		var sprite = $(poundSlot);
		var anim = object.Anim;

		this.UpdateAnimationSlot(group, anim, sprite, slot, groupX, groupY, x, y, 64, 64 );
	};

	this.UpdateAnimationSlot = function(group, animation, sprite, slot, groupX, groupY, x, y, width, height) {
		if (sprite.length == 0) {
			$("#" + group).addSprite(slot.toString(), {animation: animation, width: width, height: height, posx: x, posy: y});
			self.UpdateGrid(name, -1, -1, x+groupX, y+groupY, width, height);
		}
		else
		{
			var oldX = sprite.x();
			var oldY = sprite.y();
			sprite.x(x);
			sprite.y(y);
			self.ChangeSlotAnim(slot, animation);
			self.UpdateGrid(slot.toString(), oldX + groupX, oldY+groupY, x+groupX, y+groupY, width, height);
		}
	};

	this.UpdateApplianceAnimation = function(appliance) {


		for (var i = 0; i < 4; i++) {
			var obj = appliance.GetObject(i);
			if (typeof obj != 'undefined') {
				var oldX = sprite.x();
				var oldY = sprite.y();
				sprite.x(x);
				sprite.y(y);
				self.UpdateGrid(slot.toString(), oldX + groupX, oldY+groupY, x+groupX, y+groupY, width, height);
			}
		}
	};

	this.UpdateGrid = function(name, oldX, oldY, x, y, width, height) {
		//Checking if this needs to clear it's old position
		if (oldX > -1 && oldY > -1) {
			//Iterate over grid with tiles 64x64
			for (var i = oldX; i < oldX + width; i+= 64) {
				if (i in this.Grid) {
					for (var j = oldY; j < oldY + height; j += 64) {
						//If the name in this spot is actually the object's name, clean it up
						if (j in this.Grid[i] && this.Grid[i][j] == name) {
							this.Grid[i][j] = "";
						}
					}
				}
			}
		}
		//Iterate over grid
		for (var i = x; i < x + width; i+= 64) {
			// Do we need to add a new row to the map?
			if (!(i in this.Grid)) {
				this.Grid[i] = {};
			}
			// Add the name to all the spots in this map
			for (var j = y; j < y + height; j += 64) {
				this.Grid[i][j] = name;
			}
		}

	};

	this.CleanName = function (name) {
		return name.replace(/\s+/g, '_');
	};*/

	this.onMessage = function(msg) {
		this.LoadStateFromMsg(msg.state);
		winFlag = msg.success;
	};

	this.onMouseDown = function(x, y) {
		var obj = RemoveObjectFromPosition(x, y);
		var tileX = x % 64;
		var tileY = y % 64;

		objectHolder.SetHoldingObject(obj, x, y, tileX, tileY);
	};

	this.onMouseUp = function() {
		if (objectHolder.IsHolding()) {
			var obj = objectHolder.Pop();
			if (!SetObjectAtPosition(obj.object, obj.x, obj.y)) {
				SetObjectAtPosition(obj.object, obj.oldX, obj.oldY);
			}
		}
	};

	this.onMouseDrag = function(x, y) {
		objectHolder.SetPosition(x,y);
	};

	this.onMouseClick = function(x, y) {
		var slot = inventoryGrid.GetSlot(gx, gy);
		if (activeAction === EnumActions.Look) {
			var desc = this.GetObjDesc(slot);
			if (desc) matchConsole.Write(desc);
		} else {
			var obj = GetObjectFromPosition(x, y);
			RegisterCommand(obj, activeAction, actionSlot);
		}
	};

	
	this.IsSlotEmpty = function(slot) {
		if (slot > 0) {
			var obj = GameObjects[slot];
			if (typeof obj == 'undefined' && !this.IsSlotApp(slot)) {
				return true;
			}
			return false;
		}
		return true;
	};
	
	this.IsSlotApp = function(slot) {
		return (typeof GetApplianceFromSlot(slot) != 'undefined');
	};

	var GetApplianceFromSlot = function(slot) {
		var obj = GameObjects[slot];
		if (typeof obj == 'undefined') {
			obj = GameObjects[slot - 1];
		}
		var width = slotsPerRow;
		if (typeof obj == 'undefined') {
			obj = GameObjects[slot - width];	
		}
		if (typeof obj == 'undefined') {
			obj = GameObjects[slot - (width + 1)];	
		}
		if (obj instanceof gameAppliance) {
			return obj;
		}
		return undefined;
	};

	var GetSlotInAppliance = function(slot) {
		var obj = GameObjects[slot];
		if (obj instanceof gameAppliance) {
			return 0;
		}
		obj = GameObjects[slot - 1];
		if (obj instanceof gameAppliance) {
			return 1;
		}
		var width = slotsPerRow;
		obj = GameObjects[slot - width];	
		if (obj instanceof gameAppliance) {
			return 2;
		}
		obj = GameObjects[slot - width - 1];	
		if (obj instanceof gameAppliance) {
			return 3;
		}
		return -1;	
	};

	this.GetObjFromSlot = function(slot) {
		var obj = GameObjects[slot];
		if (typeof obj == 'undefined') {
			obj = GetApplianceFromSlot(slot);
		}
		return obj;
	};

	var getObjectSlotFromPosition = function(x, y) {
		var width = slotsPerRow;
		var rows = Math.floor(y / 64);
		var columns = Math.floor(x / 64);
		return rows * width + columns;

	};

	var GetObjectFromPosition = function(x, y) {
		var slot = getObjectSlotFromPosition(x, y);
		var appliance = GetApplianceFromSlot(slot);
		var obj = null;
		if (typeof appliance != 'undefined') {
			var applianceSlot = GetSlotInAppliance(slot);
			if (!appliance.IsEmpty(applianceSlot)) {
				obj = appliance.GetObject(applianceSlot);
			}
		}
		else {
			obj = GameObjects[slot];
		}

		return obj;
	};

	var RemoveObjectFromPosition = function(x, y) {
		var slot = getObjectSlotFromPosition(x, y);
		var appliance = GetApplianceFromSlot(slot);
		var obj = null;
		if (typeof appliance != 'undefined') {
			var applianceSlot = GetSlotInAppliance(slot);
			if (!appliance.IsEmpty(applianceSlot)) {
				obj = appliance.Remove(applianceSlot);
			}
		}
		else {
			obj = GameObjects[slot];
			delete GameObjects[slot];
		}

		return obj;
	};

	var SetObjectAtPosition = function(obj, x, y) {
		var slot = getObjectSlotFromPosition(x, y);
		var appliance = GetApplianceFromSlot(slot);
		var toObj,
			event;
		if (typeof appliance !== 'undefined') {
			toObj = appliance;
			var applianceSlot = GetSlotInAppliance(slot);
			if (!appliance.IsEmpty(applianceSlot)) {
				toObj = appliance.GetObject(applianceSlot);
			}
			event = obj.ActOn(toObj);
		}
		else {
			toObj = GameObjects[slot];
			if (typeof toObj !== 'undefined') {
				event = obj.ActOn(toObj);
			}
			SetObjectAtSlot(obj, slot);
		}
		if (typeof event !== 'undefined') {
			performAction(event);
		}
	};

	var SetObjectAtSlot = function(obj, slot) {
		if (self.IsSlotEmpty(slot)) {
			GameObjects[slot] = obj;
		}
	};
	
	this.FetchObj = function(slot) {
		if (this.IsSlotApp(slot)) {
			var appliance = GetApplianceFromSlot(slot);
			var applianceSlot = GetSlotInAppliance(slot);
			if (!appliance.IsEmpty(applianceSlot)) {
				appliance.GetObject(applianceSlot);
				var obj = appliance.GetObject(applianceSlot);
				//this.ClearSlotAnim(slot + "Box");
				return obj;
				//matchConsole.Write("Player 1 took the " + obj.Name + " off of the " + GameObjects[slot].Name);
			}
			else {
				return appliance;
			}
		}
		else {
			var obj = GameObjects[slot];
			//delete GameObjects[slot];
			//$("#"+slot).setAnimation();
			return obj;
		}
		return undefined;
	};
	
	this.PlaceObj = function(obj, slot) {
		if (slot < 0) throw "Attempted to place in non slot!";
		//Place in non empty slot
		if (!this.IsSlotEmpty(slot)) { 
			var gobj = this.FetchObj(slot);
			var origin = this.GetSlot(mouseTracker.DownX, mouseTracker.DownY);
			obj.ActOn(gobj, slot, origin);
		} else {
			console.log(slot);
			//if ((slot.charAt(0) === "c" ) === (obj.Type === EnumGOType.Ing)) {
			//	throw "Placing object in mismatched slot!";
			//} else {
			//GameObjects[slot] = obj;
			//$("#"+slot).setAnimation(obj.Anim);

			var action = this.GetMoveAction(obj, slot);
			gameConnect.ReportCmdSucc(obj.ID, slot, action, "");
			//}
		}
	};

	
	//Gets the description of the gameObject in slot
	this.GetObjDesc = function(slot) {
		var obj = this.GetObjFromSlot(slot);
		return (this.IsSlotEmpty(slot)) ? false : obj.Desc();
	};
	this.GetObjType = function(slot) {
		var obj = this.GetObjFromSlot(slot);		
		return (this.IsSlotEmpty(slot)) ? false : obj.Type;
	};
	this.GetObjName = function(slot) {
		var obj = this.GetObjFromSlot(slot);
		return (this.IsSlotEmpty(slot)) ? false : obj.Name;
	};

	this.GetPainters = function() {
		var painters = [];
		painters.push(gridPainter);
		return painters;
	};
};

/////////////////
//Mouse Tracker//
/////////////////
var MouseTracker = function() {
	"use strict";
	var isDragging = false,
		isDown = false,
		hasMoved = false,
		X = 0,
		Y = 0;
	
	var mouseClickCallbacks = [];
	var mouseDownCallbacks = [];
	var mouseUpCallbacks = [];
	var mouseDragCallbacks = [];
	var mouseMoveCallbacks = [];

	var onMouseClick = function() {
		for (var i = 0; i < mouseClickCallbacks.length; i++) {
			mouseClickCallbacks[i].onMouseDown(X, Y);
		}
	};

	var onMouseDrag = function() {
		for (var i = 0; i < mouseDragCallbacks.length; i++) {
			mouseDragCallbacks[i].onMouseDrag(X, Y);
		}
	};

	this.onMouseDown = function() {
		for (var i = 0; i < mouseDownCallbacks.length; i++) {
			mouseDownCallbacks[i].onMouseDown(X, Y);
		}
		isDown = true;
	};

	this.onMouseUp = function() {
		isDown = false;
		
		for (var i = 0; i < mouseUpCallbacks.length; i++) {
			mouseUpCallbacks[i].onMouseUp();
		}

		if (!hasMoved) {
			onMouseClick();
		}
		hasMoved = false;
	};

	this.onMouseMove = function(event) {
		// X and Y are translated from absolute X and Y to grid coordinates
		X = event.pageX;
		Y = event.pageY;
		
		hasMoved = isDown;

		for (var i = 0; i < mouseMoveCallbacks.length; i++) {
			mouseMoveCallbacks[i].onMouseMove(X, Y);
		}

		if (isDown) {
			onMouseDrag();
		}
	};

	this.addOnMouseClick = function(callback) {
		mouseClickCallbacks.push(callback);
	};

	this.addOnMouseDown = function(callback) {
		mouseDownCallbacks.push(callback);
	};

	this.addOnMouseUp = function(callback) {
		mouseUpCallbacks.push(callback);
	};

	this.addOnMouseDrag = function(callback) {
		mouseDragCallbacks.push(callback);
	};

	this.addOnMouseMove = function(callback) {
		mouseMoveCallbacks.push(callback);
	};

	/*	
	this.RegisterClick = function() {
		/*console.log("Click at " + mouseTracker.X + " " + mouseTracker.Y);
		if (mouseTracker.Clicked) {
			mouseTracker.Clicked = false;
			mouseTracker.DoubleClick(mouseTracker.GridX, mouseTracker.GridY);
		} else {
			mouseTracker.ClickTicks = 0;
			mouseTracker.Clicked = true;
		}
		console.log("Grid coords: " + mouseTracker.GridX + "x" + mouseTracker.GridY);
		Down = false;
		onMouseClick()
		mouseTracker.SingleClick(mouseTracker.GridX, mouseTracker.GridY);
	};*/
	/*
	
	this.RegisterDown = function() {
		//console.log("Mouse down!");
		Down = true;
		if (!Dragging) {
			DownX = GridX;
			DownY = GridY;
			DragTicks = 0;
			onMouseDown(DownX, DownY);	
		}	
	};
	
	this.RegisterUp = function() {
		console.log("Mouse up!");
		Down = false;
		onMouseUp();
		if (!Dragging) {
			if(mouseTracker.GridX === mouseTracker.DownX && mouseTracker.GridY === mouseTracker.DownY) {
				onMouseClick(GridX, GridY);
			}
		}
		//if(!mouseTracker.Dragging) {
		//	if(mouseTracker.GridX === mouseTracker.DownX && mouseTracker.GridY === mouseTracker.DownY) {
		//		mouseTracker.RegisterClick();
		//	}
		//} else {
		//	mouseTracker.PutDownObj();
		//}		
	};
	
	this.RecordMousePos = function(event) {
		//console.log(event.pageX+" "+event.pageY);
		X = event.pageX - OffsetX;
		Y = event.pageY - OffsetY;
		GridX = X //>>> 6;
		GridY = Y //>>> 6;
		if (Down && DragTicks > 0) {
			onMouseDrag(GridX, GridY);
		}
		else if (Down) {
			DragTicks++;
		}

	};*/
	
	/*
	Update: function() {	
		//Mouse over tracking
		actionText.Clear();
		if (!mouseTracker.Down && !mouseTracker.Dragging) {
			if (!inventoryGrid.IsSlotEmpty(inventoryGrid.GetSlot(mouseTracker.GridX, mouseTracker.GridY))) {
					var text = EnumActions.ToString(activeAction);
					text += " ";
					var slot = inventoryGrid.GetSlot(mouseTracker.GridX, mouseTracker.GridY);
					text += inventoryGrid.GetObjName(slot);
					actionText.WriteTo(text);
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
		}
		
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
		var gx = mouseTracker.GridX;
		var gy = mouseTracker.GridY;
		var width = inventoryGrid.SlotsPerRow;
		var rows = Math.floor(gy / 64);
		var columns = Math.floor(gx / 64);
		var slot = rows * width + columns;

		var appliance = inventoryGrid.GetApplianceFromSlot(slot);
		if (typeof appliance != 'undefined') {
			var applianceSlot = inventoryGrid.GetSlotInAppliance(slot);
			if (appliance.IsEmpty(applianceSlot)) {
				mouseTracker.Holding.ActOn(appliance);
			}
			else {
				inventoryGrid.PlaceObj(mouseTracker.Holding, slot);	
			}
		}
		else {
			inventoryGrid.PlaceObj(mouseTracker.Holding, slot);	
		}
		//return slot;
		//var slot = inventoryGrid.GetSlot(mouseTracker.GridX, mouseTracker.GridY);
		//var slot = inventoryGrid.GetSlot(mouseTracker.DownX, mouseTracker.DownY);
		//inventoryGrid.PlaceObj(mouseTracker.Holding, slot);
		
		mouseTracker.Dragging = false;
		mouseTracker.Holding = null;
		$("#holdingBox").setAnimation();
	},
	
	//Mouse actions
	SingleClick: function(gx, gy) {
		if (!actionBar.SelectNewAction(gx ,gy)) {
			var slot = inventoryGrid.GetSlot(gx, gy);
			if (activeAction === EnumActions.Look) {
				var desc = inventoryGrid.GetObjDesc(slot);
				if (desc) matchConsole.Write(desc);
			} else {
				var obj = inventoryGrid.GameObjects[slot];
				RegisterCommand(obj, activeAction, actionSlot);
			}
		}
	},
	
	/*
	//Deprecated
	DoubleClick: function(gx, gy) {
		var slot = inventoryGrid.GetSlot(gx, gy);
		var obj = inventoryGrid.GameObjects[slot];
		actionHandler.HandleAction(obj, slot);
	},*/
	

	// TODO need to adequately grab objects from appliances
	/*MouseDrag: function() {
		var gx = mouseTracker.DownX;
		var gy = mouseTracker.DownY;
		var width = inventoryGrid.SlotsPerRow;
		var rows = Math.floor(gy / 64);
		var columns = Math.floor(gx / 64);
		var slot = rows * width + columns;

		var appliance = inventoryGrid.GetApplianceFromSlot(slot);
		if (typeof appliance != 'undefined') {
			var applianceSlot = inventoryGrid.GetSlotInAppliance(slot);
			if (!appliance.IsEmpty(applianceSlot)) {
				mouseTracker.Dragging = true;

				var objectName = appliance.GetObject(applianceSlot);
				var object = inventoryGrid.FindObjectByName(objectName);

				// TODO, this doesn't actually get the object, just the name
				mouseTracker.Holding = object;
				$("#holdingBox").setAnimation(mouseTracker.Holding.Anim);
			}
		}
		else if (inventoryGrid.GameObjects[slot].IsMovable) {
			mouseTracker.Dragging = true;
			mouseTracker.PickUpObj(slot);
		}



			/*
		var slot = inventoryGrid.GetSlot(mouseTracker.DownX, mouseTracker.DownY);
		if (slot != "") {
			var gotype = inventoryGrid.GetObjType(slot);
			 else if (gotype === EnumGOType.App) {
				if (inventoryGrid.GameObjects[slot].Contains.length > 0) {
					mouseTracker.Dragging = true;

					mouseTracker.PickUpObj(slot);
				}
			}
		}*/
	//}
}

///////////
//Console//
///////////
var MatchConsole = function() {
	"use strict";
	var Lines = [];
	var painter = new MatchConsolePainter();
	
	this.Peek = function() {
		return Lines[this.Lines.length-1];
	};
	
	this.Write = function(line) {
		//this.Lines.shift();
		Lines.push(line);
		painter.setText(Lines);
	};

	this.GetPainter = function() {
		return painter;
	};
}

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

var ActionBar = function(actions, mouseTracker) {
	"use strict";
	if (ActionBar.prototype._actionBar) {
        return ActionBar.prototype._actionBar;
    }
    ActionBar.prototype._actionBar = this;
    
    var left,
    	right,
    	top,
    	bottom;

	this.Actions = actions;
	this.activeAction = this.Actions[0];
	var painter = new ActionBarPainter(actions, mouseTracker.RegisterClick);

	this.GetPainter = function() {
		return painter;
	}

	var isWithinActionBar = function(x, y) {
		return (left <= x && x <= right && bottom <= y && y <= top);
	};

	this.onMouseDown = function(x, y) {
		if (isWithinActionBar(x, y)){
			this.SelectNewAction(x,y);
		}
	};

	this.SelectNewAction = function(x ,y) {
		var actionGroup = $("#" + actionBar.DisplayDiv);
		var actionBarY = actionGroup.y();
		if (y > actionBarY) {
			var index = actionBar.GetActionNumber(x, y);
			activeAction = actionBar.Actions[index];
			painter.setSelector(index);
			return true;
		}
		return false;
	};

	this.GetSelectedAction = function(x, y) {
		var index = actionBar.GetActionNumber(x, y);
		return actionBar.Actions[index];
	};

	this.GetActionNumber = function(x, y) {
		return Math.floor(x / 64);
	};
};

ActionBar.getMoveAction = function(object, target) {
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
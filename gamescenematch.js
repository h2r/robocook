var gameRecipe = null;
var gameIngList = null;
var gameTitle = null;
var winFlag = false;


var GameSceneMatch = function(actionHandler, grid){
	"use strict";
	if (GameSceneMatch.prototype._gameSceneMatch) {
        return GameSceneMatch.prototype._gameSceneMatch;
    }
    GameSceneMatch.prototype._gameSceneMatch = this;
    
    var handler = actionHandler;
	var inventoryGrid = grid;
	var mouseTracker = new MouseTracker();
	var gamePainter = new GamePainter(mouseTracker);
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
		inventoryGrid.Init(matchConsole, actionBar);
		inventoryGrid.addOnActionCallback(this);
		
		//Initialize groups, add tiles as sprite
		actionText.Init();
		
		//gamePainter.init(mouseTracker);

		//Init mouse tracker
		mouseTracker.addOnMouseClick(inventoryGrid);
		mouseTracker.addOnMouseDown(inventoryGrid);
		mouseTracker.addOnMouseUp(inventoryGrid);
		mouseTracker.addOnMouseDrag(inventoryGrid);
		mouseTracker.addOnMouseClick(actionBar);

		
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
		painters.push(actionBar.getPainter());
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

    /////////////////////////////
    // PRIVATE CLASS VARIABLES //
    /////////////////////////////
	var ObjectsToIgnore = [
		"counter","shelf"
	];

	var InfiniteIngredients = [
	];

	var slotsPerRow = gameConfig.StageWidth / 64;
	
	
	var GameObjects = {};
	var objectSlotLookup = {};
	//this.GameActions = {};
	//this.GameObjectCount = 0;
	var objectHolder = new ObjectHolder();
	var gridPainter = new GridPainter();
	var matchConsole = matchCon;
	//var self = this;
	var onActionCallbacks = [];
	var actionBar;
	var mouseDownX, mouseDownY;
	var isMouseDown = false;

	////////////////////
	// PUBLIC METHODS //
	////////////////////
	this.Init = function(mConsole, aBar) {
		matchConsole = mConsole;
		actionBar = aBar;
	};

	// public
	this.addOnActionCallback =function(callback) {
		onActionCallbacks.push(callback);
	};

	// public
	this.onMessage = function(msg) {
		loadStateFromMsg(msg.state);
		winFlag = msg.success;
	};

	// public
	this.onMouseDown = function(x, y) {
		if (!isWithinBounds(x,y)) {
			return;
		}
		mouseDownX = x;
		mouseDownY = y;
	};

	// public
	this.onMouseUp = function() {
		if (objectHolder.IsHolding()) {
			var obj = objectHolder.Pop();
			if (!setObjectAtPosition(obj.object, obj.x, obj.y)) {
				setObjectAtPosition(obj.object, obj.oldX, obj.oldY);
			}
		}
	};

	// public
	this.onMouseDrag = function(x, y) {
		if (!objectHolder.IsHolding()) {
			var obj = removeObjectFromPosition(mouseDownX, mouseDownY);
			var tileX = mouseDownX % 64;
			var tileY = mouseDownY % 64;

			if (typeof obj !== 'undefined') {
				objectHolder.SetHoldingObject(obj, x, y, tileX, tileY);
			}
		}
		objectHolder.SetPosition(x,y);
	};

	// public
	this.onMouseClick = function(x, y) {
		if (!isWithinBounds(x,y)) {
			return;
		}
		var action = actionBar.getActiveAction();
		var slot = getSlot(x, y);
		if (action === EnumActions.ToString(EnumActions.Look)) {
			var desc = getObjDesc(slot);
			if (desc) matchConsole.Write(desc);
		} else {
			var obj = getObjectFromPosition(x, y);
			var logMsg  = "Performing " + action + " on " + obj.ID;
			performAction({"ID": obj.ID, "action": action, "message": logMsg});
		}
	};

	// ugh really?
	this.setActionBar = function(bar) {
		actionBar = bar;
	};

	// public
	this.GetPainters = function() {
		var painters = [];
		painters.push(gridPainter);
		return painters;
	};

	/////////////////////
	// PRIVATE METHODS //
	/////////////////////
	
	var isWithinBounds = function(x, y) {
		var bounds = gridPainter.getBounds();
		return (bounds.left <= x && x <= bounds.right && bounds.bottom <= y && y <= bounds.top);
	};

	// getSlot, getObjectFromPosition, removeObjectFromPosition, setObjectAtPosition
	var getSlotInAppliance = function(slot) {
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

	// getObjDesc, getObjType, getObjName
	var getObjFromSlot = function(slot) {
		var obj = GameObjects[slot];
		if (typeof obj == 'undefined') {
			obj = getApplianceFromSlot(slot);
		}
		return obj;
	};

	// getObjectFromPosition
	var getObjectSlotFromPosition = function(x, y) {
		var width = slotsPerRow;
		var rows = Math.floor(y / 64);
		var columns = Math.floor(x / 64);
		return rows * width + columns;

	};

	// onMouseClick
	var getObjectFromPosition = function(x, y) {
		var slot = getObjectSlotFromPosition(x, y);
		var appliance = getApplianceFromSlot(slot);
		var obj;
		if (typeof appliance != 'undefined') {
			var applianceSlot = getSlotInAppliance(slot);
			if (!appliance.IsEmpty(applianceSlot)) {
				obj = appliance.GetObject(applianceSlot);
			}
			else {
				obj = appliance;
			}
		}
		else {
			obj = GameObjects[slot];
		}

		return obj;
	};

	// onMouseDown
	var removeObjectFromPosition = function(x, y) {
		var slot = getObjectSlotFromPosition(x, y);
		var appliance = getApplianceFromSlot(slot);
		var obj;
		if (typeof appliance != 'undefined') {
			var applianceSlot = getSlotInAppliance(slot);
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

	// onMouseUp
	var setObjectAtPosition = function(obj, x, y) {
		var slot = getObjectSlotFromPosition(x, y);
		var appliance = getApplianceFromSlot(slot);
		var toObj,
			event;
		if (typeof appliance !== 'undefined') {
			toObj = appliance;
			var applianceSlot = getSlotInAppliance(slot);
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
			setObjectAtSlot(obj, slot);
		}
		if (typeof event !== 'undefined') {
			performAction(event);
		}
	};

	// setObjectAtPosition, getObjectDescription
	var isSlotEmpty = function(slot) {
		if (slot > 0) {
			var obj = GameObjects[slot];
			if (typeof obj == 'undefined' && !isSlotAppliance(slot)) {
				return true;
			}
			return false;
		}
		return true;
	};

	// isSlotEmpty
	var isSlotAppliance = function(slot) {
		return (typeof getApplianceFromSlot(slot) != 'undefined');
	};

	// isSlotAppliance, getObjFromSlot
	var getApplianceFromSlot = function(slot) {
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

	// setObjectAtPosition
	var setObjectAtSlot = function(obj, slot) {
		if (isSlotEmpty(slot)) {
			GameObjects[slot] = obj;
		}
	};

	// setObjectAtPosition
	var performAction = function(event) {
		for (var i = 0; i < onActionCallbacks.length; i++) {
			onActionCallbacks[i].onAction(event);
		}
	};	
	
	// getApplianceSlots, getContainerSlots, getIngredientContainerSlots
	var getSlot = function(gx, gy) {
		var width = slotsPerRow;
		var rows = Math.floor(gy / 64);
		var columns = Math.floor(gx / 64);
		var slot = rows * width + columns;

		var appliance = getApplianceFromSlot(slot);
		if (typeof appliance != 'undefined') {
			var applianceSlot = getSlotInAppliance(slot);
			if (appliance.IsEmpty(applianceSlot)) {
				return slot;
			}
			else {
				return appliance.Name + applianceSlot.toString();
			}
		}

		return slot;
	};

	// setPositions
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

	// getObjectGroupPosition, getSlotPosition
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

	// getApplianceSlots, getContainerSlots, getIngredientContainerSlots
	var getGroupPosition = function(group) {
		if (typeof group !== 'undefined') {
			return {"x":$("#" + group.toString()).x(), "y": $("#" + group.toString()).y()};
		}
		return {"x": 0, "y":0};
	};

	// getApplianceSlots, getContainerSlots, getIngredientContainerSlots
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

	/*
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
	};*/

	// onMessage
	var loadStateFromMsg = function(stateMsg)
	{
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

		loadIngredientContainers(ingredientContainers, ingredients, ingredientContainerObjects);
		loadContainers(workingContainers, containerObjects);

		var containersInAppliances = [];
		loadAppliances(appliances, applianceObjects, containerObjects, ingredientContainerObjects, containersInAppliances);

		containerObjects = removeContainersFromList(containerObjects, containersInAppliances);
		ingredientContainerObjects = removeContainersFromList(ingredientContainerObjects, containersInAppliances);

		assignSlots(applianceObjects, containerObjects, ingredientContainerObjects);
		updatePainter();
	};

	// loadStateFromMsg
	var separateContainers = function(containers, ingredients, ingredientContainers, workingContainers) {
		var ingredientNames = getIngredientNames(ingredients);
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

	// loadStateFromMessage
	var removeContainersFromList = function(containers, toRemove) {
		var remainingContainers = [];
		for (var i = containers.length - 1; i >= 0; i--) {
			if ($.inArray(containers[i].Name, toRemove) == -1) {
				remainingContainers.push(containers[i]);
			}
		}
		return remainingContainers;
	};


	var getIngredientNames = function(ingredients) {
		var ingredientNames = {};
		for (var i = 0; i < ingredients.length; i++) {
			ingredientNames[ingredients[i].name] = ingredients[i].name;
		}
		return ingredientNames;
	};

	// loadStateFromMsg
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

	// loadStateFromMsg
	var loadAppliances = function(appliances, appliancesList, containerObjects, ingredientContainerObjects, containersInAppliances) {
		var containers = [],
			applianceObj;
		for (var i=0; i < appliances.length; i++) {
			containers = getContainerObjects(appliances[i].contains, containerObjects, ingredientContainerObjects); 
			containersInAppliances.push(containers);
			applianceObj = getNewApplianceFromMsg(appliances[i], containers);
			appliancesList.push(applianceObj);
		}
	};

	// loadAppliances
	var getContainerObjects = function(names, workingContainers, ingredientContainers) {
		var containerObjects = [];
		for (var i = 0; i < workingContainers.length; i++) {
			if ($.inArray(workingContainers[i].Name, names) != -1) {
				containerObjects.push(workingContainers[i]);
			}
		}
		for (var i = 0; i < ingredientContainers.length; i++) {
			if ($.inArray(ingredientContainers[i].Name, names) != -1) {
				containerObjects.push(ingredientContainers[i]);
			}
		}
		return containerObjects;
	};

	// loadAppliances
	var getNewApplianceFromMsg = function(appliance, containers)
	{
		var name = appliance.name;
		var id = appliance.name;
		var sprite = name;
		if (appliance.onoff) {
			sprite += "_on";
		}
		sprite += ".PNG";
		return new gameAppliance(id, name, sprite, containers);
	};

	// loadStateFromMsg
	var loadContainers = function(containers, containersList) {
		var container;
		for (var i = 0; i < containers.length; i++) {
			container = containers[i];
			var containerObj = getNewContainerFromMsg(container);
			containerObj.Contains = container.contains;
			containersList.push(containerObj);
		}
	};

	// loadContainers
	var getNewContainerFromMsg = function(container)
	{
		var name = container.name;
		var id = container.name;
		var sprite = name + ".PNG";
		return new gameContainer(id, name, sprite);
	};

	// loadStateFromMsg
	var loadIngredientContainers = function(ingredientContainers, ingredients, ingredientContainersList) {
		for (var i = 0; i < ingredientContainers.length; i++) {
			var container = ingredientContainers[i];
			var ingredient = "";
			var ingredientObject;
			if (container.contains.length > 0) {
				ingredient = container.contains[0];
				ingredientObject = getIngredientFromList(ingredient, ingredients);
			}
			var containerObj = getNewIngredientContainerFromMsg(container, ingredientObject);
			ingredientContainersList.push(containerObj);
		}
	};

	// loadIngredientContainers
	var getIngredientFromList = function(name, ingredients) {
		var ingredient;
		for (var i =0; i < ingredients.length; i++) {
			if (ingredients[i].name == name) {
				ingredient = ingredients[i];
			}
		}
		return ingredient;
	};

	// loadIngredientContainers
	var getNewIngredientContainerFromMsg = function(container, ingredient) {
		var name = container.name;
		var id = container.name;
		var sprite = name;
		if (typeof ingredient !== 'undefined' && ingredient.peeled) {
			sprite += "_peeled"
		}
		sprite += ".PNG";
		return new gameIngredientContainer(name, id, sprite, ingredient.Name);
	};

	// loadStateFromMsg
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
				removeItemFromList(slot, applianceSlots);
			}
			else if (removeObjectFromList(object, workingContainers)) {
				tempSlots[slot] = object;
				removeItemFromList(slot, workingContainerSlots);
			}
			else if (removeObjectFromList(object, ingredientContainers)) {
				tempSlots[slot] = object;
				removeItemFromList(slot, ingredientContainerSlots);
			}
		}

		assignObjectSlots(appliances, applianceSlots, tempSlots);
		assignObjectSlots(workingContainers, workingContainerSlots, tempSlots);
		assignObjectSlots(ingredientContainers, ingredientContainerSlots, tempSlots);

		setPositions(tempSlots);
		GameObjects = tempSlots;
	};

	// assignSlots
	var getApplianceSlots = function() {
		var startPosition = getGroupPosition("appliances");
		var startSlot = getSlot(startPosition.x, startPosition.y);
		return getObjectSlots(startSlot, 2, 1);
	};
	
	// assignSlots
	var getWorkingContainerSlots = function() {
		var startPosition = getGroupPosition("containers");
		var startSlot = getSlot(startPosition.x, startPosition.y);
		return getObjectSlots(startSlot, 1, 2);
	};

	// assignSlots
	var getIngredientContainerSlots = function() {
		var startPosition = getGroupPosition("ingredients");
		var startSlot = getSlot(startPosition.x, startPosition.y);
		return getObjectSlots(startSlot, 1, 2);
	};

	//assignSlots
	var removeObjectFromList = function(obj, list) {
		for (var i = 0; i < list.length; i++) {
			if (obj.Name == list[i].Name) {
				list.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	//assignSlots
	var removeItemFromList = function(item, list) {
		var position = $.inArray(item, list);
		if (position > -1) {
			list.splice(position,1);
			return true;
		}
		return false;
	};

	// assignSlots
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

	// assignSlots
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

	// setPositions
	var getObjectGroupPosition = function(obj) {
		var group;
		if (typeof obj !== 'undefined') {
			group = getGroupOfObject(obj);
		}
		return getGroupPosition(group);
	};

	// loadStateFromMsg
	var updatePainter = function() {
		gridPainter.clear();
		gridPainter.addPainter(objectHolder.getPainter());
		var obj;
		for (var slot in GameObjects) {
			obj = GameObjects[slot];
			gridPainter.addPainter(obj.getPainter());
		}
	};

	/*
	this.LoadIngredientsFromMsg = function(startSlot, ingredients)
	{
		for (var i = 0; i < ingredients.length; i++) {
			var ingredient = ingredients[i];
			var ingredientObj = this.GetNewIngredientFromMsg(ingredient);
			self.InsertObject(startSlot + i, ingredientObj);
		}
	};
	*/
	
	

	/*

	var getNewIngredientFromMsg = function(ingredient)
	{
		var name = ingredient.name;
		var id = ingredient.name;
		var sprite = name + ".PNG";
		var isInfinite = ($.inArray(name, this.InfiniteIngredients) > -1);
		return new gameIngredient(id, name, sprite, isInfinite);
	};*/

	


	
	/*
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
		if (!isSlotEmpty(slot)) { 
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
	};*/

	
	//Gets the description of the gameObject in slot
	// onMouseClick
	var getObjDesc = function(slot) {
		var obj = getObjFromSlot(slot);
		return (isSlotEmpty(slot)) ? false : obj.Desc();
	};

	// public
	/*
	this.GetObjType = function(slot) {
		var obj = getObjFromSlot(slot);		
		return (isSlotEmpty(slot)) ? false : obj.Type;
	};

	// public
	this.GetObjName = function(slot) {
		var obj = getObjFromSlot(slot);
		return (isSlotEmpty(slot)) ? false : obj.Name;
	};*/

	
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
			mouseClickCallbacks[i].onMouseClick(X, Y);
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
    

	var Actions = actions;
	var activeAction = Actions[0];
	var painter = new ActionBarPainter(actions, mouseTracker.RegisterClick);
    var bounds = painter.getBounds();

	this.getPainter = function() {
		return painter;
	}

	this.onMouseClick = function(x, y) {
		if (isWithinActionBar(x, y)){
			selectNewAction(x,y);
			painter.draw();
		}
	};

	this.getActiveAction = function() {
		return EnumActions.ToString(activeAction);
	};

	var isWithinActionBar = function(x, y) {
		return (bounds.left <= x && x <= bounds.right && bounds.bottom <= y && y <= bounds.top);
	};

	
	var selectNewAction = function(x ,y) {
		var index = getActionNumber(x, y);
		activeAction = Actions[index];
		painter.setSelector(index);
	};

	var getSelectedAction = function(x, y) {
		var index = getActionNumber(x, y);
		return Actions[index];
	};

	var getActionNumber = function(x, y) {
		return Math.floor(x / 64);
	};

	var getActions = function() {
		return Actions;
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
var gameRecipe = null;
var gameIngList = null;
var gameTitle = null;
var winFlag = false;


var GameSceneMatch = function(playground, actionHandler, grid){
	"use strict";
	if (GameSceneMatch.prototype._gameSceneMatch) {
        return GameSceneMatch.prototype._gameSceneMatch;
    }
    GameSceneMatch.prototype._gameSceneMatch = this;
    
    var handler = actionHandler;
	var mouseTracker = new MouseTracker();
	var gamePainter = new GamePainter(playground, mouseTracker);
	var recipe = new Recipe();
	var gameConnect = new GameConnect();
	var matchConsole = new MatchConsole();

	this.GameMode = 0;
	var actionBar = new ActionBar([
			EnumActions.Look,
			EnumActions.TurnOnOff,
			EnumActions.Mix,
			EnumActions.Peel
		], mouseTracker);


	var inventoryGrid = new InventoryGrid(matchConsole, actionBar);
	this.Init = function() {
		console.log("Match Scene -> Initializing.");
		
		//Load kitchen
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

		actionBar.addResetCallback(this);

		
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
			$.playground().addGroup(
				"endgame", {width: gameConfig.StageWidth, height: gameConfig.StageHeight}).addSprite(
				"victory", {animation: gameAnimations.victoryScreen, width: gameConfig.StageWidth, height: gameConfig.StageHeight}).end();
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
		if (event.action == "refresh") {
			drawScreen();
		}
		else {
			gameConnect.ReportCmdSucc(event.ID, event.targetID, event.action, event.message);

		}
	};

	this.onReset = function() {
		inventoryGrid.reset();
		gameConnect.requestReset();
	};

	var drawScreen = function() {
		gamePainter.draw();
		$.gameQuery.resourceManager.refresh();
	};

	this.GetPainters = function() {
		var painters = inventoryGrid.GetPainters();
		painters.push(recipe.getPainter());
		painters.push(matchConsole.GetPainter());
		painters.push(actionBar.getPainter());
		return painters;
	};
};

//////////////////
//Inventory Grid//
//////////////////
var InventoryGrid = function(_matchConsole, _actionBar) {
	"use strict";
	if (InventoryGrid.prototype._inventoryGrid) {
        return InventoryGrid.prototype._inventoryGrid;
    }
    InventoryGrid.prototype._inventoryGrid = this;

    /////////////////////////////
    // PRIVATE CLASS VARIABLES //
    /////////////////////////////
	

	var slotsPerRow = gameConfig.StageWidth / 64;
	
	var GameObjects = {};
	var objectHolder = new ObjectHolder();
	var gridPainter = new GridPainter();
	var matchConsole = _matchConsole;
	var onActionCallbacks = [];
	var actionBar = _actionBar;
	var mouseDownX, mouseDownY;
	var isMouseDown = false;

	////////////////////
	// PUBLIC METHODS //
	////////////////////

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
		mouseDownX = x - $("#grid").x();
		mouseDownY = y - $("#grid").y();
	};

	// public
	this.onMouseUp = function() {
		if (objectHolder.IsHolding()) {
			var obj = objectHolder.Pop();
			if (!setObjectAtPosition(obj.object, obj.x, obj.y)) {
				setObjectAtPosition(obj.object, obj.oldX, obj.oldY);
			}
			gridPainter.draw();
		}
	};

	// public
	this.onMouseDrag = function(x, y) {
		if (!objectHolder.IsHolding()) {
			var obj = removeObjectFromPosition(mouseDownX, mouseDownY);
			var tileX = mouseDownX % 64;
			var tileY = mouseDownY % 64;

			if (typeof obj !== 'undefined') {
				objectHolder.SetHoldingObject(obj, x - $("#grid").x(), y - $("#grid").y(), tileX, tileY);
			}
		}
		objectHolder.SetPosition(x - $("#grid").x(),y - $("#grid").y());
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

	// public
	this.GetPainters = function() {
		var painters = [];
		painters.push(gridPainter);
		return painters;
	};

	this.reset = function() {
		GameObjects = {};
		objectHolder.Pop();
		gridPainter.clear();
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
		if (obj instanceof Appliance) {
			return 0;
		}
		obj = GameObjects[slot - 1];
		if (obj instanceof Appliance) {
			return 1;
		}
		var width = slotsPerRow;
		obj = GameObjects[slot - width];	
		if (obj instanceof Appliance) {
			return 2;
		}
		obj = GameObjects[slot - width - 1];	
		if (obj instanceof Appliance) {
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
			gridPainter.removePainter(obj.getPainter());
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
			var isEmpty = appliance.IsEmpty(applianceSlot);
			if (!isEmpty) {
				toObj = appliance.GetObject(applianceSlot);
			}
			event = obj.ActOn(toObj);
		}
		else {
			toObj = GameObjects[slot];
			if (typeof toObj !== 'undefined') {
				event = obj.ActOn(toObj);
			}
			else 
			{
				if (setObjectAtSlot(obj, slot)) {
					var position = getSlotPosition(slot);
					var group = getGroupOfSlot(slot);
					obj.setConfiguration(slot, position.x, position.y, group);
					event = {action:"refresh"};
				}
			}
		}
		if (typeof event !== 'undefined') {
			performAction(event);
			return true;
		}
		return false;
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
		if (obj instanceof Appliance) {
			return obj;
		}
		return undefined;
	};

	// setObjectAtPosition
	var setObjectAtSlot = function(obj, slot) {
		if (isSlotEmpty(slot)) {
			GameObjects[slot] = obj;
			gridPainter.addPainter(obj.getPainter());
			return true;
		}
		return false;
	};

	// setObjectAtPosition
	var performAction = function(event) {
		for (var i = 0; i < onActionCallbacks.length; i++) {
			onActionCallbacks[i].onAction(event);
		}
	};	
	
	// getApplianceSlots, getContainerSlots, getIngredientContainerSlots
	var getSlot = function(gx, gy) {
		var slot = getObjectSlotFromPosition(gx, gy);

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
		slot = parseInt(slot, 10);
		var row = Math.floor(slot / slotsPerRow),
			column = slot % slotsPerRow;

		var x = column * 64,
			y = row * 64;

		return {"x": x, "y": y};
	};

	var getTransformedSlotPosition = function(slot) {
		slot = parseInt(slot, 10);
		var row = Math.floor(slot / slotsPerRow),
			column = slot % slotsPerRow;

		var x = column * 64,
			y = row * 64;

		var group = getGroupOfSlot(slot);
		if (typeof group !== "") {
			var groupObj = $("#" + group.toString());
			if (groupObj.length !== 0) {
				x -= groupObj.x();
				y -= groupObj.y();
			}
		}

		return {"x": x, "y": y};
	};

	var getGroupOfSlot = function(slot) {
		slot = parseInt(slot, 10);
		var row = Math.floor(slot / slotsPerRow);
		if (row <= 2) {
			return "appliances";
		}
		if (row <= 3) {
			return "containers";
		}
		if (row <= 4) {
			return "ingredients";
		}
		return "";
	};

	// getObjectGroupPosition, getSlotPosition
	var getGroupOfObject = function(object) {
		var group;
		if (object instanceof Container) {
			group = "containers";
		}
		else if (object instanceof IngredientContainer) {
			group = "ingredients";
		}
		else if (object instanceof Appliance) {
			group = "appliances";
		}
		return group;
	};

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
				slots.push(slot.toString());
			}
		}
		return slots;
	};

	// onMessage
	var loadStateFromMsg = function(stateMsg)
	{
		var stateMessageReader = new StateMessageReader();
		var state = stateMessageReader.getStateFromMessage(stateMsg);

		assignSlots(state.appliances, state.containers, state.ingredients);
		updatePainter();
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

			var foundObject = removeObjectFromList(object, appliances);
			if (typeof foundObject !== 'undefined') {
				tempSlots[slot] = foundObject;
				removeItemFromList(slot, applianceSlots);
			}
			else {
				foundObject = removeObjectFromList(object, workingContainers);
				if (typeof foundObject !== 'undefined') {
					tempSlots[slot] = foundObject;
					removeItemFromList(slot, workingContainerSlots);
				}
				else {
					foundObject = removeObjectFromList(object, ingredientContainers);
					if (typeof foundObject !== 'undefined') {
						tempSlots[slot] = foundObject;
						removeItemFromList(slot, ingredientContainerSlots);
					}
				}
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
		var width = slotsPerRow;
		var rows = Math.floor(startPosition.y / 64);
		var columns = Math.floor(startPosition.x / 64);
		var startSlot = rows * width + columns;
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
		var removedObject;
		for (var i = 0; i < list.length; i++) {
			if (obj.Name == list[i].Name) {
				removedObject = list[i];
				list.splice(i, 1);
			}
		}
		return removedObject;
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
			//obj.setSlot(slot);
		}
	}

	// assignSlots
	var setPositions = function(objects) {
		var obj,
			position,
			groupPosition,
			group;

		for (var slot in objects) {
			obj = objects[slot];
			group = getGroupOfObject(obj);
			groupPosition = getGroupPosition(group);
			position = getSlotPosition(slot);
			obj.setConfiguration(slot, position.x - groupPosition.x, position.y - groupPosition.y, group);
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

	var getObjDesc = function(slot) {
		var obj = getObjFromSlot(slot);
		return (isSlotEmpty(slot)) ? false : obj.Desc();
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
	
	// This implementation seems like it would get a bit resource intensive if Lines gets very long
	this.Write = function(line) {
		var lines = line.split("\n");
		for (var i = 0; i < lines.length; i++) {
			Lines.push(lines[i]);
		}
		painter.setText(Lines);
		painter.draw();
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
    
	var performReset = function() {
		activeAction = Actions[0];
		painter.setSelector(0);
    	for (var i = 0; i < resetCallbacks.length; i++) {
    		resetCallbacks[i].onReset();
    	}
    };

	var Actions = actions;
	var activeAction = Actions[0];
	var painter = new ActionBarPainter(actions, mouseTracker.RegisterClick, performReset);
    var bounds = painter.getBounds();
    var resetCallbacks = [];

    this.addResetCallback = function(callback) {
    	resetCallbacks.push(callback);
    };

	this.getPainter = function() {
		return painter;
	};

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
		if (object instanceof IngredientContainer) {
			if (target instanceof Ingredient) {
				return "";
			}
			else if (target instanceof Container) {
				return "pour";
			}
			else if (target instanceof IngredientContainer) {
				return "pour";
			}
			else {
				return "";
			}
		}
		else if (object instanceof Container) {
			if (target instanceof Ingredient) {
				return "";
			}
			else if (target instanceof Container) {
				return "pour";
			}
			else if (target instanceof IngredientContainer) {
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
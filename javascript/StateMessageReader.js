var StateMessageReader = function() {
	var ObjectsToIgnore = [
		"counter","shelf"
	];

	this.getStateFromMessage = function(stateMsg) {
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
		return {appliances:applianceObjects, containers:containerObjects, ingredients:ingredientContainerObjects};
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
		var toRemoveNames = getNamesFromList(toRemove);
		var containerNames = getNamesFromList(containers);

		for (var i = containers.length - 1; i >= 0; i--) {
			if ($.inArray(containerNames[i], toRemoveNames) == -1) {
				remainingContainers.push(containers[i]);
			}
		}
		return remainingContainers;
	};

	var getNamesFromList = function(list) {
		var names = [];
		for (var i = 0; i < list.length; i++) {
			names.push(list[i].Name);
		}
		return names;
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
		var containers = [];
		
		for (var i=0; i < appliances.length; i++) {
			containers = getContainerObjects(appliances[i].contains, containerObjects, ingredientContainerObjects); 
			Array.prototype.push.apply(containersInAppliances, containers);
			var applianceObj = getNewApplianceFromMsg(appliances[i], containers);
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
		return new Appliance(id, name, sprite, containers);
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
		return new Container(id, name, sprite);
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
				var containerObj = getNewIngredientContainerFromMsg(container, ingredientObject);
			ingredientContainersList.push(containerObj);
			}
			
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
		return new IngredientContainer(name, id, sprite, ingredient.name);
	};	
};
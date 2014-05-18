//////////////////
//Action Handler//
//////////////////
var brownieHandler = {
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
};
//////////
//Recipe//
//////////
var recipeBrownies = [
"Preheat oven to 350 degrees F (175 degrees C).",						//0
"Grease and flour an 8-inch square pan.",								//1
"In a large saucepan, melt 1/2 cup butter.",							//2
//"Remove from heat.",
"Stir in sugar, eggs, and 1 teaspoon vanilla.",							//3
"Beat in 1/3 cup cocoa, 1/2 cup flour, salt, and baking powder.",		//4
"Spread batter into prepared pan.",										//5
"Bake in preheated oven for 25 to 30 minutes. Do not overcook."			//6
];
var recipeGnocchi = [
"Bring a large pot of salted water to a boil.",
"Peel potatoes and add to pot. Cook until tender but still firm, about 15 minutes.",
"Drain, cool and mash with a fork or potato masher.",
"Combine 1 cup mashed potato, flour and egg in a large bowl. Knead until dough forms a ball.",
"Shape small portions of the dough into long snakes.",
"On a floured surface, cut snakes into half-inch pieces.",
"Bring a large pot of lightly salted water to a boil.",
"Drop in gnocchi and cook for 3 to 5 minutes or until gnocchi have risen to the top; drain and serve."
];


////////////////////
//Ingredients List//
////////////////////
var ingListGnocchi = [
	"IngEgg", "Eggs", true,
	"IngPotatoes", "Potatoes", false,
	"IngCupOfFlour", "Cup of Flour", true,
	"IngWater", "Water", true,
	"IngSaltTbsp", "Tablespoon of Salt", false,
	"IngSaltDash", "Dash of Salt", false
];

var ingListBrownies = [
	"IngEgg", "Eggs", true,
	"IngSugar", "Sugar", true,
	"IngCupOfFlour", "Flour", true,
	"IngCocoaPowder", "Cocoa Powder", true,
	"IngButter", "Butter", true,
	"IngWater", "Water", true,
	"IngSaltTbsp", "Salt", true,
	"IngBakingPowder", "Baking Powder", true,
	"IngVanillaExtract", "Vanilla Extract", true
];



//////////////////
//Action Handler//
//////////////////
var gnocchiHandler = {
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

var brownieHandler = {
	ColdOvenFlag: false,

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
				if (gameObjects["AppOven"].IsEmpty()) 
				{
					$("#rlist0").css({"color":"orange"});
				}
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
				if (actionHandler.VerifyContents(gobj, ["IngButterMelted", "IngEgg", "IngSugar", "IngVanillaExtract"])) {
					matchConsole.Write("Player 1 stirred Eggs, Sugar and Vanilla into the Melted Butter!");
					$("#rlist3").css({"color":"orange"});
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngBatterPrecursor", "Partially Completed Batter", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngBatterPrecursor", "IngCocoaPowder", "IngBakingPowder", "IngCupOfFlour", "IngSaltTbsp"])) {
					matchConsole.Write("Player 1 beat Cocoa, Baking Powder, Flour and Salt into the Batter!");
					$("#rlist4").css({"color":"orange"});
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngBatter", "Brownie Batter", ""));
				}
				break;
				
			case "ContBowlLarge":
				if (actionHandler.VerifyContents(gobj, ["IngButterMelted", "IngEgg", "IngSugar", "IngVanillaExtract"])) {
					matchConsole.Write("Player 1 stirred Eggs, Sugar and Vanilla into the Melted Butter!");
					$("#rlist3").css({"color":"orange"});
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngBatterPrecursor", "Partially Completed Batter", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngBatterPrecursor", "IngCocoaPowder", "IngBakingPowder", "IngCupOfFlour", "IngSaltTbsp"])) {
					matchConsole.Write("Player 1 beat Cocoa, Baking Powder, Flour and Salt into the Batter!");
					$("#rlist4").css({"color":"orange"});
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngBatter", "Brownie Batter", ""));
				}
				break;
				
			case "ContCuttingBoard":
				break;
				
			case "ContCuttingBoardFloured":
				break;
				
			case "ContBakingDish":
				if (actionHandler.VerifyContents(gobj, ["IngButter"])) {
					matchConsole.Write("Player 1 greased the baking dish!");
					gobj.Contains.length = 0;
					inventoryGrid.GameObjects[slot] = gameObjects["ContBakingDishGreased"];
				} else if (actionHandler.VerifyContents(gobj, ["IngButterMelted", "IngEgg", "IngSugar", "IngVanillaExtract"])) {
					matchConsole.Write("Player 1 stirred Eggs, Sugar and Vanilla into the Melted Butter!");
					$("#rlist3").css({"color":"orange"});
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngBatterPrecursor", "Partially Completed Batter", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngBatterPrecursor", "IngCocoaPowder", "IngBakingPowder", "IngCupOfFlour", "IngSaltTbsp"])) {
					matchConsole.Write("Player 1 beat Cocoa, Baking Powder, Flour and Salt into the Batter!");
					$("#rlist4").css({"color":"orange"});
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngBatter", "Brownie Batter", ""));
				}
				break;
			
			case "ContBakingDishGreased":
				if (actionHandler.VerifyContents(gobj, ["IngCupOfFlour"])) {
					$("#rlist1").css({"color":"orange"});
					matchConsole.Write("Player 1 floured the baking dish!");
					gobj.Contains.length = 0;
					inventoryGrid.GameObjects[slot] = gameObjects["ContBakingDishGreasedFloured"];
				}
				break;
			
			case "ContBakingDishGreasedFloured":
				if (actionHandler.VerifyContents(gobj, ["IngBatter"])) {
					matchConsole.Write("Player 1 spread the batter in the baking dish!");
					$("#rlist5").css({"color":"orange"});
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngBatterSpread", "Spread Brownie Batter", ""));
				}
				break;
			
			case "ContSaucepanLarge":
				if (actionHandler.VerifyContents(gobj, ["IngButterMelted", "IngEgg", "IngSugar", "IngVanillaExtract"])) {
					matchConsole.Write("Player 1 stirred Eggs, Sugar and Vanilla into the Melted Butter!");
					$("#rlist3").css({"color":"orange"});
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngBatterPrecursor", "Partially Completed Batter", ""));
				} else if (actionHandler.VerifyContents(gobj, ["IngBatterPrecursor", "IngCocoaPowder", "IngBakingPowder", "IngCupOfFlour", "IngSaltTbsp"])) {
					matchConsole.Write("Player 1 beat Cocoa, Baking Powder, Flour and Salt into the Batter!");
					$("#rlist4").css({"color":"orange"});
					gobj.Contains.length = 0;
					gobj.AddTo(new gameIngredient("IngBatter", "Brownie Batter", ""));
				}
				break;
		}
	},
	
	UpdateAppliances: function() {
		//Check stove top
		try {
			//Cold oven checking for preheat purposes
			if (gameObjects["AppOven"].IsEmpty() && gameObjects["AppOvenOn"].IsEmpty())
				actionHandler.ColdOvenFlag = false;
			else if (!gameObjects["AppOven"].IsEmpty())
				actionHandler.ColdOvenFlag = true;
				
			//Stovetop
			if (!gameObjects["AppStoveTopOn"].IsEmpty()) {
				if (actionHandler.VerifyContents(gameObjects["AppStoveTopOn"].Contains[0], ["IngButter"])) {
					matchConsole.Write("The butter melted in the saucepan!");
					$("#rlist2").css({"color":"orange"});
					gameObjects["AppStoveTopOn"].Contains[0].Contains.length = 0;
					gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngButterMelted", "Melted Butter", ""));
				}
			}
			
			if (!gameObjects["AppOvenOn"].IsEmpty()) {
				if (actionHandler.VerifyContents(gameObjects["AppOvenOn"].Contains[0], ["IngBatterSpread"])) {
					if (actionHandler.ColdOvenFlag) {
						matchConsole.Write("The oven was not preheated.  The brownies are undercooked!");
						gameObjects["AppOvenOn"].Contains[0].Contains.length = 0;
						gameObjects["AppOvenOn"].Contains[0].AddTo(new gameIngredient("IngFailBrownies", "Chocolate Failure", ""));
					} else {
						matchConsole.Write("The brownies cook perfectly in the preheated oven!");
						gameObjects["AppOvenOn"].Contains[0].Contains.length = 0;
						gameObjects["AppOvenOn"].Contains[0].AddTo(new gameIngredient("IngBrownies", "Delicious Brownies", ""));
						$("#rlist6").css({"color":"orange"});
						winFlag = true;
					}
				} else if (actionHandler.VerifyContents(gameObjects["AppOvenOn"].Contains[0], ["IngBatter"])) {
					if (actionHandler.ColdOvenFlag) {
						matchConsole.Write("The batter was not spread out properly so the result is big lump!");
						gameObjects["AppOvenOn"].Contains[0].Contains.length = 0;
						gameObjects["AppOvenOn"].Contains[0].AddTo(new gameIngredient("IngFailBrownies", "Chocolate Failure", ""));
					}
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
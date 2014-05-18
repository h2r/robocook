//////////
//Recipe//
//////////
var recipeBrownies = [
"Recipe: Brownies",
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
"Recipe: Gnocchi",
"Bring a large pot of salted water to a boil.",											//0
"Peel potatoes and add to pot.  Cook until tender and drain.",							//1
"Let cool and mash.",																	//2
"Combine mashed potato, flour and egg in a large bowl.",								//3
"Knead the dough into a ball.",														//4
"Shape small portions of the dough into long snakes.",									//5
"On a floured cutting board, cut snakes into half-inch pieces.",						//6
"Bring another large pot of salted water to a boil.",									//7
"Drop in gnocchi and cook for 3 to 5 minutes or until gnocchi have risen to the top."	//8
];


////////////////////
//Ingredients List//
////////////////////
var ingListGnocchi = [
	"IngEgg", "Eggs", true,
	"IngPotatoes", "Potatoes", true,
	"IngCupOfFlour", "Cup of Flour", true,
	"IngWater", "Water", true,
	"IngSalt", "Salt", true,
];

var ingListBrownies = [
	"IngEgg", "Eggs", true,
	"IngSugar", "Sugar", true,
	"IngCupOfFlour", "Flour", true,
	"IngCocoaPowder", "Cocoa Powder", true,
	"IngButter", "Butter", true,
	"IngWater", "Water", true,
	"IngSalt", "Salt", true,
	"IngBakingPowder", "Baking Powder", true,
	"IngVanillaExtract", "Vanilla Extract", true
];


//////////////////
//Action Handler//
//////////////////
var gnocchiHandler = {
	HandleAction: function(gobj, slot, action)	{
		var succ = false;
		switch (gobj.ID) {
			case "IngPotatoes":
				if (action === EnumActions.Peel) {
					matchConsole.Write("Player 1 peeled the potatoes.");
					succ = true;
					var nobj = new gameIngredient("IngPotatoesPeeled", "Peeled Potatoes", "IngPotatoesPeeled.PNG", true);
					inventoryGrid.GameObjects[slot] = nobj;
					inventoryGrid.ChangeSlotAnim(slot, nobj.Anim);
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "AppOven":
				if (action === EnumActions.TurnOnOff) {
					matchConsole.Write("Player 1 turned the oven on.");
					succ = true;
					actionHandler.SwapAppliances(slot, gameObjects["AppOven"], gameObjects["AppOvenOn"]);
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "AppOvenOn":
				if (action === EnumActions.TurnOnOff) {
					matchConsole.Write("Player 1 turned the oven off.");
					succ = true;
					actionHandler.SwapAppliances(slot, gameObjects["AppOvenOn"], gameObjects["AppOven"]);
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "AppStoveTop":
				if (action === EnumActions.TurnOnOff) {
					matchConsole.Write("Player 1 turned the stove top on.");
					succ = true;
					actionHandler.SwapAppliances(slot, gameObjects["AppStoveTop"], gameObjects["AppStoveTopOn"]);
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "AppStoveTopOn":
				if (action === EnumActions.TurnOnOff) {
					matchConsole.Write("Player 1 turned the stove top off.");
					succ = true;
					actionHandler.SwapAppliances(slot, gameObjects["AppStoveTopOn"], gameObjects["AppStoveTop"]);
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "ContPotLarge":
				if (action === EnumActions.Use) {
					if (actionHandler.VerifyContents(gobj, ["IngTenderPotatoes", "IngSaltedWater"])) {
						matchConsole.Write("Player 1 drained the water from the pot!");
						succ = true;
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngTenderPotatoes", "Tender Potatoes", ""));
					} else if (actionHandler.VerifyContents(gobj, ["IngCookedGnocchi", "IngSaltedWaterLight"])) {
						matchConsole.Write("Player 1 drained the water from the pot!");
						succ = true;
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngCookedGnocchi", "Cooked Gnocchi", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}	
				} else if (action === EnumActions.Mix) {
					if (actionHandler.VerifyContents(gobj, ["IngTenderPotatoes"])) {
						matchConsole.Write("Player 1 mashed the tender potatoes!");
						succ = true;
						$("#rlist2").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngMashedPotatoes", "Mashed Potatoes", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}	
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "ContBowlLarge":
				if (action === EnumActions.Mix) {
					if (actionHandler.VerifyContents(gobj, ["IngMashedPotatoes", "IngEgg", "IngCupOfFlour"])) {
						matchConsole.Write("Player 1 combined the ingredients into dough!");
						succ = true;
						$("#rlist3").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngDough", "Dough", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else if (action === EnumActions.Shape) {
					if (actionHandler.VerifyContents(gobj, ["IngDough"])) {
						matchConsole.Write("Player 1 kneaded the dough into a ball!");
						succ = true;
						$("#rlist4").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngDoughBall", "Ball of Dough", ""));
					} else if (actionHandler.VerifyContents(gobj, ["IngDoughBall"])) {
						matchConsole.Write("Player 1 shaped the dough into snakes!");
						succ = true;
						$("#rlist5").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngDoughSnakes", "Snakes of Dough", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "ContCuttingBoard":
				if (action === EnumActions.Spread) {
					if (actionHandler.VerifyContents(gobj, ["IngCupOfFlour"])) {
						matchConsole.Write("Player 1 floured the cutting board!");
						succ = true;
						gobj.Contains.length = 0;
						inventoryGrid.GameObjects[slot] = gameObjects["ContCuttingBoardFloured"];
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "ContCuttingBoardFloured":
				if (action === EnumActions.Cut) {
					if (actionHandler.VerifyContents(gobj, ["IngDoughSnakes"])) {
						matchConsole.Write("Player 1 cut the snakes into half-inch pieces of raw gnocchi!");
						succ = true;
						$("#rlist6").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngRawGnocchi", "Raw Gnocchi", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
		}
		if (succ) {
			gameConnect.ReportCmdSucc(gobj.ID, gobj.ID, EnumActions.ToString(action), matchConsole.Peek());
		}
	},
	
	UpdateAppliances: function() {
		try {
			//Check stove top
			if (gameObjects["AppStoveTopOn"].Contains.length > 0) {
				if (actionHandler.VerifyContents(gameObjects["AppStoveTopOn"].Contains[0], ["IngWater", "IngSalt"])) {
					matchConsole.Write("The salt and water are brought to a boil!");
					gameObjects["AppStoveTopOn"].Contains[0].Contains.length = 0;
					gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngBoilingSaltedWater", "Boiling Salted Water", ""));
					gameConnect.ReportTransform("IngWater, IngSalt","AppOvenOn","IngBoilingSaltedWater",matchConsole.Peek());
					$("#rlist0").css({"color":"orange"});
					$("#rlist7").css({"color":"orange"});
				} else if (actionHandler.VerifyContents(gameObjects["AppStoveTopOn"].Contains[0], ["IngBoilingSaltedWater", "IngPotatoesPeeled"])) {
					matchConsole.Write("The potatoes boiled in the salted water!  Now they are nice and tender.");
					gameObjects["AppStoveTopOn"].Contains[0].Contains.length = 0;
					gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngTenderPotatoes", "Tender Potatoes", ""));
					gameConnect.ReportTransform("IngBoilingSaltedWater, IngPotatoesPeeled","AppOvenOn","IngTenderPotatoes",matchConsole.Peek());
					$("#rlist1").css({"color":"orange"});
					//gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngSaltedWater", "Salted Water", ""));
				} else if (actionHandler.VerifyContents(gameObjects["AppStoveTopOn"].Contains[0], ["IngBoilingSaltedWater", "IngRawGnocchi"])) {
					matchConsole.Write("The gnocchi cooked until they rose to the top!");
					gameObjects["AppStoveTopOn"].Contains[0].Contains.length = 0;
					gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngCookedGnocchi", "Cooked Gnocchi", ""));
					gameConnect.ReportTransform("IngBoilingSaltedWater, IngRawGnocchi","AppOvenOn","IngCookedGnocchi",matchConsole.Peek());
					$("#rlist8").css({"color":"orange"});
					winFlag = true;
					//gameObjects["AppStoveTopOn"].Contains[0].AddTo(new gameIngredient("IngSaltedWater", "Salted Water", ""));
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

var generalHandler = {
	ColdOvenFlag: false,

	HandleAction: function(gobj, slot, action)	{
		var succ = false;

		//matchConsole.Write("gobj: " + gobj.ToString() + ", slot: " + slot.ToString() + ", action: " + action.ToString());
		gameConnect.ReportCmdSucc(gobj.ID, gobj.ID, EnumActions.ToString(action), matchConsole.Peek());		
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
					//Report to server
					gameConnect.ReportTransform("IngButter","AppStoveTopOn","IngButterMelted",matchConsole.Peek());
				}
			}
			
			if (!gameObjects["AppOvenOn"].IsEmpty()) {
				if (actionHandler.VerifyContents(gameObjects["AppOvenOn"].Contains[0], ["IngBatterSpread"])) {
					if (actionHandler.ColdOvenFlag) {
						matchConsole.Write("The oven was not preheated.  The brownies are undercooked!");
						gameObjects["AppOvenOn"].Contains[0].Contains.length = 0;
						gameObjects["AppOvenOn"].Contains[0].AddTo(new gameIngredient("IngFailBrownies", "Chocolate Failure", ""));
						gameConnect.ReportTransform("IngBatterSpread","AppOvenOn","IngFailBrownies",matchConsole.Peek());
					} else {
						matchConsole.Write("The brownies cook perfectly in the preheated oven!");
						gameObjects["AppOvenOn"].Contains[0].Contains.length = 0;
						gameObjects["AppOvenOn"].Contains[0].AddTo(new gameIngredient("IngBrownies", "Delicious Brownies", ""));
						$("#rlist6").css({"color":"orange"});
						gameConnect.ReportTransform("IngBatterSpread","AppOvenOn","IngBrownies",matchConsole.Peek());
						winFlag = true;
					}
				} else if (actionHandler.VerifyContents(gameObjects["AppOvenOn"].Contains[0], ["IngBatter"])) {
					if (actionHandler.ColdOvenFlag) {
						matchConsole.Write("The batter was not spread out properly so the result is big lump!");
						gameObjects["AppOvenOn"].Contains[0].Contains.length = 0;
						gameObjects["AppOvenOn"].Contains[0].AddTo(new gameIngredient("IngFailBrownies", "Chocolate Failure", ""));
						gameConnect.ReportTransform("IngBatter","AppOvenOn","IngFailBrownies",matchConsole.Peek());
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
				//console.log(gobj.Contains[j].ID + " vs " + arr[i]);
				if (gobj.Contains[j].ID === arr[i]) {
					console.log("Match!");
					found = true;
				}
			}
			if (!found) return false;
		}
		return true;
	}
}


/////////////
//BROWNIES!//
/////////////
var brownieHandler = {
	ColdOvenFlag: false,

	HandleAction: function(gobj, slot, action)	{
		var succ = false;
		switch (gobj.ID) {				
			case "AppOven":
				if (action === EnumActions.TurnOnOff) {
					matchConsole.Write("Player 1 turned the oven on.");
					succ = true;
					if (gameObjects["AppOven"].IsEmpty()) 
					{
						$("#rlist0").css({"color":"orange"});
					}
					actionHandler.SwapAppliances(slot, gameObjects["AppOven"], gameObjects["AppOvenOn"]);
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "AppOvenOn":
				if (action === EnumActions.TurnOnOff) {
					matchConsole.Write("Player 1 turned the oven off.");
					succ = true;
					actionHandler.SwapAppliances(slot, gameObjects["AppOvenOn"], gameObjects["AppOven"]);
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "AppStoveTop":
				if (action === EnumActions.TurnOnOff) {
					matchConsole.Write("Player 1 turned the stove top on.");
					succ = true;
					actionHandler.SwapAppliances(slot, gameObjects["AppStoveTop"], gameObjects["AppStoveTopOn"]);
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "AppStoveTopOn":
				if (action === EnumActions.TurnOnOff) {
					matchConsole.Write("Player 1 turned the stove top off.");
					succ = true;
					actionHandler.SwapAppliances(slot, gameObjects["AppStoveTopOn"], gameObjects["AppStoveTop"]);
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "ContPotLarge":
				if (action === EnumActions.Mix) {
					if (actionHandler.VerifyContents(gobj, ["IngButterMelted", "IngEgg", "IngSugar", "IngVanillaExtract"])) {
						matchConsole.Write("Player 1 stirred Eggs, Sugar and Vanilla into the Melted Butter!");
						$("#rlist3").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngBatterPrecursor", "Partially Completed Batter", ""));
					} else if (actionHandler.VerifyContents(gobj, ["IngBatterPrecursor", "IngCocoaPowder", "IngBakingPowder", "IngCupOfFlour", "IngSalt"])) {
						matchConsole.Write("Player 1 beat Cocoa, Baking Powder, Flour and Salt into the Batter!");
						$("#rlist4").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngBatter", "Brownie Batter", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "ContBowlLarge":
				if (action === EnumActions.Mix) {
					if (actionHandler.VerifyContents(gobj, ["IngButterMelted", "IngEgg", "IngSugar", "IngVanillaExtract"])) {
						matchConsole.Write("Player 1 stirred Eggs, Sugar and Vanilla into the Melted Butter!");
						succ = true;
						$("#rlist3").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngBatterPrecursor", "Partially Completed Batter", ""));
					} else if (actionHandler.VerifyContents(gobj, ["IngBatterPrecursor", "IngCocoaPowder", "IngBakingPowder", "IngCupOfFlour", "IngSalt"])) {
						matchConsole.Write("Player 1 beat Cocoa, Baking Powder, Flour and Salt into the Batter!");
						succ = true;
						$("#rlist4").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngBatter", "Brownie Batter", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else {
						matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
				
			case "ContCuttingBoard":
				matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				break;
				
			case "ContBakingDish":
				if (action === EnumActions.Mix) {
					if (actionHandler.VerifyContents(gobj, ["IngButterMelted", "IngEgg", "IngSugar", "IngVanillaExtract"])) {
						matchConsole.Write("Player 1 stirred Eggs, Sugar and Vanilla into the Melted Butter!");
						succ = true;
						$("#rlist3").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngBatterPrecursor", "Partially Completed Batter", ""));
					} else if (actionHandler.VerifyContents(gobj, ["IngBatterPrecursor", "IngCocoaPowder", "IngBakingPowder", "IngCupOfFlour", "IngSalt"])) {
						matchConsole.Write("Player 1 beat Cocoa, Baking Powder, Flour and Salt into the Batter!");
						succ = true;
						$("#rlist4").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngBatter", "Brownie Batter", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else if (action === EnumActions.Spread) {
					if (actionHandler.VerifyContents(gobj, ["IngButter"])) {
						matchConsole.Write("Player 1 greased the baking dish!");
						succ = true;
						gobj.Contains.length = 0;
						inventoryGrid.GameObjects[slot] = gameObjects["ContBakingDishGreased"];
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
			
			case "ContBakingDishGreased":
				if (action === EnumActions.Spread) {
					if (actionHandler.VerifyContents(gobj, ["IngCupOfFlour"])) {
						$("#rlist1").css({"color":"orange"});
						matchConsole.Write("Player 1 floured the baking dish!");
						succ = true;
						gobj.Contains.length = 0;
						inventoryGrid.GameObjects[slot] = gameObjects["ContBakingDishGreasedFloured"];
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
			
			case "ContBakingDishGreasedFloured":
				if (action === EnumActions.Spread) {
					if (actionHandler.VerifyContents(gobj, ["IngBatter"])) {
							matchConsole.Write("Player 1 spread the batter in the baking dish!");
							succ = true;
							$("#rlist5").css({"color":"orange"});
							gobj.Contains.length = 0;
							gobj.AddTo(new gameIngredient("IngBatterSpread", "Spread Brownie Batter", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
			
			case "ContSaucepanLarge":
				if (action === EnumActions.Mix) {
					if (actionHandler.VerifyContents(gobj, ["IngButterMelted", "IngEgg", "IngSugar", "IngVanillaExtract"])) {
						matchConsole.Write("Player 1 stirred Eggs, Sugar and Vanilla into the Melted Butter!");
						succ = true;
						$("#rlist3").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngBatterPrecursor", "Partially Completed Batter", ""));
					} else if (actionHandler.VerifyContents(gobj, ["IngBatterPrecursor", "IngCocoaPowder", "IngBakingPowder", "IngCupOfFlour", "IngSalt"])) {
						matchConsole.Write("Player 1 beat Cocoa, Baking Powder, Flour and Salt into the Batter!");
						succ = true;
						$("#rlist4").css({"color":"orange"});
						gobj.Contains.length = 0;
						gobj.AddTo(new gameIngredient("IngBatter", "Brownie Batter", ""));
					} else {
						matchConsole.Write("That didn't accomplish anything!");
					}
				} else {
					matchConsole.Write("Command " + EnumActions.ToString(action) + " is invalid for that!");
				}
				break;
		}
		if (succ) {
			gameConnect.ReportCmdSucc(gobj.ID, gobj.ID, EnumActions.ToString(action), matchConsole.Peek());
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
					//Report to server
					gameConnect.ReportTransform("IngButter","AppStoveTopOn","IngButterMelted",matchConsole.Peek());
				}
			}
			
			if (!gameObjects["AppOvenOn"].IsEmpty()) {
				if (actionHandler.VerifyContents(gameObjects["AppOvenOn"].Contains[0], ["IngBatterSpread"])) {
					if (actionHandler.ColdOvenFlag) {
						matchConsole.Write("The oven was not preheated.  The brownies are undercooked!");
						gameObjects["AppOvenOn"].Contains[0].Contains.length = 0;
						gameObjects["AppOvenOn"].Contains[0].AddTo(new gameIngredient("IngFailBrownies", "Chocolate Failure", ""));
						gameConnect.ReportTransform("IngBatterSpread","AppOvenOn","IngFailBrownies",matchConsole.Peek());
					} else {
						matchConsole.Write("The brownies cook perfectly in the preheated oven!");
						gameObjects["AppOvenOn"].Contains[0].Contains.length = 0;
						gameObjects["AppOvenOn"].Contains[0].AddTo(new gameIngredient("IngBrownies", "Delicious Brownies", ""));
						$("#rlist6").css({"color":"orange"});
						gameConnect.ReportTransform("IngBatterSpread","AppOvenOn","IngBrownies",matchConsole.Peek());
						winFlag = true;
					}
				} else if (actionHandler.VerifyContents(gameObjects["AppOvenOn"].Contains[0], ["IngBatter"])) {
					if (actionHandler.ColdOvenFlag) {
						matchConsole.Write("The batter was not spread out properly so the result is big lump!");
						gameObjects["AppOvenOn"].Contains[0].Contains.length = 0;
						gameObjects["AppOvenOn"].Contains[0].AddTo(new gameIngredient("IngFailBrownies", "Chocolate Failure", ""));
						gameConnect.ReportTransform("IngBatter","AppOvenOn","IngFailBrownies",matchConsole.Peek());
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
				//console.log(gobj.Contains[j].ID + " vs " + arr[i]);
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
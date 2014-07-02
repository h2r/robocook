"use strict";

//////////
//Recipe//
//////////
var recipeBrownies = [
"Recipe: Brownies",
"Preheat oven to 350 degrees F (175 degrees C).",                       //0
"Grease and flour an 8-inch square pan.",                               //1
"In a large saucepan, melt 1/2 cup butter.",                            //2
//"Remove from heat.",
"Stir in sugar, eggs, and 1 teaspoon vanilla.",                         //3
"Beat in 1/3 cup cocoa, 1/2 cup flour, salt, and baking powder.",       //4
"Spread batter into prepared pan.",                                     //5
"Bake in preheated oven for 25 to 30 minutes. Do not overcook."         //6
];
var recipeGnocchi = [
"Recipe: Gnocchi",
"Bring a large pot of salted water to a boil.",                                         //0
"Peel potatoes and add to pot.  Cook until tender and drain.",                          //1
"Let cool and mash.",                                                                   //2
"Combine mashed potato, flour and egg in a large bowl.",                                //3
"Knead the dough into a ball.",                                                     //4
"Shape small portions of the dough into long snakes.",                                  //5
"On a floured cutting board, cut snakes into half-inch pieces.",                        //6
"Bring another large pot of salted water to a boil.",                                   //7
"Drop in gnocchi and cook for 3 to 5 minutes or until gnocchi have risen to the top."   //8
];

var GeneralHandler = function(){
    
    this.HandleAction = function(gobj, slot, action)  {
        var succ = false;
        gameConnect.ReportCmdSucc(gobj.ID, gobj.ID, EnumActions.ToString(action), matchConsole.Peek());     
    },
    
    this.UpdateAppliances = function() {
        
    };
    
    this.SwapAppliances = function(slot, oapp, napp) {

    },
    
    this.VerifyContents = function(gobj, arr) {

    }
};

var Recipe = function() {

    var painter = new RecipePainter();

    this.onMessage = function(msg) {
        if ('recipe' in msg) {
            painter.setText(msg.recipe);
        }
        if ('status' in msg) {
            painter.setStatus(msg.status);
        };
    };

    this.getPainter = function() {
        return painter;
    };
};
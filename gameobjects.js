"use strict";

//GameObject enums
var EnumGOType = {
    App: 0,     //Appliances like stove
    Cont: 1,    //Container
    IngContainer: 2,
    Ing: 3,     //Ingredients like eggs
    Tool: 4,        //Tools like knife
    Empty: 5
};

//Game Object
function gameObject(id, name, type, sprite, fnDesc)
{
    this.Name = name;
    this.ID = id;
    this.Type = type;
    this.Sprite = sprite;
    this.Slot = "";
    this.IsMovable = false;
    
    if (!this.Sprite) {
        this.Anim = null;
    } else {
        this.Anim = new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite});
    }

    this.Desc = fnDesc || "This is a " + this.Name;
    
    //Slot management
    //this.SetSlot = function(slot) { this.Slot = slot; }
}

///////////////////
//Game Ingredient//
///////////////////
function gameIngredient(id, name, sprite, infinite, fnDesc)
{
    this.Name = name;
    this.ID = id;
    this.Type = EnumGOType.Ing;
    this.Sprite = sprite;
    this.IsMovable = false;
    
    
    if (infinite) this.Infinite = infinite;
    else this.Infinite = false;
    
    this.Anim = (this.Sprite) ? new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite}) : null;
    this.Desc = fnDesc || "This is a " + this.Name;
    
    
    this.ActOn = function(gobj, slot, origin) {
        if (gobj.Type === EnumGOType.Cont) {            
            console.log(this.Name + " acted on " + gobj.Name);
            //Report to server here
            var logMsg = "Player 1 transferred " + this.Name + " to the " + gobj.Name;
            matchConsole.Write(logMsg);
            
            var action = inventoryGrid.GetMoveAction(this.ID, gobj.ID);

            gameConnect.ReportCmdSucc(this.ID, gobj.ID, action, logMsg);
            gobj.AddTo(this);
            if (this.Infinite) throw "Ingredient is infinite!";
        } else if (gobj.Type === EnumGOType.App) {
            if (gobj.Contains.length > 0) 
                this.ActOn(gobj.Contains[0], slot, origin);
            else
                throw "Invalid action!";
        } else {
            throw "Invalid action!";
        }
    };
    
    this.Activate = function() {
        throw "Activation not yet implemented!";
    };
}
//////////////////
//Game Container//
//////////////////
function gameContainer(id, name, sprite)
{
    this.Name = name;
    this.ID = id;
    this.Type = EnumGOType.Cont;
    this.Sprite = sprite;
    this.IsMovable = true;
    
    
    this.Anim = (this.Sprite) ? new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite}) : null;

    this.Desc = function() {    
        if (!this.Contains.length) {
            return "This is an empty " + this.Name;
        } else {
            var str = "This is a " + this.Name + " containing";
            for (var i=0; i<this.Contains.length; i++) {
                if (i >= 1) str += ",";
                str += " " + this.Contains[i];
            }
            return str;
        }
    };
    
    this.Contains = [];
    
    this.ActOn = function(gobj, slot, origin) {
        var logMsg = this.Name + " acted on " + gobj.Name;  
        console.log(logMsg);        

        var action = inventoryGrid.GetMoveAction(this, gobj);
            
        if (gobj.Type === EnumGOType.App) 
        {
            gameConnect.ReportCmdSucc(this.ID, gobj.ID, action, logMsg);
        } 
        else if (gobj.Type === EnumGOType.Cont) 
        {
            gameConnect.ReportCmdSucc(this.ID, gobj.ID, action, logMsg);
        } 
    };
    
    //Transfer contents of container to new container
    this.TransferTo = function(cont) {
        var arr = cont.Contains.concat(this.Contains);
        cont.Contains = arr;
        this.Contains.length = 0;
    };
    
    this.Activate = function() {
        throw "Activation not yet implemented!";
    };
}

function gameIngredientContainer(id, name, sprite, ingredient) {
    this.Name = name;
    this.ID = id;
    this.Type = EnumGOType.IngContainer;
    this.Sprite = sprite;
    this.Ingredient = ingredient;
    this.IsMovable = true;

    this.Anim = (this.Sprite) ? new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite}) : null;
    
    this.Desc = function() {    
        if (!this.Contains.length) {
            return "This is an empty " + this.Name;
        } else {
            var str = "This is a " + this.Name + " containing " + this.Ingredient;
            return str;
        }
    };
    
    this.Contains = [];
    if (typeof ingredient != ingredient  && ingredient !== "") {
        this.Contains = [this.Ingredient];
    }
    
    this.RemoveFrom = function(gobj) {
        throw "Not yet implemented!";
    };
    
    this.ActOn = function(gobj, slot, origin) {
        if (gobj.Type === EnumGOType.Cont) {
            var action = inventoryGrid.GetMoveAction(this, gobj);
            var logMsg = this.Name + " acted on " + gobj.Name;          
            gameConnect.ReportCmdSucc(this.ID, gobj.ID, action, logMsg);
        }
    };
}

//////////////////
//Game Appliance//
//////////////////
function gameAppliance(id, name, sprite, containers)
{
    this.Name = name;
    this.ID = id;
    this.Type = EnumGOType.App;
    this.Sprite = sprite;
    this.IsMovable = false;

    this.Anim = (this.Sprite) ? new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite}) : null;

    this.Desc = function() {    
        if (!this.Contains.length) {
            return "This is an empty " + this.Name;
        } else {
            var str = "This is a " + this.Name + " containing: " + this.Contains[0].Desc();
            return str;
        }
    };

    var Contains = [];
    
    this.AddTo = function(gobj) {
        Contains.push(gobj);
    };

    for (var i = 0; i < containers.length; i++) {
        this.AddTo(containers[i]);
    }   
    

    this.GetObject = function(slot) {
        return Contains[slot];
    };

    this.Remove = function(slot) {
        var obj = null;
        if (!this.IsEmpty()) {
            obj = Contains[slot];    
            Contains = Contains.splice(slot,1);
        }
        return obj;
    };
    
    this.RemoveFrom = function(gobj) {
        throw "Not yet implemented!";
    };
    
    this.IsEmpty = function(slot) {
        return (this.Contains.length <= slot);
    };

    this.Activate = function() {
        throw "Activation not yet implemented!";
    };
}

//////////
//Action//
//////////
function gameAction(name, sprite, cmdstr)
{
    this.Name = name;   //This is the display name of the command
    this.Sprite = sprite;  //The sprite to display
    this.Cmd = cmdstr;  //The string used for issuing commands
    this.IsMovable = false;
    
}


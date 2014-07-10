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

///////////////////
//Game Ingredient//
///////////////////
var Ingredient = function(id, name, sprite, infinite, fnDesc)
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

    this.setPosition = function(x, y) {
        painter.setPosition(x,y);
    };
};
//////////////////
//Game Container//
//////////////////
var Container = function(id, name, sprite)
{
    this.Name = name;
    this.ID = id;
    this.Type = EnumGOType.Cont;

    var painterExists = (sprite in Container.prototype.painterLookup);

    var painter = (painterExists) ? Container.prototype.painterLookup[sprite] :
                new ContainerPainter(name, sprite, 0, 0, -1, "containers");

    Container.prototype.painterLookup[sprite] = painter;

    this.Desc = function() {    
        if (Contains.length === 0) {
            return "This is an empty " + this.Name;
        } else {
            var str = "This is a " + this.Name + " containing";
            for (var i=0; i<Contains.length; i++) {
                if (i >= 1) str += ",";
                str += " " + Contains[i];
            }
            return str;
        }
    };
    
    var Contains = [];
    this.addContents = function(contents) {
        for (var i = 0; i < contents.length; i++) {
            Contains.push(contents[i]);
        }
    };
    
    this.ActOn = function(gobj, slot, origin) {
        var logMsg,
            action;
        if (gobj.Type === EnumGOType.App || gobj.Type === EnumGOType.Cont) 
        {
            logMsg = this.Name + " acted on " + gobj.Name;  
            console.log(logMsg);        
            action = ActionBar.getMoveAction(this, gobj);
        } 
        return {"ID": this.ID, "targetID": gobj.ID, "action": action, "message": logMsg};
    };

    this.getPainter = function() {
        return painter;
    };

    this.setSlot = function(slot) {
        painter.setSlot(slot);
    };

    this.setPosition = function(x, y) {
        painter.setPosition(x,y);
    };

    this.setConfiguration = function(slot, x, y, group) {
        painter.setConfiguration(slot, x, y, group);
    };
};

Container.prototype.painterLookup = {};

var IngredientContainer = function(id, name, sprite, ingredient) {
    this.Name = name;
    this.ID = id;
    this.Type = EnumGOType.IngContainer;
    this.Ingredient = ingredient;
    this.IsMovable = true;

    var name_wo_bowl = name.replace(" bowl", "");
    name_wo_bowl = name_wo_bowl.replace("_bowl", "");

    var painterExists = (sprite in IngredientContainer.prototype.painterLookup);

    var painter = (painterExists) ? IngredientContainer.prototype.painterLookup[sprite] :
                new ContainerPainter(name_wo_bowl, sprite, 0, 0, -1, "ingredients");

    IngredientContainer.prototype.painterLookup[sprite] = painter;

    this.Desc = function() {    
        if (Contains.length === 0) {
            return "This is an empty " + this.Name;
        } else {
            var str = "This is a " + this.Name + " containing";
            for (var i=0; i<Contains.length; i++) {
                if (i >= 1) str += ",";
                str += " " + Contains[i];
            }
            return str;
        }
    };
    
    var Contains = [];
    if (typeof ingredient != ingredient  && ingredient !== "") {
        Contains = [this.Ingredient];
    }
    
    this.RemoveFrom = function(gobj) {
        throw "Not yet implemented!";
    };
    
    this.ActOn = function(gobj, slot, origin) {
        var action,
            logMsg;
        if (gobj.Type === EnumGOType.Cont) {
            action =  ActionBar.getMoveAction(this, gobj);
            logMsg = this.Name + " acted on " + gobj.Name;          
        }

        return {"ID": this.ID, "targetID": gobj.ID, "action": action, "message": logMsg};
    };

    this.getPainter = function() {
        return painter;
    };

    this.setPosition = function(x, y) {
        painter.setPosition(x,y);
    };

    this.setConfiguration = function(slot, x, y, group) {
        painter.setConfiguration(slot, x, y, group);
    };

    this.setSlot = function(slot) {
        painter.setSlot(slot);
    }; 
};

IngredientContainer.prototype.painterLookup = {};

//////////////////
//Game Appliance//
//////////////////
var Appliance = function(id, name, sprite, containers)
{
    this.Name = name;
    this.ID = id;
    this.Type = EnumGOType.App;
    this.IsMovable = false;
    var painter;
    //this.Anim = (this.Sprite) ? new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite}) : null;

    var initPainter = function() {
        var painterExists = (sprite in Appliance.prototype.painterLookup);

        var containerPainters = [];
        for (var i = 0; i < Contains.length; i++) {
            containerPainters.push(Contains[i].getPainter());
        }
        painter = (painterExists) ? Appliance.prototype.painterLookup[sprite] :
            new AppliancePainter(sprite, 0, 0, 0, containerPainters);

        painter.setPainters(containerPainters);
        Appliance.prototype.painterLookup[sprite] = painter;
    }; 

    this.Desc = function() {    
        if (Contains.length === 0) {
            return "This is an empty " + this.Name;
        } 
        else 
        {
            var str = "This is a " + this.Name + " containing";
            for (var i=0; i<Contains.length; i++) {
                if (i >= 1) str += ",";
                str += " " + Contains[i].Name;
            }
            return str;
        }
    };

    var Contains = containers;
    initPainter();
    this.AddTo = function(gobj) {
        //initPainter();
        Contains.contents.push(gobj);
        painter.addPainter(gobj.getPainter());
    };

    this.GetObject = function(slot) {
        return Contains[slot];
    };

    this.Remove = function(slot) {
        var obj = null;
        if (!this.IsEmpty()) {
            obj = Contains[slot];
            painter.removePainter(obj.getPainter());    
            Contains = Contains.splice(slot,1);
        }
        return obj;
    };
    
    this.IsEmpty = function(slot) {
        var length = Contains.length;
        return (length <= slot);
    };

    this.getPainter = function() {
        //initPainter();
        return painter;
    };

    this.setSlot = function(slot) {
        //initPainter();
        painter.setSlot(slot);
    };

    this.setPosition = function(x, y) {
        //initPainter();
        painter.setPosition(x,y);
    };

    this.setConfiguration = function(slot, x, y, group) {
        painter.setConfiguration(slot, x, y, group);
    };
};

Appliance.prototype.painterLookup = {};


//////////
//Action//
//////////
var gameAction = function(name, sprite, cmdstr)
{
    this.Name = name;   //This is the display name of the command
    this.Sprite = sprite;  //The sprite to display
    this.Cmd = cmdstr;  //The string used for issuing commands
    this.IsMovable = false;
    
};


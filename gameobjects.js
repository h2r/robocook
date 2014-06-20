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

    this.getPainter = function() {
        console.log("gameIngredient.getPainter(): This function is deprecated, stop calling it");
    };

    this.setSlot = function() {
        console.log("gameIngredinet.setSlot(): This function is deprecated, stop calling it");
    };

    this.setPosition = function(x, y) {
        painter.setPosition(x,y);
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
    var painter = new ContainerPainter(this.Anim, 0, 0, 0, "containers");
    this.Desc = function() {    
        if (!Contains.length) {
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
    var painter = new ContainerPainter(this.Anim, 0, 0, 0, "ingredients");
    this.Desc = function() {    
        if (!Contains.length) {
            return "This is an empty " + this.Name;
        } else {
            var str = "This is a " + this.Name + " containing " + this.Ingredient;
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

    this.setSlot = function(slot) {
        painter.setSlot(slot);
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
    var painter = new AppliancePainter(this.Anim, 0, 0, 0);
    this.Desc = function() {    
        if (!Contains.length) {
            return "This is an empty " + this.Name;
        } else {
            var str = "This is a " + this.Name + " containing: " + Contains[0].Desc();
            return str;
        }
    };

    var Contains = [];
    
    this.AddTo = function(gobj) {
        Contains.push(gobj);
        painter.addPainter(gobj.getPainter());
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
        return (Contains.length <= slot);
    };

    this.Activate = function() {
        throw "Activation not yet implemented!";
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


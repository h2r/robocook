//GameObject enums
EnumGOType = {
	App: 0,		//Appliances like stove
	Cont: 1,	//Container
	Ing: 2,		//Ingredients like eggs
	Tool: 3,		//Tools like knife
	Empty: 4
};

//Game Object
function gameObject(id, name, type, sprite, fnDesc)
{
	this.Name = name;
	this.ID = id;
	this.Type = type;
	this.Sprite = sprite;
	this.Slot = "";
	
	if (!this.Sprite) {
		this.Anim = null;
	} else {
		this.Anim = new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite});
	}

	if (fnDesc) { this.Desc = fnDesc } 
	else {
		this.Desc = function() {	
			return "This is a " + this.Name;
		}
	}
	
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
	
	if (infinite) this.Infinite = infinite;
	else this.Infinite = false;
	
	if (!this.Sprite) {
		this.Anim = null;
	} else {
		this.Anim = new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite});
	}

	if (fnDesc) { this.Desc = fnDesc } 
	else {
		this.Desc = function() {	
			return "This is a " + this.Name;
		}
	}
	
	this.ActOn = function(gobj, slot, origin) {
		if (gobj.Type === EnumGOType.Cont) {			
			console.log(this.Name + " acted on " + gobj.Name);
			//Report to server here
			var logMsg = "Player 1 transferred " + this.Name + " to the " + gobj.Name;
			matchConsole.Write(logMsg);
			gameConnect.ReportCmdSucc(this.ID, gobj.ID, "transfer", logMsg);
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
	}
	
	this.Activate = function() {
		throw "Activation not yet implemented!";
	}
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
	
	if (!this.Sprite) {
		this.Anim = null;
	} else {
		this.Anim = new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite});
	}

	this.Desc = function() {	
		if (!this.Contains.length) {
			return "This is an empty " + this.Name;
		} else {
			var str = "This is a " + this.Name + " containing";
			for (var i=0; i<this.Contains.length; i++) {
				if (i >= 1) str += ",";
				str += " " + this.Contains[i].Name;
			}
			return str;
		}
	}
	
	this.Contains = [];
	
	this.AddTo = function(gobj) {
		this.Contains.push(gobj);
	}
	
	this.RemoveFrom = function(gobj) {
		throw "Not yet implemented!";
	}
	
	this.ActOn = function(gobj, slot, origin) {
		if (gobj.Type === EnumGOType.App) {			
			console.log(this.Name + " acted on " + gobj.Name);
			try {
				gobj.AddTo(this);
				//Report action to server here
				var logMsg = "Player 1 moved " + this.Name + " to the " + gobj.Name;
				matchConsole.Write(logMsg);
				gameConnect.ReportCmdSucc(this.ID, gobj.ID, "move", logMsg);
				inventoryGrid.ChangeSlotAnim(slot + "Box", this.Anim);
			} catch(err) {
				throw "Invalid action!";
			}
			//throw "test";
		} else if (gobj.Type === EnumGOType.Cont) {
			this.TransferTo(gobj);
			//Report action to server here
			var logMsg = "Player 1 transferred the contents of " + this.Name + " to the " + gobj.Name;
			matchConsole.Write(logMsg);
			gameConnect.ReportCmdSucc(this.ID, gobj.ID, "transfer", logMsg);
			throw "Do not delete container!";
		} else {
			throw "Invalid action!";
		}
	}
	
	//Transfer contents of container to new container
	this.TransferTo = function(cont) {
		var arr = cont.Contains.concat(this.Contains);
		cont.Contains = arr;
		this.Contains.length = 0;
	}
	
	this.Activate = function() {
		throw "Activation not yet implemented!";
	}
}


//////////////////
//Game Appliance//
//////////////////
function gameAppliance(id, name, sprite)
{
	this.Name = name;
	this.ID = id;
	this.Type = EnumGOType.App;
	this.Sprite = sprite;
	
	if (!this.Sprite) {
		this.Anim = null;
	} else {
		this.Anim = new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite});
	}

	this.Desc = function() {	
		if (!this.Contains.length) {
			return "This is an empty " + this.Name;
		} else {
			var str = "This is a " + this.Name + " containing: " + this.Contains[0].Desc();
			return str;
		}
	}
		
	this.Contains = [];
	
	this.AddTo = function(gobj) {
		if (this.Contains.length)
			throw "Invalid action!  Cannot have more than one object on an appliance at a time!";
		else
			this.Contains.push(gobj);
	}
	
	this.RemoveFrom = function(gobj) {
		throw "Not yet implemented!";
	}
	
	this.Container = function() {
		//if (this.Contains.length === 0) return null;
		//else 
			return this.Contains[0];
	}
	
	this.IsEmpty = function() {
		return (this.Contains.length === 0 || !this.Contains);
	}
	
	//Transfer contents of container to new container
	this.TransferTo = function(cont) {
		if (!this.IsEmpty())
		{ 	
			cont.AddTo(this.Contains[0]);
			this.Contains.length = 0;
		}
	}
	
	this.Activate = function() {
		throw "Activation not yet implemented!";
	}
}

//////////
//Action//
//////////
function gameAction(name, sprite, cmdstr)
{
	this.Name = name;	//This is the display name of the command
	this.Sprite = sprite;  //The sprite to display
	this.Cmd = cmdstr;	//The string used for issuing commands
}


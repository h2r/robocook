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

//A game container does not have to have a sprite
function gameContainer(id, name, sprite, fnDesc)
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

	if (fnDesc) { this.Desc = fnDesc } 
	else {
		this.Desc = function() {	
			return "This is a " + this.Name;
		}
	}
		
	this.Contains = [];
	
	this.AddTo = function(gobj) {
		this.Contains.Push(gobj);
	}
	
	this.RemoveFrom = function(gobj) {
		throw "Not yet implemented!";
	}
	
	//Transfer contents of container to new container
	this.TransferTo = function(cont) {
		var arr = cont.Contains.concat(this.Contains);
		cont.Contains = arr;
		this.Contains.length = 0;
	}
}

//Appliances next
function gameAppliance(id, name, sprite, fnDesc)
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

	if (fnDesc) { this.Desc = fnDesc } 
	else {
		this.Desc = function() {	
			return "This is a " + this.Name;
		}
	}
		
	this.Contains = [];
	
	this.AddTo = function(gobj) {
		throw "Not yet implemented!";
	}
	
	this.RemoveFrom = function(gobj) {
		throw "Not yet implemented!";
	}
}


//GameObject enums
EnumGOType = {
	App: 0,		//Appliances like stove
	Cont: 1,	//Container
	Ing: 2,		//Ingredients like eggs
	Tool: 3,		//Tools like knife
	Empty: 4
};

//Game Object
function gameObject(id, name, type, sprite)
{
	this.Name = name;
	this.ID = id;
	this.Type = type;
	this.Sprite = sprite;
	
	if (sprite === "") {
		this.Anim = null;
	} else {
		this.Anim = new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite});
	}	
}

//A game container does not have to have a sprite
function gameContainer(id, name, sprite)
{
	this.ID = id;
	this.Name = name;
	this.Sprite = sprite;
		
	this.Contains = [];
	
	this.AddTo = function(gobj) {
		throw "Not yet implemented!";
	}
	
	this.RemoveFrom = function(gobj) {
		throw "Not yet implemented!";
	}
}


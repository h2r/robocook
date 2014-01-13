//GameObject enums
EnumGOType = {
	App: 0,		//Appliances like stove
	Cont: 1,	//Container
	Ing: 2,		//Ingredients like eggs
	Tool: 3,		//Tools like knife
	Empty: 4
};

//Game Object
function gameObject(name, type, sprite)
{
	this.Name = name;
	this.Type = type;
	this.Sprite = sprite;
	
	if (sprite === "") {
		this.Anim = null;
	} else {
		this.Anim = new $.gameQuery.Animation({imageURL: "./Sprites/" + this.Sprite});
	}	
}


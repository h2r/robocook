var Sprite = function(text)
{
	var name = text;

	var painter = new SpritePainter(name, name + "_sprite");

	this.getPainter = function() {
		return painter;
	};

};

$.fn.textWidth = function()
{
	var self = $(this),
        children = self.children(),
        calculator = $('<span style="display: inline-block;" />'),
        width;

    children.wrap(calculator);
    width = children.parent().width(); // parent = the calculator wrapper
    children.unwrap();
    return width;
};

$.fn.textHeight = function()
{
	var self = $(this),
        children = self.children(),
        calculator = $('<span style="display: inline-block;" />'),
        height;

    children.wrap(calculator);
    height = children.parent().height(); // parent = the calculator wrapper
    children.unwrap();
    return height;
};

var SpritePainter = function(newText, newDiv, newGroup) 
{
	var width = 64;
	var maxTextWidth = width - 8;
	var height = 64;
	var text = newText.replace(".PNG", "").replace("_", " ");
	var div = newDiv.replace(".PNG", "");
	var group = newGroup;
	var defaultTextSize = 64;
	var groupObj = $("#" + group);
	$("#" + group).addGroup(div, {width: width, height: height}).css({"font-size": defaultTextSize.toString() + "pt", "color": "black", "overflow": "auto", "text-align":"center"}).end();

	var divObject = function() {
		return $("#" + div);
	};

	var setDiv = function() {
		if (divObject().length === 0) {
			$("#" + group).addGroup(div, {width: width, height: height}).css({"font-size": defaultTextSize.toString() + "pt", "color": "black", "overflow": "auto", "text-align":"center"}).end();
		}
	};

	var isSizedCorrectly = function() 
	{
		return divObject().textWidth() < maxTextWidth;
	};

	this.setSize = function(newWidth, newHeight) {
		width = newWidth;
		maxTextWidth = width - 8;
		height = newHeight;
		divObject.width(width);
		divObject.height(height);
	};

	this.draw = function() {
		setDiv();
		divObject().html("");
		divObject().append("<p>" + text + "</p>");

		var fontSize = defaultTextSize;
		var fontSizeStr = fontSize.toString() + "pt";
		while(!isSizedCorrectly() && fontSize > 8)
		{	
			fontSize = fontSize - 1;
			fontSizeStr = fontSize.toString() + "pt";
			divObject().css("font-size", fontSizeStr);
		}

		var actualHeight = divObject().innerHeight();
		divObject().y(actualHeight);
	};
};
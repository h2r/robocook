$.fn.textfill = function(longestWord, text, minFontSize, maxFontSize) {
    maxFontSize = parseInt(maxFontSize, 10);
    minFontSize = parseInt(minFontSize, 10);
    return this.each(function(){

    	var ourText = $("span", this),
            parent = ourText.parent();
        parent.css("font-family", "Verdana");
        ourText.html("<span>" + longestWord + "</span>");
	    //parent.append("<span>" + longestWord + "</span>");
		
        var maxHeight = parent.height(),
            maxWidth = parent.width(),
            fontSize = parseInt(ourText.css("font-size"), 10),
            multiplier = maxWidth/ourText.width(),
            yMultiplier = maxHeight / ourText.height(),
            newSize = fontSize * multiplier * 0.8;
        newSize = Math.max(minFontSize, newSize);
        newSize = Math.min(maxFontSize, newSize);
        parent.css("font-size", newSize);
        ourText.html("<span>" + text + "</span>");
    });
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
	$("#" + group).addGroup(div, {width: width}).css({"font-size": defaultTextSize.toString() + "px", "color": "black", "overflow": "auto", "text-align":"center", "white-space": "normal"}).end();

	var divObject = function() {
		return $("#" + div);
	};

	var setDiv = function() {
		if (divObject().length === 0) {
			$("#" + group).addGroup(div, {width: width, height:height}).css({"font-size": defaultTextSize.toString() + "px", "color": "black", "overflow": "auto", "text-align":"center", "white-space": "normal"}).end();
		}
	};

	var getNumberLines = function() {

		var divHeight = divObject().offsetHeight;
		var lineHeight = divObject().lineHeight;
		return divHeight / lineHeight;
	};

	var wordCount = function() {
		var words = text.split(' ');
		return words.length;
	};	

	this.setSize = function(newWidth, newHeight) {
		width = newWidth;
		maxTextWidth = width - 8;
		height = newHeight;
		divObject().width(width);
		divObject().height(height);
	};

	this.setGroup = function(newGroup) {
		divObject().remove();
		group = newGroup;
	};

	var getLongestWord = function() {
		var words = text.split(' ');
		var maxLength = 0;
		var longest;
		for (var i = 0; i < words.length; i++) {
			if (words[i].length > maxLength) {
				maxLength = words[i].length;
				longest = words[i];
			}
		}
		return longest;
	};

	this.draw = function() {
		setDiv();
		divObject().html("");
		var longestWord = getLongestWord();

		divObject().html("<span>" + longestWord + "</span>");
		divObject().textfill(longestWord, text, 8, 16);
	};
};
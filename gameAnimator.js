var SplashPainter = function(startOnClick, textOnKeyDown) {
    "use strict";
    var painters = [];
    var allowReset = true;

    this.draw = function() {
         $("#stage").append("<div id='"+gameConfig.SceneSplashName+"'></div>");
        
        //Title
        $("#"+gameConfig.SceneSplashName).append("<h1 id='splashTitle'>" + gameConfig.Title + "</h1>");
        console.log("Splash Scene -> Generating Title at " + gamePos.TitleY + " " + gamePos.TitleX);
        $("#splashTitle").css({
            "color": gameConfig.TitleColor,
            "font-size": gameConfig.TitleSize,
            "position":"absolute",
            "top":gamePos.TitleY,
            "left":gamePos.TitleX});
        
        //Name input
        $("#"+gameConfig.SceneSplashName).append("<input id='playerName' type='text'>");
        console.log("Splash Scene -> Generating Player Name text input at...");

        $("#playerName").css({
            "width":256,
            "position":"relative",
            "top":240,
            "left":228}).val('Enter thy name Chef!')
            .keydown(function() {
                allowReset = false;
                textOnKeyDown();})
            .click(function() {if (allowReset) {$("#playerName").val("");}});

        //Start button
        console.log("Splash Scene -> Generating Start button at " + gamePos.StartY + " " + gamePos.StartX);
        $("#"+gameConfig.SceneSplashName).append("<button id='splashButton' type='button'>" + gameConfig.StartButton + "</button>");
        $("#splashButton").css({
            "position":"absolute",
            "top":gamePos.StartY,
            "left":gamePos.StartX})
            .click(startOnClick);
    };

    this.addPainter = function(painter) {
        painters.push(painter);
    };
}

var GamePainter = function(mouseTracker) {
    "use strict";
    var painters = [];
    $.playground().pauseGame().clearScenegraph().startGame().addGroup(
            "background", {width: gameConfig.StageWidth, height: gameConfig.StageHeight}).addSprite(
            "background", {animation: gameAnimations.background1, width: gameConfig.StageWidth, height: gameConfig.StageHeight}).end()
        .mousemove(mouseTracker.onMouseMove)
        .mousedown(mouseTracker.onMouseDown)
        .mouseup(mouseTracker.onMouseUp)    
        .addGroup("appliances", {width: 384, height: 128, posx: 0, posy: 192}).end()
        .addGroup("containers", {width: 768, height: 64, posx: 0, posy: 320}).end()
        .addGroup("ingredients", {width: 768, height: 64, posx: gamePos.MatchDivIngsX, posy: gamePos.MatchDivIngsY}).end()
        .addGroup("holding", {width: 756, height: 512, posx: 0, posy: 0})
            .addSprite("app1Box", {width: 64, height: 64, posx: 32, posy: 288-64})
            .addSprite("app2Box", {width: 64, height: 64, posx: 160, posy: 288-64})
            .addSprite("app3Box", {width: 64, height: 64, posx: 288, posy: 288-64})
            .addSprite("holdingBox", {width: 64, height: 64, posx: 0, posy: 0})
            .end()
        .addGroup("selectionDiv", {width: 756, height: 512, posx: 0, posy: 0})
            .end()
        .addGroup("recipeBackground", {width: 384, height: 192, posx: 384, posy: 0})
            .css({"background-image": "url('./Sprites/RecipeDivBG.PNG')", "overflow": "visible"})
            .addGroup("recipeDiv", {width: 374, height: 186, posx: 10, posy: 6})
                .css({"font-size": "10pt", "color": "black", "overflow": "auto"})
                .end().end()
        .addGroup("consoleBackground", {width: 384, height: 192, posx: 0, posy: 0})
            .css({"background-image": "url('./Sprites/TerminalDivBG.PNG')", "overflow": "visible"})
            .addGroup("consoleDiv", {width: 374, height: 180, posx: 10, posy: 6})
                .css({"font-size": "10pt", "color": "green", "overflow": "auto"})
                .end().end()
        .addGroup("actionDiv",{width: 768, height: 64, posx: 0, posy: 448})
            .css({"font-size": "8pt", "color": "yellow", "overflow": "auto"})
            .addSprite("actSelector", {animation: gameAnimations.overSelectionP1, width: 64, height: 64, posx: 0})
            .append("<button id='matchResetBtn' type='button'>Reset</button>")
            .end()
        .addGroup(actionText.DisplayDiv, {width: 256, height: 64, posx: 448, posy: 448})
            .end();

    //Configure reset button
    $("#matchResetBtn").css({
        "position":"absolute",
        "top":16,
        "left":708}).click(function(event) {
            event.preventDefault();
            //console.log("Match Scene -> Reset button clicked!");
            RegisterCommand(gameConfig.SceneMatchName, EnumGameCommands.MatchReset);
        });     
        

    this.draw = function () {
        var i = 0;  
        for (i = 0; i < painters.length; i++) {
            painters[i].draw();
        }
    };

    this.addPainter = function (painter) {
        painters.push(painter);
    };

    this.addPainters = function(newPainters) {
        painters = painters.concat(newPainters);
    };
}

var GridPainter = function() {
    "use strict";
    var painters = [];

    this.addPainter = function(painter) {
        painters.push(painter);
    };

    this.setPainters = function(newPainters) {
        painters = newPainters;
    };

    this.getBounds = function() {
        var left,
            right,
            top,
            bottom;
        left = Math.min($("#appliances").x(), $("#containers").x(), $("#ingredients").x());
        right = Math.max($("#appliances").x() + $("#appliances").width() , $("#containers").x() + $("#containers").width(), $("#ingredients").x() + $("#ingredients").width());
        bottom = Math.min($("#appliances").y(), $("#containers").y(), $("#ingredients").y());
        top = Math.max($("#appliances").y() + $("#appliances").height() , $("#containers").y() + $("#containers").height(), $("#ingredients").y() + $("#ingredients").height());
        return {top:top, bottom:bottom, left:left, right:right};
    };  

    this.clear = function() {
        painters = [];
    };

    this.draw = function() {
        for (var i = 0; i < painters.length; i++) {
            painters[i].draw();
        }
    };
};

var ActionBarPainter = function(usedActions, onClick) {
    "use strict";
    var actions = usedActions,
        selector = 0;
    var DisplayDiv = "actionDiv";

    this.setSelector = function(position) {
        if (0 <= position && position < actions.length) {
            selector = position;
        }
        this.draw();
    };

    this.draw = function() {
        var i = 0,
            x = 0,
            action = 0,
            actionDiv = "",
            animation = null;
        var actionGroup = $("#" + DisplayDiv);

        for (i = 0; i < actions.length; i++) {
            x = i * 64;
            action = actions[i];
            animation = getSprite(action);
            actionDiv = "action_" + i.toString();

            actionGroup.addSprite(actionDiv, {animation: animation, width: 64, height: 64, posx: x});
            $("#" + actionDiv).click(onClick);
        }

        $("#actSelector").x(64 * selector);
    };

    this.getBounds = function() {
        var div = $("#" + DisplayDiv);
        return {"left":div.x(), "right":div.x() + div.width(), "bottom":div.y(), "top": div.y() + div.height()};
    };

    var getSprite = function(action) {
        switch(action) {
        case EnumActions.Look:
            return gameAnimations.actLook;
            break;
        case EnumActions.Use:
            return gameAnimations.actUse;
            break;
        case EnumActions.Mix:
            return gameAnimations.actMix;
            break;
        case EnumActions.Spread:
            return gameAnimations.actSpread;
            break;
        case EnumActions.TurnOnOff:
            return gameAnimations.actTurnOnOff;
            break;
        case EnumActions.Peel:
            return gameAnimations.actPeel;
            break;
        case EnumActions.Shape:
            return gameAnimations.actShape;
            break;
        case EnumActions.Cut:
            return gameAnimations.actCut;
            break;
        default:
            return -1;
        }
        return -1;
    };
}

var AppliancePainter = function(anim, posx, posy, currentSlot) {
    "use strict";

    var animation = anim;
    var group = "appliances";
    var slot = currentSlot;
    var containers = [];
    var x = posx;
    var y = posy;

    this.addPainter = function(newContainer) {
        containers.push(newContainer);
    };

    this.setPosition = function(newX, newY) {
        x = newX;
        y = newY;
    }
    this.setGroup = function(newGroup) {
        group = newGroup;
    };

    this.setAnimation = function(newAnimation) {
        animation = newAnimation;
    };

    this.setSlot = function(newSlot) {
        slot = newSlot;
    };

    this.draw = function() {
        var slotObject = $("#" + slot.toString());
        if (slotObject.length == 0) {
            $("#" + group).addSprite(slot.toString(), 
                {animation: animation, width: 128, height: 128, posx: x, posy: y});
        }
        else {
            slotObject.setAnimation(animation);
        }
        for (var i = 0; i < containers.length; i++) {
            containers[i].draw();
        }
    };
}

var ContainerPainter = function(anim, posx, posy, currentSlot, containerGroup) {
    "use strict";
    var group = (typeof containerGroup !== 'undefined') ? containerGroup : "containers";
    var animation = anim;
    var slot = currentSlot;
    var x = posx;
    var y = posy;

    var getSlotObject = function() {
        var slotObject =  $("#" + slot.toString());
        if (slotObject.length == 0) {
            setSprite();
        }
        return $("#" + slot.toString());
    }

    var setSprite = function() {
        if (typeof group !== 'undefined') {
            $("#" + group).addSprite(slot.toString(), 
                {animation: animation, width: 64, height: 64, posx: x, posy: y});
        }
    }

    this.setPosition = function(newX, newY) {
        x = newX;
        y = newY;
    };

    this.setGroup = function(newGroup) {
        group = newGroup;
        var slotObject = getSlotObject();
        slotObject.remove();
        setSprite();
    };

    this.setAnimation = function(newAnimation) {
        animation = newAnimation;
        var slotObject = getSlotObject();
        if (slotObject.length != 0) {
            slotObject.setAnimation(animation);
        }
    };

    this.setSlot = function(newSlot) {
        var oldSlotObject = getSlotObject();
        oldSlotObject.remove();

        slot = newSlot;
        var newSlotObject = getSlotObject();
        newSlotObject.setAnimation(animation);
    };

    this.draw = function() {
        var slotObject = getSlotObject();
        if (slotObject.length == 0) {
            setSprite();
        }
        else {
            slotObject.x(x);
            slotObject.y(y);
        }
    };
}

var RecipePainter = function() {
    "use strict";
    var x, y;
    var text;
    var status;

    this.SetX = function(newX) {
        x = newX;
    };

    this.SetY = function(newY) {
        y = newY;
    };

    this.setText = function(newText) {
        text = newText;
        if (typeof status === 'undefined') {
            status = [];
            for (var i = 0; i < text.length; i++) {
                status[i] = false;
            }
        }
    };

    this.setStatus = function(newStatus) {
        status = newStatus;
        for (var i = status.length; i < text.length; i++) {
            status[i] = false;
        }
    };

    this.draw = function(){
        if (typeof text === 'undefined') {
            return;
        }
        $("#recipeDiv").html("");
        $("#recipeDiv").append("<u>" + text[0] + "</u>");
        $("#recipeDiv").append("<ol>");
        var color;
        for (var i = 1; i < text.length; i++) {
            color = (status[i]) ? "gray" : "black";
                $("#recipeDiv").append("<li id='rlist" + (i - 1) + "'>" + text[i] + "</li>").css({"color":color});
        }
        $("#recipeDiv").append("</ol>");
    };

}

var MatchConsolePainter = function() {
    "use strict";
    var DisplayDiv = "consoleDiv";
    var text = [];
    var height = $("#" + DisplayDiv).height() - 8;

    this.setText = function(lines) {
        text = lines;
    };

    this.draw = function() {
        $("#" + DisplayDiv).html("");
        for (var i = 0; i < text.length; i++) {
            $("#" + DisplayDiv).append(text[i] + "</br>");
        }
        var scrollAmount = $("#" + DisplayDiv).height();
        $("#" + DisplayDiv).scrollTop(scrollAmount);
        //$("#" + DisplayDiv).append("<u>" + text[0] + "</u>");
        //$("#" + DisplayDiv).append("<ol>");
        
        //$("#" + DisplayDiv).append("</ol>");
    };
}

var HoldingBoxPainter = function() {
    "use strict";
    var x, y;
    var holdingGroup = "holding";

    var holdingObjectPainter = null;

    var getGroupObject = function() {
        return $("#" + holdingGroup);
    };

    this.setPosition = function(newX, newY) {
        x = newX;
        y = newY;
        this.draw();
    };

    this.setHoldingObjectPainter = function(objPainter, tileX, tileY) {
        holdingObjectPainter = objPainter;
        holdingObjectPainter.setGroup(holdingGroup);
        holdingObjectPainter.setPosition(-tileX,-tileY);
        this.draw();
    };

    this.clearHoldingObjectPainter = function() {
        if (holdingObjectPainter) {
            holdingObjectPainter.setGroup();
        }
        holdingObjectPainter = null;

        var groupObject = getGroupObject();
        groupObject.html();
    };

    this.draw = function() {
        var groupObject = getGroupObject();
        groupObject.x(x);
        groupObject.y(y);

        if (holdingObjectPainter) {
            holdingObjectPainter.draw();
        }
    };
}
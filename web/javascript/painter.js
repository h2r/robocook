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
};

var GamePainter = function(playground, mouseTracker) {
    "use strict";
    var painters = [];
    playground.pauseGame().clearScenegraph().startGame().addGroup(
            "background", {width: gameConfig.StageWidth, height: gameConfig.StageHeight}).addSprite(
            "background", {animation: gameAnimations.background1, width: gameConfig.StageWidth, height: gameConfig.StageHeight}).end()
        .mousemove(mouseTracker.onMouseMove)
        .mousedown(mouseTracker.onMouseDown)
        .mouseup(mouseTracker.onMouseUp)
        .addGroup("grid", {width: 768, height: 256, posx: 0, posy: 192}).end()    
        .addGroup("holding", {width: 756, height: 512, posx: 0, posy: 0})
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
            .addGroup("consoleDiv", {width: 364, height: 180, posx: 10, posy: 6})
                .css({"font-size": "10pt", "color": "green", "overflow": "auto"})
                .end().end()
        .addGroup("actionDiv",{width: 768, height: 64, posx: 0, posy: 448})
            .css({"font-size": "8pt", "color": "yellow", "overflow": "auto"})
            .addSprite("actSelector", {animation: gameAnimations.overSelectionP1, width: 64, height: 64, posx: 0})
            .append("<button id='matchResetBtn' type='button'>Reset</button>")
            .end()
        .addGroup(actionText.DisplayDiv, {width: 256, height: 64, posx: 448, posy: 448})
            .end();

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
};

var GridPainter = function() {
    "use strict";
    var painters = [];
    
    var initGroup = function() {
        if ($("#appliances").length === 0) {
            $("#grid").addGroup("appliances", {width: 384, height: 128, posx: 0, posy: 0}).end()
        }
        if ($("#containers").length === 0) {
            $("#grid").addGroup("containers", {width: 768, height: 64, posx: 0, posy: 128}).end()
        }
        if ($("#ingredients").length === 0) {
            $("#grid").addGroup("ingredients", {width: 768, height: 64, posx: 0, posy: 192}).end()
        }
    };
    initGroup();

    this.addPainter = function(painter) {
        painters.push(painter);
    };

    this.removePainter = function(painter) {
        var position = $.inArray(painter, painters);
        if (position != -1) 
        {
            painters[position].clear();
            painters.splice(position, 1);
        }
    };

    this.setPainters = function(newPainters) {
        painters = newPainters;
    };

    this.getBounds = function() {
        var left = $("#grid").x();
        var right = $("#grid").x() + $("#grid").width();
        var bottom = $("#grid").y();
        var top = $("#grid").y() + $("#grid").height();
        return {top:top, bottom:bottom, left:left, right:right};
    };  

    this.clear = function() {
        for (var i = 0; i < painters.length; i++) {
            painters[i].clear();
        }
        painters = [];
        clearGroup($("#appliances"));
        clearGroup($("#containers"));
        clearGroup($("#ingredients"));
    };

    var clearGroup = function(group) {
        for (var i = 0; i < group.length; i++) {
            group.remove();
        }
        initGroup();
    };

    this.draw = function() {
        for (var i = 0; i < painters.length; i++) {
            painters[i].draw();
        }
    };
};

var ActionBarPainter = function(usedActions, onClick, onReset) {
    "use strict";
    var actions = usedActions,
        selector = 0;
    var DisplayDiv = "actionDiv";



    //Configure reset button
    $("#matchResetBtn").css({
        "position":"absolute",
        "top":16,
        "left":708}).click(onReset);     
        


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
};

var AppliancePainter = function(sprite, posx, posy, currentSlot, containerPainters) {
    "use strict";

    var x = posx;
    var y = posy;
    var group = "appliances";
    var slot = currentSlot;
    var containers = containerPainters;
    var applianceGroup = "appliances" + "_" + slot.toString();
    var animation;
    var spritePainter;
    var imageUrl = "./Sprites/" + sprite;
    var self = this;

    var imageExists = function() {
        animation = new $.gameQuery.Animation({imageURL: imageUrl });
        self.draw();
    };

    var imageNotExists = function() {
        animation = new $.gameQuery.Animation({imageURL: "./Sprites/Appliance.PNG"})
        spritePainter = new SpritePainter(sprite, "sprite_" + sprite, applianceGroup);
        spritePainter.setSize(128,128);
        self.draw();
    };

    $.get(imageUrl)
        .done(imageExists).fail(imageNotExists);

    this.clear = function() {
        removeAll();
    };

    var groupObject = function() {
        return $("#" + applianceGroup.toString());
    };

    var slotObject = function() {
        return $("#" + slot.toString());
    };

    var getGroupObject = function() {
        if (groupObject().length === 0) {
            setApplianceGroup();
        }

        return groupObject();
    };

    var getSlotObject = function() {
        if (slotObject().length === 0) {
            setSprite();
        }

        return slotObject();
    };

    var removeAll = function() {
        slotObject().remove();
        groupObject().remove();
    };

    var setApplianceGroup = function() {
        groupObject().remove();
        
        $("#" + group).addGroup(applianceGroup.toString(), 
                {width: 128, height: 128, posx: x, posy: y});
    };

    var setSprite = function() {
        slotObject().remove();
        $("#" + applianceGroup).addSprite(slot.toString(), 
                {animation:animation, width: 128, height: 128});
    };

    var setContainers = function() {
        var containerSlot,
        containerX,
        containerY,
        containerGroup;

        for (var i = 0; i < containers.length; i++) {
            containerX = (i % 2) * 64;
            containerY = Math.floor(i / 2) * 64;
            containerSlot = slot + "_" + i.toString();

            containers[i].setConfiguration(containerSlot, containerX, containerY, applianceGroup);
        }
    };

    var setAll = function() {
        setApplianceGroup();
        setSprite();
        setContainers();
    };

    this.addPainter = function(newContainer) {
        containers.push(newContainer);
    };

    this.setPainters = function(newContainers) {
        containers = newContainers;
    };

    this.removePainter = function(toRemove) {
        var position = $.inArray(toRemove, containers);
        if (position != -1) {
            containers.splice(position, 1);
        }
    }

    this.setPosition = function(newX, newY) {
        removeAll();
        x = newX;
        y = newY;
    };
    this.setGroup = function(newGroup) {
        removeAll();
        group = newGroup;
        applianceGroup = group.toString() + "_" + slot.toString();
    };

    this.setAnimation = function(newAnimation) {
        removeAll();
        animation = newAnimation;
    };

    this.setSlot = function(newSlot) {
        removeAll();
        slot = newSlot;
        applianceGroup = group.toString() + "_" + slot.toString();
    };

    this.setConfiguration = function(newSlot, newX, newY, newGroup) {
        removeAll();
        if (typeof newSlot !== 'undefined') {
            slot = newSlot;
            applianceGroup = group.toString() + "_" + slot.toString();    
        }
        if (typeof newX !== 'undefined') {
            x = newX;
        }
        if (typeof newY !== 'undefined') {
            y = newY;
        }
        if (typeof newGroup !== 'undefined') {
            group = newGroup;
            applianceGroup = group.toString() + "_" + slot.toString();
        }
    };

    this.draw = function() {
        setAll();
        if (typeof spritePainter !== 'undefined') {
            spritePainter.draw();
        }
        for (var i = 0; i < containers.length; i++) {
            containers[i].draw();
        }
    };
};

var ContainerPainter = function(text, sprite, posx, posy, currentSlot, containerGroup) {
    "use strict";
    var group = (typeof containerGroup !== 'undefined') ? containerGroup : "containers";
    var containerGroup = group + "_" + currentSlot.toString();
    var imageUrl = "./Sprites/" + sprite;
    var animation,
        spritePainter;
    var slot = currentSlot;
    var x = posx;
    var y = posy;
    var self = this;
    var initialized = false;

    var imageExists = function() {
        animation = new $.gameQuery.Animation({imageURL: imageUrl });
        initialized = true;
        self.draw();
    };

    var imageNotExists = function() {
        animation = new $.gameQuery.Animation({imageURL: "./Sprites/Container.PNG"})
        spritePainter = new SpritePainter(text, "sprite_" + sprite, containerGroup);
        initialized = true;
        self.draw();
    };

    $.get(imageUrl)
        .done(imageExists).fail(imageNotExists);

    var slotObject = function() {
        return $("#" + slot.toString());
    };

    var containerObject = function() {
        return $("#" + containerGroup);
    };

    var groupObject = function() {
        return $("#" + group);
    };

    this.clear = function() {
        this.clearAnimation();
    }

    

    var drawSprite = function() {
        if (typeof group !== 'undefined') {
            if (containerObject().length === 0)
            {
                groupObject().addGroup(containerGroup.toString(), 
                    {width: 64, height: 64, posx: x, posy: y})
            }
            if (slotObject().length === 0)
            {
                containerObject().addSprite(slot.toString(), 
                    {animation: animation, width: 64, height: 64});
            }
        }
    };

    this.setPosition = function(newX, newY) {
        slotObject().remove();
        x = newX;
        y = newY;
    };

    this.setGroup = function(newGroup) {
        slotObject().remove();
        group = newGroup;
        containerGroup = group + "_" + slot.toString();
        if (typeof spritePainter !== 'undefined') 
        {
            spritePainter.setGroup(containerGroup);
        }
    };

    this.setAnimation = function(newAnimation) {
        animation = newAnimation;
    };

    this.clearAnimation = function() {
        if (slotObject().length !== 0) {
            slotObject().setAnimation();
            slotObject().remove();
        }
    };

    this.setSlot = function(newSlot) {
        slotObject().remove();
        slot = newSlot;
        containerGroup = group + "_" + slot.toString();
        if (typeof spritePainter !== 'undefined') 
        {
            spritePainter.setGroup(containerGroup);
        }
    };

    this.setConfiguration = function(newSlot, newX, newY, newGroup) {
        slotObject().remove();

        if (typeof newSlot !== 'undefined') {
            slot = newSlot;
        }
        if (typeof newX !== 'undefined') {
            x = newX;
        }
        if (typeof newY !== 'undefined') {
            y = newY;
        }
        if (typeof newGroup !== 'undefined') {
            group = newGroup;
        }
        containerGroup = group + "_" + slot.toString();
        if (typeof spritePainter !== 'undefined') 
        {
            spritePainter.setGroup(containerGroup);
        }        
    };

    this.draw = function() {
        if (slot != "-1" && initialized) {
            drawSprite();
            if (typeof spritePainter !== 'undefined') {
                spritePainter.draw();   
            }
        }
    };
};

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

};

$.fn.textHeight = function()
 {
   var self = $(this),
         children = self.children(),
         calculator = $('<span style="display: inline-block;" />'),
         height;
 
    var selfHeight = self.height();
     
     children.wrap(calculator);
     height = children.parent().height(); // parent = the calculator wrapper
     children.unwrap();
     return height * children.length;
 };

var MatchConsolePainter = function() {
    "use strict";
    var DisplayDiv = "consoleDiv";
    var text = [];
    var height = $("#" + DisplayDiv).height() - 8;

    var divObject = function() {
        return $("#" + DisplayDiv);
    }

    this.setText = function(lines) {
        text = lines;
    };

    this.draw = function() {
        divObject().html("");
        for (var i = 0; i < text.length; i++) {
            divObject().append(text[i] + "</br>");
        }
        var scrollAmount = divObject().textHeight();
       divObject().scrollTop(scrollAmount);
    };
};

var HoldingBoxPainter = function() {
    "use strict";
    var x, y;

    $("#holding").addGroup("holdingBox", {width:64, height:64}).end();

    var holdingGroup = "holdingBox";

    var holdingObjectPainter;

    this.clear = function() {
        this.clearHoldingObjectPainter();
    };

    var groupObject = function() {
        return $("#" + holdingGroup);
    };

    var getGroupObject = function() {
        if (groupObject().length === 0) {
            setGroupObject();
        }
        return groupObject();
    };

    var setGroupObject = function() {
        $("#holding").addGroup("holdingBox", {width:64, height:64}).end();        
    };

    this.setPosition = function(newX, newY) {
        x = newX;
        y = newY;
        this.draw();
    };

    this.setHoldingObjectPainter = function(objPainter, tileX, tileY) {
        //objPainter.clearAnimation();
        //objPainter.setGroup();

        holdingObjectPainter = objPainter;
        holdingObjectPainter.setGroup(holdingGroup);
        holdingObjectPainter.setPosition(-tileX,-tileY);
        this.draw();
    };

    this.clearHoldingObjectPainter = function() {
        if (holdingObjectPainter) {
            holdingObjectPainter.clearAnimation();
            holdingObjectPainter.setGroup();
        }

        holdingObjectPainter = undefined;

        groupObject().remove();
        groupObject().html();
    };

    this.draw = function() {
        var obj = getGroupObject();
        obj.x(x);
        obj.y(y);

        if (typeof holdingObjectPainter !== 'undefined') {
            holdingObjectPainter.draw();
        }
    };
};
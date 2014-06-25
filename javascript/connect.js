

//////////////////////////////////////////////////////
// gameconnect.js
// ----------------------------
// This module handles all websocket related stuff,
//  including message passing and top-of-the-chain
//  message handling.
// ---------------------
// Note: Set gameConnect.wsurl and then call Init
//  to connect.
//////////////////////////////////////////////////////

var GameConnect = function(){
    "use strict";

    if (GameConnect.prototype._gameConnect) {
        return GameSceneMatch.prototype._gameConnect;
    }
    GameConnect.prototype._gameSceneMatch = this;
    
    var wsurl = "ws://127.0.0.1:8787",
        callbacks = [],
        callbackIds = [],
        ws = 0,
        clientId = 0,
        websocket = null,
        isOpen = false;
    
    this.IsOpen = function() {
        return isOpen;
    };

    this.Open = function() {
        websocket = new WebSocket(wsurl);
        
        websocket.onopen = function() {
            OnOpen();
        };
        websocket.onmessage = function(evt) {
            OnMessage(evt);
        };
        websocket.onclose = function(evt) {
            OnClose(evt);
        };
        websocket.onerror = function(err) {
            OnError(err);
        };
    };

    this.AddCallback = function(callback) {
        var id = 0;
        if (callbackIds.length > 0) {
            id = callbackIds[callbackIds.length - 1] + 1;
        }
        callbacks.push(callback);
        callbackIds.push(id);
        return id;
    };

    this.RemoveCallback = function(id) {
        for (var i = 0; i < callbackIds.length; i++) {
            if (callbackIds[i] == id) {
                callbackIds.splice(i, 1);
                callbacks.splice(i, 1);
            }
        }
    };

    var OnOpen = function() {
        console.log("Connection to websocket opened!");

        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].onOpen();
        }
        isOpen = true;
    };

    var OnMessage = function(evt) {
        console.log("Websocket Message from server: " + event.data);
        

        var msg = JSON.parse(evt.data);
        if (msg.hasOwnProperty('clientId')) {
            clientId = msg.clientId;
        }
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].onMessage(msg);
        }

    };
    
    var OnClose = function(evt) {
        console.log("Connection to websocket closed!");
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].onClose(evt);
        }
        isOpen = false;
            
    };

    var OnError = function(err) {
        console.log("Websocket Error: " + err);
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].onError(err);
        }
    };

    this.Send = function(msg){
        msg.clientId = clientId;
        var msgString = JSON.stringify(msg);
        console.log("Sending: " + msgString);
        websocket.send(msgString);
    };

    //Reports actions taken by players to the server
    //Please note the functions which report success are contained in either gameobjects.js or gamerecipes.js.
    this.ReportCmdSucc = function(obj, target, action, log) {

        var token = {
                msgtype: "action",
                msg: {
                action: action,
                logmsg: log
                }
            };
        token.msg.params = (target) ? ["human", obj, target] : ["human", obj];
        if (action !== "") {         
            this.Send(token);
        }
        else {
            console.log("Failed to send message: " + JSON.stringify(token));
        }
    };
}
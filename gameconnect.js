//////////////////////////////////////////////////////
// gameconnect.js
// ----------------------------
// This module handles all websocket related stuff,
// 	including message passing and top-of-the-chain
// 	message handling.
// ---------------------
// Note: Set gameConnect.wsurl and then call Init
//	to connect.
//////////////////////////////////////////////////////

var gameConnect = {
	wsurl: "ws://echo.websocket.org",
	callbacks: new Array(),
	callbackIds: new Array(),
	ws: 0,
	clientID: 0,
	
	Init: function(){
		gameConnect.ws = new WebSocket(gameConnect.wsurl);
		
		gameConnect.ws.onopen = function() {gameConnect.OnOpen()};
		gameConnect.ws.onmessage = function(evt) {gameConnect.OnMessage(evt) };
		gameConnect.ws.onclose = function(evt) {gameConnect.OnClose(evt)};
		gameConnect.ws.onerror = function(err) {gameConnect.OnError(err)};
	},

	AddCallback: function(callback) {
		var id = 0;
		if (this.callbackIds.length > 0) {
			id = this.callbackIds[this.callbackIds.length - 1] + 1;
		}
		this.callbacks.push(callback);
		this.callbackIds.push(id);
		return id;
	},

	RemoveCallback: function(id) {
		for (var i = 0; i < this.callbackIds.length; i++) {
			if (this.callbackIds[i] == id) {
				this.callbackIds.splice(i, 1);
				this.callbacks.splite(i, 1);
			}
		}
	},

	OnOpen: function() {
		console.log("Connection to websocket opened!");

		for (var i = 0; i < this.callbacks.length; i++) {
			this.callbacks[i].onOpen();
		}

		msg = {
			msgtype:"init",
			source:"server",
			clientid:"1030410200125"
		};
		this.ws.send(JSON.stringify(msg));
	},

	OnMessage: function(evt) {
		console.log("Websocket Message from server: " + evt.data);
		

		var msg = JSON.parse(evt.data);
		if (msg.hasOwnProperty('clientId')) {
			this.clientId = msg.clientId;
		}
		for (var i = 0; i < this.callbacks.length; i++) {
			this.callbacks[i].onMessage(msg);
		}

	},
	
	OnClose: function(evt) {
		console.log("Connection to websocket closed!");
		for (var i = 0; i < this.callbacks.length; i++) {
			this.callbacks[i].onClose(evt);
		}
			
	},

	OnError: function(err) {
		console.log("Websocket Error: " + err);
		for (var i = 0; i < this.callbacks.length; i++) {
			this.callbacks[i].onError(err);
		}
	},

	Send: function(msg){
		msg.clientId = gameConnect.clientId;
		var msgString = JSON.stringify(msg);
		console.log("Sending: " + msgString);
		this.ws.send(msgString);
	},

	//Reports actions taken by players to the server
	//Please note the functions which report success are contained in either gameobjects.js or gamerecipes.js.
	ReportCmdSucc: function(obj, target, action, log) {
		var token = {
				msgtype: "action",
				msg: {
				params: ["human", obj, target],
				action: action,
				logmsg: log
				}
			};
		if (action != "") {			
			gameConnect.Send(token);
		}
		else {
			console.log("Failed to send message: " + JSON.stringify(token));
		}
	},
	
	//Reports state transformations occurring due to met prereqs
	//e.g. water boiling
	ReportTransform: function(obj, loc, newobj, log) {
		var token = {
			msgtype: "transform",
			msg: {
			params: [obj, loc, newobj],
			logmsg: log
			}
		};
		gameConnect.Send(token);
	}
}
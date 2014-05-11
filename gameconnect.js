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
	ws: 0,
	clientID: 0,
	
	Init: function(){
		gameConnect.ws = new WebSocket(gameConnect.wsurl);
		gameConnect.ws.onopen = function() {
			console.log("Connection to websocket opened!");
			msg = {
				msgtype:"init",
				source:"server",
				clientid:"1030410200125"
			};
			gameConnect.ws.send(JSON.stringify(msg));
		};

		gameConnect.ws.onmessage = function (evt) {
			console.log("Websocket Message from server: " + evt.data);
			
			var msg = eval('('+evt.data+')');
			if (msg.hasOwnProperty('clientId')) {
				gameConnect.clientId = msg.clientId;
			}
		};

		gameConnect.ws.onclose = function() {
			console.log("Connection to websocket closed!");
		};

		gameConnect.ws.onerror = function(err) {
			console.log("Websocket Error: " + err);
		};
	},
	
	Send: function(msg){
		msg.clientId = gameConnect.clientId;
		var msgString = JSON.stringify(msg);
		console.log("Sending: " + msgString);
		gameConnect.ws.send(msgString);
	},
	
	//Reports actions taken by players to the server
	//Please note the functions which report success are contained in either gameobjects.js or gamerecipes.js.
	ReportCmdSucc: function(obj, target, action, log) {
		var token = {
			msgtype: "action",
			msg: {
			params: [obj, target],
			action: action,
			logmsg: log
			}
		};
		gameConnect.Send(token);
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
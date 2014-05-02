function fnMain(){
	// jws.browserSupportsWebSockets checks if web sockets are available
// either natively, by the FlashBridge or by the ChromeFrame.
	if( jws.browserSupportsWebSockets() ) {
	jWebSocketClient = new jws.jWebSocketJSONClient();
	// Optionally enable GUI controls here
	} else {
	// Optionally disable GUI controls here
	var lMsg = jws.MSG_WS_NOT_SUPPORTED;
	alert( lMsg );
	}
    var lURL = "ws://127.0.0.1:8787";
    var gUsername = "guest";
	var lPassword = "guest";
				
	console.log( "Connecting to " + lURL + " and logging in as '" + gUsername + "'..." );
	id = "null";
	var oRes = jWebSocketClient.open(lURL, {
	
		// OnOpen callback
		OnOpen: function( aEvent ) {
			console.log("jWebSocket connection established." );
		},
		// OnMessage callback
		OnMessage: function( aEvent, aToken ) {
			console.log( "jWebSocket '" + aToken.type + "' token received, full message: '" + aEvent.data + "'" );
			if (aToken.type == "welcome")
			{
				id = aToken.sourceId;
			}
		},
		// OnClose callback
		OnClose: function( aEvent ) {
			console.log( "jWebSocket connection closed." );
		}
	});

	console.log( jWebSocketClient.resultToString( oRes ) );
	
	window.setTimeout(function(){
		sendMessage(jWebSocketClient, id)
	})
	
}

function sendMessage(client, id)
{
	var lToken = {
	  ns: "my.namespace",
	  data: {action: "ping"},
	  sourceId: id
	};
	if (client.isConnected())
	{
		console.log("Sending token");
		client.sendToken( lToken, {
		  OnResponse: function( aToken ) {
		    console.log("Server responded: " + aToken.msg);
		  },

		  OnSuccess: function(aEvent, aToken) {
		  	console.log("Sending token succeeded " + aToken.msg);
		  },

		  OnFailure: function(aEvent, aToken) {
		  	console.log("Sending token failed " + aToken.msg);
		  },

		  OnTimeout: function(aEvent) {
		  	console.log("Timeout exceeded " + aEvent.data);
		  }
		});
	}
	else
	{
		console.log("Not Connected");
	}
	window.setTimeout(function(){
		sendMessage(client, id);


	},1000);
}
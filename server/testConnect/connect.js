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
	var oRes = jWebSocketClient.open(lURL, {
	
		// OnOpen callback
		OnOpen: function( aEvent ) {
			console.log("jWebSocket connection established." );
			
		},
		// OnMessage callback
		OnMessage: function( aEvent, aToken ) {
			console.log( "jWebSocket '" + aToken.type + "' token received, full message: '" + aEvent.data + "'" );
		},
		// OnClose callback
		OnClose: function( aEvent ) {
			console.log( "jWebSocket connection closed." );
		}
	});

	console.log( jWebSocketClient.resultToString( oRes ) );
	
	var opened = false
	
	//console.log( jWebSocketClient.resultToString( lRes ) );
	sendMessage(jWebSocketClient)
}

function sendMessage(client)
{
	var lToken = {
	  ns: "my.namespace",
	  type: "send",
	  action: "ping"
	};
	if (client.isConnected())
	{
		console.log("Sending token");
		jWebSocketClient.sendToken( lToken, {
		  OnResponse: function( aToken ) {
		    log("Server responded: "
		      + aToken.msg
		    );
		  }
		});
	}
	else
	{
		console.log("Not Connected");
	}
}
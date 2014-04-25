package robocook;

import org.apache.log4j.Logger;
import org.jwebsocket.api.PluginConfiguration;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.plugins.TokenPlugIn;

public class RobocookPlugin extends TokenPlugIn {

	//change the Apache logger to your Classname
	private static Logger mLog = Logging.getLogger(LauridsPlugIn.class);
	// if you change the namespace, don't forget to change the ns_sample!
	private final static String NS_SAMPLE = "com.lauridmeyer.tests.LauridsPlugIn";

	//Constructor
	public RobocookPlugIn(PluginConfiguration aConfiguration) {
		super(aConfiguration);
		if (mLog.isDebugEnabled()) {
			mLog.debug("Instantiating Robocook PlugIn ...");
		}
		// specify your namespace
		this.setNamespace(NS_SAMPLE);
	}
	
	//Method is called when a token has to be progresed
	@Override
	public void processToken(PlugInResponse aResponse, WebSocketConnector aConnector, Token aToken) {
		// get the type of the token
		// the type can be associated with a "command"
		String lType = aToken.getType();

		// get the namespace of the token
		// each plug-in should have its own unique namespace
		String lNS = aToken.getNS();

		// check if token has a type and a matching namespace
		if (lType != null && lNS != null && lNS.equals(getNamespace())) {
			if (lType.equals("getPlayerNames")) {//if the request is "getAuthorName"
				mLog.debug("Player names were requested");
				Token lResponse = createResponse(aToken);//create the response
				lResponse.setString("nameP1", "Player 1");
				lResponse.setString("nameP2", "Player 2");
				sendToken(aConnector, aConnector, lResponse);//send the response
			} else if (lType.equals("getState")) {//if the request is "calculate"
				//logic here
				sendToken(aConnector, aConnector, lResponse);//send the response
			} else if (lType.equals("processCommand")) {//if the request is "calculate"
				//logic here
				sendToken(aConnector, aConnector, lResponse);//send the response
			}
		}
	}
}
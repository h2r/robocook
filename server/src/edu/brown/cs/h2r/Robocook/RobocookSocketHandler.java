package edu.brown.cs.h2r.Robocook;


import java.io.IOException;
import java.util.HashMap;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import com.mongodb.util.JSON;

@WebSocket
public class RobocookSocketHandler {

    @OnWebSocketClose
    public void onClose(int statusCode, String reason) {
        System.out.println("Close: statusCode=" + statusCode + ", reason=" + reason);
    }

    @OnWebSocketError
    public void onError(Throwable t) {
        System.out.println("Error: " + t.getMessage());
    }

    @OnWebSocketConnect
    public void onConnect(Session session) {
        System.out.println("Connect: " + session.getRemoteAddress().getAddress());
        try {
            session.getRemote().sendString("Hello Webbrowser");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnWebSocketMessage
    public void onMessage(String message) {
    	Object obj = JSON.parse(message);
    	RobocookServerToken token = (RobocookServerToken)obj;
    	if (!token.isEmpty()) 
    	{
    		Object msgObject = token.get("msg");
    		String msg = (String)msgObject;
    	}
        System.out.println("Message: " + message);
    }

	public void configure(WebSocketServletFactory factory) {
		// TODO Auto-generated method stub
		
	}
}
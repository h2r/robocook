package edu.brown.cs.h2r.Robocook;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.server.WebSocketHandler;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.util.JSON;

import edu.brown.cs.h2r.baking.Experiments.BasicKitchen;
import edu.brown.cs.h2r.baking.Recipes.Brownies;

@WebSocket
public class RobocookServer{
	private static final String MSGTYPE_STRING = "msgtype";
	private MongoClient mongo;
	private DB db;
	private Map<String, BasicKitchen> gameLookup;
	
	public RobocookServer(String ip, int port, String dbName)
	{
		try 
		{
			this.mongo = new MongoClient(ip, port);
		} 
		catch (UnknownHostException e) 
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
		this.db = this.mongo.getDB(dbName);	
	}
	
	public String getNewCollectionID()
	{
		Random random = new Random();
		String id = Long.toString(random.nextLong());
		while (this.db.collectionExists(id))
		{
			id = Long.toString(random.nextLong());
		}
		return id;
	}
	
	public void logData(String id, String json)
	{
		DBCollection collection = this.db.getCollection(id);
		DBObject data = (DBObject) JSON.parse(json);
		collection.insert(data);
	}
	
	public List<DBObject> getCollectionItems(String id)
	{
		DBCollection collection = this.db.getCollection(id);
		List<DBObject> objects = new ArrayList<DBObject>();
		
		DBCursor cursor = collection.find();
		while(cursor.hasNext())
		{
			objects.add(cursor.next());
		}
		return objects;
	}
	
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
    public void onText(Session session, String message) {
    	Object obj = JSON.parse(message);
    	RobocookServerToken token = (RobocookServerToken)obj;
    	RobocookServerToken response = this.processToken(token);
    	if (!response.isEmpty())
    	{
    		try {
				session.getRemote().sendString(response.toJSONString());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
    }
    
	public RobocookServerToken processToken(RobocookServerToken token)
	{
		// here you can interpret the token type sent from the client according to your needs.
		RobocookServerToken response = new RobocookServerToken();
		
		// Get desired action from token
		String msgtype;
		try 
		{
			msgtype = token.getString(RobocookServer.MSGTYPE_STRING);
		} 
		catch (TokenCastException e) 
		{
			response.setBoolean("Error", true);
			return response;
		}
		
		if (msgtype.equals("init"))
		{
			// Get desired new game type from token
			String gameType;
			try 
			{
				RobocookServerToken msg = token.getToken("msg");
				gameType = msg.getString("type");
			} 
			catch (TokenCastException e) 
			{
				response.setBoolean("Error", true);
				return response;
			}
			
			String id = this.initializeGame(gameType);
			response.setString("id", id);
		}
		else if (msgtype.equals("action"))
		{
			RobocookServerToken msg;
			String id;
			String gameAction;
			List<String> params;
			
			// Get msg, id, gameaction and params from token
			try 
			{
				msg = token.getToken("msg");
				id = token.getString("id");
				gameAction = msg.getString("action");
				params = msg.getStringList("params");
			} 
			catch (TokenCastException e) 
			{
				response.setBoolean("Error", true);
				return response;
			}
			
			this.takeAction(id, gameAction, params, response);
		}
		else if (msgtype.equals("ping"))
		{
			response.setString("msg", "hello");
		}
		
		return response;
	}

	public String initializeGame(String type)
	{
		String id = this.getNewCollectionID();
		BasicKitchen kitchen = new BasicKitchen(new Brownies());
		this.gameLookup.put(id,  kitchen);
		return id;
	}
	
	public RobocookServerToken takeAction(String id, String action, List<String> params, RobocookServerToken responseToken)
	{
		BasicKitchen kitchen = this.gameLookup.get(id);
		String[] paramsArray = (String[])params.toArray();
		String result = kitchen.takeAction(action, paramsArray);
		
		responseToken.setBoolean("failed", kitchen.getIsBotched());
		responseToken.setBoolean("success", kitchen.getIsSuccess());
		
		RobocookServerToken token = RobocookServerToken.tokenFromJSONString(result);
		responseToken.setToken("msg", token);
		return responseToken;
	}

	
	public static void main(String[] args) {
	    RobocookServer server = new RobocookServer("localhost", 27017, "myDB");
	    Server webSocketServer = new Server(8787);
	    WebSocketHandler handeler = new WebSocketHandler() {
	    	@Override
	        public void configure(WebSocketServletFactory factory)
	        {
	            factory.register(RobocookServer.class);
	        }		    	
	    };
        webSocketServer.setHandler(handeler);
        try {
			webSocketServer.start();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        try {
			webSocketServer.join();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String id = server.getNewCollectionID();
		
		String data1 = "{\"hello\": \"world\"}";
		server.logData(id, data1);
		
		String data2 = "{\"goodbye\": \"world\"}";
		server.logData(id, data2);
		
		List<DBObject> objects = server.getCollectionItems(id);
		for (DBObject object: objects)
		{
			System.out.println(object.toString());
		}
	    
	    
		try {
			while (webSocketServer.isRunning()) {
				Thread.sleep(10);
		    }
		} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
		}
	}
}

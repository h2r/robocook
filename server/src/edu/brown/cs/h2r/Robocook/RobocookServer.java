package edu.brown.cs.h2r.Robocook;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
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
import org.eclipse.jetty.websocket.common.WebSocketSession;
import org.eclipse.jetty.websocket.server.WebSocketHandler;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.util.JSON;

import edu.brown.cs.h2r.baking.Experiments.BasicKitchen;
import edu.brown.cs.h2r.baking.Recipes.Brownies;
import edu.brown.cs.h2r.baking.Recipes.MashedPotatoes;
import edu.brown.cs.h2r.baking.Recipes.Recipe;

@WebSocket
public class RobocookServer{
	private static final String MSGTYPE_STRING = "msgtype";
	private MongoClient mongo;
	private DB db;
	private Map<String, BasicKitchen> gameLookup;
	private Session session;
	public RobocookServer() {
		try 
		{
			this.mongo = new MongoClient("localhost", 27017);
		} 
		catch (UnknownHostException e) 
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
		this.db = this.mongo.getDB("myDB");	
	}
	
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
        	RobocookServerToken token = new RobocookServerToken();
        	token.setString("msg", "hello webbrowser");
            session.getRemote().sendString(token.toJSONString());
            this.session = session;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

	@OnWebSocketMessage
    public void onMessage(String message)
	{		
    	RobocookServerToken token = RobocookServerToken.tokenFromJSONString(message);
    	RobocookServerToken response = this.processToken(token);
    	if (!response.isEmpty())
    	{
    		try {
				this.session.getRemote().sendString(response.toJSONString());
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
			String gameType = "single";
			/*try 
			{
				//RobocookServerToken msg = token.getToken("msg");
				gameType = "single";
			} 
			catch (TokenCastException e) 
			{
				response.setBoolean("Error", true);
				return response;
			}*/
			
			this.initializeGame(gameType, response);
			
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
				id = token.getString("clientId");
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

	public void initializeGame(String type, RobocookServerToken token)
	{
		if (this.gameLookup == null) {
			this.gameLookup = new HashMap<String, BasicKitchen>();
		}
		String id = this.getNewCollectionID();
		Recipe brownies = new Brownies();
		Recipe mashedPotatoes = new MashedPotatoes();
		Random random = new Random();
		Recipe recipe = (random.nextBoolean()) ? brownies : mashedPotatoes;
		BasicKitchen kitchen = new BasicKitchen(recipe);
		this.gameLookup.put(id,  kitchen);
		String newState = kitchen.resetCurrentState();
		RobocookServerToken newStateToken = RobocookServerToken.tokenFromJSONString(newState);
		token.setToken("state", newStateToken);
		token.setString("update", "Welcome to our new cooking game!");
		token.setString("clientId", id);
	}
	
	public RobocookServerToken takeAction(String id, String action, List<String> params, RobocookServerToken responseToken)
	{
		BasicKitchen kitchen = this.gameLookup.get(id);
		String[] paramsArray = params.toArray(new String[params.size()]);
	
		boolean didUpdate = kitchen.takeAction(action, paramsArray);
		String newState = kitchen.getCurrentStateString();
		
		
		responseToken.setBoolean("failed", kitchen.getIsBotched());
		responseToken.setBoolean("success", kitchen.getIsSuccess());
		
		String updatedStatus;
		if (didUpdate) {
			updatedStatus = "Successfully performed action " + action;
		}
		else
		{
			updatedStatus = "Action " + action + " did nothing";
		}
		responseToken.setString("update", updatedStatus);
		RobocookServerToken newStateToken = RobocookServerToken.tokenFromJSONString(newState);
		responseToken.setToken("state", newStateToken);
		
		return responseToken;
	}

	
	public static void main(String[] args) {
	    RobocookServer robocookServer = new RobocookServer("localhost", 27017, "myDB");
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
		String id = robocookServer.getNewCollectionID();
		
		String data1 = "{\"hello\": \"world\"}";
		robocookServer.logData(id, data1);
		
		String data2 = "{\"goodbye\": \"world\"}";
		robocookServer.logData(id, data2);
		
		List<DBObject> objects = robocookServer.getCollectionItems(id);
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

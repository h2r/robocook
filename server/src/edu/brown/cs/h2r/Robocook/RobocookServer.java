package edu.brown.cs.h2r.Robocook;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
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
import edu.brown.cs.h2r.baking.Recipes.MashedPotatoes;
import edu.brown.cs.h2r.baking.Recipes.Recipe;
import edu.brown.cs.h2r.baking.actions.BakingActionResult;

/**
 * Main code for the robocook server which serves as the websocket docking point for all clients.
 * 
 * @author Stephen Brawner
 * @author Lee Painton
 * @version Pre-alpha, 09/11/2014 
 */
@WebSocket
public class RobocookServer{
	private static final String MSGTYPE_STRING = "msgtype";
	private static final String WELCOME_MESSAGE =
			"========================================\n\n"
			+ "Welcome to our cooking game!\n\n" +
			"Your task is to complete recipe at the right by interacting with the tiles below.\n\n" +
			"You can drag and drop tiles to move or pour them. You can also select different actions " +
			"and click tiles to perform that action on them.\n\n" + 
			"This is window will provide helpful status updates for you.\n\n" +
			"Enjoy!\n\n"
			+ "========================================";
	
	private static final String RESET_MESSAGE = 
			"The state of the world has been reset.";
	
	private MongoClient mongo;	//Holds the MongoDB client
	private DB db;				//Holds the db connection
	private Map<String, BasicKitchen> gameLookup;  //Maps collection IDs to BasicKitchen objects
	private Session session;
	
	/**
	 * Initializes a new server based on the following hard-coded default settings.
	 * IP = localhost
	 * port = 27017
	 * dbName = myDB
	 */
	public RobocookServer() {
		this("localhost", 27017, "myDB")
	}
	
	/**
	 * Initializes new server based on specified params.
	 * 
	 * @param ip 		a string representing ip address of the server
	 * @param port		the port on which to connect
	 * @param dbName 	a string naming the db to which to connect
	 */
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
	
	/**
	 * Creates a new MongoDB collection ID which is unique for the database.
	 * 
	 * @return	a string containing a unique id for a collection
	 */
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
	
	/**
	 * Inserts a json string in a specified collection on the db.
	 * 
	 * @param id	string containing the collection id
	 * @param json	a string with json data to insert  
	 */
	public void logData(String id, String json)
	{
		DBCollection collection = this.db.getCollection(id);
		DBObject data = (DBObject) JSON.parse(json);
		collection.insert(data);
		System.out.println("Robocook server: " + json);
	}
	
	/**
	 * Retrieves all items from a db collection and returns an list containins them.
	 * 
	 * @param id	a string with the id of the collection to retrieve
	 * @return		a list of DBObjects containing all items in the retrieved collection
	 */
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
	
	/**
	 * Event listener for Jetty websocket API.  
	 * Writes a message to the console with logging data when websocket closes.
	 * 
	 * @param statusCode	the websocket connection close code received from the server
	 * @param reason		a string indicating the reason the server closed
	 */
	@OnWebSocketClose
    public void onClose(int statusCode, String reason) {
        System.out.println("Close: statusCode=" + statusCode + ", reason=" + reason);
    }

	/**
	 * Event listener for Jetty websocket API.
	 * Writes a message to the console with logging data when websocket encounters an error.
	 * 
	 * @param t		a throwable exception generated by the error
	 */
	@OnWebSocketError
    public void onError(Throwable t) {
        System.out.println("Error: " + t.getMessage());

    }

	/**
	 * Event listener for Jetty websocket API.
	 * 
	 * @param session	a session object containing the session generated by the connection event
	 */
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

	/**
	 * Event listener for Jetty websocket API.
	 * 
	 * @param message	a string containing the message received from a client. 
	 */
	@OnWebSocketMessage
    public void onMessage(String message)
	{		
    	RobocookServerToken token = RobocookServerToken.tokenFromJSONString(message);
    	RobocookServerToken response = this.processToken(token);
    	if (response.containsKey("clientId")) {
    		this.logData((String)response.get("clientId"), message);
        	
    	}
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
    
	/**
	 * Processes a token and returns a response.  Intended to bind client and server state.
	 * 
	 * @param token		RobocookServerToken containing the token to be processed.
	 * @return			RobocookServerToken as a reponse
	 */
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
			this.initializeGame(gameType, response);
		}
		else if (msgtype.equals("reset"))
		{
			String id;
			try {
				id = token.getString("clientId");
			} catch (TokenCastException e) {
				throw new RuntimeException("Client Id not in reset message");
			}
			this.resetState(id, response);
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
		
		if (response.containsKey("clientId") && response.containsKey("state")) {
			this.logData((String)response.get("clientId"), response.toJSONString());
		}
		return response;
	}

	/**
	 * Initializes the game variables and token.  Also initializes a basic kitchen.
	 * Currently only selects one of two recipes (brownies or mashed potatoes)
	 * 
	 * @param type		a string which is currently unused.
	 * @param token		a RobocookServerToken which is modified by the method
	 */
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
		token.setStringList("recipe", recipe.getRecipeProcedures());
		token.setToken("state", newStateToken);
		token.setString("update", RobocookServer.WELCOME_MESSAGE);
		token.setString("clientId", id);
	}
	
	/**
	 * Resets the state of the game to a fresh instance.
	 * Basically re-initializes without creating a new Kitchen or collection.
	 * 
	 * @param id		string with the collection id
	 * @param token		RobocookServerToken attached to this session
	 */
	public void resetState(String id, RobocookServerToken token) {
		BasicKitchen kitchen = this.gameLookup.get(id);
		String newState = kitchen.resetCurrentState();
		RobocookServerToken newStateToken = RobocookServerToken.tokenFromJSONString(newState);
		token.setToken("state", newStateToken);
		token.setString("update", RobocookServer.RESET_MESSAGE);
		token.setString("clientId", id);
	}
	
	/**
	 * Sends parameters of an attempted action to the basic kitchen and returns success or failure token.
	 * 
	 * @param id				string holding the collection id
	 * @param action			string describing the action to be taken
	 * @param params			string with parameters for the action
	 * @param responseToken		RobocookServerToken to be returned as a response
	 * @return					RobocookServerToken response to message
	 */
	public RobocookServerToken takeAction(String id, String action, List<String> params, RobocookServerToken responseToken)
	{
		BasicKitchen kitchen = this.gameLookup.get(id);
		String[] paramsArray = params.toArray(new String[params.size()]);
	
		BakingActionResult updateResult = kitchen.takeAction(action, paramsArray);
		String newState = kitchen.getCurrentStateString();
		
		
		responseToken.setBoolean("failed", kitchen.getIsBotched());
		responseToken.setBoolean("success", kitchen.getIsSuccess());
		boolean[] status = kitchen.getCompletedSubgoals();
		responseToken.setObject("status", status);

		String updatedStatus;
		if (updateResult.getIsSuccess()) {
			updatedStatus = "Performed action " + action;
			for (int i = 1; i < params.size(); i++)
			{
				updatedStatus += (i == 1) ? " with " : "";
				updatedStatus += params.get(i);
				updatedStatus += (i < params.size() - 2) ? ", " : "";
				updatedStatus += (i == params.size() - 2) ? " and " : "";
			}
		}
		else
		{
			updatedStatus = updateResult.getWhyFailed();
		}
		responseToken.setString("update", updatedStatus);
		responseToken.setString("clientId", id);
		RobocookServerToken newStateToken = RobocookServerToken.tokenFromJSONString(newState);
		responseToken.setToken("state", newStateToken);
		
		return responseToken;
	}

	/** Main method for the server */
	public static void main(String[] args) {
	    RobocookServer robocookServer = new RobocookServer("localhost", 27017, "myDB");
	    Server webSocketServer = new Server(8787);
	    System.out.println("Starting server at " + webSocketServer.getURI());
	    WebSocketHandler handeler = new WebSocketHandler() {
	    	@Override
	        public void configure(WebSocketServletFactory factory)
	        {
	    		// Set client timeout to 5 min
	    		factory.getPolicy().setIdleTimeout(5*60*1000);
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

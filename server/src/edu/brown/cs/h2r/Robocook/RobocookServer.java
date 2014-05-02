package edu.brown.cs.h2r.Robocook;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.log4j.Logger;
import org.jwebsocket.api.WebSocketPacket;
import org.jwebsocket.api.WebSocketServerListener;
import org.jwebsocket.console.JWebSocketTokenListenerSample;
import org.jwebsocket.factory.JWebSocketFactory;
import org.jwebsocket.kit.WebSocketServerEvent;
import org.jwebsocket.listener.WebSocketServerTokenEvent;
import org.jwebsocket.listener.WebSocketServerTokenListener;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.packetProcessors.JSONProcessor;
import org.jwebsocket.server.TokenServer;
import org.jwebsocket.token.Token;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.util.JSON;

import edu.brown.cs.h2r.baking.Experiments.BasicKitchen;
import edu.brown.cs.h2r.baking.Recipes.Brownies;


public class RobocookServer implements WebSocketServerTokenListener{
	private MongoClient mongo;
	private DB db;
	private static Logger log = Logging.getLogger(JWebSocketTokenListenerSample.class);
	private Map<String, BasicKitchen> gameLookup;
	
	public RobocookServer(String ip, int port, String dbName)
	{
		try {
			this.mongo = new MongoClient(ip, port);
		} catch (UnknownHostException e) {
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
		this.db = this.mongo.getDB(dbName);	
		
		TokenServer tokenServer = (TokenServer)JWebSocketFactory.getServer("ts0");
		if( tokenServer != null ) {
		  // and add the sample listener to the server's listener chain
		  tokenServer.addListener(this);
		}
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
	
	public void processOpened(WebSocketServerEvent aEvent) {
		log.info("Client '" + aEvent.getSessionId() + "' connected.");
		System.out.println("Client '" + aEvent.getSessionId() + "' connected.");
	}

	public void processPacket(WebSocketServerEvent aEvent, WebSocketPacket aPacket) {
		// here you can process any non-token low level message, if desired
	}

	public void processToken(WebSocketServerTokenEvent aEvent, Token aToken) {
		log.info("Client '" + aEvent.getSessionId() + "' sent Token: '" + aToken.toString() + "'.");
		System.out.println("Client '" + aEvent.getSessionId() + "' sent Token: '" + aToken.toString() + "'.");
		
		// here you can interpret the token type sent from the client according to your needs.
		String lNS = aToken.getNS();
		String lType = aToken.getType();
		
		Token response = aEvent.createResponse(aToken);
		String action = aToken.getString("action");
		if (action.equals("new_game"))
		{
			Token msg = aToken.getToken("msg");
			String id = this.initializeGame(msg.getString("type"));
			response.setString("id", id);
		}
		else if (action.equals("take_action"))
		{
			Token msg = aToken.getToken("msg");
			String id = aToken.getString("id");
			String gameAction = msg.getString("action");
			
			//TODO this needs to parse correctly
			List params = msg.getList("params");
			
			this.takeAction(id, gameAction, params, response);
		}
		else if (action.equals("ping"))
		{
			response.setString("msg", "hello");
		}
		
		aEvent.sendToken(response);
	}

	public void processClosed(WebSocketServerEvent aEvent) {
		log.info("Client '" + aEvent.getSessionId() + "' disconnected.");
	}

	public String initializeGame(String type)
	{
		String id = this.getNewCollectionID();
		BasicKitchen kitchen = new BasicKitchen(new Brownies());
		this.gameLookup.put(id,  kitchen);
		return id;
	}
	
	public Token takeAction(String id, String action, List<String> params, Token responseToken)
	{
		BasicKitchen kitchen = this.gameLookup.get(id);
		String[] paramsArray = (String[])params.toArray();
		String result = kitchen.takeAction(action, paramsArray);
		
		responseToken.setBoolean("failed", kitchen.getIsBotched());
		responseToken.setBoolean("success", kitchen.getIsSuccess());
		
		Token token = JSONProcessor.JSONStringToToken(result);
		responseToken.setToken("msg", token);
		return responseToken;
	}
	
	public static void main(String[] args) {
		RobocookServer server = new RobocookServer("localhost", 27017, "myDB");
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
		
		while(true)
		{
			try {
				Thread.sleep(10);
			} catch (InterruptedException e) {
				System.out.println("Exiting due to interrupted sleep");
				System.exit(0);
				
			}
		}
	}	
}

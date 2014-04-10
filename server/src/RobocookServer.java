import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.log4j.Logger;
import org.jwebsocket.config.JWebSocketCommonConstants;
import org.jwebsocket.config.JWebSocketServerConstants;
import org.jwebsocket.console.JWebSocketTokenListenerSample;
import org.jwebsocket.factory.JWebSocketFactory;
import org.jwebsocket.kit.BroadcastOptions;
import org.jwebsocket.kit.CloseReason;
import org.jwebsocket.kit.WebSocketException;
import org.jwebsocket.kit.WebSocketServerEvent;
import org.jwebsocket.kit.WebSocketSession;
import org.jwebsocket.listener.WebSocketServerTokenEvent;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.server.TokenServer;
import org.jwebsocket.token.Token;
import org.jwebsocket.api.IPacketDeliveryListener;
import org.jwebsocket.api.ServerConfiguration;
import org.jwebsocket.api.WebSocketConnector;
import org.jwebsocket.api.WebSocketEngine;
import org.jwebsocket.api.WebSocketFilter;
import org.jwebsocket.api.WebSocketFilterChain;
import org.jwebsocket.api.WebSocketPacket;
import org.jwebsocket.api.WebSocketPlugIn;
import org.jwebsocket.api.WebSocketPlugInChain;
import org.jwebsocket.api.WebSocketServer;
import org.jwebsocket.api.WebSocketServerListener;
import org.jwebsocket.async.IOFuture;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.WriteConcern;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;
import com.mongodb.ServerAddress;
import com.mongodb.WriteResult;
import com.mongodb.util.JSON;

public class RobocookServer implements WebSocketServerListener{
	private MongoClient mongo;
	private DB db;
	private static Logger log = Logging.getLogger(JWebSocketTokenListenerSample.class);
	
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
	}

	public void processPacket(WebSocketServerEvent aEvent, WebSocketPacket aPacket) {
		// here you can process any non-token low level message, if desired
	}

	public void processToken(WebSocketServerTokenEvent aEvent, Token aToken) {
		log.info("Client '" + aEvent.getSessionId() + "' sent Token: '" + aToken.toString() + "'.");
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
		// TODO Initialize new game
		String id = this.getNewCollectionID();
		return id;
	}
	
	public Token takeAction(String id, String action, List<String> params, Token responseToken)
	{
		// TODO take action here
		// TODO get new state in form of json/Token response
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
	}	
}

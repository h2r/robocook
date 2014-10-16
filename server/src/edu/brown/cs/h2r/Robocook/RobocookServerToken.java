package edu.brown.cs.h2r.Robocook;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;

/**
 * Extends a linked hash map with additional, server specific methods
 * 
 * @author Stephen Brawner
 * @author Lee Painton
 */
public class RobocookServerToken extends LinkedHashMap<String, Object> {

	/** String key at which error status is to be stored */
	private static final String ERROR_KEY = "Error";
	
	/** RobocookServerToken default constructor */
	public RobocookServerToken() {
		
	}
	
	/** Constructor which imports a linked hash map into the structure of the Token 
	 * 
	 * @param map 	LinkedHashMap<String, Object> which is imported into the structure of the token.
	 */
	public RobocookServerToken(LinkedHashMap<String, Object> map) {
		this.putAll(map);
	}
	
	/** Serializer which serializes the token into a message format */
	public String toJSONString() {
		return JSON.serialize(this);
	}
	
	/** Static method constructs a Token from JSON version of a DB object 
	 *
	 * @param jsonStr	String JSON object to be parsed
	 * @return			Token with one or more DBobjs
	 */
	public static RobocookServerToken tokenFromJSONString(String jsonStr) {
		Object obj = JSON.parse(jsonStr);
		if (obj instanceof BasicDBList) {
			List<Object> tokens = new ArrayList<Object>();
			BasicDBList list = (BasicDBList)obj;
			for (Object dbObj : list) {
				tokens.add(new RobocookServerToken((BasicDBObject)dbObj));
			}
			RobocookServerToken token = new RobocookServerToken();
			token.setList("data", tokens);
			return token;
		}
		
		BasicDBObject dbObj = (BasicDBObject)obj;
		
		return new RobocookServerToken(dbObj);
	}
	
	/** Retrieves the value at the provided key
	 * 
	 *  @param key	String key for the desired hashmap entry
	 *  @return		Object stored at the keyed location
	 */
	public Object getObject(String key) {
		return this.get(key);
	}
	
	/** Sets the Object value at a keyed location
	 * 
	 * @param key		String with the key for a location in the map
	 * @param object	Object to be stored at the location
	 */
	public void setObject(String key, Object object) {
		this.put(key, object);
	}
	
	/** Sets the value at ERROR_KEY to the provided value
	 * 
	 * @param isError	Boolean which is true if error or false if not
	 */
	public void setError(Boolean isError) {
		this.put(RobocookServerToken.ERROR_KEY, isError);
	}
	
	/** Retrieves the value stored at key "Error" as a Boolean. 
	 * 
	 * @return	Boolean equal to the value at ERROR_KEY or true if the value isn't castable, otherwise false if ERROR_KEY isn't in the hashmap. 
	 */
	public Boolean getError() {
		if (this.containsKey(RobocookServerToken.ERROR_KEY)) {
			try {
				return this.getBoolean(RobocookServerToken.ERROR_KEY);
			} catch (TokenCastException e) {
				return true;
			}
		}
		return false;
	}
	
	/** Retrieves value at key and casts to String
	 * 
	 * @param key	String with the key for the location
	 * @returns		String casted Object value from keyed location
	 * @throws		TokenCastException iff cast throws an exception
	 */
	public String getString(String key) throws TokenCastException {
		try {
			return (String)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	/** Sets the value at key with a String value
	 * 
	 * @param key		String key for location
	 * @param value		String value to set
	 */
	public void setString(String key, String value) {
		this.setObject(key, value);
	}
	
	/** Retrieves value at key and casts to Boolean
	 * 
	 * @param key	String with the key for the location
	 * @returns		Boolean casted Object value from keyed location
	 * @throws		TokenCastException iff cast throws an exception
	 */
	public Boolean getBoolean(String key)  throws TokenCastException  {
		try {
			return (Boolean)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	/** Sets the value at key with a Boolean value
	 * 
	 * @param key		String key for location
	 * @param value		Boolean value to set
	 */
	public void setBoolean(String key, Boolean value) {
		this.setObject(key, value);
	}
	
	/** Retrieves value at key and casts to Double
	 * 
	 * @param key	String with the key for the location
	 * @returns		Double casted Object value from keyed location
	 * @throws		TokenCastException iff cast throws an exception
	 */
	public Double getDouble(String key)  throws TokenCastException  {
		try {
			return (Double)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	/** Sets the value at key with a Double value
	 * 
	 * @param key		String key for location
	 * @param value		Double value to set
	 */
	public void setDouble(String key, Double value) {
		this.setObject(key, value);
	}
	
	/** Retrieves value at key and casts to Integer
	 * 
	 * @param key	String with the key for the location
	 * @returns		Integer casted Object value from keyed location
	 * @throws		TokenCastException iff cast throws an exception
	 */
	public Integer getInt(String key)  throws TokenCastException  {
		try {
			return (Integer)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	/** Sets the value at key with a Integer value
	 * 
	 * @param key		String key for location
	 * @param value		Integer value to set
	 */
	public void setInt(String key, String value) {
		this.setObject(key, value);
	}
	
	/** Retrieves individual token if this token is composed of multiple DBobjs
	 * 
	 * @param key	Key under which the subtoken is stored
	 * @return		RobocookServerToken composed from the subtoken
	 * @throws		TokenCastException if the value isn't castable to a LinkedHashMap<String, Object>
	 */
	public RobocookServerToken getToken(String key)  throws TokenCastException  {
		return new RobocookServerToken((LinkedHashMap<String, Object>)this.getObject(key));
	}
	
	/** Sets the value at key with a String value casted to object
	 * @param key		String key for the location to store the subtoken
	 * @param value		RobocookServerToken to store as a subtoken at the location
	 */
	public void setToken(String key, RobocookServerToken value) {
		this.setObject(key, value);
	}
	
	/** Retrieves value at key and casts to a List of Objects
	 * 
	 * @param key	String with the key for the location
	 * @returns		List<Object> casted Object value from keyed location
	 * @throws		TokenCastException iff cast throws an exception
	 */
	public List<Object> getList(String key)  throws TokenCastException  {
		try {
			return (List<Object>)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	/** Sets the value at key with a List<Object> value
	 * 
	 * @param key		String key for location
	 * @param value		List<Object> value to set
	 */
	public void setList(String key, List<Object> list) {
		this.setObject(key, list);
	}
	
	/** Retrieves the list of values at the key and composes a List of Strings from it
	 * 
	 * @param key	String with key for the location to retrieve
	 * @return		List<String> composed from DBList at key
	 * @throws		TokenCastException iff cast throws and exception
	 */
	public List<String> getStringList(String key)  throws TokenCastException  {
		BasicDBList oldList = (BasicDBList)this.getObject(key);
		List<String> list = new ArrayList<String>();
		try {
			for (Object obj : oldList) {
				list.add((String)obj);
			}
			return list;
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	/** Sets the value at the keyed location to a List of Strings
	 * 
	 * @param key	String with key for location to set
	 * @param list	List<String> to set as the value at the keyed location 
	 */
	public void setStringList(String key, List<String> list) {
		this.setObject(key, list);
	}
}

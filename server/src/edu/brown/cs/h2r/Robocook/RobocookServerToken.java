package edu.brown.cs.h2r.Robocook;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;

public class RobocookServerToken extends LinkedHashMap<String, Object> {

	private static final String ERROR_KEY = "Error";
	
	public RobocookServerToken() {
		
	}
	
	public RobocookServerToken(LinkedHashMap<String, Object> map) {
		this.putAll(map);
	}
	
	public String toJSONString() {
		return JSON.serialize(this);
	}
	
	public static RobocookServerToken tokenFromJSONString(String jsonStr) {
		Object obj = JSON.parse(jsonStr);
		BasicDBObject dbObj = (BasicDBObject)obj;
		
		return new RobocookServerToken(dbObj);
	}
	
	public Object getObject(String key) {
		return this.get(key);
	}
		
	public void setObject(String key, Object object) {
		this.put(key, object);
	}
	
	public void setError(Boolean isError) {
		this.put(RobocookServerToken.ERROR_KEY, isError);
	}
	
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
	
	public String getString(String key) throws TokenCastException {
		try {
			return (String)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	public void setString(String key, String value) {
		this.setObject(key, value);
	}
	
	public Boolean getBoolean(String key)  throws TokenCastException  {
		try {
			return (Boolean)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	public void setBoolean(String key, Boolean value) {
		this.setObject(key, value);
	}
	
	public Double getDouble(String key)  throws TokenCastException  {
		try {
			return (Double)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	public void setDouble(String key, Double value) {
		this.setObject(key, value);
	}
	
	public Integer getInt(String key)  throws TokenCastException  {
		try {
			return (Integer)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	public void setInt(String key, String value) {
		this.setObject(key, value);
	}
	
	public RobocookServerToken getToken(String key)  throws TokenCastException  {
		try {
			return (RobocookServerToken)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	public void setToken(String key, RobocookServerToken value) {
		this.setObject(key, value);
	}
	
	public List<Object> getList(String key)  throws TokenCastException  {
		try {
			return (List<Object>)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
	
	public List<String> getStringList(String key)  throws TokenCastException  {
		try {
			return (List<String>)this.getObject(key);
		}
		catch (ClassCastException e) {
			throw e;
		}
	}
}

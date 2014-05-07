package edu.brown.cs.h2r.Robocook;

public class TokenCastException extends Exception {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public TokenCastException(ClassCastException e) {
		this.setStackTrace(e.getStackTrace());
	}
}

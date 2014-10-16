package edu.brown.cs.h2r.Robocook;

/** A specific instance of a ClassCastException used for RobocookServerToken cast operations
 * 
 * @author Stephen Brawner
 * @author Lee Painton
 */
public class TokenCastException extends Exception {

	private static final long serialVersionUID = 1L;

	public TokenCastException(ClassCastException e) {
		this.setStackTrace(e.getStackTrace());
	}
}

robocook
========
Code relating to the Robocook kitchen cooking simulator.

Installation
============
Download as archive and place in a directory of your choosing.  Open index.html in a browser of your choice to run.

Implemented Messaging Structure
===============================

Client is started, sends new game request with info (1 player, 2 player)
	- Server creates anonymous ID
	- Server starts mongo collection for epidose, logs request, sends client ID back if needed
	- If 2 player, specifies type in collection (other human, robot, random robot)
	- responds with ready message, and anon ID

Client acts, sends ID and requested action
	- server logs request
	- server gets gets next action (if applicable)
	- if game is over, sends message success/failure
	- if server/client get out of sync send FAIL
	- if server crashes, send FAIL

Message: New game request
{
	clientid: <client sends own id if it knows it from previous sessions>
	
}





Proposed Messaging Structure
=============================
Client is started, sends new game request with info (1 player, 2 player)
	- Server creates anonymous ID
	- Server starts mongo collection for epidose, logs request
	- If 2 player, specifies type in collection (other human, robot, random robot)
	- responds with ready message, and anon ID

Client acts, sends ID and requested action
	- server logs request
	- server gets gets next action (if applicable)
	- sends action and new state
	- if game is over, sends message success/failure
	- if server/client get out of sync send FAIL
	- if server crashes, send FAIL


Message: new game request (from client)
{
type: ‘new game’
game_mode: ‘single player’/ ‘two player’
}

Message: new game response (from server)
{
ID: 12345
type: ‘new game’
}

Message: action request (from client)
{
ID: 12345
type: ‘action’
action:
	type: ‘cut’,’move’, ‘pour’, etc
	args: “broccoli”/“bowl counter”, etc…
}

Message: action response (from server)
{
ID: 12345
type: ‘action’
action: #if two player, responds with the action they did
	type: ‘cut’,’move’, ‘pour’, etc
	args: “broccoli”/“bowl counter”, etc…
state:
{
objects:
	- bowl:
		contains: [‘butter’, ‘sugar’, …]
		location: counter
	- knife:
		location: counter
	- butter:
		container: bowl
}
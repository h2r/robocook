#Robocook Web Client
====================
* Author: Lee Painton
* Author: Stephen Brawner

##Installation
==============
Client can be run as-is, but will not provide functionality without active server

##Architecture
==============
The section below provides some details regarding the architecture of the web client.  This is primarily intended for readers who are approaching the client for the first time and would like to know how it fits together as well as where they might find bits of code.
### Files Overview
  * game.js: Provides overall flow logic for the game as well as the main game loop
  * index.html: Does loading of all dependencies and imports, then calls the games main function
  * objects.js: Defines game objects, their state, their control behaviors and their graphical representation
  * painter.js: Defines a set of drawing components for various scenes in the game
  * scenematch.js: Handles the large volume of control logic for the match scene which is the main game scene
  * scenes.js: Contains objects with logic for the smaller scenes (splash, main menu, matchmaking, post-match)
  * sprite.js: Contains logic for creating a default sprite when the sprite has not yet been made
### Architecture Overview
  * The game uses GameQuery [http://gamequeryjs.com/] which is a JS graphics engine built on JQuery

Robocook Web Client
===================
* Author: Lee Painton
* Author: Stephen Brawner

Installation
============
Client can be run as-is, but will not provide functionality without active server

Architecture
============
1. Files Overview
  * game.js: Provides overall flow logic for the game as well as the main game loop
  * index.html: Does loading of all dependencies and imports, then calls the games main function
  * painter.js: Defines a set of drawing components for various scenes in the game
  * scenematch.js: Handles the large volume of control logic for the match scene which is the main game scene
  * scenes.js: Contains objects with logic for the smaller scenes (splash, main menu, matchmaking, post-match)

The robocook server.

INSTALLATION
---------------------------------------------------------

Download jwebsocket server at:

https://jwebsocket.org/downloads/jwebsocket-latest-versions

Download or install MongoDB server at:

http://www.mongodb.org/downloads

There does not exist a build script for now. Open the server code in Eclipse or something.

RUNNING
----------------------------------------------------------
Start mongo server. Change dbpath to a directory where you want your db stored
```
./path_to_mongo/bin/mongod --dbpath=$HOME
```

Start jwebsocket server
```
./path_to_jwebsocket/bin/jWebSocketServer.sh
```
Start the Robocook server

This expects an executable jar in the robocook/server directory. Build the project first

```
cd /path_to_robocook/server
./scripts/launch.bash
```

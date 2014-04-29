#!/usr/bin/env bash

su mongo
mongod
su jweb 
export JWEBSOCKET_HOME=/opt/jWebSocket-1.0
./opt/jWebSocket-1.0/bin/jWebSocketServer.sh
su root /opt/robocook/server/scripts/robocookServer.sh

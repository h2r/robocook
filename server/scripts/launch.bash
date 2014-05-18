#!/usr/bin/env bash

mkdir -p /opt/robocook/log
chown root:robocook -R /opt/robocook/log
chmod 776 -R /opt/robocook/log

su -c "mongod 2>/opt/robocook/log/mongoerr.txt >/opt/robocook/log/mongolog.txt &" - mongo

#su -c "export JWEBSOCKET_HOME=/opt/jWebSocket-1.0 && 
#       cd /opt/jWebSocket-1.0/bin &&
#	       (./jWebSocketServer.sh 2> /opt/robocook/log/robocookerr.txt >/opt/robocook/log/robocooklog.txt&)" - jweb

nohup /opt/robocook/server/scripts/start_server.bash 2>/opt/robocook/log/robocook.err >/opt/robocook/log/robocook.log &

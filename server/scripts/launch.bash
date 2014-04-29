#!/usr/bin/env bash

su - mongo mongod
su - jweb jWebSocketServer.sh
su - robocook robocookServer.sh

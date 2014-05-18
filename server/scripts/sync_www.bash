#!/usr/bin/env bash

mkdir -p /opt/robocook/server
rsync -av --exclude '.git' ../ /opt/robocook/server/

mkdir -p /var/www/robocook/
rsync -av --exclude 'server' --exclude '.git'  ../../ /var/www/robocook/
chmod 775 -R /var/www/robocook

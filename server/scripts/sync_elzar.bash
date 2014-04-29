#!/usr/bin/env bash

cd ~/workspace/robocook
git pull
rsync -avz -e ssh ~/workspace/robocook/ brawner@elzar:~/workspace/robocook/

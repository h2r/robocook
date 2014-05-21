#!/usr/bin/env bash

cd ../..
git pull
rsync -avz --exclude '.git' -e ssh ./ elzar:~/workspace/robocook/

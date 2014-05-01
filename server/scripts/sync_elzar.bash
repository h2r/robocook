#!/usr/bin/env bash

cd ../..
git pull
rsync -avz -e ssh ./ elzar:~/workspace/robocook/

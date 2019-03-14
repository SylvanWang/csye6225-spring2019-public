#!/bin/bash
sudo chmod 777 -R webapp
cd webapp
npm install
cd bin
node ./webapp/bin/www

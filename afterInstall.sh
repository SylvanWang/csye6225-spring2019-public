#!/bin/bash
pkill node
sudo chmod 777 -R webapp
cd /webapp
npm install
sudo systemctl start nodeserver.service
node ./bin/www

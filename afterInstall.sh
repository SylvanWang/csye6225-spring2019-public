#!/bin/bash
pkill node
sudo chmod 777 -R webapp
sudo systemctl daemon-reload
sudo systemctl enable nodeserver.service
sudo systemctl start nodeserver.service
cd /webapp
npm install
node ./bin/www

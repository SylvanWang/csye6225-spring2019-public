#!/bin/bash
pkill node
sudo chmod 777 -R webapp
sudo systemctl daemon-reload
sudo systemctl enable nodeserver
sudo systemctl start nodeserver
cd /webapp
npm install
node ./bin/www

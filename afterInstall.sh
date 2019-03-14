#!/bin/bash
pkill node
sudo chmod 777 -R /opt/webapp
sudo systemctl start nodeserver.service
cd /opt/webapp
npm install
node ./bin/www

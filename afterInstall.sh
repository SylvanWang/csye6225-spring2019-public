#!/bin/bash
pkill node
sudo chmod 777 -R /webapp
sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service
cd webapp
npm install
node ./bin/www

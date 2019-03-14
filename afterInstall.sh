#!/bin/bash
pkill node
sudo chmod 777 -R webapp
sh /etc/profile.d/webappEnv.sh
sudo systemctl start /etc/systemd/system/nodeserver.service
cd /webapp
npm install
sudo systemctl start nodeserver.service
node ./bin/www

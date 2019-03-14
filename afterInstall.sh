#!/bin/bash
killall node
sudo chmod 777 -R webapp
npm install
cd /etc/systemd/system/
sudo systemctl start nodeserver.service
cd ~
cd webapp
node ./bin/www

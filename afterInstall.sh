#!/bin/bash
sudo chmod 777 -R webapp
npm install
node ./webapp/www
cd /etc/systemd/system/
sudo systemctl start nodeserver.service
cd ~
node ./webapp/bin/www

#!/bin/bash
pwd
sudo chmod 777 -R webapp
npm install
cd /etc/systemd/system/
sudo systemctl start nodeserver.service
cd ~
node ./webapp/bin/www

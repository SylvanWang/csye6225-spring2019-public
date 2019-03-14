#!/bin/bash
pwd
sudo chmod 777 -R webapp
npm install
sudo systemctl start nodeserver.service
node ./webapp/bin/www

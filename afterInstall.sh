#!/bin/bash
sudo chmod 777 -R /opt/webapps
cd /webapp
sudo npm install
cd /opt/webapp/bin
sudo node www

#!/bin/bash
source /home/centos/.bash_profile
sudo chmod 777 -R /webapp
sudo pkill node
sudo systemctl daemon-reload
cd webapp
npm install

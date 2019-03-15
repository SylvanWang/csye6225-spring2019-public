#!/bin/bash

sudo chmod 777 -R /webapp
sudo pkill node
#sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service
cd webapp
npm install
node ./bin/www >www.out 2>www.err &
sudo pkill node
sudo systemctl status nodeserver.service -l
sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service >run.out 2>run.err &
#node ./bin/www

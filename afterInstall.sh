#!/bin/bash
sudo pkill node
sudo chmod 777 -R /webapp
#sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service
cd webapp
npm install
sudo systemctl status nodeserver.service -l
sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service >run.out 2>run.err &
#node ./bin/www

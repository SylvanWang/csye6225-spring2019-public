#!/bin/bash
sudo pkill node
sudo chmod 777 -R /webapp
#sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service
sudo systemctl status --no-pager nodeserver.service
cd webapp
npm install
node ./bin/www

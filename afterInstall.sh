#!/bin/bash
source /home/centos/.bash_profile
sudo chmod 777 -R /webapp
sudo pkill node
sudo systemctl daemon-reload
#sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service
cd webapp
npm install
#node ./bin/www >www.out 2>www.err &
#sudo systemctl status nodeserver.service -l
#sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service >run.out 2>run.err &
#node ./bin/www

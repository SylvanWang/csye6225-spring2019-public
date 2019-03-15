#!/bin/bash
source /home/centos/.bash_profile
npm install -g forever
#sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service >run.out 2>run.err &
forever node /webapp/bin/www &

#!/bin/bash
source /home/centos/.bash_profile
cd ~/node_logs
nohup node /webapp/bin/www > webapp.log 2> webapp_err.log &

sudo systemctl enable awslogs.service
sudo systemctl start awslogs.service
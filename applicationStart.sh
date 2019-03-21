#!/bin/bash
source /home/centos/.bash_profile
sudo systemctl start cloudwatch.service

cd /webapp
mkdir node_logs
cd node_logs
nohup node /webapp/bin/www > webapp.log 2> webapp_err.log &


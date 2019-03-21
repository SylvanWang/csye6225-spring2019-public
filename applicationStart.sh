#!/bin/bash
source /home/centos/.bash_profile

cd /webapp
mkdir node_logs
cd node_logs
nohup node /webapp/bin/www > webapp.log 2> webapp_err.log &

sudo systemctl start cloudwatch.service


#!/bin/bash
source /home/centos/.bash_profile
sudo chmod 777 -R /webapp
sudo pkill node
sudo systemctl daemon-reload
cd webapp
npm install

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/cloudwatch-config.json \
    -s

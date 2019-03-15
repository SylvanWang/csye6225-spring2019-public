#!/bin/bash
source /home/centos/.bash_profile
npm install -g forever
nohup node /webapp/bin/www &

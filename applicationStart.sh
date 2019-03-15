#!/bin/bash
source /home/centos/.bash_profile
sudo systemctl daemon-reload
sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service >run.out 2>run.err &


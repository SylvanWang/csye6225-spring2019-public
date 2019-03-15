#!/bin/bash
source /home/centos/.bash_profile
sudo systemctl status nodeserver.service -l
sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service >run.out 2>run.err &


#!/bin/bash
source /home/centos/.bash_profile
nohup node /webapp/bin/www >/dev/null 2>&1 &

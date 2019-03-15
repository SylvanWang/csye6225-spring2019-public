#!/bin/bash
sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service >run.out 2>run.err &


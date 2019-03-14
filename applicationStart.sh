#!/bin/bash
sudo systemctl enable nodeserver.service
sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service >run.out 2>run.err &
sudo systemctl status nodeserver.service -l

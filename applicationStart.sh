#!/bin/bash
sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service >/dev/null 2>&1 &

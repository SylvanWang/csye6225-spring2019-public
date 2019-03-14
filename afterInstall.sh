#!/bin/bash
pkill node
sudo chmod 777 -R /webapp
#sudo systemctl start nodeserver.service && journalctl -fexu nodeserver.service
cd webapp
npm install

mysql -h csye6225-spring2019.cvbzr0rb8azs.us-east-1.rds.amazonaws.com -P 3306 -u csye6225master -pcsye6225password -e 'use csye6225; create table if not exists users(id int(11) not null auto_increment, username VARCHAR(45), password VARCHAR(100), constraint pk_example primary key (id));'
mysql -h csye6225-spring2019.cvbzr0rb8azs.us-east-1.rds.amazonaws.com -P 3306 -u csye6225master -pcsye6225password -e 'use csye6225; create table if not exists notes(id VARCHAR(100) not null, content VARCHAR(45), title VARCHAR(45), createdOn VARCHAR(45), lastUpdatedOn VARCHAR(45), creator_id VARCHAR(45) not null, constraint pk_example primary key (id));'
mysql -h csye6225-spring2019.cvbzr0rb8azs.us-east-1.rds.amazonaws.com -P 3306 -u csye6225master -pcsye6225password -e 'use csye6225; create table if not exists attachments(id VARCHAR(100) not null, url VARCHAR(245), _key VARCHAR(245), noteId VARCHAR(100) not null);'

#node ./bin/www

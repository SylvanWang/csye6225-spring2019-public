#!/usr/bin/env bash

imageId=$(aws ec2 describe-images --filters Name=description,Values="Centos AMI for CSYE 6225 - Spring 2019" | jq '.Images[0].ImageId')
echo $imageId
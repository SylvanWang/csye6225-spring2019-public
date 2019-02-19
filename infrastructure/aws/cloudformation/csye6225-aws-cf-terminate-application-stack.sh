#!/bin/bash

aws cloudformation delete-stack --stack-name $1
aws cloudformation wait stack-delete-complete --stack-name $1

after=$(aws cloudformation describe-stacks --stack-name $1 2> temp)
rm temp

domainName=$(aws route53 list-hosted-zones | jq '.HostedZones[0].Name' | tr -d '"')
echo $domainName

domainName+="csye6225.com"
echo $domainName

$(aws s3 rm s3://$domainName --recursive)

if [ ! -z "${after}" ]
then
      echo "\$delete failer"
else
      echo "\$delete success"
fi


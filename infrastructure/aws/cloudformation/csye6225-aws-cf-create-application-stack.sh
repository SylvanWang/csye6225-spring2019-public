#!/bin/bash

imageId=$(aws ec2 describe-images --filters Name=name,Values="centos_7" | jq '.Images[0].ImageId')
echo $imageId

vpcId=$(aws ec2  describe-vpcs --filters Name=tag:aws:cloudformation:logical-id,Values="myVPC" |jq '.Vpcs[0].VpcId')
echo "$vpcId"

publicSubnetId1=$(aws ec2 describe-subnets --filters Name=vpc-id,Values=$vpcId Name=tag:aws:cloudformation:logical-id,Values="myPublicSubnet1" |jq '.Subnets[0].SubnetId')
echo $publicSubnetId1

privateSubnetId1=$(aws ec2 describe-subnets --filters Name=vpc-id,Values=$vpcId Name=tag:aws:cloudformation:logical-id,Values="myPrivateSubnet1" |jq '.Subnets[0].SubnetId')
echo $privateSubnetId1

privateSubnetId2=$(aws ec2 describe-subnets --filters Name=vpc-id,Values=$vpcId Name=tag:aws:cloudformation:logical-id,Values="myPrivateSubnet2" |jq '.Subnets[0].SubnetId')
echo $privateSubnetId2

domainName=$(aws route53 list-hosted-zones | jq '.HostedZones[0].Name' | tr -d '"')
echo $domainName

if [ ! -z "$domainName" ]
then
      res=$(aws cloudformation create-stack --stack-name $1 --template-body \
            file://csye6225-cf-application.json \
            --parameters \
                        ParameterKey=imageId,ParameterValue=$imageId \
                        ParameterKey=vpcId,ParameterValue=$vpcId \
                        ParameterKey=publicSubnetId1,ParameterValue=$publicSubnetId1 \
                        ParameterKey=privateSubnetId1,ParameterValue=$privateSubnetId1 \
                        ParameterKey=privateSubnetId2,ParameterValue=$privateSubnetId2 \
                        ParameterKey=DBport,ParameterValue="3306"\
                        ParameterKey=DomainName,ParameterValue=$domainName;
            aws cloudformation wait stack-create-complete --stack-name $1)

else
      echo "Domain is not yet hosted."
fi

echo $res
if [ ! -z "$res" ]
then
      echo "\$success"

else
      echo "\$fail"
fi

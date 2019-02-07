#!/bin/bash
temp=`aws cloudformation validate-template --template-body file://csye6225-cf-networking.json`
if [ -z "$temp" ]
then
	echo "Json Template Error"
else 
	echo "Json Template is valid"
fi

response=$(aws cloudformation create-stack --stack-name $1 --template-body file://csye6225-cf-networking.json --parameters ParameterKey=parameterVPCName,ParameterValue=csye6225-vpc ParameterKey=parameterGatewayName,ParameterValue=csye6225-gateway ParameterKey=parameterRouteTableName,ParameterValue=csye6225-rt;
      aws cloudformation wait stack-create-complete --stack-name $1)

if [ ! -z "${response}" ]
then
	echo "Stack created"
else
	echo "Failed to create stack"
	exit 1
fi

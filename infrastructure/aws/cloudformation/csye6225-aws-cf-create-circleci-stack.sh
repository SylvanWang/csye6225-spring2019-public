#!/bin/bash
INPUT='someletters_12345_moreleters.ext'
SUBSTRING=$(echo $INPUT| cut -d'_' -f 2)
echo $SUBSTRING


AWS_REGION=$(aws configure get region)
echo "$AWS_REGION"

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')
echo "$AWS_ACCOUNT_ID"

DomainNamePre=$(aws route53 list-hosted-zones | jq '.HostedZones[0].Name' | tr -d '"')
DomainName="${DomainNamePre%?}"
echo $DomainName

CircleCiUser="circleci1"
echo "$CircleCiUser"

ApplicationName="csye6225-webapp"
echo "$ApplicationName"

RoleArn="arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
echo "$RoleArn"

if [ ! -z "$DomainName" ]
then
      res=$(aws cloudformation create-stack --stack-name $1 --capabilities CAPABILITY_NAMED_IAM --template-body \
            file://csye6225-cf-circleci.json \
            --parameters \
                        ParameterKey=DomainName,ParameterValue=$DomainName \
                        ParameterKey=S3AppZipKey,ParameterValue="myLambda.zip" \
                        ParameterKey=LambdaFuntionName,ParameterValue="passwordResetService" \
                        ParameterKey=LambdaFuntionHandlerName,ParameterValue="index.handler" \
                        ParameterKey=LambdaFuntionRuntime,ParameterValue="nodejs8.10";
            aws cloudformation wait stack-create-complete --stack-name $1)

else
      echo "Domain is not yet hosted."
fi

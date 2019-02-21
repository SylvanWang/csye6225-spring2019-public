#!/usr/bin/env bash

domainName=$(aws route53 list-hosted-zones | jq '.HostedZones[0].Name' | tr -d '"')
echo $domainName

domainName=$domainName"csye6225.com";
echo $domainName
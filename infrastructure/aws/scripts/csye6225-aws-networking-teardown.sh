if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit 1
fi

name="$1"
vpcName="$name VPC"
routeTableName="$name RouteTable"
securityGroupName="$name SecurityGroup"

vpcId=$(aws ec2 describe-vpcs --query "Vpcs[?Tags[?Key=='Name']|[?Value=='$name VPC']].VpcId" --output text)

routeTableId=$(aws ec2 describe-route-tables --query "RouteTables[?Tags[?Value=='$routeTableName']].RouteTableId" --output text)

subnets=$(aws ec2 describe-subnets --query "Subnets[?VpcId=='$vpcId'].SubnetId" --output text)

securityGroups=$(aws ec2 describe-security-groups --query "SecurityGroups[?GroupName=='$securityGroupName'].GroupId" --output text)
#echo "securityGroupIds $securityGroups"

# Delete security groups
if [ "$securityGroups" ]
then 
	for se in $securityGroups
	do
		echo "se: $se"	
		echo "Deleting security group..."
		aws ec2 delete-security-group --group-id $se
	done
else 
	echo "Failed to delete security group"
	exit 1
fi

# Delete route
aws ec2 delete-route --route-table-id $routeTableId --destination-cidr-block 0.0.0.0/0
echo "Deleted route"

if [ "$subnets" ]
then
	for s in $subnets
	do 
		echo "Deleteting Subnets with id '$s'..."
		aws ec2 delete-subnet --subnet-id "$s"		
	done
else 
	echo "Failed to delete subnets"
	exit 1
fi

# Delete Internet Gateway
internetGatewayId=$(aws ec2 describe-internet-gateways --query "InternetGateways[?Attachments[?VpcId=='$vpcId']].InternetGatewayId" --output text)
if [ "$internetGatewayId" ]
then
	echo "Detaching gateway..."
	#Detach Internet gateway
	aws ec2 detach-internet-gateway --internet-gateway-id $internetGatewayId  --vpc-id $vpcId
	#Delete Internet gateway
	aws ec2 delete-internet-gateway --internet-gateway-id $internetGatewayId
	echo "Deleted Internet Gateway"
else 
	echo "Failed to delete gateway"
	exit 1
fi

# Delete Route Table
if [ "$routeTableId" ] 
then
	echo "Deleting routeTable"
	aws ec2 delete-route-table --route-table-id "$routeTableId"
else 
	echo "Failed to delete routeTable"
	exit 1
fi


# Delete VPC
if [ "$vpcId" ]
then
	aws ec2 delete-vpc --vpc-id $vpcId
else 
	echo "Unable to delete resources"
	exit 1
fi



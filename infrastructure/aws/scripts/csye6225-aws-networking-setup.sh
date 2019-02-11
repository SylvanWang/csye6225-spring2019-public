if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit 1
fi


availabilityZone="us-east-1a"
name="$1"
vpcName="$name VPC"
subnet1_name="$name Subnet1"
subnet2_name="$name Subnet2"
subnet3_name="$name Subnet3"
gatewayName="$name Gateway"
routeTableName="$name RouteTable"

securityGroupName="$name SecurityGroup"
vpcCidrBlock="10.0.0.0/16"
port22CidrBlock="0.0.0.0/0"
port80CidrBlock="0.0.0.0/0"

# Create VPC
echo "Creating VPC..."
vpcId=$(aws ec2 create-vpc --cidr-block "$vpcCidrBlock" | jq '.Vpc.VpcId' | tr -d '"')

if [ "$vpcId" ]
then 
	aws ec2 create-tags --resources "$vpcId" --tags Key=Name,Value="$vpcName"
	echo "vpcId created"
else
	echo "Failed to create VPC"
	exit 1
fi

# Create Subnet 1
echo "Creating subnet1..."
subnet1_Id=$(aws ec2 create-subnet --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --vpc-id "$vpcId"  | jq '.Subnet.SubnetId' | tr -d '"')
if [ "$subnet1_Id" ]
then 
	aws ec2 create-tags --resources "$subnet1_Id" --tags Key=Name,Value="$subnet1_name"
	echo "Subnet1 created"
else 
	echo "Failed to create subnet1"
	exit 1
fi

# Create Subnet2
echo "Creating subnet2..."
subnet2_Id=$(aws ec2 create-subnet --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --vpc-id "$vpcId"  | jq '.Subnet.SubnetId' | tr -d '"')
if [ "$subnet2_Id" ]
then 
	aws ec2 create-tags --resources "$subnet2_Id" --tags Key=Name,Value="$subnet2_name"
	echo "Subnet2 created"
else
	echo "Failed to create subnet2"
	exit 1
fi

# Create Subnet3
echo "Creating subnet3..."
subnet3_Id=$(aws ec2 create-subnet --cidr-block 10.0.3.0/24 --availability-zone us-east-1c --vpc-id "$vpcId"  | jq '.Subnet.SubnetId' | tr -d '"')
if [ "$subnet3_Id" ]
then 
	aws ec2 create-tags --resources "$subnet3_Id" --tags Key=Name,Value="$subnet3_name"
	echo "Subnet3 created"
else
	echo "Failed to create subnet3"
	exit 1
fi

# Create Internet Gateway
echo "Creating Internet Gateway..."
gatewayId=$(aws ec2 create-internet-gateway |  jq '.InternetGateway.InternetGatewayId' | tr -d '"')
if [ "$gatewayId" ]
then 
	aws ec2 create-tags --resources "$gatewayId" --tags Key=Name,Value="$gatewayName"
	aws ec2 attach-internet-gateway --internet-gateway-id "$gatewayId"  --vpc-id "$vpcId"
	echo "Gateway created"
else
	echo "Failed to create Internet gateway"
	exit 1
fi

# Create Rrout Table
echo "Creating Route Table..."
routeTableId=$(aws ec2 create-route-table --vpc-id "$vpcId" | jq '.RouteTable.RouteTableId' | tr -d '"')
if [ "$routeTableId" ]
then
	aws ec2 create-tags --resources "$routeTableId" --tags Key=Name,Value="$routeTableName"
	#Associate subnet to the route table
	aws ec2 associate-route-table --route-table-id "$routeTableId" --subnet-id "$subnet1_Id"
	aws ec2 associate-route-table --route-table-id "$routeTableId" --subnet-id "$subnet2_Id"
	aws ec2 associate-route-table --route-table-id "$routeTableId" --subnet-id "$subnet3_Id"
	echo "Route table with associated subnets created"
else
	echo "Failed to create Route Table"
	exit 1
fi

# Create route
echo "Creating Route..."
aws ec2 create-route --route-table-id "$routeTableId" --destination-cidr-block 0.0.0.0/0 --gateway-id "$gatewayId"
echo "Route created"

#create security group
groupId=$(aws ec2 create-security-group --vpc-id "$vpcId" --group-name "$securityGroupName" --description "$securityGroupName" | jq '.GroupId' | tr -d '"')
if [ "$groupId" ]
then 
	aws ec2 create-tags --resources "$groupId" --tags Key=Name,Value="$securityGroupName"
	echo "Security Group created"
else
	echo "Failed to create Security Group"
	exit 1
fi

# Port 22
aws ec2 authorize-security-group-ingress --group-id "$groupId" --protocol tcp --port 22 --cidr "$port22CidrBlock"
echo "Enable port 22"

# Port 80
aws ec2 authorize-security-group-ingress --group-id "$groupId" --protocol tcp --port 80 --cidr "$port80CidrBlock"
echo "Enable port 80"

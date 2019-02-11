aws cloudformation delete-stack --stack-name $1
aws cloudformation wait stack-delete-complete --stack-name $1

after=$(aws cloudformation describe-stacks --stack-name $1 2> temp)

rm temp

if [ ! -z "${after}" ]
then
      echo "Failed to delete"
else
      echo "Deleted"
fi

domainName=$(aws route53 list-hosted-zones | jq '.HostedZones[0].Name' | tr -d '"')
domainName="${domainName%?}"
echo $domainName

jmeterPath="/Users/wangmengqi/apache-jmeter-5.1.1/bin/jmeter"
attachmentPath="/Users/wangmengqi/Desktop/test.jpg"
$jmeterPath -JdomainName=$domainName -Jattachment=$attachmentPath -n -t jmeter.jmx -l test.csv -j test.log
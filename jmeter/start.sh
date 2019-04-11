domainName=$(aws route53 list-hosted-zones | jq '.HostedZones[0].Name' | tr -d '"')
domainName="${domainName%?}"
echo $domainName

jmeterPath="/home/yichuan/apache-jmeter-5.1.1/bin/jmeter"
attachmentPath="/home/yichuan/Downloads/jpg.jpg"
$jmeterPath -JdomainName=$domainName -Jattachment=$attachmentPath -n -t jmeter.jmx -l test.csv -j test.log
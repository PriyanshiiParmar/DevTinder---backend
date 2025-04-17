# setting up SES
- create IAM user
- give access to AmazonSESFullAccess
- Amazon ses : create identity
- verify domain and email
- Install SDK -  npm i @aws-sdk/client-s3 (make sure it is on v3) npm i @aws-sdk/client-ses(because we are using ses)
- example code from https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
- setup SES Client
- Access credentials should be created from IAM under security credentials tab, then add credentials and then write code for SES client 
- code for sending email address
- make the email dynamic, by passing more params to the run function

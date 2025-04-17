require('dotenv').config(); 
const { SESClient } = require("@aws-sdk/client-ses");

const REGION = "ap-south-1";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});


module.exports = { sesClient };

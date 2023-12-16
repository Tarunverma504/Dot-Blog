const sqMail = require("@sendgrid/mail");
const dotenv = require('dotenv');
dotenv.config({ path: require('find-config')('.env') })
const API_KEY = process.env.SENDGRID_API_KEY
sqMail.setApiKey(API_KEY);


var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


async function sendOTP(email, msg){
    const sender = {
        email: process.env.SENDER_MAIL_ID,
        name:'Dot-Blog'
    }

    try{
        const sendEmail = await apiInstance.sendTransacEmail({
            sender,
            to: [{email: email}],
            subject:"OTP Verification for Dot-Blog",
            textContent: msg
        })
        console.log(sendEmail);
    }
    catch(err){
        console.log(err);
    }
}

async function sendResetLink(email, msg, subject){
    const sender = {
        email: process.env.SENDER_MAIL_ID,
        name:'Dot-Blog'
    }
    try{
         await apiInstance.sendTransacEmail({
            sender,
            to: [{email: email}],
            subject: `${subject}`,
            htmlContent:`${msg}`
        })
        .then((data)=>{
            console.log(data);
            return true;
        })
        .catch((err)=>{
            console.log(err);
            return false;
        })
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {sendOTP, sendResetLink};
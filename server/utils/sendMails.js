const sqMail = require("@sendgrid/mail");
const dotenv = require('dotenv');
dotenv.config({ path: require('find-config')('.env') })
const API_KEY = process.env.SENDGRID_API_KEY
sqMail.setApiKey(API_KEY);

async function sendOTP(email, msg){
    const message = {
        to: `${email}`, // Change to your recipient
        from: `${process.env.SENDER_MAIL_ID}`, // Change to your verified sender
        subject: '.blog: OTP verification',
        text: `${msg}`,
    }

    await sqMail.send(message)
        .then((response)=>{
            console.log(response);
            console.log('Email Send..0');
        })
        .catch((err)=>{console.log(err)})
}

module.exports = {sendOTP};
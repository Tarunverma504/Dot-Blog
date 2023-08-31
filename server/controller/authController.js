const User = require("../models/user");
const createToken = require("../utils/jwtToken");
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const Cryptr = require('cryptr');
const {sendOTP} = require("../utils/sendMails");

require('dotenv').config({ path: require('find-config')('.env') })
const cryptr = new Cryptr(process.env.TWO_WAY_SECRET);

exports.registerUser = async(req, res)=>{
    try{
        const {name, password, email} = req.body;

        const otp =otpGenerator.generate(6, { upperCase: true, specialChars: false });
        const result = await User.find({email:email});
        let user = null;
        if(result && result.length>0){
            // if email exists and otp is also verified mean suer profile is already created successfully
            if(result[0].verified){
                res.status(403).send({ message: 'Email is Already Registered'});
            }
                
            // email is exist but otp is not verified
            else{
                user = await User.findByIdAndUpdate({_id: result[0]._id}, { otp: otp});                       
            }
        }
        else{
            user = await User.create({
                name,   
                email,
                password,
                otp: otp,
                verified: false
            })
            // const token = createToken(user._id);
            // console.log(token);
            // //res.status(200).cookie('Usertoken', token, {httpOnly:true}).json({name:user.name, opt: user.otp, verified: user.verified});
            // const encryptedId = await cryptr.encrypt(user._id);
            // let msg=`Hi,\n Your OTP is: ${otp}`;
            //     sendOTP(user.email, msg)
            // res.status(200).json({name:user.name, opt: user.otp, userId: encryptedId});
        }

        if(user!=null){
            const encryptedId = await cryptr.encrypt(user._id);
            let msg=`Hi,\n Your OTP is: ${otp}`;
            await sendOTP(user.email, msg)
            res.status(200).json({name:user.name, opt: user.otp, userId: encryptedId});
        }
    }
    catch(err){
        if (err) {
            if (err.name === 'ValidationError') {
                const message = Object.values(err.errors).map(val => val.message)
                res.status(403).send({ message: message[0]});
            }
            else{
                console.log(err);
                res.status(504).send({ message: 'Internalserver error'});
            }
        }        
    }
    
}

exports.verifyUserOtp = async(req, res, next)=>{
    try{
        const {userId, Otp} = req.body;
        if(userId==null || userId.length<1){
            res.status(504).send({ message: 'UserId not received'});
        }
        const Id = cryptr.decrypt(userId);
        const user = await User.findById({_id: Id});
        console.log(user);
        if(user){
            if(user.verified){
                res.status(504).send({ message: 'User already exist'});
            }
            else{
                if(user.otp == Otp){
                    const token = createToken(user._id);
                    res.status(200).cookie('Usertoken', token, {httpOnly:true}).json({message: "Otp Verified"})
                }
                else{
                    res.status(400).send({message: "Otp not Verified"});
                }
            }
        }
        else{
            res.status(403).send({ message: 'User not found'});
        }
        
    }
    catch(err){
        res.status(400).send({message: "Otp not Verified"});
    }
}

exports.resendOtp = async(req, res, next)=>{
    try{
        const {userId} = req.body;
        if(userId==null || userId.length<1){
            res.status(504).send({ message: 'UserId not received'});
        }
        else{
            const otp =otpGenerator.generate(6, { upperCase: true, specialChars: false });
            const Id = cryptr.decrypt(userId);
            const user = await User.findByIdAndUpdate({_id: Id}, { otp: otp});
            let msg=`Hi,\n Your OTP is: ${otp}`;
            await sendOTP(user.email, msg)
            res.status(200).json({message: "Please check your email for the OTP"});

        }
    }
    catch(err){
        res.status(504).send({message: "Internal server error"});
    }
}

exports.loginUser = async(req, res, next)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).send({message: 'Please enter email & password'});
        }

        //Finding user in database 
        const user = await User.findOne({email}).select('+password');
        if(!user){
            res.status(401).send({message: 'Invalid Email or Password'});
        }

        //checks if password is correct or not
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if(!isPasswordMatched){
            res.status(401).send({message: 'Invalid Email or Password'});
        }
        const token = createToken(user._id);
        res.status(200).cookie('Usertoken', token, {httpOnly:true}).json({name:user.name});
    }
    catch(err){
        console.error(err);
        res.status(504).send({ message: 'Internalserver error', err:err});
    }
}



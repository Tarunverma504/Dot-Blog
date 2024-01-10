const User = require("../models/user");
const ForgotPassword = require("../models/forgotPassword");
const {createToken, getTokenValue} = require("../utils/jwtToken");
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const Cryptr = require('cryptr');
const {sendOTP, sendResetLink} = require("../utils/sendMails");

require('dotenv').config({ path: require('find-config')('.env') })
const cryptr = new Cryptr(process.env.TWO_WAY_SECRET);

exports.isAuthenticated = async(req, res)=>{
    const token = await req.headers.authorization.replace("Bearer ", "");
    if (!token ||token.length<1|| token =='null') {
        res.status(401).send({message: 'No User Loggged'});
        return;
    }

    const Id = getTokenValue(token);
    const user = await User.findById(Id);
    if(user){
        res.status(200).json({name:user.name, profilePhoto:user.profilePhoto, coverPhoto: user.coverPhoto, authToken:token})
    }

}

exports.registerUser = async(req, res)=>{
    try{
        const {username, email, password} = req.body;
        // username = username.trim();
        if(username.trim().length<1 || email.trim().length<1 || password.trim().length<1){
            res.status(401).send({ message: 'Please fill all the details'});
        }
        const otp =otpGenerator.generate(6, { upperCase: true, specialChars: false });
        const result = await User.find({email:email});
        let user = null;
        if(result && result.length>0){
            // if email exists and otp is also verified mean suer profile is already created successfully
            if(result[0].verified){
                res.status(401).send({ message: 'Email is Already Registered'});
            }
                
            // email is exist but otp is not verified
            else{
                user = await User.findByIdAndUpdate({_id: result[0]._id}, {name:username, password:password, otp: otp}, {new: true});                       
            }
        }
        else{
            user = await User.create({
                name:username,   
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
            await sendOTP(user.email, msg);
            const token = createToken(user._id);
            res.status(200).json({verificationToken:token});
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
        const {verificationToken, Otp} = req.body;
        if(verificationToken==null || verificationToken.length<1){
            res.status(402).send({ message: 'Token not received'});
        }
        if(Otp==null || Otp.trim().length<1){
            res.status(401).send({ message: 'Please fill the Otp'});
        }
        const id = getTokenValue(verificationToken);
        const user = await User.findById({_id: id});
        if(user){
            if(user.verified){
                res.status(403).send({ message: 'User already exist'});
            }
            else{
                if(user.otp == Otp){
                    const user = await User.findByIdAndUpdate({_id: id}, {verified:true});

                    const token = createToken(user._id);
                    res.status(200).json({name:user.name, profilePhoto:user.profilePhoto, authToken:token});
                }
                else{
                    res.status(401).send({message: "Otp not Verified"});
                }
            }
        }
        else{
            res.status(403).send({ message: 'User not found'});
        }
        
    }
    catch(err){
        console.log(err);
        res.status(401).send({message: "Otp not Verified"});
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
            res.status(401).send({message: 'Please enter email & password'});
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
        res.status(200).json({name:user.name, profilePhoto:user.profilePhoto, authToken:token});
    }
    catch(err){
        console.error(err);
        res.status(504).send({ message: 'Internalserver error', err:err});
    }
}

exports.forgotPassword = async(req, res, next)=>{
    try{
        const {email} = req.body;
        // username = username.trim();
        if(email.trim().length<1){
            res.status(401).send({ message: 'Please fill all the details'});
        }

        const result = await User.findOne({email:email, verified:true});
        if(result){
            console.log(result._id);
            await ForgotPassword.create({  
                userId:result._id,
                email:email
            })
            .then((data)=>{
                console.log(data);
                const msg = `<p>Hi, Please click the below link to change the password</p>
                        <a href='${process.env.FRONTEND_URL}/reset-password/${data._id}'>Reset Password!</a>`
                if(sendResetLink(email, msg, "Change account Password request")){
                    res.status(200).send("Link send successfully");
                }
                else{
                    res.status(504).send({ message: 'Internalserver error', err:err});
                }
            })
        }
        else{
            res.status(403).json({message:"Invalid email"})
        }


    }
    catch(err){
        console.error(err);
        res.status(504).send({ message: 'Internalserver error', err:err});
    }
}

exports.resetPassword = async(req, res)=>{
    try{
        const { password, confirmPassword, id } = req.body;
        if(password.trim().length<1 || confirmPassword.trim().length<1){
            res.status(403).send({message:"Please fill all the fields"});
        }
        else{
            if(password.trim() != confirmPassword.trim()){
                res.status(403).send({message:"password doesn't match"});
            }
            else{
                const forgotPassword = await ForgotPassword.findById(id);
                if(forgotPassword && forgotPassword._id){
                    const hashPassword = await bcrypt.hash(password.trim(),10)
                    User.findByIdAndUpdate({_id:forgotPassword.userId}, {password:hashPassword}, {new:true})
                        .then(async()=>{
                            await ForgotPassword.findByIdAndUpdate({_id:forgotPassword._id}, {expired:true})
                                .then(()=>{
                                    res.status(200).json("Password updated successfully");
                                })
                                .catch((err)=>{
                                    res.status(504).send({ message: 'Internalserver error', err:err});
                                })
                        })
                        .catch((err)=>{
                            res.status(504).send({ message: 'Internalserver error', err:err});
                        })
                }
                else{
                    res.status(504).send({ message: 'Internalserver error', err:err});
                }
            }
        }
    }
    catch(err){
        console.error(err);
        res.status(504).send({ message: 'Internalserver error', err:err});
    }
}

exports.checkResetLink = async(req, res)=>{
    try{
        const id = req.params.id;
        if(id){
            await ForgotPassword.findById(id)
            .then((data)=>{
                res.status(200).json(data.expired)
            })
            .catch((err)=>{
                console.log(err);
                res.status(504).send({ message: 'Internalserver error', err:err});
            })
        }
    }
    catch(err){
        console.error(err);
        res.status(504).send({ message: 'Internalserver error', err:err});
    }
}



const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, "Your name cannot exceeds 30 characters"]
    },
    email:{
        type: String,
        required:[true, 'Please enter your email'],
        unique:[true, 'Email already exist'],
        validate:[validator.isEmail, 'Please enter valid email address']  //check that it is email or not
    },
    password:{
        type: String,
        required:[true, 'Please enter your password'],
        select: false
    },
    otp: String,
    verified: {
        type: Boolean,
        default: false
    },
    profilePhoto:{
        type: String,
        default:""
    },
    profilePhoto_Public_ID:{
        type:String,
        default:""
    },
    coverPhoto:{
        type: String,
        default:""
    },
    coverPhoto_Public_ID:{
        type:String,
        default:""
    },
    about:{
        type:String,
        default:""
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

//Encrypting password before saving user
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){  // it make sure that password is changed
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})




module.exports = mongoose.model('User', userSchema);
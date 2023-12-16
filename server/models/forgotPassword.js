const mongoose = require('mongoose');
const forgotPasswordSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    email:{
        type:String
    },
    expired:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);
const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    Thumbnail:{
        type:String,
        trim:true
    },
    Title:{
        type:String,
        trim:true
    },
    Body:{
        type:String,
        trim:true
    },
    Category:{
        type:String,
        trim: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Blog', blogSchema);
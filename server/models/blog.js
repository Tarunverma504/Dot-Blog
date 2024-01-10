const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Thumbnail:{
        type:String,
        trim:true
    },
    Thumbnail_PublicId:{
        type:String,
        trim:true
    },
    Title:{
        type:String,
        trim:true
    },
    SubText:{
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
    isPublished:{
        type: Boolean, 
        default: false
    },
    likes:[
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        },
    ],
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            text: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    PublishedDate:{
        type:Date,
        default:Date.now
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Blog', blogSchema);
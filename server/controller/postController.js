const User = require("../models/user");
const Blog = require("../models/blog");
const mongoose = require('mongoose');
const { createToken,getTokenValue} = require("../utils/jwtToken");
const cloudinary = require('cloudinary');
const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
    ];
const objectId = mongoose.Types.ObjectId;


// exports.CreateNewPost = async(req, res)=>{
//     try{
//         const token = await req.headers.authorization.replace("Bearer ", "");
//         if (!token ||token.length<1|| token =='null') {
//             res.status(401).send({message: 'No User Loggged'});
//             return;
//         }
//         const Id = getTokenValue(token);
//         const blog = await Blog.create({
//             userId:Id,
//             Thumbnail:null,
//             Title:"Please Change Your Blog Title Here..",
//             Body:"Write your blog here..",
//             Category:null
//         })
//         const BlogId = createToken(blog._id)
//         res.status(200).json({data:BlogId});
//     }
//     catch(err){
//         res.status(500).json({error:err});
//     }
    
// }


exports.UploadThumbnail = async(req, res)=>{
    const PrevImage = JSON.parse(req.body.PrevImage);
    try{
        const result = await cloudinary.v2.uploader.upload(req.files.thumbnail_Img.tempFilePath,{
            folder: 'Dot-Blog/Blog_Thumbnails',
            crop: "scale"
        })
        if(Object.keys(PrevImage).length>0){
            await cloudinary.v2.uploader.destroy(PrevImage.public_id)
        }
        res.status(200).json({ImageUrl:result.url, public_id:result.public_id})
    }
    catch(err){
        console.log(err);
    }
    
}

exports.CreateBlogSave = async(req, res)=>{
    try{
        const token = await req.headers.authorization.replace("Bearer ", "");
        if (!token ||token.length<1|| token =='null') {
            res.status(401).send({message: 'No User Loggged'});
            return;
        }
        const Id = getTokenValue(token);
        const heading = req.body.heading;
        const subText = req.body.subText;
        let content = req.body.content;
        content = content.split("<br>").join("<br/>");
        const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath,{
            folder: 'Dot-Blog/Blog_Thumbnails',
            crop: "scale"
        })

        if(result){
            await Blog.create({
                userId:Id,
                Thumbnail:result.url,
                Thumbnail_PublicId:result.public_id,
                Title:heading,
                Body:content,
                Category:null,
                SubText:subText
            })
            .then(async(data)=>{
                await User.findByIdAndUpdate({_id: Id}, {$push:{posts:data._id}})
                .then((data)=>{
                    res.status(200).send({message:"Success"});
                })
                .catch((err)=>{
                    res.status(500).send({message: err});
                })
            })
            .catch((err)=>{
                res.status(500).send({message: err});
            })
        }
        else{
            res.status(500).send({message: err});
        }
        
    }
    catch(err){
        console.log(err);
        res.status(500).send({message: err});
    }

}

exports.UploadProfilePhoto = async(req, res)=>{
    try{
        const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
            folder: 'Dot-Blog/Profile_Photo',
            crop: "scale"
        })

        const token = await req.headers.authorization.replace("Bearer ", "");
        const Id = getTokenValue(token);
        const user = await User.findById({_id: Id});
        if(user){
            let profilePhoto_Public_ID = user.profilePhoto_Public_ID;
            await User.findByIdAndUpdate({_id: Id}, { profilePhoto: result.url, profilePhoto_Public_ID: result.public_id}, {new: true})
            .then(async(data)=>{
                if(profilePhoto_Public_ID.trim().length>0){
                    await cloudinary.v2.uploader.destroy(profilePhoto_Public_ID);
                    //res.status(200).json({ImageUrl:result.url, public_id:result.public_id})
                }
                res.status(200).json({ImageUrl:result.url, public_id:result.public_id})
            })
            .catch((err)=>{
                res.status(500).json({message:err})
            })
            
        }
    }
    catch(err){
        res.status(500).json({message:err})
    }
}

exports.UploadCoverPhoto = async(req, res)=>{
    try{
        const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
            folder: 'Dot-Blog/Cover_Photo',
            crop: "scale"
        })

        const token = await req.headers.authorization.replace("Bearer ", "");
        const Id = getTokenValue(token);
        const user = await User.findById({_id: Id});
        if(user){
            let coverPhoto_Public_ID = user.coverPhoto_Public_ID;
            await User.findByIdAndUpdate({_id: Id}, { coverPhoto: result.url, coverPhoto_Public_ID: result.public_id}, {new: true})
            .then(async(data)=>{
                if(coverPhoto_Public_ID.trim().length>0){
                    await cloudinary.v2.uploader.destroy(coverPhoto_Public_ID);
                    res.status(200).json({ImageUrl:result.url, public_id:result.public_id})
                }
            })
            .catch((err)=>{
                res.status(500).json({message:err})
            })
            
        }
    }
    catch(err){
        res.status(500).json({message:err})
    }
}

exports.GetUserBlogs = async(req, res)=>{
    try{
        const token = await req.headers.authorization.replace("Bearer ", "");
        if (!token ||token.length<1|| token =='null') {
            res.status(401).send({message: 'No User Loggged'});
            return;
        }
        const Id = getTokenValue(token);
        const user = await User.findById({_id: Id}).populate('posts');
        if(user){
            const oData = {
                name: user.name,
                profilePhoto: user.profilePhoto,
                coverPhoto: user.coverPhoto,
                about:user.about,
                Published:[],
                Draft:[]
            }
            const posts = user.posts;
            (posts).forEach(function(e){
                if(e.isPublished){
                    oData.Published.push(e);
                }
                else{
                    oData.Draft.push(e);
                }
            })
            res.status(200).json(oData);

        }
        else{
            res.status(500).json({message:"Something went wrong"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err})
    }
}

exports.GetBlog = async(req, res)=>{
    try
    {
        const id = req.params.id;
        await Blog.findById({_id:id}).populate('userId').populate('comments.userId', 'name email profilePhoto')
        .then(async(data)=>{
            data.comments.sort((a, b) => b.createdAt - a.createdAt);
            let isAlreadyLiked = false;
            const token = await req.headers.authorization.replace("Bearer ", "");
            if (!token ||token.length<1|| token =='null') {
                isAlreadyLiked = false;
            }
            else{
                const Id = getTokenValue(token);
                isAlreadyLiked = data.likes.some(like => like.userId.equals(Id));
            }
            const result = {
                Title:data.Title,
                Body:data.Body,
                Thumbnail:data.Thumbnail,
                AuthorName: data.userId.name,
                AuthorId: data.userId._id,
                AuthorPhoto: data.userId.profilePhoto,
                SubText: data.SubText,
                CreatedAt: monthNames[data.createdAt.getMonth()]+" "+data.createdAt.getDate()+","+data.createdAt.getFullYear(),
                likes: data.likes.length,
                comments: data.comments,
                isAlreadyLiked: isAlreadyLiked
            };
            res.status(200).json(result);
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({message:err});
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

exports.UpdateBlog = async(req, res)=>{
    try
    {
        const token = await req.headers.authorization.replace("Bearer ", "");
        if (!token ||token.length<1|| token =='null') {
            res.status(401).send({message: 'No User Loggged'});
            return;
        }
       
        const {isThumbnailUpdated} = req.body;
        const id = req.params.id;
        if(isThumbnailUpdated=='true'){
            const getBlog = await Blog.findById(id);
            const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath,{
                folder: 'Dot-Blog/Blog_Thumbnails',
                crop: "scale"
            })
            if((getBlog.Thumbnail_PublicId).trim().length>0){
                await cloudinary.v2.uploader.destroy(getBlog.Thumbnail_PublicId)
            }

            const heading = req.body.heading;
            const subText = req.body.subText;
            let content = req.body.content;
            content = content.split("<br>").join("<br/>");
            await Blog.findByIdAndUpdate({_id:id}, {Title:heading, SubText:subText, Body:content, Thumbnail:result.url, Thumbnail_PublicId:result.public_id}, {new:true})
            .then((data)=>{
                res.status(200).json({message:"Blog Saved Successfully"});
            })
            .catch ((err)=>{
                console.log(err);
                res.status(500).json(err);
            })
        }
        else{
            const id = req.params.id;
            const heading = req.body.heading;
            const subText = req.body.subText;
            let content = req.body.content;
            content = content.split("<br>").join("<br/>");
            await Blog.findByIdAndUpdate({_id:id}, {Title:heading, SubText:subText, Body:content}, {new:true})
            .then((data)=>{
                res.status(200).json({message:"Blog Saved Successfully"});
            })
            .catch ((err)=>{
                console.log(err);
                res.status(500).json(err);
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

exports.GetAllBlogs = async(req, res)=>{
    try{
        await Blog.find({isPublished:true}).populate('userId')
        .then((data)=>{
            res.status(200).json(data);
        })
        .catch((err)=>{
            res.status(500).json(err);
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

exports.PublishBlog = async(req, res)=>{
    try
    {
        const token = await req.headers.authorization.replace("Bearer ", "");
        if (!token ||token.length<1|| token =='null') {
            res.status(401).send({message: 'No User Loggged'});
            return;
        }  
        const id = req.body.Blogid;
        await Blog.findByIdAndUpdate({_id:id}, {isPublished:true, PublishedDate: new Date()}, {new:true})
        .then((data)=>{
            res.status(200).json({message:"Blog Published Successfully"});
        })
        .catch ((err)=>{
            console.log(err);
            res.status(500).json(err);
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

exports.GetAllPublishedBlogs = async(req, res)=>{
    try{
        const searchValue = req.query.search || '';
        if(searchValue.trim().length<1){
            await Blog.find({isPublished:true}).sort({PublishedDate: -1}).populate('userId')
            .then((data)=>{
                res.status(200).json(data);
            })
        }
        else{
            await Blog.find({isPublished:true, 
                $or: [
                    { Title: { $regex: searchValue, $options: 'i' } },
                    { SubText: { $regex: searchValue, $options: 'i' } },
                    { Body: { $regex: searchValue, $options: 'i' } },
                    { Category: { $regex: searchValue, $options: 'i' } }
                ]
            }).sort({PublishedDate: -1}).populate('userId')
            .then((data)=>{
                res.status(200).json(data);
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

exports.GetAuthor = async(req,res)=>{
    try{
        const id = req.params.id;
        const user = await User.findById(id).populate('posts')
        if(user){
            const oData = {
                name: user.name,
                profilePhoto: user.profilePhoto,
                coverPhoto: user.coverPhoto,
                about:user.about,
                Published:[],
                Draft:[]
            }

            const posts = user.posts;
            (posts).forEach(function(e){
                if(e.isPublished){
                    oData.Published.push(e);
                }

            })
            res.status(200).json(oData);

        }
        else{
            res.status(500).json({message:"Something went wrong"})
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

exports.UpdateAbout = async(req, res)=>{
    try{
        const token = await req.headers.authorization.replace("Bearer ", "");
        if (!token ||token.length<1|| token =='null') {
            res.status(401).send({message: 'No User Loggged'});
            return;
        }
        const id = getTokenValue(token);
        let about = req.body.about;
        about = about.trim();
        about = about.split("<br>").join("<br/>");
        console.log(typeof(about));
        await User.findByIdAndUpdate({_id: id},{$set:{about:about}});
        const user = await User.findById(id).populate('posts')
        if(user){
            const oData = {
                name: user.name,
                profilePhoto: user.profilePhoto,
                coverPhoto: user.coverPhoto,
                about:user.about,
                Published:[],
                Draft:[]
            }

            const posts = user.posts;
            (posts).forEach(function(e){
                if(e.isPublished){
                    oData.Published.push(e);
                }
                else{
                    oData.Draft.push(e);
                }
            })
            res.status(200).json(oData);

        }
        else{
            res.status(500).json({message:"Something went wrong"})
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

exports.getCategoriesBlogs = async(req, res)=>{
    try{
        const category = req.params.category;
        if(category == 'DefaultOption'){
            await Blog.find({isPublished:true}).sort({PublishedDate: -1}).populate('userId')
            .then((data)=>{
                res.status(200).json(data);
            })
        }
        else{
            await Blog.find({Category:category,isPublished: true}).sort({PublishedDate: -1}).populate('userId')
            .then((data)=>{
                res.status(200).json(data);
            })
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

exports.LikeThePost = async(req, res)=>{
    try{
        const {userId, BlogId} = req.body;
        const id = getTokenValue(userId);
        await Blog.findByIdAndUpdate(new objectId(BlogId), {$push:{likes: {userId: id}}}, { new: true })
        .then((data)=>{
            res.status(200).json(data.likes.length)
        }).catch((err)=>{
            res.status(500).send({message: err});
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

exports.DislikeThePost = async(req, res)=>{
    try{
        const {userId, BlogId} = req.body;
        const id = getTokenValue(userId);
        await Blog.findByIdAndUpdate(new objectId(BlogId), {$pull:{likes: {userId: id}}}, { new: true })
        .then((data)=>{
            res.status(200).json(data.likes.length)
        }).catch((err)=>{
            res.status(500).send({message: err});
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }   
}

exports.AddComment = async(req, res)=>{
    try{
        console.log(req.body);
        const {BlogId, userId, Comment} = req.body;
        const id = getTokenValue(userId);
        await Blog.findByIdAndUpdate(new objectId(BlogId), {$push:{comments: {userId: new objectId(id), text: Comment}}}, { new: true }).populate('comments.userId', 'name email profilePhoto')
        .then(async(data)=>{
          data.comments.sort((a, b) => b.createdAt - a.createdAt);
            res.status(200).json(data.comments);
        })
        .catch((err)=>{
            res.status(500).send({message: err});
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }  
}
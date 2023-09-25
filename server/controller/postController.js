const User = require("../models/user");
const Blog = require("../models/blog");
const { createToken,getTokenValue} = require("../utils/jwtToken");
const cloudinary = require('cloudinary');


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
    console.log(PrevImage);
    try{
        const result = await cloudinary.v2.uploader.upload(req.files.thumbnail_Img.tempFilePath,{
            folder: 'Dot-Blog/Blog_Thumbnails',
            crop: "scale"
        })
        if(Object.keys(PrevImage).length>0){
            await cloudinary.v2.uploader.destroy(PrevImage.public_id)
            .then((data)=>{
                console.log(data);
            })
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
        console.log(req.body);
        const heading = req.body.heading;
        const thumbnail = req.body.Thumbnail;
        const content = req.body.content;
        await Blog.create({
            userId:Id,
            Thumbnail:thumbnail,
            Title:heading,
            Body:content,
            Category:null
        })
        .then(async(data)=>{
            console.log(data);
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
    catch(err){
        res.status(500).send({message: err});
    }

}
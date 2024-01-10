import React, { useEffect, useState } from 'react'
import axios from 'axios';
import QuillEditor from '../Utils/QuillEditor';
import { Navbar } from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import {PageLoader} from "./PageLoader";
import {getDate} from "../Utils/utils"
import {
    BLOG_THUMBNAIL_REQUEST,
    BLOG_THUMBNAIL_SUCCESS,
    BLOG_THUMBNAIL_FAILED,
    SAVE_BLOG_REQUEST,
    SAVE_BLOG_SUCCESS,
    SAVE_BLOG_FAILED
} from "../../constants/postConstants"

import {  AUTH_TOKEN } from "../../constants/userConstants"; 
import ReadBlogCard from '../Utils/ReadBlogCard';

import useUnsavedChangesWarning from '../../CutomHooks/useUnsavedChangesWarning';
const CreateBlog = (props)=>{

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.post)
    const {user} = useSelector(state => state.auth);
    
    // States

    const[setDirty, setPristine, setEditorContentDirty] = useUnsavedChangesWarning();

    const [heading, setHeading] = useState(props.heading);
    const [subtext, setSubText] = useState(props.subtext);
    const [editorContent, setEditorContent] = useState(props.editorContent);
    const [initalEditorContent, setInitalEditorContent] = useState(props.editorContent);
    const [category, setCategory] = useState(props.DefaultOption);
    const [newCategory, setNewCategory] = useState(props.newCategory);
    const [file, setFile] = useState(props.file);
    const [thumbnailUrl, setThumbnailUrl] = useState(props.thumbnailUrl);
    const [showPreview, setPreview] = useState(false);
    useEffect(()=>{
        setHeading(props.heading);
        setSubText(props.subtext);
        setEditorContent(props.editorContent);
        setCategory(props.DefaultOption);
        setNewCategory(props.newCategory);
        setFile(props.file);
        setThumbnailUrl(props.thumbnailUrl);
        setInitalEditorContent(props.editorContent);
    },[props.heading,props.subtext, props.editorContent, props.DefaultOption, props.newCategory, props.file, props.thumbnailUrl ])

    useEffect(()=>{
        if(editorContent != initalEditorContent){
            setEditorContentDirty();
        }
    }, [editorContent, initalEditorContent])
    const handleDragOver = event => {
        event.preventDefault();
    }
    const handleOnDrop = event => {
        setThumbnailUrl("");
        //prevent the browser from opening the image
        event.preventDefault(); 
        event.stopPropagation(); 
        //let's grab the image file
        uploadImage(event.dataTransfer.files[0], event.dataTransfer.files[0].name, URL.createObjectURL(event.dataTransfer.files[0]));
    }
    
    const handleImage = (e) =>{
        e.preventDefault(); 
        setThumbnailUrl("");
        uploadImage(e.target.files[0], e.target.files[0].name, URL.createObjectURL(e.target.files[0]));
    }

    const uploadImage = (image, name, url)=>{
        const obj = {
            image:image,
            name:name
        }
        setFile(obj);
        setThumbnailUrl(url);
    }

    function validateDetails(data){
        if((typeof(data)) == 'object' ){
            if(Object.keys(data).length>0){
                return true;
            }
            else
                return false;
        }
        else{
            if(data.trim().length<1){
                return false;
            }
            else
                return true;
        }
    }
    
    const saveFormData = async(e)=>{
        try{
            e.preventDefault();
            if(!validateDetails(heading)){
                alert("Please add the blog heading");
                return;
            }
            else if(!validateDetails(file)){
                alert("Please add the blog thumbnail");
                return;
            }
            else if(!validateDetails(subtext)){
                alert("Please add the blog sub text");
                return;
            }
            else if(!validateDetails(editorContent)){
                alert("Blog content is missing");
                return;
            }
            else if(!category || category=='DefaultOption'){
                alert("Please select the Blog Category")
                return;
            }

            dispatch({type: SAVE_BLOG_REQUEST});
            
            const fd = new FormData();
            fd.append("image_Name",file.name);
            fd.append("image",file.image);
            fd.append("heading",heading);
            fd.append("content",editorContent);
            fd.append("subText",subtext);
            const Token = localStorage.getItem(AUTH_TOKEN);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization':`Bearer ${Token}`
                }
            }
            await axios.post(`${process.env.REACT_APP_PORT}/api/v2/create-blog-save`, fd, config)
            .then((result)=>{
                dispatch({type: SAVE_BLOG_SUCCESS});
                setPristine();
                navigate(`/profile`);
            })
            .catch((err)=>{
                console.log(err);
                dispatch({type: SAVE_BLOG_FAILED});
                setPristine();
                navigate('/server-error');
            })
        }
        catch(err){
            console.log(err)
            dispatch({type: SAVE_BLOG_FAILED});
            setPristine();
            navigate('/server-error');
        }
       
    }

    const updateBlog = async(e) => {
        try{
            e.preventDefault();
            setPristine();
            const fd = await getFormData();
            if(fd==null)
                return;
            dispatch({type: SAVE_BLOG_REQUEST});  
            const Token = localStorage.getItem(AUTH_TOKEN);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization':`Bearer ${Token}`
                }
            }

            await axios.post(`${process.env.REACT_APP_PORT}/api/v2/update-blog/${props.blogId}`, fd, config)
            .then(async(result)=>{
                dispatch({type: SAVE_BLOG_SUCCESS});
                //await setPristine();
                alert("Blog saved Successfully");
                window.location.reload(true);
            })
            .catch((err)=>{
                setPristine();
                console.log(err);
                dispatch({type: SAVE_BLOG_FAILED});
            })
        }
        catch(err){
            console.log(err)
            setPristine();
            dispatch({type: SAVE_BLOG_FAILED});
            navigate('/server-error');
        }
    }

    const publishBlog = async(e)=>{
        try{
            e.preventDefault();
            setPristine();
            const fd = await getFormData();
            if(fd==null)
                return;
                dispatch({type: SAVE_BLOG_REQUEST});  
                const Token = localStorage.getItem(AUTH_TOKEN);
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'authorization':`Bearer ${Token}`
                    }
                }
                await axios.post(`${process.env.REACT_APP_PORT}/api/v2/update-blog/${props.blogId}`, fd, config)
                .then(async()=>{
                    const oData = {
                        Blogid : props.blogId
                    }
                    await axios.post(`${process.env.REACT_APP_PORT}/api/v2/publish-blog`, oData, config)
                    .then(()=>{
                        alert("Blog Published Successfully");
                        dispatch({type: SAVE_BLOG_SUCCESS});
                        navigate(`/profile`);
                    })
                })
                .catch((err)=>{
                    console.log(err);
                    setPristine();
                    dispatch({type: SAVE_BLOG_FAILED});
                    navigate('/server-error');
                })
        }
        catch(err){
            console.log(err);
            setPristine();
            navigate('/server-error');
        }
    }

    const Data = {
        Title:heading,
        Thumbnail:thumbnailUrl,
        Body:editorContent,
        AuthorName:user.name,
        AuthorPhoto:user.profilePhoto,
        CreatedAt: getDate()
    }

    const getFormData = ()=>{
        console.log(category);
        if(!validateDetails(heading)){
            alert("Please add the blog heading");
            return null;
        }
        else if(!validateDetails(subtext)){
            alert("Please add the blog sub text");
            return null;
        }
        else if(!validateDetails(editorContent)){
            alert("Blog content is missing");
            return null;
        }
        else if(category=='DefaultOption'){
            alert("Please select Blog Category")
            return null;
        }

        const fd = new FormData();
        fd.append("heading",heading);
        fd.append("content",editorContent);
        fd.append("subText",subtext);

        // if Thumbnail is not updated
        if(Object.keys(file).length<=0)
        {
            fd.append("isThumbnailUpdated",false);
        }
        else
        {
            fd.append("isThumbnailUpdated",true);
            fd.append("image_Name",file.name);
            fd.append("image",file.image);
        }
        
        return fd;
    }

    return(
        <>
            {loading ? <PageLoader/>:""}
            {
                !showPreview &&  <div>
                <form onChange={(e)=>{setDirty();}}>
                    <div className='createBlogcontainer'>
                        <h2>Create New Blog</h2>
                        <div className='BlogGuidLines'>
                            All content that you add in your blog posts must be original content. If it is your own content from any of your other websites, please use the Refrence Url option indcate this. All acknowledgements of source refrences must be ensured.
                        </div>
                        <div className='BlogTitle'>
                            <label>Blog Title<span className='red-star'>*</span></label>
                            <input type="text" placeholder='Enter Blog Title' value={heading} onChange={(e) => {setHeading(e.target.value);}}/>
                        </div>
                        {
                            thumbnailUrl && thumbnailUrl.trim().length>0?
                                <div className='BlogThumbnail' onDragOver = {handleDragOver} onDrop = {handleOnDrop}>
                                    <div className='BlogThumbnailImage'>
                                        <img src={thumbnailUrl}/>
                                    </div>
                                        <label style={{marginBottom: "40px"}}>Wanna change Thumbnail? Drag and Drop on above image or 
                                            <label className="custom-file-upload">
                                                <input type="file" accept=".png, .jpg, .jpeg" id="img" name="img" onChange={handleImage}/>
                                                        Browser here...
                                            </label> 
                                        </label>
                                </div>
                            :
                                
                                    Object.keys(file).length<1?
                                        <div className='BlogThumbnail'>
                                            <label>Upload Blog Thumbnail<span className='red-star'>*</span></label>
                                            <div className="wrapper">
                                                <div className="drop_zone" onDragOver = {handleDragOver} onDrop = {handleOnDrop}> 
                                                    <p>Drop your Image here or
                                                        <label className="custom-file-upload">
                                                            <input type="file" accept=".png, .jpg, .jpeg" id="img" name="img" onChange={handleImage}/>
                                                            Browser
                                                        </label> 
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    :
                                    <div className='BlogThumbnail' onDragOver = {handleDragOver} onDrop = {handleOnDrop}>
                                        <div className='BlogThumbnailImage'>
                                            <img src={file.url}/>
                                        </div>
                                            <label style={{marginBottom: "40px"}}>Wanna change Thumbnail? Drag and Drop on above image or 
                                                <label className="custom-file-upload">
                                                    <input type="file" accept=".png, .jpg, .jpeg" id="img" name="img" onChange={handleImage}/>
                                                            Browser here...
                                                </label> 
                                            </label>
                                    </div>
                                
                        }

                        <div className='SelectCategory'>
                            <div className='SelectCategoryDiv1'>
                                <label>Select Category<span className='red-star'>*</span>:</label>
                                <select value={category} onChange={e=> setCategory(e.target.value)}>
                                    <option value="DefaultOption">Category</option>
                                    <option value="Food">Food</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Automobiles">Automobiles</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Health and Fitness">Health and Fitness</option>
                                    <option value="LifeStyle">LifeStyle</option>
                                    <option value="Fashion and beauty">Fashion and beauty</option>
                                    <option value="Photography">Photography</option>
                                    <option value="Music">Music</option>
                                    <option value="Business">Business</option>
                                    <option value="Movie">Movie</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {category=="Other" &&   <div className='SelectCategoryDiv2'>
                                                        <input type='text' placeholder='Please Enter Category' value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                                                    </div>
                            }
                        </div>

                        <div className='BlogTitle'>
                            <label>Blog Sub Text (Max: 300 words)<span className='red-star'>*</span></label>
                            <textarea type="text" placeholder='Enter blog sub text' maxLength={300} value={subtext} onChange={(e)=>setSubText(e.target.value)} />
                        </div>
                        
                        <div className='BlogEditor'>
                            <ReactQuill className='Editor' value={editorContent} onChange={(e)=>{setEditorContent(e);}}  placeholder='Please write you blog here...'/>
                            <ReactQuill className='Editor' value={initalEditorContent} onChange={(e)=>{setInitalEditorContent(e);}} style={{display:"none"}}/>
                        </div>
                        {
                            props.isNewBlog ?
                                <div className='create-blog-btn'>
                                    <button className='btn btn-primary' onClick={saveFormData}>Save</button>
                                    <button className='btn btn-secondary'>Preview</button>
                                </div>
                            :
                                <div className='create-blog-btn'>
                                    <button className='btn btn-primary' onClick={updateBlog}>Save</button>
                                    <button className='btn btn-secondary' onClick={(e)=> {e.preventDefault();setPreview(true)}}>Preview</button>
                                    <button className='btn btn-success' onClick={publishBlog}>Publish</button>
                                </div>
                        }
                        
                    </div>
                </form>
            </div>
            }
            {
                showPreview &&  
                <div>
                    <ReadBlogCard Data={Data}  /> 
                    <div className='ReadBlogContainer' style={{marginTop:"10px"}}>
                        <button className='btn btn-danger' onClick={(e)=> {e.preventDefault();setPreview(false)}} style={{float:"right", width:"80px", marginBottom:"50px"}}>Back</button>
                    </div>
                </div>
            }           
        </>
    )
}

export default CreateBlog;
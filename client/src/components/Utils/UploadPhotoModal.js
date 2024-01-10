import React, {useState} from 'react';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import {  AUTH_TOKEN } from "../../constants/userConstants"; 
import {PageLoader} from "../layout/PageLoader";
import { loadUser } from '../../actions/userActions';
import {getPosts} from "../../actions/postActions";
import { 
        UPLOAD_PHOTO_REQUEST,
        UPLOAD_PHOTO_SUCCESS,
        UPLOAD_PHOTO_FAILED
    } from '../../constants/postConstants';


const UploadPhotoModal = (props)=>{

    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.post)

    const [file, setFile] = useState({});

    const handleDragOver = event => {
        event.preventDefault();
    }

    const handleOnDrop = event => {
        console.log(event.dataTransfer);
        //prevent the browser from opening the image
        event.preventDefault(); 
        event.stopPropagation(); 
        //let's grab the image file
        uploadImage(event.dataTransfer.files[0], event.dataTransfer.files[0].name, URL.createObjectURL(event.dataTransfer.files[0]))
        console.log(typeof(file));
    }
    
    const handleImage = (e) =>{
        uploadImage(e.target.files[0], e.target.files[0].name, URL.createObjectURL(e.target.files[0]));
    }

    const uploadImage = (image, name, url)=>{
        const obj = {
            url:url,
            image:image,
            name:name
        }
        setFile(obj);
    }

    const SaveImage = async() =>{
        dispatch({type:UPLOAD_PHOTO_REQUEST})
        const fd = new FormData();
        fd.append("image_Name",file.name);
        fd.append("image",file.image);
        const Token = localStorage.getItem(AUTH_TOKEN);
        const config = {
            headers:{
                'Content-Type': 'multipart/form-data',
                'authorization':`Bearer ${Token}`
            }
        }
        await axios.post(`${process.env.REACT_APP_PORT}/api/v2/upload/${props.endpoint}`, fd, config)
        .then((data)=>{
            props.toggleState(false);
            dispatch(getPosts());
            dispatch({type: UPLOAD_PHOTO_SUCCESS})
        })
        .catch((err)=>{
            console.log(err);
            dispatch({type: UPLOAD_PHOTO_FAILED})
        })
    }

    return(
        <>
            
            <div id="myModal" className="modal">
                {loading?<PageLoader/>:""}
                <div className="modal-content">
                    <div className="modalClose">
                        <span style={{float:"right", display:"inline"}} onClick={()=>props.toggleState(false)}><CloseTwoToneIcon/></span>
                    </div>
                    <h3>{props.title}</h3>
                    {
                        Object.keys(file).length<1 ?
                            <div>
                                <div className="wrapper">
                                    <div className="drop_zone" onDragOver = {handleDragOver} onDrop = {handleOnDrop} > 
                                        <p>Drop your Image here or
                                            <label className="custom-file-upload">
                                                <input type="file" accept=".png, .jpg, .jpeg" id="img" name="img" style={{display:"none"}} onChange={handleImage}/>
                                                    Browser
                                            </label> 
                                        </p>
                                    </div>
                                </div>
                            </div>
                        :
                        <div>
                            <div className={props.PreviewClass} onDragOver = {handleDragOver} onDrop = {handleOnDrop}>
                                <img src={file.url} />
                            </div>
                            <label style={{marginBottom: "40px"}}>Wanna change? <br/>Drag and Drop on above image or 
                                <label className="custom-file-upload">
                                    <input type="file" accept=".png, .jpg, .jpeg" id="img" name="img" style={{display:"none"}} onChange={handleImage}/>
                                        Browser here...
                                </label> 
                            </label>
                            <div className='PhotoSaveBtn'>
                                <button onClick={SaveImage}>Save</button>
                            </div>
                        </div>
                        
                    }

                </div>
            </div>
        </>
    )
}

export default UploadPhotoModal;

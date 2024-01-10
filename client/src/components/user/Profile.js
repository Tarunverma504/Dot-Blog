import React, {Fragment, useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ReactQuill from 'react-quill';

import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import CameraAltTwoToneIcon from '@mui/icons-material/CameraAltTwoTone';

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import Avatar from 'react-avatar';

import defaultCoverPhoto from "../../assets/defaultCoverPhoto.png"

import UploadPhotoModal from "../Utils/UploadPhotoModal"

import {getPosts, getAuthor, updateAbout} from "../../actions/postActions"
import ProfileBlogCard from "../Utils/ProfileBlogCard"
import { PageLoader } from '../layout/PageLoader';
const Profile = (props) =>{
    const dispatch = useDispatch();
    const params = useParams();
    useEffect(()=>{
        if(props.Owner){
            dispatch(getPosts());
        }
        else if(!props.Owner){
            dispatch(getAuthor(params.id));
        }
      },[props, params])


    const {posts,loading} = useSelector(state => state.post);
    const [showDraft, setShowDraft] = useState(false);

    const [aboutContent, setAboutContent] = useState("");
    const [editMode, setEditMode] = useState(false);

    const [openCoverModal, setOpenCoverModal] = useState(false);
    const onOpenCoverModal = () => setOpenCoverModal(true);

    const [openProfileModal, setOpenProfileModal] = useState(false);
    const onOpenProfileModal = () => setOpenProfileModal(true);

    const toggleEditMode = () =>{
        setEditMode(true);
    }

    useEffect(()=>{
        if(posts.about){
            setAboutContent(posts.about);
        }
      },[posts])
      
    const saveButton = () =>{
        dispatch(updateAbout(aboutContent));
        setEditMode(false);
    }

    const cancelButton = () =>{
        setAboutContent(posts.about);
        setEditMode(false);
    }
    return(
        <>
        {
            loading && <PageLoader/>
        }
                <div className='ProfileContainer'>
                    <div className='ProfileBannerContainer'>
                        <div className='ProfileCoverPhoto'>
                            <img src={posts.coverPhoto} onError={e => { e.currentTarget.src = defaultCoverPhoto}}/>
                            { props.Owner &&
                                <div className='UpdateProfileCover' onClick={onOpenCoverModal}>
                                <CameraAltTwoToneIcon style={{color:"white", width:"50px", height:"50px"}}/>
                                </div>
                            }
                        </div>
                        <div className='ProfileContainer2'>
                            <div className='ProfilePhoto'>
                                <Avatar name={posts.name} src={posts.profilePhoto} size="100%" round={true}/>
                                {
                                    props.Owner &&
                                    <div className='UpdateProfilePhoto' onClick={onOpenProfileModal}>
                                            <CameraAltTwoToneIcon style={{color:"white", width:"35px", height:"35px"}}/>
                                        </div>
                                }
                                
                            </div>
                            <div className='Profiledetails'>
                                <h1>{posts.name}</h1>
                                <p><span style={{marginRight:"5px"}}>{posts.Published.length}</span>Published Blogs</p>
                            </div>
                        </div>
                    </div>

                    <div className='AboutContainer'>
                        <h2 style={{marginBottom:"20px"}} onClick={toggleEditMode}>About{!editMode && props.Owner && <span style={{marginLeft:"10px", cursor:"pointer"}}><ModeEditTwoToneIcon/></span>} </h2>
                        {!editMode &&<div className='AboutContent'>
                            <div dangerouslySetInnerHTML={{ __html: posts.about }}></div>
                            {/* <p>{posts.about}</p> */}
                        </div>}
                        {editMode && <div>
                                        <ReactQuill className="AboutEditor" value={aboutContent} onChange={setAboutContent} placeholder='Please write you blog here...'/>
                                        <div className='AboutBtns'>
                                            <button className='AboutSaveBtn' onClick={saveButton}>Save</button>
                                            <button className='AboutCancelBtn' onClick={cancelButton}>Cancel</button>
                                        </div>
                                    </div>
                        }
                    </div>

                    {props.Owner &&
                        <div className='BlogsDiv'>
                            <div className='PublishedBlogsBtn' style={showDraft?{color:"#495057", background:"none"}:{color:"white", backgroundColor:"#495057"}} onClick={(e)=>setShowDraft(!showDraft)}>
                                <h2>Published</h2>
                            </div>
                            <div className='DraftBlogsBtn' style={!showDraft?{color:"#495057", background:"none"}:{color:"white", backgroundColor:"#495057"}} onClick={(e)=>setShowDraft(!showDraft)}>
                                <h2>Draft</h2>
                            </div>
                        </div>
                    }
                    {
                        props.Owner?
                            showDraft ? 
                                <ProfileBlogCard isDraft={true} data={posts.Draft}/>
                            :
                                <ProfileBlogCard isDraft={false} data={posts.Published}/>
                        
                        :<ProfileBlogCard isDraft={false} data={posts.Published}/>
                    }

                    {openProfileModal && <UploadPhotoModal title="Upload Profile Photo" toggleState = {setOpenProfileModal} currentUrl = {posts.profilePhoto} PreviewClass="PreviewProfilePhoto" endpoint="profile-photo" />}
                    {openCoverModal && <UploadPhotoModal title="Upload Cover Photo" toggleState = {setOpenCoverModal} currentUrl = {posts.coverPhoto} PreviewClass="PreviewCoverPhoto" endpoint="cover-photo"/>}
                </div>
                
        </>
    )
}

export default Profile;
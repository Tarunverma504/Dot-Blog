import React, {useEffect, useState} from 'react';
import Avatar from 'react-avatar';
import { Link, Navigate, useParams } from 'react-router-dom';
import CommentsCard from './CommentsCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import QuestionAnswerTwoToneIcon from '@mui/icons-material/QuestionAnswerTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import defaultCoverPhoto from "../../assets/defaultCoverPhoto.png"
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_TOKEN } from "../../constants/userConstants"; 
import Sendmesssage from "../../assets/sendmessage.svg";
import SendmessageGrey from "../../assets/sendmessagegrey.svg";
import {PageLoader} from "../layout/PageLoader"
import axios from 'axios';
import {
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAILURE,
    LIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    LIKE_POST_FAILURE,
    DISLIKE_POST_REQUEST,
    DISLIKE_POST_SUCCESS,
    DISLIKE_POST_FAILURE

} from '../../constants/postConstants'

const ReadBlogCard = () =>{
    const dispatch = useDispatch();
    const {isAuthenticated, user} = useSelector(state => state.auth);

    const [showComments, setShowComments] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [comment, setComment] = useState('');
    const params = useParams();

    const {ReadBlog, loading} = useSelector(state => state.post)

    const dislikePost = async()=>{
        if(isAuthenticated){
            dispatch({
                type:DISLIKE_POST_REQUEST,
                payload:ReadBlog.likes-1>=0? ReadBlog.likes-1: 0
            });
            const Token = localStorage.getItem(AUTH_TOKEN);
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            const oData = {
                userId: Token,
                BlogId: params.id
            }
            await axios.post(`${process.env.REACT_APP_PORT}/api/v2/dislike-post`, oData, config)
            .then((data)=>{
                dispatch({
                    type:DISLIKE_POST_SUCCESS,
                    payload:data.data
                });
            })
            .catch((err)=>{
                console.log(err);
                dispatch({
                    type:DISLIKE_POST_FAILURE,
                    payload:ReadBlog.likes+1
                });
            })
        }
        else{
            setShowWarning(!showWarning);
        }
    }

    const likePost = async()=>{
        if(isAuthenticated){
            dispatch({
                type:LIKE_POST_REQUEST,
                payload:ReadBlog.likes+1
            });
            const Token = localStorage.getItem(AUTH_TOKEN);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            const oData = {
                userId: Token,
                BlogId: params.id
            }
            await axios.post(`${process.env.REACT_APP_PORT}/api/v2/like-post`, oData, config)
            .then((data)=>{
                dispatch({
                    type:LIKE_POST_SUCCESS,
                    payload:data.data
                });
            })
            .catch((err)=>{
                console.log(err);
                dispatch({
                    type:DISLIKE_POST_FAILURE,
                    payload:ReadBlog.likes-1
                });
            })
        }
        else{
            setShowWarning(!showWarning);
        }
        
        
    }

    const handleComment = async(event)=>{
        event.preventDefault();
        dispatch({type:ADD_COMMENT_REQUEST});
        const sComment = comment;
        setComment("");
        const Token = localStorage.getItem(AUTH_TOKEN);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            const oData = {
                userId: Token,
                BlogId: params.id,
                Comment: sComment
            }
            await axios.post(`${process.env.REACT_APP_PORT}/api/v2/add-commnet`, oData, config)
            .then((data)=>{
                dispatch({
                    type:ADD_COMMENT_SUCCESS,
                    payload: data.data
                });
            })
            .catch((err)=>{
                console.log(err);
                dispatch({type:ADD_COMMENT_FAILURE});
                Navigate('/server-error');

            })
    }
    return(
        <>
            <div className='ReadBlogContainer'>
                    <h1 className='BlogHeading'>{ReadBlog.Title}</h1>
                    <div className='AuthorInfo'>
                        <Link to={`/Author/${ReadBlog.AuthorId}`}><Avatar name={ReadBlog.AuthorName} src={ReadBlog.AuthorPhoto} size="40" round={true} style={{margin:"0px 10px"}}/></Link>
                        <div>
                            <Link to={`/Author/${ReadBlog.AuthorId}`}>{ReadBlog.AuthorName}</Link>
                            <p style={{marginTop:"0px"}}>{ReadBlog.CreatedAt}</p>
                        </div>
                    </div>
                    <div className='BlogImage'>
                        <img src={ReadBlog.Thumbnail} onError={e => { e.currentTarget.src = defaultCoverPhoto}}/>
                    </div>
                    <div className='LikeAndCommentControls'>
                        {
                            ReadBlog.isAlreadyLiked ?
                                <FavoriteIcon style={{color:"red", cursor:"pointer"}} onClick={dislikePost}/>
                            :
                                <FavoriteBorderTwoToneIcon style={{cursor:"pointer"}} onClick={likePost}/> 
                        }
                        <span>{ReadBlog.likes}</span>
                        <QuestionAnswerTwoToneIcon style={{marginLeft:"20px",cursor:"pointer"}} onClick={()=>setShowComments(true)}/>
                        
                    </div>
                    <div className='BlogBody' dangerouslySetInnerHTML={{ __html: ReadBlog.Body }} />
            </div>
            {showComments &&
                <div className='CommentsOuterContainer'>
                    <div className='CommentsInnerContainer1'>
                        <div className='CommentsInnerDivOne'>
                            <div className='CommentsInnerDivTwo'>
                                <h2>Comments</h2>
                                <CloseTwoToneIcon style={{color: "#ff0084",fontSize:"35px", cursor:"pointer"}} onClick={()=>setShowComments(false)}/>
                            </div>
                        </div>
                        {
                            (ReadBlog.comments && ReadBlog.comments.length > 0) ?  
                                <div className="showComments">
                                    {
                                        ReadBlog.comments.map((data) => (
                                            <CommentsCard key={data.commentId} data={data} />
                                        ))
                                    }
                                </div>
                            :
                                <div>"No Comments Yet"</div>
                        }
                        
                        {
                            isAuthenticated &&
                                <div className='WriteComment'>
                                    <form onSubmit={handleComment}>
                                        <div className='WriteCommentInnerDiv1'>
                                            <div>
                                                <Avatar name={user.name} src={user.profilePhoto} size="40" round={true} />
                                            </div>
                                            <div>
                                                <input type="text" placeholder='Add a comment...' value={comment} onChange={(e)=> setComment(e.target.value)}/>
                                            </div>
                                            {
                                                loading?
                                                <div className='commentLoader'>
                                                    <div className="loader1"></div>
                                                </div>
                                                :
                                                    comment.trim().length<1 ?
                                                    <div>
                                                        <button disabled><img src={SendmessageGrey}/></button>
                                                    </div>
                                                    :
                                                    <div>
                                                        <button type="submit" style={{cursor:"pointer"}}><img src={Sendmesssage}/></button>
                                                    </div>
                                            }
                                            
                                            
                                        </div>
                                    </form>
                                </div>
                            
                        }
                    </div>  
                </div>
            }
            {
                showWarning && 
                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <div className="modalClose">
                            <span style={{float:"right", display:"inline"}} onClick={()=>setShowWarning(!showWarning)}><CloseTwoToneIcon/></span>
                        </div>
                        <p style={{color:"#495057"}}>Please login first to Like or Comment</p>
                        <br/>
                        <Link to="/login"><button className='HomeButton'>Login</button></Link>
                    </div>
            </div>
            }
            
        </>
    )
}

export default ReadBlogCard;
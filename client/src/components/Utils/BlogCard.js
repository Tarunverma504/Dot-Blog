import React from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const MontNames=[
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
    ];

const BlogCard = (props)=>{
    const navigate = useNavigate();
    console.log(props);
    return(
        <>
            <Link to={`/blog/${props.data._id}`} style={{textDecoration:"none"}}>
                <div className='blog-card'>
                    {
                    !props.isProfile && <div className='blog-card-header'>
                        <Avatar name={props.data.userId.name} src={props.data.userId.profilePhoto} size="45" round={true} style={{margin:"0px 10px"}}/>
                        <div>
                            <Link to={`/Author/${props.data.userId._id}`}>Tarun Verma</Link>
                            <p style={{marginTop:"0px"}}>{MontNames[new Date(props.data.PublishedDate).getMonth()]+" "+new Date(props.data.PublishedDate).getDate()+","+new Date(props.data.PublishedDate).getFullYear()}</p>
                        </div>
                        </div>
                    }
                    <div className='blog-card-image'>
                        <img src={props.data.Thumbnail} />  
                    </div>
                    <div className='blog-card-body'>
                        <h4 style={{textAlign:"center",color:"black"}}>{props.data.Title}</h4>
                           <p className='blog-text'>    
                            {props.data.SubText}  
                          </p>

                        
                    </div>
                    {
                        props.isProfile && props.isDraft && <div className='blog-edit-button'>
                                                <Link to={`/edit-blog/${props.data._id}`}><button>Edit Blog</button></Link>
                                            </div>
                    }
                </div>
            </Link>
        </>
    )
}

export default BlogCard;
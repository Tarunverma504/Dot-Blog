import React from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const MontNames=[
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
    ];

const CommentsCard = (props)=>{
    console.log(props.data);
    return(
        <>
        {
            props.data && 
            <div className='CommentsCardContainer'>
                <div className='CommentorDetails'>
                    <Link to="/login"><Avatar name={props.data.userId.name} src={props.data.userId.profilePhoto} size="30" round={true} style={{margin:"0px 10px"}}/></Link>
                        <div className='CommentorName'>
                            <Link to="/login">{props.data.userId.name}</Link>
                            <p style={{marginTop:"0px"}}>{MontNames[new Date(props.data.createdAt).getMonth()]+" "+new Date(props.data.createdAt).getDate()+","+new Date(props.data.createdAt).getFullYear()}</p>
                        </div>
                </div>
                <div className='CommentText'>
                    <p> {props.data.text}</p>
                </div>
            </div>
        }
            
        </>
    )
}

export default CommentsCard;
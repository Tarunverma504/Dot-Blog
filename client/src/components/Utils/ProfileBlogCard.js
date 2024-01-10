import React from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';

const ProfileBlogCard = (props) =>{
    return(
        <>
            {
                props.data.length < 1 ?
                    <div style={{textAlign:"center",color:"grey",margin:"60px 0px"}}>
                        <h3>Oops! It looks like there are no blogs right now </h3>
                    </div>
                :
                <div className='DraftBlogs'>
                    <div className='BlogsContainer'>
                        {
                            (props.data).map((e)=>{
                                return(
                                    <BlogCard isProfile={true} data={e} isDraft={props.isDraft}/> 
                                )
                            })
                        }
                    </div>                        
                </div>
            }
            
        </>
    )
}

export default ProfileBlogCard;
import React, {Fragment, useState, useEffect} from 'react';
import { Navbar } from './layout/Navbar';
import { useDispatch, useSelector } from 'react-redux';

import { getPostsForHome } from '../actions/postActions';
import { PageLoader } from './layout/PageLoader';
import BlogCard from './Utils/BlogCard';

// import HomeComponent from './layout/HomeComponent';
const Home = ()=>{
    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.post);

    useEffect(()=>{
        dispatch(getPostsForHome());
    },[])

    const {PublishedBlogs} = useSelector(state => state.post)
    console.log(PublishedBlogs.length);
    return(
        <>
        {
            loading && <PageLoader/>
        }
            <div className='HomeConatiner'>
                {
                    PublishedBlogs.length < 1?
                    <div className='No-Blogs-Found'>
                        <p>No Blogs Available</p>
                    </div>
                    :
                    PublishedBlogs.map((e)=>{
                        return(
                            <BlogCard isProfile={false} data={e} isDraft={""}/> 
                        )
                    })
                    
                }
            </div>
        </>
    )
}

export default Home;
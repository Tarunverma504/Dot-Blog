import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { READ_BLOG_REQUEST, READ_BLOG_SUCCESS, READ_BLOG_FAILURE} from "../../constants/postConstants";
import { PageLoader } from './PageLoader';
import axios from 'axios';
import { AUTH_TOKEN } from "../../constants/userConstants"; 
import ReadBlogCard from '../Utils/ReadBlogCard';

const ReadBlog = ()=>{
    const params = useParams();
    const dispatch = useDispatch();
    const[result, setResult] = useState({});
    const {loading} = useSelector(state => state.post)
    useEffect(()=>{
        dispatch({type:READ_BLOG_REQUEST});
        const Token = localStorage.getItem(AUTH_TOKEN);
        const fetchBlog = async()=>{
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':`Bearer ${Token}`
                }
            }

            await axios.get(`${process.env.REACT_APP_PORT}/api/v2/get-blog/${params.id}`,config)
            .then((data)=>{
                console.log(data);
               // setResult(data.data);
                dispatch({
                    type: READ_BLOG_SUCCESS,
                    payload: data.data
                });
            })
            .catch((err)=>{
                console.log(err);
                dispatch({type: READ_BLOG_FAILURE});
            })
        }

        fetchBlog();

    }, [])
    
    return(
        <>
        {
            loading && <PageLoader/>
        }
            <div>
                <ReadBlogCard/>
            </div>
        </>
    )
}

export default ReadBlog;
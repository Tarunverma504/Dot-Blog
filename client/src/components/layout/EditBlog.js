import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GET_BLOG_REQUEST, GET_BLOG_SUCCESS, GET_BLOG_FAILURE } from "../../constants/postConstants";
import { PageLoader } from './PageLoader';
import axios from 'axios';
import CreateBlog from './CreateBlog';


const EditBlog = () =>{
    const params = useParams();
    const dispatch = useDispatch();
    const[result, setResult] = useState({});
    const {loading} = useSelector(state => state.post)
    useEffect(()=>{
        dispatch({type:GET_BLOG_REQUEST});
        const fetchBlog = async ()=>{
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            await axios.get(`${process.env.REACT_APP_PORT}/api/v2/get-blog/${params.id}`,config)
                .then((data)=>{
                    setResult(data.data);
                    dispatch({type: GET_BLOG_SUCCESS});
                })
                .catch((err)=>{
                    console.log(err);
                    dispatch({type: GET_BLOG_FAILURE});
                })
        }
        fetchBlog();
    },[])
    return(
        <>
        {loading && <PageLoader/>}
        <CreateBlog heading={result.Title} editorContent={result.Body} category="DefaultOption" newCategory="" file={{}} thumbnailUrl={result.Thumbnail} subtext={result.SubText} isNewBlog={false} blogId={params.id} />
        </>
    )
}

export default EditBlog;
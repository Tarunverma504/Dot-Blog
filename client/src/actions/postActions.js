import axios from 'axios';
import { AUTH_TOKEN } from "../constants/userConstants"; 

import { 
    GET_POSTS_REQUEST,
    GET_POSTS_SUCCESS,
    GET_POSTS_FAILURE,
    GET_HOME_POSTS_REQUEST,
    GET_HOME_POSTS_SUCCESS,
    GET_HOME_POSTS_FAILURE
 } from "../constants/postConstants";

export const getPosts = () => async(dispatch)=>{
    dispatch({type:GET_POSTS_REQUEST});

    const Token = localStorage.getItem(AUTH_TOKEN);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'authorization':`Bearer ${Token}`
        }
    }
    await axios.get(`${process.env.REACT_APP_PORT}/api/v2/get-user-blogs`,config)
    .then((data)=>{
        dispatch({
            type: GET_POSTS_SUCCESS,
            payload: data.data
        });
    })
    .catch((err)=>{
        dispatch({type:GET_POSTS_FAILURE});
    })
}

export const getPostsForHome = () => async(dispatch)=>{
    dispatch({type:GET_HOME_POSTS_REQUEST});
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    await axios.get(`${process.env.REACT_APP_PORT}/api/v2/get-all-blogs`,config)
    .then((data)=>{
        dispatch({
            type:GET_HOME_POSTS_SUCCESS,
            payload: data.data
        })
    })
    .catch((err)=>{
        dispatch({type: GET_HOME_POSTS_FAILURE});
    })
}

export const getAuthor = (id) => async(dispatch)=>{
    dispatch({type:GET_POSTS_REQUEST});
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    await axios.get(`${process.env.REACT_APP_PORT}/api/v2/Author/${id}`,config)
    .then((data)=>{
        dispatch({
            type:GET_POSTS_SUCCESS,
            payload: data.data
        })
    })
    .catch((err)=>{
        dispatch({type: GET_POSTS_FAILURE});
    })

}

export const updateAbout = (about)=> async(dispatch)=>{
    dispatch({type:GET_POSTS_REQUEST});
    const Token = localStorage.getItem(AUTH_TOKEN);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'authorization':`Bearer ${Token}`
        }
    }
    await axios.post(`${process.env.REACT_APP_PORT}/api/v2/update-about`,{about},config)
    .then((data)=>{
        dispatch({
            type: GET_POSTS_SUCCESS,
            payload: data.data
        });
    })
    .catch((err)=>{
        dispatch({type:GET_POSTS_FAILURE});
    })
}

export const getCategoriesBlogs = (category) => async(dispatch)=>{
    dispatch({type:GET_HOME_POSTS_REQUEST});
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    await axios.get(`${process.env.REACT_APP_PORT}/api/v2/get-categories-blogs/${category}`,config)
    .then((data)=>{
        dispatch({
            type:GET_HOME_POSTS_SUCCESS,
            payload: data.data
        })
    })
    .catch((err)=>{
        dispatch({type: GET_HOME_POSTS_FAILURE});
    })
}

export const getSearchResults = (searchValue)=> async(dispatch)=>{
    // dispatch({type:GET_HOME_POSTS_REQUEST});
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    await axios.get(`${process.env.REACT_APP_PORT}/api/v2/get-all-blogs?search=${searchValue}`,config)
    .then((data)=>{
        dispatch({
            type:GET_HOME_POSTS_SUCCESS,
            payload: data.data
        })
    })
    .catch((err)=>{
        dispatch({type: GET_HOME_POSTS_FAILURE});
    })
}
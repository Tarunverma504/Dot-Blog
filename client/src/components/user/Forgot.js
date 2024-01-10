import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";

import { ButtonLoader } from '../layout/loader';
import {PageLoader} from "../layout/PageLoader";
import { RESET_REQUEST, RESET_SUCCESS, RESET_FAILURE, LOGIN_ONLOAD } from "../../constants/userConstants";

const Forgot = () =>{

    const[email,setEmail] = useState("");
    const[toggle, setToggle] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading, error, isAuthenticated} = useSelector(state => state.auth)
    const submitHandler = async (e)=>{
        e.preventDefault();
        dispatch({type: RESET_REQUEST});
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const oData = {
            email:email
        }

        await axios.post(`${process.env.REACT_APP_PORT}/api/v2/forgot-password`, oData, config)
        .then((data)=>{
            console.log(data);
            dispatch({
                type: RESET_SUCCESS,
                payload: data.data
            });
            setToggle(true);
        })
        .catch((err)=>{
            console.log(err);
            if(err.response && err.response.status==403){
                dispatch({
                    type: RESET_FAILURE,
                    payload: err.response.data.message
                })
            }
        })
    }

    useEffect(()=>{
        dispatch({type: LOGIN_ONLOAD})
        if(isAuthenticated){
            navigate("/");
        }
    },[dispatch, isAuthenticated]);


    return(
        <>
        {
            loading && <PageLoader/>
        }
        {
            !toggle ?
            <div className="authcontainer">
                <div className="form-container" style={{"paddingBottom":"20px"}}>
                    <h2>Forgot Password</h2>
                    <form onSubmit={submitHandler}>
                        <div className="form-content-wrapper">
                            <label>Please enter your registered email</label>
                            <input type="email" placeholder="Enter Email" value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                            {error!=null?<span className="error-span">*{error}</span>:""}
                            <button type="submit" style={{marginTop:"20px"}}>Send Link</button>
                            <Link to="/login" style={{color:"#ff0084", marginTop:"0px"}}>Back to Login</Link>
                        </div>
                    </form>
                    
                </div>
            </div>
            :
            <div className="authcontainer">
                <div className="form-container" style={{"padding":"20px"}}>
                    <p className='ForgotConfirmText'>Please check your email for password reset link</p>
                    <Link to="/"><button className='HomeButton'>Back to home </button></Link>
                    
                </div>
            </div>
        }
            
        </>
    )
}

export default Forgot;
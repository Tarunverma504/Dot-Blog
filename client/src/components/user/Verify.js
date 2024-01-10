import React, {Fragment, useState, useEffect} from 'react';

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { ButtonLoader } from '../layout/loader';
import {VerifyOtp} from "../../actions/userActions"
import {VERIFICATION_TOKEN ,OTP_ONLOAD } from "../../constants/userConstants";


const Verify = () =>{
    const [Otp, setOtp] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading, error, isOtpVerified, isOtpSend, isAuthenticated} = useSelector(state => state.auth);

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/');
        } 
        if(!isOtpSend){
            navigate('/register');
        }
        if(isOtpVerified){
            navigate('/');
        }
        dispatch({ type: OTP_ONLOAD})
    }, [dispatch, isOtpSend, isOtpVerified, isAuthenticated])

    const submitHandler = (e) =>{
        e.preventDefault();
        if(localStorage.getItem(VERIFICATION_TOKEN)==null){
            navigate('/register');
        }
        dispatch(VerifyOtp(localStorage.getItem(VERIFICATION_TOKEN), Otp));
    }
    return(
        <>
           <div className="container">
                <div className="form-container" style={{"paddingBottom":"20px"}}>
                    <h1>.blog</h1>
                    <form onSubmit={submitHandler}>
                    <div className="form-content-wrapper">
                        <label>Please check your email for the OTP</label>
                            <input type="text" placeholder="Enter Otp" value={Otp} onChange={(e) => setOtp(e.target.value)}  required/>
                            {error!=null?<span className="error-span">*{error}</span>:""}
                            {error!=null?<a href=""> Resend Otp</a>: ""}
                            {loading ? <ButtonLoader/> : <button type="submit">Verify</button>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Verify;
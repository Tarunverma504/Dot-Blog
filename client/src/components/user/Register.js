import React, {Fragment, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux'
import { ButtonLoader } from '../layout/loader';
import { useNavigate } from "react-router-dom";


import { SignUp } from '../../actions/userActions';
import { REGISTER_ONLOAD } from "../../constants/userConstants";

const Register = () =>{
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading, error, isAuthenticated, isOtpSend} = useSelector(state => state.auth)
    useEffect(()=>{
        console.log(error)
        dispatch({type: REGISTER_ONLOAD})
        if(isAuthenticated){
            navigate("/");
        }
        if(isOtpSend){
            navigate('/Verify-User');
        }
    }, [dispatch, isAuthenticated, isOtpSend])

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(SignUp(username, email, password));
    }
    return(
        <>
            <div className="authcontainer">
                <div className="form-container">
                    <h1>Sign Up</h1>
                    <form onSubmit={submitHandler}>
                        <div className="form-content-wrapper">
                            <input type="text" placeholder="Enter Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                            <input type="email" placeholder="Enter Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            {error!=null?<span className="error-span">*{error}</span>:""}
                            {/* <a href=""> Forgot password?</a> */}
                            {loading ? <ButtonLoader/> : <button id="loginButton" type="submit">Submit</button>}
                            <span className="signup-span"> Already have an account? <Link to="/login">Login</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register;
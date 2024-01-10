import React, {Fragment, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { LOGIN_ONLOAD } from "../../constants/userConstants";
import { ButtonLoader } from '../layout/loader';

import {login} from "../../actions/userActions"
const Login = ({history, location}) =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading, error, isAuthenticated} = useSelector(state => state.auth)

    useEffect(()=>{
        dispatch({type: LOGIN_ONLOAD})
        if(isAuthenticated){
            navigate("/");
        }
    },[dispatch, isAuthenticated]);

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(login(email, password));
    }
    return(
        <>
            <div className="authcontainer">
                <div className="form-container">
                    <h1>Login</h1>
                    <form onSubmit={submitHandler}>
                        <div className="form-content-wrapper">
                                <input type="email" placeholder="Enter Email" value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                                <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                {error!=null?<span className="error-span">*{error}</span>:""}
                                {/* <a href=""> Forgot password?</a> */}
                                <Link to='/forgot-password'>Forgot password?</Link>
                                {loading ? <ButtonLoader/> : <button id="loginButton" type="submit">Submit</button>}
                                <span className="signup-span"> Don't have an account? <Link to="/register">Sign Up</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;
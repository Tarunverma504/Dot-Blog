import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

import { RESET_REQUEST, RESET_SUCCESS, RESET_FAILURE, LOGIN_ONLOAD } from "../../constants/userConstants";
import { PageLoader } from '../layout/PageLoader';


const NewPassword = () =>{
    const params = useParams();
    const navigate = useNavigate();
    const[newPassword, setNewPassword] = useState();
    const[confirmPassword, setConfirmPassword] = useState();
    const[isLinkExpired, setIsLinkExpired] = useState(false);
    const {loading, error, isAuthenticated} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const submitHandler = async (e)=>{
        e.preventDefault();
        dispatch({type: RESET_REQUEST});
        if(newPassword.trim().length>0 && confirmPassword.trim().length>0 && newPassword.trim() == confirmPassword.trim()){
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            const oData = {
                password:newPassword,
                confirmPassword:confirmPassword,
                id:params.id
            }
            await axios.post(`${process.env.REACT_APP_PORT}/api/v2/reset-password`, oData, config)
            .then((data)=>{
                console.log(data);
                if(data.status==200){
                    dispatch({type:RESET_SUCCESS})
                    alert('Password updated successfully');
                    navigate("/login");
                }
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
        else{
            dispatch({
                type: RESET_FAILURE,
                payload: "Password and confirm password does not match"
            })
        } 
    }

    useEffect(()=>{
        dispatch({type: RESET_REQUEST});
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        axios.get(`${process.env.REACT_APP_PORT}/api/v2/validate-password-reset-link/${params.id}`, config)
        .then((data)=>{
            setIsLinkExpired(data.data);
            dispatch({type:RESET_SUCCESS})
        })
        .catch((err)=>{
            console.log(err);
            dispatch({type:RESET_SUCCESS})
        })
    },[]);
    return(
        <>
        {loading && <PageLoader/>}

        {
            isLinkExpired ?
            <div className="authcontainer">
                <div className="form-container" style={{"padding":"20px"}}>
                    <p className='ForgotConfirmText'>Oops!! This link has expired</p>
                    <Link to="/login"><button className='HomeButton'>Back to login </button></Link>
                    
                </div>
            </div>
            :
                <div className="authcontainer">
                    <div className="form-container" style={{"paddingBottom":"20px"}}>
                        <h2>Reset Password</h2>
                        <form onSubmit={submitHandler}>
                            <div className="form-content-wrapper">
                                <input type="password" placeholder="New Password" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} required/>
                                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required/>
                                {error!=null?<span className="error-span">*{error}</span>:""}
                                <button type="submit" style={{marginTop:"20px"}}>Save</button>
                            </div>
                        </form>
                        
                    </div>
                </div>
        }
        </>
    )
}

export default NewPassword;
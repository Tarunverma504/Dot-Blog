import axios from 'axios';
import { 
        LOAD_USER_REQUEST,
        LOAD_USER_SUCCESS,
        LOAD_USER_FAILED,
        LOGIN_REQUEST,
        LOGIN_SUCCESS,
        LOGIN_FAIL,
        SIGNUP_REQUEST,
        SIGNUP_SUCCESS,
        SIGNUP_FAIL,
        OTP_REQUEST,
        OTP_SUCCESS,
        OTP_FAIL,
        AUTH_TOKEN,
        VERIFICATION_TOKEN
    } from "../constants/userConstants"; 


//loadUser
export const loadUser = () => async(dispatch)=>{
    const Token = localStorage.getItem(AUTH_TOKEN);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'authorization':`Bearer ${Token}`
        }
    }
    dispatch({ type: LOAD_USER_REQUEST })
    await axios.get(`${process.env.REACT_APP_PORT}/api/v2/isAuthenticated`,config)
        .then((data)=>{
            console.log(data);
            dispatch({ 
                type: LOAD_USER_SUCCESS,
                payload: data.data
            })
        })
        .catch((err)=>{
            dispatch({ 
                type: LOAD_USER_FAILED,
                payload: {}
            })
        })

}

//Login
export const login = (email, password) => async(dispatch)=>{

    dispatch({ type:LOGIN_REQUEST});
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }

    await axios.post(`${process.env.REACT_APP_PORT}/api/v2/login`, {email, password}, config)
        .then(async(data)=>{
            if(data.status==200)
            {
                await localStorage.setItem(AUTH_TOKEN, data.data.authToken)
                dispatch({ 
                    type: LOGIN_SUCCESS,
                    payload:data.data
                })
            }
        })
        .catch((err)=>{
            console.log(err);
            try{
                if(err.response.status==401){
                    dispatch({ 
                        type: LOGIN_FAIL,
                        payload:err.response.data.message
                    });
                }
            }
            catch{
                
            }
            
        });
}

//signup
export const SignUp = (username, email, password) => async(dispatch)=>{
    dispatch({ type: SIGNUP_REQUEST});
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    await axios.post(`${process.env.REACT_APP_PORT}/api/v2/register`, {username, email, password}, config)
        .then((data)=>{
            console.log(data)
            if(data.status==200)
            {
               localStorage.setItem(VERIFICATION_TOKEN, data.data.verificationToken);
               dispatch({ type: SIGNUP_SUCCESS});
            }
        })
        .catch((err)=>{
            console.log(err)
            if(err.response.status==401){
                dispatch({ 
                    type: SIGNUP_FAIL,
                    payload:err.response.data.message
                });
            }
        });
}

//verifyOtp
export const VerifyOtp = (verificationToken, Otp) => async(dispatch)=>{
    dispatch({ type: OTP_REQUEST})
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    await axios.post(`${process.env.REACT_APP_PORT}/api/v2/verify`, {verificationToken, Otp}, config)
        .then(async(data)=>{
            if(data.status==200){
                await localStorage.setItem(AUTH_TOKEN, data.data.authToken)
                await localStorage.removeItem(verificationToken);
                dispatch({ 
                    type: OTP_SUCCESS,
                    payload:data.data
                })
            }

        })
        .catch((err)=>{
            if(err.response.status == 401){
                dispatch({
                    type: OTP_FAIL,
                    payload: err.response.data.message
                })
            }
        });
}
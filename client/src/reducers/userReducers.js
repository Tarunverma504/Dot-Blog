import { login } from "../actions/userActions";
import {

    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOGIN_ONLOAD,
    LOAD_USER_FAILED,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_ONLOAD,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    OTP_REQUEST,
    OTP_SUCCESS,
    OTP_FAIL,
    OTP_ONLOAD,
    LOGOUT,
    RESET_REQUEST,
    RESET_SUCCESS,
    RESET_FAILURE
    
} from "../constants/userConstants";

export const authReducer = (state = {user: {}, loading:false, error:null, isAuthenticated: true,  isOtpSend: false, isOtpVerified: false }, action)=>{
    switch(action.type){
        case LOGIN_ONLOAD:
        case REGISTER_ONLOAD:
        case OTP_ONLOAD:
        case RESET_SUCCESS:
            return{
                ...state,
                loading: false,
                error:null
            } 
        case LOAD_USER_REQUEST:
        case LOGIN_REQUEST:
        case SIGNUP_REQUEST:
            return{
                ...state,
                loading: true,
                user: {},
                isOtpSend: false,
                isOtpVerified: false,
                error: null
            }
        case LOAD_USER_SUCCESS:
        case LOGIN_SUCCESS:
        case OTP_SUCCESS:
            return{
                ...state,
                loading: false,
                isAuthenticated: true,
                user:action.payload,
                error:null
            }
        case LOAD_USER_FAILED:
            return{
                ...state,
                loading: false,
                isAuthenticated: false,
                user: action.payload
            }
        case LOGIN_FAIL:
        case RESET_FAILURE:
            return{
                ...state,
                loading: false,
                isAuthenticated: false,
                user: {},
                error: action.payload
            }
        case SIGNUP_SUCCESS:
            return{
                ...state,
                loading: false,
                isOtpSend: true,
                error: null
            }
        case SIGNUP_FAIL:
            return{
                ...state,
                loading: false,
                error: action.payload,
                isOtpSend: false
            }
        case OTP_FAIL:
            return{
                ...state,
                loading: false,
                error: action.payload,
                isOtpVerified:false
            }
        case OTP_REQUEST:
        case RESET_REQUEST:
            return{
                ...state,
                loading: true,
                error: null,
                isOtpVerified: false
            }
        case LOGOUT:
            return{
                ...state,
                user:{},
                isAuthenticated: false
            }
        default: return state
    }
}



// export const authReducer = (state= {loading:false, error:null, isOtpSend: false, isOtpVerified: false, user: null}, action)=>{
//     switch(action.type){
//         case REGISTER_ONLOAD:
//         case OTP_ONLOAD:
//         case LOGIN_ONLOAD:
//             return{
//                 loading:false,
//                 error: null,
//                 user:{}
//             }
//         case SIGNUP_REQUEST:
//         case OTP_REQUEST:
//         case LOGIN_REQUEST:
//             return{
//                 loading:true,
//                 error: null,
//                 isOtpVerified: false,
//                 isOtpSend: false,
//                 user:{}
//             }
//         case SIGNUP_SUCCESS:
//             return{
//                 loading: false,
//                 isOtpSend: true,
//                 error:null,
//             }
//         case SIGNUP_FAIL:
//         case OTP_FAIL:
//         case LOGIN_FAIL:
//             return{
//                 loading: false,
//                 error: action.payload,
//                 isOtpSend: false,
//                 isOtpVerified: false
//             }
//         case OTP_SUCCESS:
//         case LOGIN_SUCCESS:
//             return{
//                 loading: false,
//                 isOtpVerified: true,
//                 error: null,
//                 user:action.payload
//             }
//         default: return state
//     }
// }
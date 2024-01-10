import React, {useEffect, useState, useSyncExternalStore} from "react";
import {Link, NavLink, useNavigate, useLocation} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import Avatar from 'react-avatar';

import { AUTH_TOKEN, LOGOUT } from "../../constants/userConstants";

import {ButtonLoader} from "../layout/loader";

import {getCategoriesBlogs, getSearchResults} from "../../actions/postActions"
export const Navbar = () =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [hide, setHide] = useState(false);
    const [toggleSignOut, setToggleSignOut] = useState(false);
    const [menuOpen, setmenuOpen] = useState(false);
    const [info, setInfo] = useState(null);
    const {user} = useSelector(state => state.auth)
    const [searchValue, setSearchValue] = useState("");
    
    useEffect(()=>{
        if(location.pathname === '/create-post'){
            setHide(true);
        }
        else{
            setHide(false);
        }

        if((location.pathname).includes("/profile")){
            setToggleSignOut(true);
        }
        else{
            setToggleSignOut(false);
        }
    })
    useEffect(()=>{
        if(user && Object.keys(user).length>0 && user!=null){
            setInfo(user);
        }
        else{
            setInfo(null);
        }
    },[dispatch, user])


    const logoutUser = async() =>{
        await localStorage.removeItem(AUTH_TOKEN);
        dispatch({type:LOGOUT});
        navigate("/");
    }

    const onCategoryChange = async(event)=>{
        dispatch(getCategoriesBlogs(event.target.value));
    }

    const submitHandler = async(e)=>{
        e.preventDefault();
        dispatch(getSearchResults(searchValue));
    }

    return(
        <div className="Navcontainer">
            <nav sticky="top">
                <Link to="/" className="Title">.blog</Link>
                <span className="menu" onClick={()=>{setmenuOpen(!menuOpen); }} >{menuOpen?<CloseTwoToneIcon style={{color: "#ff0084",fontSize:"35px"}} />: <MenuTwoToneIcon style={{color: "#ff0084",fontSize:"35px"}}/>}</span>
                <ul className={menuOpen? "open" : ""}>
                    <li>
                        <form onSubmit={submitHandler}>
                            <div className="searchBar">
                                <input type="text" placeholder="search" value={searchValue} onChange={(e)=> setSearchValue(e.target.value)}/>
                                <div className="searchIconDiv" >
                                    <SearchTwoToneIcon style={{color:"grey"}}/>
                                </div>
                            </div>
                        </form> 
                    </li>
                    <li>
                        <select onChange={onCategoryChange}>
                            <option value="DefaultOption">Categories</option>
                            <option value="Food">Food</option>
                            <option value="Technology">Technology</option>
                            <option value="Automobiles">Automobiles</option>
                            <option value="Travel">Travel</option>
                            <option value="Health and Fitness">Health and Fitness</option>
                            <option value="LifeStyle">LifeStyle</option>
                            <option value="Fashion and beauty">Fashion and beauty</option>
                            <option value="Photography">Photography</option>
                            <option value="Music">Music</option>
                            <option value="Business">Business</option>
                            <option value="Movie">Movie</option>
                            <option value="Sports">Sports</option>
                            <option value="Other">Other</option>
                        </select>
                    </li>
                    {
                        !hide && 
                            <li>
                                <Link to="/create-post"><button className="createBlogBtn"> Create Blog </button></Link>
                            </li>
                    }
                    <li>
                        {
                            toggleSignOut ?
                                <button onClick={logoutUser} className="NavLoginBtn" style={{border:"none", background:"none", cursor:"pointer"}}>Logout</button>
                            :
                                (info!=null? 
                                    <Link to="/profile">
                                        <Avatar name={info.name} src={info.profilePhoto} size="40" round={true} style={{marginTop:"-5px"}}/>
                                    </Link>
                                :
                                    <Link to="/login" className="NavLoginBtn">Login</Link>
                                )
                        }
                    </li>
                </ul>
            </nav>
        </div>
        
    )
}
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useLocation} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import Avatar from 'react-avatar';

import { AUTH_TOKEN, LOGOUT } from "../../constants/userConstants";

import {ButtonLoader} from "../layout/loader";

import {getCategoriesBlogs, getSearchResults} from "../../actions/postActions"

import {
    LOGIN_ROUTE,
    HOME_ROUTE,
    REGISTER_ROUTE,
    VERIFY_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    RESET_PASSWORD_ROUTE,
    SERVER_ERROR_ROUTE,
    CREATE_POST_ROUTE,
    PROFILE_ROUTE,
    EDIT_BLOG_ROUTE,
    AUTHOR_ROUTE,
    BLOG_ROUTE
} from "../../constants/navbarConstants"
import Verify from "../user/Verify";
export const Navbar = () =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [toggleSignOut, setToggleSignOut] = useState(false); //to show hide the signin and signout button
    const [menuOpen, setmenuOpen] = useState(false); // to open/close the menu of navbar in Phone view
    const [info, setInfo] = useState(null); // To show hide the profile/login button
    const {user} = useSelector(state => state.auth)
    const [searchValue, setSearchValue] = useState(""); // Search Bar
    //const [hide, setHide] = useState(false); // to showHide the create button

    

    // states for visiblity
    const [toggleSearchBox, setToogleSeachBox] = useState(false); // to show/hide the search box
    const [visibleMenuIcons, setVisibleMenuIcons] = useState(false) // to show/hide the menu icon in the Phone view
    const [toggleCategory, setToggleCategory] = useState(false);
    const [toggleCreateButton, setToggleCreateButton] = useState(false) // to show/Hide the create button
    const [toggleProfilButton, setToggleprofileButton] = useState(false);
    useEffect(()=>{
        // if(location.pathname === '/create-post'){
        //     setHide(true);
        // }
        // else{
        //     setHide(false);
        // }

        // if((location.pathname).includes("/profile")){
        //     setToggleSignOut(true);
        // }
        // else{
        //     setToggleSignOut(false);
        // }
        // if(location.pathname === '/login'){
        //     setVisibleMenuIcons(false);

        // }
        // else{
        //     setVisibleMenuIcons(true);
        // }

        let pathName = location.pathname;
        console.log(pathName);
        if(pathName==HOME_ROUTE){
            setVisibleMenuIcons(true);
            setToogleSeachBox(true);
            setToggleCategory(true);
            setToggleCreateButton(true);
            setToggleprofileButton(true);
            setToggleSignOut(false);
        }
        else if(pathName.includes(LOGIN_ROUTE) || pathName.includes(REGISTER_ROUTE) || pathName.includes(VERIFY_ROUTE) || pathName.includes(FORGOT_PASSWORD_ROUTE) || pathName.includes(RESET_PASSWORD_ROUTE) || pathName.includes(SERVER_ERROR_ROUTE)){
            setVisibleMenuIcons(false);
            setToogleSeachBox(false);
            setToggleCategory(false);
            setToggleCreateButton(false);
            setToggleprofileButton(false);
            setToggleSignOut(false);
        }
        else if(pathName.includes(CREATE_POST_ROUTE) || pathName.includes(EDIT_BLOG_ROUTE)){
            setVisibleMenuIcons(true);
            setToogleSeachBox(false);
            setToggleCategory(false);
            setToggleCreateButton(false);
            setToggleprofileButton(true);
            setToggleSignOut(false);
        }
        else if(pathName.includes(PROFILE_ROUTE)){
            setVisibleMenuIcons(true);
            setToogleSeachBox(false);
            setToggleCategory(false);
            setToggleCreateButton(true);
            setToggleprofileButton(true);
            setToggleSignOut(true);
        }
        else if(pathName.includes(AUTHOR_ROUTE) || pathName.includes(BLOG_ROUTE)){
            setVisibleMenuIcons(true);
            setToogleSeachBox(false);
            setToggleCategory(false);
            setToggleCreateButton(true);
            setToggleprofileButton(true);
            setToggleSignOut(false);
        }

        setSearchValue("");
        setmenuOpen(false);
    },[location])
    
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
                {visibleMenuIcons && <span className="menu" onClick={()=>{setmenuOpen(!menuOpen); }} >{menuOpen?<CloseTwoToneIcon style={{color: "#ff0084",fontSize:"35px"}} />: <MenuTwoToneIcon style={{color: "#ff0084",fontSize:"35px"}}/>}</span>}
                <ul className={menuOpen? "open" : ""}>
                    <li>
                        {
                            toggleSearchBox &&
                            <form onSubmit={submitHandler}>
                                <div className="searchBar">
                                    <input type="text" placeholder="search" value={searchValue} onChange={(e)=> setSearchValue(e.target.value)}/>
                                    <div className="searchIconDiv" >
                                        <SearchTwoToneIcon style={{color:"grey"}}/>
                                    </div>
                                </div>
                            </form>
                        }
                         
                    </li>
                    <li>
                        {
                            toggleCategory && 
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
                        }
                        
                    </li>
                    {
                        toggleCreateButton && 
                            <li>
                                <Link to="/create-post"><button className="createBlogBtn"> Create Blog </button></Link>
                            </li>
                    }
                    {
                        toggleProfilButton ? 
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
                        : 
                            ""
                    }
                    
                </ul>
            </nav>
        </div>
        
    )
}
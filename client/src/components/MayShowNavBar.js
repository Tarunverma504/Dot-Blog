import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const MayShowNavBar = ({children})=>{

    const location = useLocation();
    const [showNavBar, setShowNavBar] = useState(false);

    useEffect(()=>{
        // if(location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/Verify-User'){
        //     setShowNavBar(false);
        // }
        // else{
            setShowNavBar(true);
        //}
    })
    return(
        <>
            <div>{showNavBar && children}</div>
        </>
    )
}

export default MayShowNavBar;
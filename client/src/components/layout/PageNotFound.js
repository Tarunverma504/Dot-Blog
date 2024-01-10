import React from 'react';
import NotFound from "../../assets/pagenotfound1.svg"
import { Link } from 'react-router-dom';

const PageNotFound = ()=>{
    return(
        <>
            <div className='ErrorOuterDiv'>
                <div className='ErrorInnerDiv1'>
                    <img src={NotFound} />
                </div>
                <div className='ErrorInnerDiv2'>
                    <h2 style={{marginBottom: "20px"}}>Page not found</h2>
                    <p style={{fontSize:"15px"}}>We're sorry, the page you requested could not be found</p>
                    <Link to='/' target="_blank"><button>Back to home</button></Link>
                </div>
            </div>
        </>
    )
}

export default PageNotFound;

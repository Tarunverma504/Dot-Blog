import './App.css';
import React, {useEffect, useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from "./route/ProtectedRoute"


// Auth routes
import Login from './components/user/Login';
import Register from "./components/user/Register";
import Verify from "./components/user/Verify";
import Forgot from './components/user/Forgot';

import Home from './components/Home';
import ReadBlog from './components/layout/ReadBlog';
import CreateBlog from './components/layout/CreateBlog';
import store from './store';
import {loadUser} from "./actions/userActions";
import {Navbar} from "./components/layout/Navbar";
import Profile from "./components/user/Profile";
import EditBlog from './components/layout/EditBlog';
import MayShowNavBar from "./components/MayShowNavBar";
import NewPassword from "./components/user/NewPassword";
import InternalServerError from "./components/layout/InternalServerError";
import PageNotFound from './components/layout/PageNotFound';
function App() {

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(loadUser());
  },[])

  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route exact path='/' element={<Home/>}/>
    //     <Route path="/create-post" element={<ProtectedRoute> <CreateBlog/> </ProtectedRoute>} />        
    //     <Route exact path='/login' element={<Login/>}/>
    //     <Route exact path='/register' element={<Register/>}/>
    //     <Route exact path='/Verify-User' element={<Verify/>}/>
    //   </Routes>
    // </BrowserRouter>

    <BrowserRouter>
    <div >
        <MayShowNavBar>
          <Navbar />
        </MayShowNavBar>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/register' element={<Register/>}/>
          <Route exact path='/Verify-User' element={<Verify/>}/>
          <Route exact path='/Author/:id' element={<Profile Owner={false}/>}/>
          <Route exact path='/blog/:id' element={<ReadBlog/>}/>
          <Route exact path='/server-error' element={<InternalServerError/>}/>
          <Route exact path='/forgot-password' element={<Forgot/>}/>
          <Route exact path='/reset-password/:id' element={<NewPassword/>}/>

          <Route path="/create-post" element={<ProtectedRoute> <CreateBlog heading="" editorContent="" category="DefaultOption" newCategory="" file={{}} thumbnailUrl="" subtext="" isNewBlog={true} /> </ProtectedRoute>} /> 
          <Route exact path='/profile' element={<ProtectedRoute> <Profile Owner={true}/> </ProtectedRoute>}/>       
          <Route exact path='/edit-blog/:id' element={<ProtectedRoute> <EditBlog/> </ProtectedRoute>}/>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
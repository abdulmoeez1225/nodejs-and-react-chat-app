import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header';
import Dashboard from './modules/Dashboard';
import Form from './modules/Form';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { startSocket } from './utils';
import Room from './modules/Room';


const ProtectedRoute = ({ children, auth=false }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;

  if(!isLoggedIn && auth) {
    return <Navigate to={'/users/sign_in'} />
  }else if(isLoggedIn && ['/users/sign_in', '/users/sign_up'].includes(window.location.pathname)){
    console.log('object :>> ');
    return <Navigate to={'/'} />
  }

  return children
}


function App() {

  const location = useLocation()

  const [token,setToken]=useState('')

  useEffect(()=>{
    startSocket("http://localhost:8080")
  },[])

  useEffect(()=>{
    setToken(localStorage.getItem('user:token') !== null || false)
  },[location.pathname])
  return (
    <>
    <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition="Bounce"
    />
    <div className='flex'>
    {token && <Header/>}
    
    <Routes>
      <Route path='/' element={
        <ProtectedRoute auth={true}>
          <Dashboard/>
        </ProtectedRoute>
      } />
      <Route path='/users/sign_in' element={
      <ProtectedRoute>
        <Form isSignInPage={true}/>
      </ProtectedRoute>
      } />
      <Route path='/users/sign_up' element={
        <ProtectedRoute>
        <Form isSignInPage={false}/>
      </ProtectedRoute>
      } />
       <Route path='/room/:roomName' element={
        <ProtectedRoute>
        <Room/>
      </ProtectedRoute>
      } />
    </Routes>
    </div>
    </>
  );
}

export default App;

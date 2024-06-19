import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Redirect from './components/Redirect';
import { INDEX_URL } from './settings';
import Login from './components/pages/Login';
import { useState } from 'react';
import Admin from './components/pages/Admin';
import { useCookies } from 'react-cookie';
import Manager from './components/pages/Manager';

function App() {
  const [cookies,setCookie,removeCookie] = useCookies(["token"]);
  const [token, setToken] = useState((cookies.token && cookies.token!=undefined) ? cookies.token : null);
  return (
    <div className='font-poppins'>
      <Routes>
        <Route
        path='/login'
        element={<Login setToken={setToken} token={token} setCookie={setCookie}/>}/>
        <Route
        path='/edit/:token'
        element={<Manager userToken={token}/>}/>
        {token && 
        <>
        <Route
        path='/admin'
        element={<Admin token={token}/>}/>
        </>}
        <Route
        path='*'
        element={<Redirect url={INDEX_URL}/>}/>
      </Routes>
    </div>
  );
}

export default App;

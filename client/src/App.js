import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import BrandsClient from './components/BrandsClient';
import LoginForm from './components/LoginForm';
import { useState } from 'react';
import ClientsManager from './components/ClientsManager';
import { useCookies } from 'react-cookie';
import BrandsList from './components/BrandsList';
import BrandEdit from './components/BrandEdit';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [token, setToken] = useState(cookies.token ? cookies.token : null);
  return (
    <div>
      <Routes>
        <Route
        path='/'
        element={<LoginForm
        setToken={(newToken)=>{
          setCookie("token",newToken);
          setToken(newToken);
        }}
        token={token}/>}/>
        <Route
        path='/:token'
        element={<BrandsClient/>}>
        </Route>
        {token && <>
        <Route
        path='/admin'
        element={<ClientsManager
        token={token}/>}/>
        <Route
        path='/admin/brands'
        element={<BrandsList
        token={token}/>}/>
        <Route
        path='/admin/brands/:id'
        element={<BrandEdit
        token={token}/>}/>
        </>}
      </Routes>
    </div>
  );
}

export default App;

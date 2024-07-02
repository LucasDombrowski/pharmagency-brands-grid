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
import AllBrands from './components/pages/AllBrands';
import AddBrand from './components/pages/AddBrand';
import EditBrand from './components/pages/EditBrand';
import AddDomain from './components/pages/AddDomain';
import EditDomain from './components/pages/EditDomain';

function App() {
  const [cookies,setCookie,removeCookie] = useCookies(["token"]);
  const [token, setToken] = useState((cookies.token && cookies.token!=undefined) ? cookies.token : null);

  return (
    <div className='font-dm-sans'>
      <Routes>
        <Route
        path={"/login"}
        element={<Login setToken={setToken} token={token} setCookie={setCookie}/>}/>
        <Route
        path={"/connexion"}
        element={<Login setToken={setToken} token={token} setCookie={setCookie}/>}/>
        <Route
        path='/edit/:token'
        element={<Manager userToken={token}/>}/>
        <Route
        path='/modifier/:token'
        element={<Manager userToken={token}/>}/>
        {token && 
        <>
        <Route
        path='/admin'
        element={<Admin token={token}/>}/>
        <Route
        path='/admin/marques'
        element={<AllBrands token={token}/>}/>
        <Route
        path='/admin/marques/add'
        element={<AddBrand token={token}/>}/>
        <Route
        path='/admin/marques/ajouter'
        element={<AddBrand token={token}/>}/>
        <Route
        path='/admin/marques/:id'
        element={<EditBrand token={token}/>}/>
        <Route
        path='/admin/add'
        element={<AddDomain token={token}/>}/>
        <Route
        path='/admin/ajouter'
        element={<AddDomain token={token}/>}/>
        <Route
        path='/admin/:id'
        element={<EditDomain token={token}/>}/>
        <Route
        path='/'
        element={<Redirect url={"/admin"}/>}/>
        </>}
        <Route
        path='*'
        element={<Redirect url={INDEX_URL}/>}/>
      </Routes>
    </div>
  );
}

export default App;

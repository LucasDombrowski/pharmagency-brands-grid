import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import BrandsClient from './components/BrandsClient';

function App() {
  return (
    <div>
      <Routes>
        <Route
        path='/:token'
        element={<BrandsClient/>}>
        </Route>
      </Routes>
    </div>
  );
}

export default App;

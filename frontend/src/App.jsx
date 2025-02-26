import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Dashboard, Register,Login,Notfound } from './pages/index';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';
function App() {
  return (
    
    <BrowserRouter>
          <ToastContainer />
      <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='*' element={<Notfound/>}/>
      </Routes>
    </BrowserRouter>
   
  )
}

export default App

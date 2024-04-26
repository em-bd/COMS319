/**
 * Authors: Em Bradley-DeHaan,
 *          Samuel Craft
 * ISU Netids: emmieb@iastate.edu
 *          craftsam@iastate.edu
 * Date: April 27th, 2024
 */

import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.css";
import './App.css';




function App() {
 


  return (
    <div>
      {(viewer === 0) && <Create />}
      {(viewer === 1) && <Remove />}
      {(viewer === 2) && <Update />}
      {(viewer === 3) && <Delete />}
    </div>
  );
}

export default App;

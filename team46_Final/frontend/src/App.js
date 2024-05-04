/**
 * Authors: Em Bradley-DeHaan,
 *          Samuel Craft
 * ISU Netids: emmieb@iastate.edu
 *          craftsam@iastate.edu
 * Date: May 9th, 2024
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "Main";
import Implements from "Implements";
import Vehicles from "Vehicles";

function App() {
  // react hooks viewer:
  const [viewer, setViewer] = useState(0);

  function updateHooks(i) {
    setViewer(i);
  }



  return (
    <div>
      {viewer == 0 && <Main />}
      {viewer == 1 && <Products />}
      {viewer == 2 && <Vehicles />}
      {viewer == 3 && <Implements />}
      {viewer == 4 && <Cart />}
      {viewer == 5 && <Summary />}
      {viewer == 6 && <AboutUs />}
    </div>
  );
}

export default App;

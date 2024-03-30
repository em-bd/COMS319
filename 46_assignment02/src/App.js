/**
 * Authors: Em Bradley-DeHaan
 *          Samuel Craft
 * ISU Netids: emmieb@iastate.edu
 *          
 * Date: April 6th, 2024
 */


// import statements:
import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { Products } from "./Products";
import { Categories } from "./Categories";


// product rendering:
const renderProducts = (ProductsCategory) => {

};

// app rendering:
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

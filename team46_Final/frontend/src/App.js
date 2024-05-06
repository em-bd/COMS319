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

// viewer:
const [viewer, setViewer] = useState(0);
// login:
const [user, setUser] = useState({});
// Browse views:
const [products, setProducts] = useState([]);
const [oneProduct, setOneProduct] = useState({});
// react forms:
const { userRegister, handleUserSubmit, formState: { loginErrors } } = useForm();
const { register, handleSubmit, formState: { errors } } = useForm();
const [newComment, setNewComment] = useState({});

function App() {
  // collect data from db:
  useEffect(() => {
    getAllProducts();
  }, []);
  function getAllProducts() {
    fetch("http://localhost:8081/products", {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }

  /**
   * Main Page:
   * This is the first page that opens up, where
   * the user must input a username and password.
   * If the user does not exist in the database,
   * then the option 
   */
  function Main() {
    let type = -1;
    // get all user data:
    const [allUsers, setAllUsers] = useState({});
    fetch("http://localhost:8081/users", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((allUsers) = setAllUsers(allUsers));

    const login = (data) => {
      let login = false;
        // check if this username and password combination exists:
        for (var u in allUsers) {
          if (u.username === data.username && u.password === data.password) {
            login = true;
            break;
          }
        }

        // alert "invalid username or password."
        if (!login) {

        }
        // alert "login successful."
        else {

          setUser(u);
          setViewer(1);
        }
    }

    const register = (data) => {
      // check if this username already exists:
      for (let u in allUsers) {
        // alert "username already exists."
        if (u.username === data.username) {
          
          return;
        }
      }

      fetch("http://localhost:8081/users", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      // alert "registration successful."
      setUser(u);
      setViewer(1);
    }

    const onSubmit = (data) => {
      // logging in:
      if (type === 0)
        login(data);
      // registering:
      else if (type === 1)
        register(data);
    }


    return (<div className="text-bg-dark">
      <nav className="navbar fixed navbar-expand-md navbar-dark bg-gray shadow py-2">
        <div className="container-fluid">
          <h1>FarmersRUs</h1>
        </div>
      </nav>

      <div class="container-fluid">
        <form className="py-4 justify-content-center" onSubmit={(handleUserSubmit(onSubmit))}>
          <div className="form-group py-1">
            <input {...userRegister("username", { required: true })}
              placeholder="Username" type="text" className="form-control w-50">
              {errors.username && (
                <p className="text-danger">Username required.</p>
              )}
            </input>
          </div>
          <div className="form-group py-1">
            <input {...userRegister("password", { required: true })}
              placeholder="Password" type="password" className="form-control w-50">
              {errors.password && (
                <p className="text-danger">Password required.</p>
              )}
            </input>
          </div>
          <button onClick={type = 0} type="submit" class="btn btn-primary py-1">Login</button>
          <button pnClick={type = 1} type="submit" class="btn btn-primary py-1">Register</button>
        </form>
      </div>
    </div>);
  }

  /**
   * Browse Page:
   * This will display all products available from
   * this store's catalogue. A filter will be 
   * located on the side of the page as well, where
   * the user can filter through products and select
   * what they want.
   */
  function Browse() {
    // product filtering useState:
    const [keywords, setKeywords] = useState(products);

    // clicked on a single product, do inflated view:
    const handleClick = (productID) => {
      setOneProduct(products[productID - 1]);
      setViewer(2);
    };

    // filter button:
    function filterQuery() {
      const checkboxes = document.querySelectorAll("input.form-check-input");
      console.log(checkboxes.length);
      let vals = ["  ", "  "];
      var i = 0;

      if (checkboxes.length == 0) {
        setKeywords(products);
        return;
      }

      checkboxes.forEach((item) => {
        if (item.checked) {
          vals[i++] = item.attributes.getNamedItem("id").nodeValue;
        }
      })

      i = 0;
      let filtered = {};
      for (i in vals) {
        for (let k in products.filter(p => p.keywords.includes(vals[i]))) {
          if (filtered.filter(f => f.id != k.id))
            filtered.push(k);
        }
      }

      setKeywords(filtered);
    };

    // renders all products on the page:
    const renderProducts = (product) => {
      return (
        <div id="col" class="row row-cols-md-3 g-3">
          {product.map((el) => (
            <button key={el.id} id={el.id} className="card text-bg-dark shadow-sm mx-1" onClick={() => handleClick(el.id)}>
              <img src={el.src} className="card-img-top card-bottom" alt={el.alt} />
              <div class="card-body">
                <p class="card-text"> <strong>{el.name}</strong> ${el.price}</p>
                <p class="card-text">{el.rating[0].rate} ({el.rating[0].count})</p>
              </div>
            </button>
          ))}
        </div>);
    };

    return (<div class="text-bg-dark">
      <nav className="navbar fixed navbar-expand-md navbar-dark bg-gray shadow py-2">
        <div className="container-fluid">
          <h1>FarmersRUs</h1>
          <div class="float-right">
            <nav class="nav nav-masthead justify-content-center float-md-end">
              <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setUser({}) && setViewer(0)}>Logout </a>
              <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setViewer(3)}>Cart </a>
              <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setViewer(5)}>About Us</a>
            </nav>
          </div>
        </div>
      </nav>

      <div class="d-flex mt-5 m-auto">
        <div class="sidebar-nav flex-shrink-0 flex-column" style="padding-right : 10px;">
          <span class="fs-5 fw-semibold">Filters</span>
          <ul class="list-unstyled ps-0">
            <li class="mb-1">
              <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                data-bs-toggle="collapse" data-bs-target="#implement-collapse" aria-expanded="false">
                Implements
              </button>
              <div class="collapse" id="implement-collapse">
                <div class="d-flex flex-column flex-md-row align-items-center justify-content-center"
                  style="padding-top : 20px; padding-bottom : 20px;">
                  <div class="list-group">
                    <label class="list-group-item d-flex gap-2">
                      <input id="seeder" class="form-check-input flex-shrink-0" name="implement" type="checkbox" value="" />
                      <span>
                        Seeder
                      </span>
                    </label>
                    <label class="list-group-item d-flex gap-2">
                      <input id="crop-care" class="form-check-input flex-shrink-0" name="implement" type="checkbox" value="" />
                      <span>
                        Crop Care
                      </span>
                    </label>
                    <label class="list-group-item d-flex gap-2">
                      <input id="planter" class="form-check-input flex-shrink-0" name="implement" type="checkbox" value="" />
                      <span>
                        Planters
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </li>

            <li class="border-top my-3"></li>

            <li class="mb-1">
              <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                data-bs-toggle="collapse" data-bs-target="#vehicle-collapse" aria-expanded="false">
                Vehicles
              </button>
              <div class="collapse" id="vehicle-collapse">
                <div class="d-flex flex-column flex-md-row align-items-center justify-content-center"
                  style="padding-top : 20px; padding-bottom : 20px;">
                  <div class="list-group">
                    <label class="list-group-item d-flex gap-2">
                      <input id="harvester" class="form-check-input flex-shrink-0" name="vehicle" type="checkbox" value="" />
                      <span>
                        Harvester
                      </span>
                    </label>
                    <label class="list-group-item d-flex gap-2">
                      <input id="tractor" class="form-check-input flex-shrink-0" name="vehicle" type="checkbox" value="" />
                      <span>
                        Tractor
                      </span>
                    </label>
                    <label class="list-group-item d-flex gap-2">
                      <input class="form-check-input flex-shrink-0" name="vehicle" type="checkbox" value="" />
                      <span>
                        Red
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </li>

            <li class="border-top my-3"></li>

            <li class="mb-1">
              <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                data-bs-toggle="collapse" data-bs-target="#product-collapse" aria-expanded="false">
                Products
              </button>
              <div class="collapse" id="product-collapse">
                <div class="d-flex flex-column flex-md-row align-items-center justify-content-center"
                  style="padding-top : 20px; padding-bottom : 20px;">
                  <div class="list-group">
                    <label class="list-group-item d-flex gap-2">
                      <input id="seed" class="form-check-input flex-shrink-0" name="product" type="checkbox" value="" />
                      <span>
                        Seed
                      </span>
                    </label>
                    <label class="list-group-item d-flex gap-2">
                      <input id="soil" class="form-check-input flex-shrink-0" name="product" type="checkbox" value="" />
                      <span>
                        Soil
                      </span>
                    </label>
                    <label class="list-group-item d-flex gap-2">
                      <input id="material" class="form-check-input flex-shrink-0" name="product" type="checkbox" value="" />
                      <span>
                        Material
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <button class="btn-filter" onclick={filterQuery}>
          Apply Filters
        </button>
        {(() => {
          'use strict'
          const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
          tooltipTriggerList.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl)
          })
        })()}

        <div class="album py-5">
          <div class="container mx-auto">
            <div id="col" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {renderProducts(keywords)}
            </div>
          </div>
        </div>
      </div>
    </div>);
  }

  /**
   * Single Product Page:
   * This displays information for a single 
   * product that was selected by the user.
   * From here, the user can input 
   */
  function OneProduct() {

  }

  /**
   * Cart Page:
   * This will display the items
   * currently in the user's cart,
   * allowing for the user to either add
   * or remove from the current items
   * within it. Additionally, a form
   * will be made available at the
   * bottom of the page for payment information.
   */
  function Cart() {

  }

  /**
   * Order Summary Page:
   * This will display images of the items
   * purchased by the user, the number of
   * each item, the total cost, and a
   * confirmation that the order has gone
   * through.
   */
  function Summary() {

  }

  /**
   * About Us Page:
   * This will display information on us, the
   * course, and the course instructors.
   */
  function AboutUs() {

  }


  return (
    <div>
      {viewer == 0 && <Main />}
      {viewer == 1 && <Browse />}
      {viewer == 2 && <OneProduct />}
      {viewer == 3 && <Cart />}
      {viewer == 4 && <Summary />}
      {viewer == 5 && <AboutUs />}
    </div>
  );
}

export default App;

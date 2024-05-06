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
const [dataF, setDataF] = useState({});
// shopping cart:
const [cart, setCart] = useState([]);
const [cartTotal, setCartTotal] = useState(0);

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

  // add to cart:
  const addToCart = (el) => {
    setCart([...cart, el]);
  }

  // remove from cart:
  const removeFromCart = (el) => {
    let itemFound = false;
    const updatedCart = cart.filter((cartItem) => {
      if (cartItem.id === el.id && !itemFound) {
        itemFound = true;
        return false;
      }
      return true;
    });
    if (itemFound)
      setCart(updatedCart);
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
    const mainNode = document.getElementById("alert");
    let newNode = document.createElement("div");
    newNode.setAttribute("role", "alert");

    const login = (data) => {
      let login = false;
      // check if this username and password combination exists:
      for (var u in allUsers) {
        if (u.username === data.username && u.password === data.password) {
          login = true;
          break;
        }
      }

      mainNode.innerHTML = "";
      let newNode = document.createElement("div");
      newNode.setAttribute("role", "alert");
      // alert "invalid username or password."
      if (!login) {
        newNode.className = "alert alert-danger";
        let text = document.createTextNode("Invalid Username or Password.");
        newNode.appendChild(text);
        mainNode.appendChild(newNode);
      }
      // alert "login successful."
      else {
        newNode.className = "alert alert-success";
        let text = document.createTextNode("Login successful.");
        newNode.appendChild(text);
        mainNode.appendChild(newNode);
        setTimeout(() => {
          console.log("Delaying for 1 second.");
        }, 1000);
        setUser(u);
        setViewer(1);
      }
    }

    const register = (data) => {
      // check if this username already exists:
      for (let u in allUsers) {
        // alert "username already exists."
        if (u.username === data.username) {
          newNode.className = "alert alert-danger";
          let text = document.createTextNode("Username already exists.");
          newNode.appendChild(text);
          mainNode.appendChild(newNode);
          return;
        }
      }

      fetch("http://localhost:8081/users", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      // alert "registration successful."
      newNode.className = "alert alert-info";
      let text = document.createTextNode("Registraiton successful");
      newNode.appendChild(text);
      mainNode.appendChild(newNode);
      setTimeout(() => {
        console.log("Delaying for 1 second.");
      }, 1000);
      u.priv = "user";
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


    return (<div id="main" className="text-bg-dark">
      <nav className="navbar fixed navbar-expand-md navbar-dark bg-gray shadow py-2">
        <div className="container-fluid">
          <h1>FarmersRUs</h1>
        </div>
      </nav>

      <div class="container-fluid">
        <form id="my-form" className="py-4 justify-content-center" onSubmit={(handleUserSubmit(onSubmit))}>
          <div className="form-group py-1">
            <input {...userRegister("username", { required: true })}
              placeholder="Username" type="text" className="form-control w-50">
              {loginErrors.username && (
                <p className="text-danger">Username required.</p>
              )}
            </input>
          </div>
          <div className="form-group py-1">
            <input {...userRegister("password", { required: true })}
              placeholder="Password" type="password" className="form-control w-50">
              {loginErrors.password && (
                <p className="text-danger">Password required.</p>
              )}
            </input>
          </div>
          <button onClick={type = 0} type="submit" class="btn btn-primary py-1">Login</button>
          <button pnClick={type = 1} type="submit" class="btn btn-primary py-1">Register</button>
          <div id="alert"></div>
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
    // display how many of this item:
    function howManyofThis(id) {
      let hmot = cart.filter((cartItem) => cartItem.id === id);
      return hmot.length;
    }
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
                <p class="card-text"> <strong>{el.name}</strong> <span className="text-green-600">${el.price}</span></p>
                <p class="card-text">{el.rating[0].rate} ({el.rating[0].count})</p>
              </div>
              <div className="flex justify-between">
                <div class="btn-group">
                  <button type="button" class="btn btn-outline-secondary" onClick={() => removeFromCart(product)} > - </button>{" "}
                  <button type="button" class="btn btn-outline-secondary" onClick={() => addToCart(product)}> + </button>
                </div>
                <p>{howManyofThis(product.id)}</p>
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
    // user is adding a comment:
    function onSubmit() {
      let comment_body = document.getElementById("comment_body");

      if (comment_body.value.length == 0)
        return;

      let newComment = {
        "body": comment_body.value,
        "user": user.username
      };
      // put request:
      oneProduct.comments.push(newComment);
      fetch("http://localhost:8081/products/" + oneProduct.id, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(oneProduct),
      })
    }

    const renderProduct = (oneProduct) => {
      return (<div class="container d-flex align-center py-10">
        <div>
          <div>
            <img class="h-100 w-100 img-fluid" src={oneProduct.src} width="100" alt={oneProduct.alt} />
          </div>
          <div class="float-left px-5">
            <h2>{oneProduct.title}</h2>
            <h4>
              Rating: {oneProduct[0].rating.rate} <span class="text-muted">({oneProduct[0].rating.count})</span>
            </h4>
            <h4 class="text-green-600">${oneProduct.price}</h4>
            <p class="card-text-sm w-50">{oneProduct.desc}</p>
            <h5>Specifications:</h5>
            <ul>
              {oneProduct.specs.map((s) => {
                return (<li>s</li>);
              })}
            </ul>
          </div>
        </div>
        <div>
          <h4>Comments:</h4>
          {oneProduct.comments.map((c) => {
            return (<div>
              <h5>c.user</h5>
              <p>c.body</p>
            </div>)
          })}
        </div>
        <form className="py-2 px-5" onSubmit={onSubmit}></form>
        <input id="comment_body" placeholder="Type a Review!" type="text" className="form-control w-80"></input>
        <button type="submit" class="btn btn-primary px-1">Submit</button>
      </div>);
    }

    return (<div className="text-bg-dark h-auto">
      <nav class="navbar fixed navbar-expand-md navbar-dark text-bg-dark shadow py-2">
        <div className="container-fluid">
          <h1>FarmersRUs</h1>
          <div class="float-right">
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setViewer(1)}>Return</a>
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setUser({}) && setViewer(0)}>Logout</a>
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setViewer(3)}>Cart</a>
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setViewer(5)}>About Us</a>
            {u.priv === "admin" &&
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setViewer(6)}>Remove Users</a>}
          </div>
        </div>
      </nav>
      <div class="container">
        {renderProduct(oneProduct)}
      </div>
    </div>);
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
    var foundCart = [];
    for (let i of cart) {
      if (!foundCart.includes(i)) {
        foundCart.push(i);
      }
    }

    // count how many products of the same id:
    function howManyofThis(id) {
      let hmot = cart.filter((cartItem) => cartItem.id === id);
      return hmot.length;
    }

    const listItems = foundCart.map((el) => (
      <div class="row border-top border-bottom" key={el.id}>
        <div class="row main align-items-center">
          <div class="col-2">
            <img class="img-fluid" src={el.src} alt={el.alt} />
          </div>
          <div class="col">
            <div class="row text-muted">{el.name}</div>
          </div>
          <div class="col">
            <div class="btn-group">
              <button type="button" class="btn btn-outline-danger" onClick={() => removeFromCart(el)} > - </button>{" "}
              <button type="button" class="btn btn-outline-success" onClick={() => addToCart(el)}> + </button>
            </div>
          </div>
          <div class="col">
            ${el.price} <span class="close">&nbsp;&#10005;</span> {howManyofThis(el.id)}
          </div>
        </div>
      </div>
    ));

    // calculate cart total
    const total = () => {
      let totalVal = 0;
      for (let i = 0; i < cart.length; i++)
        totalVal += cart[i].price;
      setCartTotal(totalVal);
    };
    useEffect(() => {
      total();
    });

    const onSubmit = (data) => {
      console.log(data); // log all data
      console.log(data.fullName); // log only fullname
      // update hooks
      setDataF(data);
      setViewer(4);
    };

    // store rendering
    return (<div>
      <nav class="navbar fixed navbar-expand-md navbar-light bg-white shadow py-2">
        <div className="container-fluid">
          <p>FarmersRUs</p>
          <button type="button" class="btn btn-primary justify-content-end" onClick={setViewer(1)}>Return</button>
        </div>
      </nav>
      <div class="card">
        <div class="row">
          <div class="col-md-8 cart">
            <div class="title">
              <div class="row">
                <div class="col align-self-center text-right text-muted">
                  Products selected {cart.length}
                </div>
              </div>
            </div>
            <div>{listItems}</div>
          </div>
          <div class="float-end">
            <p class="mb-0 me-5 d-flex align-items-center">
              <span class="small text-muted me-2">Order total:</span>
              <span class="lead fw-normal">${cartTotal.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="container mt-5">
          <div className="form-group">
            <input
              {...register("fullName", { required: true })}
              placeholder="Full Name"
              className="form-control" />
            {errors.fullName && (
              <p className="text-danger">Full Name is required.</p>
            )}
          </div>
          <div className="form-group">
            <input
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              placeholder="Email"
              className="form-control" />
            {errors.email && <p className="text-danger">Email is required.</p>}
          </div>
          <div className="form-group">
            <input
              {...register("creditCard", { required: true, minLength: 15 })}
              placeholder="Credit Card"
              className="form-control" />
            {errors.creditCard && (
              <p className="text-danger">Credit Card is required.</p>
            )}
          </div>
          <div className="form-group">
            <input
              {...register("address", { required: true })}
              placeholder="Address"
              className="form-control" />
            {errors.address && (
              <p className="text-danger">Address is required.</p>
            )}
          </div>
          <div className="form-group">
            <input
              {...register("address2")}
              placeholder="Address 2"
              className="form-control" />
          </div>
          <div className="form-group">
            <input
              {...register("city", { required: true })}
              placeholder="City"
              className="form-control" />
            {errors.city && <p className="text-danger">City is required.</p>}
          </div>
          <div className="form-group">
            <input
              {...register("state", { required: true })}
              placeholder="State"
              className="form-control" />
            {errors.state && <p className="text-danger">State is required.</p>}
          </div>
          <div className="form-group">
            <input
              {...register("zip", { required: true, minLength: 5, maxLength: 5 })}
              placeholder="Zip"
              className="form-control" />
            {errors.zip && <p className="text-danger">Zip is required.</p>}
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>);
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
    var foundCart = []
    for (let i of cart) {
      if (!foundCart.includes(i)) {
        foundCart.push(i);
      }
    }

    // count how many products of the same id:
    function howManyofThis(id) {
      let hmot = cart.filter((cartItem) => cartItem.id === id);
      return hmot.length;
    }

    // show selected products:
    const listItems = foundCart.map((el) => (
      <div class="row border-top border-bottom" key={el.id}>
        <div class="row main align-items-center">
          <div class="col-2">
            <img class="img-fluid" src={el.src} alt={el.alt} />
          </div>
          <div class="col">
            <div class="row text-muted">{el.name}</div>
          </div>
          <div class="col">
            ${el.price} <span class="close">&nbsp;&#10005;</span>{howManyofThis(el.id)}
          </div>
        </div>
      </div>
    ));

    // include a list of the items purchased as well
    return (<div>
      <h1>Payment summary:</h1>
      <h3>{dataF.fullName}</h3>
      <p>{dataF.email}</p>
      <p>{dataF.creditCard}</p>
      <p>{dataF.address}</p>
      <p>{dataF.city}, {dataF.state} {dataF.zip} </p>
      <p>Total Cost: ${cartTotal.toFixed(2)}</p>
      <p>Number of items: {cart.length}</p>
      {listItems}
      <button onClick={() => updateHooks(0)} className="btn btn-secondary">Browse More</button>
      <button onClick={() => updateHooks(1)} className="btn btn-primary">Back to Cart   </button>
    </div>);
  }

  /**
   * About Us Page:
   * This will display information on us, the
   * course, and the course instructors.
   */
  function AboutUs() {
    return (<div class="text-bg-dark">
      <div>
        <nav className="navbar fixed navbar-expand-md navbar-dark bg-gray shadow py-2">
          <div className="container-fluid">
            <h1>About Us</h1>
            <div class="float-right">
              <nav class="nav nav-masthead justify-content-center float-md-end">
                <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setViewer(1)}>Return</a>
                <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setUser({}) && setViewer(0)}>Logout</a>
                <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setViewer(3)}>Cart</a>
                <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={setViewer(5)}>About Us</a>
              </nav>
            </div>
          </div>
        </nav>
      </div>

      <h2 class="text-bg-dark px-10 my-3">SE/COMS 319</h2>

      <div class="d-flex justify-content-center">
        <div class="album py-5">
          <div class="container mx-auto">
            <div id="col" class="row row-cols-1 row-cols-sm-2 g-4">
              <div class="card shadow-sm bg-dark">
                <div class="card-body">
                  <h5 class="card-title text-white">Sam Craft</h5>
                  <p class="card-text text-white">Sophomore studying Software Engineering.</p>
                  <div class="d-flex justify-content-between align-items-center">
                  </div>
                  <img class="card-img-top card-img-bottom" src="IMG_3992.jpeg" alt="Picture of Sam" />
                </div>
              </div>
              <div class="card shadow-sm bg-dark">
                <div class="card-body">
                  <h5 class="card-title text-white">Em Bradley-DeHaan</h5>
                  <p class="card-text text-white">Junior studying Software Engineering</p>
                  <div class="d-flex justify-content-between align-items-center">
                  </div>
                  <img class="card-img-top card-img-bottom" src="IMG_4867.jpg" alt="Picture of Em" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }

  function RemoveUsers() {

  }


  return (
    <div>
      {viewer == 0 && <Main />}
      {viewer == 1 && <Browse />}
      {viewer == 2 && <OneProduct />}
      {viewer == 3 && <Cart />}
      {viewer == 4 && <Summary />}
      {viewer == 5 && <AboutUs />}
      {viewer == 6 && u.priv === "admin" && <RemoveUsers />}
    </div>
  );
}

export default App;

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

function App() {
  // viewer:
  const [viewer, setViewer] = useState(0);
  // login:
  const [user, setUser] = useState({});
  // get all user data:
  const [allUsers, setAllUsers] = useState({});
  // Browse views:
  const [products, setProducts] = useState([]);
  const [oneProduct, setOneProduct] = useState({});
  // react forms:
  const { register, reset, handleSubmit, formState: { errors } } = useForm();
  const [dataF, setDataF] = useState({});
  // shopping cart:
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

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

  useEffect(() => {
    getAllUsers();
  }, []);
  function getAllUsers() {
    fetch("http://localhost:8081/users", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setAllUsers(data));
  };

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
    var type = -1;

    const login = (data) => {
      console.log("Attempting login.");
      let login = false;
      // check if this username and password combination exists:
      for (let u in allUsers) {
        if (allUsers[u].username === data.username && allUsers[u].password === data.password) {
          setUser(allUsers[u]);
          login = true;
          break;
        }
      }
      // alert "invalid username or password."
      if (login === false) {

      }
      // alert "login successful."
      else {

        setViewer(1);
      }
    };

    const registerUser = (data) => {
      console.log("Attempting registration.");
      // check if this username already exists:
      for (let u in allUsers) {
        // alert "username already exists."
        if (allUsers[u].username === data.username) {
          return;
        }
      }

      fetch("http://localhost:8081/users", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          "username": data.username,
          "password": data.password,
          "priv": "user"
        }),
      });
      // alert "registration successful."
      data.priv = "user";
      setUser(data);
      setViewer(1);
    };

    const onSubmit = (data) => {
      login(data);
    };

    const onRegisterSubmit = (data) => {
      registerUser(data);
    }


    return (<div id="main" className="text-bg-dark">
      <nav className="navbar fixed navbar-expand-md navbar-dark bg-gray shadow py-2">
        <div className="container-fluid">
          <h1>FarmersRUs</h1>
        </div>
      </nav>

      <div className="container-fluid">
        <form id="my-form" className="py-4 mx-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group py-1">
            <input {...register("username", { required: true })}
              placeholder="Username" type="text" className="form-control w-50">
              {errors.username && (
                <p className="text-danger">Username required.</p>
              )}
            </input>
          </div>
          <div className="form-group py-1">
            <input {...register("password", { required: true })}
              placeholder="Password" type="password" className="form-control w-50">
              {errors.password && (
                <p className="text-danger">Password required.</p>
              )}
            </input>
          </div>
          <button type="submit" className="btn btn-primary py-1">Login</button>
          <button onClick={handleSubmit(onRegisterSubmit)} type="submit" className="btn btn-primary py-1">Register</button>
        </form>
        <div id="alert_message"></div>
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

      if (checkboxes.length === 0) {
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
      for (let j in vals) {
        for (let k in products.filter(p => p.keywords.includes(vals[j]))) {
          if (filtered.filter(f => f.id !== k.id))
            filtered.push(k);
        }
      }

      setKeywords(filtered);
    };

    // renders all products on the page:
    const renderProducts = (product) => {
      return (<div className="category-section fixed">
        <div className="m-6 p-3 mt-10 m1-0 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 x1:gap-x-10" style={{ maxHeight: '800px', overflowY: 'scroll' }}>
          {product.map((el) => (
            <div key={el.id} className="group relative shadow-lg">
              <div className="min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
                <img
                  src={el.src}
                  alt={el.alt}
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
              </div>
              <div className="flex justify-between p-3">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a onClick={() => handleClick(el.id)}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      <span style={{ fontSize: '16px', fontWeight: '600' }}>{el.name}</span>
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Rating: {el.rating[0].rate} ({el.rating[0].count})</p>
                  <div className='flex justify-between'>
                    <div class="btn-group">
                      <button type="button" class="btn btn-outline-secondary" onClick={() => removeFromCart(el)} > - </button>{" "}
                      <button type="button" class="btn btn-outline-secondary" onClick={() => addToCart(el)}> + </button>
                    </div>
                    <p>{howManyofThis(el.id)}</p>
                  </div>
                </div>

                <p className="text-sm font-medium text-green-600">${el.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>);
    };

    return (<div className="text-bg-dark">
      <nav className="navbar fixed navbar-expand-md navbar-dark bg-gray shadow py-2">
        <div className="container-fluid">
          <h1>FarmersRUs</h1>
          <div className="float-right">
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a className="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={(() => setUser({})) && (() => setViewer(0))}>Logout</a>
              <a className="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(3)}>Cart</a>
              <a className="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(5)}>About Us</a>
              {user.priv === "admin" &&
                <a className="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(6)}>Remove User</a>}
            </nav>
          </div>
        </div>
      </nav>

      <div className="d-flex mt-5 px-2">
        <div className="sidebar-nav flex-shrink-0 flex-column">
          <span className="fs-5 fw-semibold">Filters</span>
          <ul className="list-unstyled ps-0">
            <li className="mb-1">
              <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                data-bs-toggle="collapse" data-bs-target="#implement-collapse" aria-expanded="false">
                Implements
              </button>
              <div className="collapse" id="implement-collapse">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-center"
                  style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                  <div class="list-group">
                    <label className="list-group-item d-flex gap-2">
                      <input id="seeder" className="form-check-input flex-shrink-0" name="implement" type="checkbox" value="" />
                      <span>
                        Seeder
                      </span>
                    </label>
                    <label className="list-group-item d-flex gap-2">
                      <input id="crop-care" className="form-check-input flex-shrink-0" name="implement" type="checkbox" value="" />
                      <span>
                        Crop Care
                      </span>
                    </label>
                    <label class="list-group-item d-flex gap-2">
                      <input id="planter" className="form-check-input flex-shrink-0" name="implement" type="checkbox" value="" />
                      <span>
                        Planters
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </li>

            <li className="border-top my-3"></li>

            <li className="mb-1">
              <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                data-bs-toggle="collapse" data-bs-target="#vehicle-collapse" aria-expanded="false">
                Vehicles
              </button>
              <div className="collapse" id="vehicle-collapse">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-center"
                  style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                  <div className="list-group">
                    <label className="list-group-item d-flex gap-2">
                      <input id="harvester" className="form-check-input flex-shrink-0" name="vehicle" type="checkbox" value="" />
                      <span>
                        Harvester
                      </span>
                    </label>
                    <label className="list-group-item d-flex gap-2">
                      <input id="tractor" className="form-check-input flex-shrink-0" name="vehicle" type="checkbox" value="" />
                      <span>
                        Tractor
                      </span>
                    </label>
                    <label className="list-group-item d-flex gap-2">
                      <input className="form-check-input flex-shrink-0" name="vehicle" type="checkbox" value="" />
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
                  style={{ paddingTop: "20px", paddingBottom: "20px" }}>
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
          <button class="btn-filter" onClick={filterQuery}>
            Apply Filters
          </button>
        </div>

        <div className="m1-5 x1:basis-4/5">
          {renderProducts(keywords)}
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

      if (comment_body.value.length === 0)
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
      return (<div className="container" style={{ "margin-top": "10px" }}>
        <div>
          <div className="align-center d-flex py-4">
            <img className="img-fluid" src={oneProduct.src} alt={oneProduct.alt} style={{ "height": "400px", "borderRadius": "5px" }} />
            <div className="float-right px-3">
              <h2>{oneProduct.title}</h2>
              <h4>
                Rating: {oneProduct.rating[0].rate} ({oneProduct.rating[0].count})
              </h4>
              <h4 class="text-green-600">${oneProduct.price}</h4>
              <p class="card-text-sm w-50">{oneProduct.desc}</p>
              <h5>Specifications:</h5>
              <ul>
                {oneProduct.specs.map((s) => {
                  return (<li>{s}</li>);
                })}
              </ul>
            </div>
          </div>
          <div>
            <div>
              <h4>Comments:</h4>
              {oneProduct.comments.map((c) => {
                return (<div>
                  <h5>c.user</h5>
                  <p>c.body</p>
                </div>)
              })}
            </div>
            <form className="py-3" onSubmit={onSubmit}>
              <textarea id="comment_body" placeholder="Leave a Review!" type="text" className="form-control" style={{ "width" : "400px", "height" : "112.8px" }}></textarea>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>);
    };

    return (<div className="text-bg-dark">
      <nav class="navbar fixed navbar-expand-md navbar-dark text-bg-dark shadow py-2">
        <div className="container-fluid">
          <h1>FarmersRUs</h1>
          <div class="float-right">
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(1)}>Return</a>
              <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={(() => setUser({})) && (() => setViewer(0))}>Logout</a>
              <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(3)}>Cart</a>
              <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(5)}>About Us</a>
              {user.priv === "admin" &&
                <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(6)}>Remove Users</a>}
            </nav>
          </div>
        </div>
      </nav>
      <div className="container">
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
          <button type="button" class="btn btn-primary justify-content-end" onClick={() => setViewer(1)}>Return</button>
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
      <button onClick={() => setViewer(1)} className="btn btn-secondary">Browse More</button>
      <button onClick={() => setViewer(3)} className="btn btn-primary">Back to Cart   </button>
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
                <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(1)}>Return</a>
                <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={(() => setUser({})) && (() => setViewer(0))}>Logout</a>
                <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(3)}>Cart</a>
                <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => setViewer(5)}>About Us</a>
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

  /**
   * Remove Users Page:
   * This will allow an admin to remove a user
   * from the FarmersRUs database, only accessible
   * to admin users.
   */
  function RemoveUsers() {

  }


  return (
    <div>
      {viewer === 0 && <Main />}
      {viewer === 1 && <Browse />}
      {viewer === 2 && <OneProduct />}
      {viewer === 3 && <Cart />}
      {viewer === 4 && <Summary />}
      {viewer === 5 && <AboutUs />}
      {viewer === 6 && user.priv === "admin" && <RemoveUsers />}
    </div>
  );
}

export default App;

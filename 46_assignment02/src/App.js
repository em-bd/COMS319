/* eslint-disable jsx-a11y/alt-text */
/**
 * Authors: Em Bradley-DeHaan,
 *          Samuel Craft
 * ISU Netids: emmieb@iastate.edu
 *          craftsam@iastate.edu
 * Date: April 6th, 2024
 */


// import statements:
import './App.css';
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import items from "./products.json";


// app rendering:
function App() {
  // browse:
  const [ProductsCategory, setProductsCategory] = useState(items);
  const [query, setQuery] = useState('');
  // shopping cart:
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  // order summary:
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [dataF,setDataF] = useState({});
  // determine view mode:
  const [viewer,setViewer] = useState(0);

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

  function updateHooks(i) {
    setViewer(i);
  }


  // browse items:
  function Browse() {

    function howManyofThis(id) {
      let hmot = cart.filter((cartItem) => cartItem.id === id);
      return hmot.length;
    }
        
    // product rendering:
    const render_products = (ProductsCategory) => {
      return (<div className="category-section fixed">    
        <div className="m-6 p-3 mt-10 m1-0 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 x1:gap-x-10" style={{ maxHeight: '800px', overflowY: 'scroll'}}>
          {ProductsCategory.map((product, index) => (
            <div key={index} className="group relative shadow-lg">
                  <div className="min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
                    <img
                      src={product.image}
                      alt-text="Product Image"
                      className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                    />
                  </div>
                  <div className="flex justify-between p-3">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <a href={product.href}>
                          <span aria-hidden="true" className="absolute inset-0"/>
                          <span style={{ fontSize: '16px', fontWeight: '600' }}>{product.title}</span>
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">Rating: {product.rating.rate}</p>
                      <div className='flex justify-between'>
                      <div class="btn-group">
                        <button type="button" class="btn btn-outline-secondary" onClick={() => removeFromCart(product)} > - </button>{" "}
                        <button type="button" class="btn btn-outline-secondary" onClick={() => addToCart(product)}> + </button>
                        </div>
                          <p>{howManyofThis(product.id)}</p>
                        </div> 
                    </div>
                    
                    <p className="text-sm font-medium text-green-600">${product.price}</p>
                  </div>
                  
                </div>
              ))}
              </div>     
          </div>);
    }

    // search even handler:
    const handleChange = (e) => {
      setQuery(e.target.value);
      const results = items.filter(eachProduct => {
        if (e.target.value === "") return ProductsCategory;
        return eachProduct.title.toLowerCase().includes(e.target.value.toLowerCase());
      });
      setProductsCategory(results);
    }

    // render page:
    return (
    <div>
      <nav class="navbar fixed navbar-expand-md navbar-light bg-white shadow py-2">
        <div className="container-fluid">
            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
              focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700
              dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
              dark:focus:ring-blue-500 dark:focus:border-blue-500" type="search" value={query} onChange={handleChange}/>
            <button type="button" class="btn btn-primary justify-content-end" onClick={() => updateHooks(1)}>
                <svg xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor" class="bi bi-cart float-left align-middle">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"></path>
                </svg>&nbsp;Cart </button>
        </div>
      </nav>
      <div className="m1-5 x1:basis-4/5">
        {render_products(ProductsCategory)}
      </div>
    </div>);
  }


  // shopping cart and payment:
  function Cart() {

    var foundCart = []

      for (let i of cart) {
        if(!foundCart.includes(i)) {
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
                    <img class="img-fluid" src={el.image} />
                </div>
                <div class="col">
                    <div class="row text-muted">{el.title}</div>
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
    }
  
    // get total from cart
    useEffect(() => {
        total();
    });

    const onSubmit = (data) => {
      console.log(data); // log all data
      console.log(data.fullName); // log only fullname
      // update hooks
      setDataF(data);
      setViewer(2);
    };
  
  
    // store rendering
    return (
        <div>
            
            <nav class="navbar fixed navbar-expand-md navbar-light bg-white shadow py-2">
                 <div className="container-fluid">
                  <p>Shopping Cart</p>
            <button type="button" class="btn btn-primary justify-content-end" onClick={() => updateHooks(0)}> Return </button>
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
              className="form-control"
            />

            {errors.fullName && (
              <p className="text-danger">Full Name is required.</p>
            )}
          </div>

          <div className="form-group">
            <input
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              placeholder="Email"
              className="form-control"
            />
            {errors.email && <p className="text-danger">Email is required.</p>}
          </div>

          <div className="form-group">
            <input
              {...register("creditCard", { required: true, minLength: 15 })}
              placeholder="Credit Card"
              className="form-control"
            />
            {errors.creditCard && (
              <p className="text-danger">Credit Card is required.</p>
            )}
          </div>
          <div className="form-group">
            <input
              {...register("address", { required: true })}
              placeholder="Address"
              className="form-control"
            />
            {errors.address && (
              <p className="text-danger">Address is required.</p>
            )}
          </div>
          <div className="form-group">
            <input
              {...register("address2")}
              placeholder="Address 2"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              {...register("city", { required: true })}
              placeholder="City"
              className="form-control"
            />
            {errors.city && <p className="text-danger">City is required.</p>}
          </div>
          <div className="form-group">
            <input
              {...register("state", { required: true })}
              placeholder="State"
              className="form-control"
            />
            {errors.state && <p className="text-danger">State is required.</p>}
          </div>
          <div className="form-group">
            <input
              {...register("zip", { required: true, minLength: 5, maxLength: 5 })}
              placeholder="Zip"
              className="form-control"
            />
            {errors.zip && <p className="text-danger">Zip is required.</p>}
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
        </div>
    );
  }


  // order summary:
  function Confirmation() {

    var foundCart = []

      for (let i of cart) {
        if(!foundCart.includes(i)) {
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
                    <img class="img-fluid" src={el.image} />
                </div>
                <div class="col">
                    <div class="row text-muted">{el.title}</div>
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

  // view to display determined by viewer:
  return (
    <div>
      {(viewer === 0) && <Browse />}
      {(viewer === 1) && <Cart />}
      {(viewer === 2) && <Confirmation />}
    </div>
  );
}

export default App;

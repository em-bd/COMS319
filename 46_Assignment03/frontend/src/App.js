/**
 * Authors: Em Bradley-DeHaan,
 *          Samuel Craft
 * ISU Netids: emmieb@iastate.edu
 *          craftsam@iastate.edu
 * Date: April 27th, 2024
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { Button } from "bootstrap";

function App() {
  // browse:
  const [product, setProduct] = useState([]);
  // update one product:
  const [oneProduct, setOneProduct] = useState([]);
  const { register, handleSubmit, formState: { errors} } = useForm();
  // // new product:
  const [addNewProduct, setAddNewProduct] = useState({});

  // react hooks viewer:
  const [viewer, setViewer] = useState(0);

  function updateHooks(i) {
    setViewer(i);
  }

  useEffect(() => {
    getAllProducts();
  }, []);
  function getAllProducts() {
    fetch("http://localhost:8081/products", {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }

  /**
   * Browse page:
   * Displays all products on the page,
   * calls a GET request to the database 
   */
  function Browse() {
    const handleClick = (productID) => {
      setOneProduct(product[productID - 1]);
      updateHooks(1);
    }

    const render_products = (product) => {
      return (
      <div id="col" class="row row-cols-md-3 g-3">
        {product.map((el) => (
          <button key={el.id} id={el.id} className="card text-bg-dark shadow-sm mx-1" onClick={() => handleClick(el.id)}>
            <img src={el.image} className="card-img-top card-bottom" alt="image"/>
            <div class="card-body">
              <p class="card-text"> <strong>{el.title}</strong> ${el.price}</p>
              <p class="card-text">{el.rating.rate} ({el.rating.count})</p>
            </div>
          </button>
        ))}
      </div>);
    };

    return (<div class="text-bg-dark">
      <nav className="navbar fixed navbar-expand-md navbar-dark bg-gray shadow py-2">
        <div className="container-fluid">
          <h1>Catalog</h1>
          <div class="float-right">
          <nav class="nav nav-masthead justify-content-center float-md-end">
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => updateHooks(2)}>Add Product</a>
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => updateHooks(3)}>Remove Product</a>
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => updateHooks(4)}>About Us</a>
            </nav>
          </div>
        </div>
      </nav>

      <div class="album py-5">
        <div className="container mx-auto">
            {render_products(product)}
        </div>
      </div>
    </div>);
  }

  /**
   * Update Product page:
   * Displays a single product on the
   * page, calls a GET request and a 
   * PUT request to update specific aspects
   * of the specified product.
   */
  function OneProduct() {


    const render_product = (oneProduct) => {


      return (<div class="container d-flex align-center py-10">
        <div>
          <img class="h-100 w-100 img-fluid"src={oneProduct.image} width="100" alt="image"/>
        </div>

        <div class="float-left px-5">
          <h2>{oneProduct.title}</h2>

          <h4>
            Rating: {oneProduct.rating.rate} <span class="text-muted">({oneProduct.rating.count})</span>
          </h4>

          <h4 class="text-green-600">${oneProduct.price}</h4>
          <p class="card-text-sm w-50">{oneProduct.description}</p>
        </div>
      </div>);
    }

    console.log(oneProduct.rating.rate)


    const onSubmit = (data) => {

      const newProduct = {
        "id" : oneProduct.id,
        "title" : oneProduct.title,
        "price" : Number(data.price),
        "description" : oneProduct.description,
        "category" : oneProduct.category,
        "image" : oneProduct.image,
        "rating" : {
        "rate" : oneProduct.rating.rate,
        "count" : oneProduct.rating.count
        }
      }

      fetch("http://localhost:8081/products/"+oneProduct.id, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newProduct),
        });
      

    }


    return(<div class="h-auto">
      <nav class="navbar fixed navbar-expand-md navbar-dark text-bg-dark shadow py-2">
        <div className="container-fluid">
          <h1>Review Product</h1>
          <div class="float-right">
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => updateHooks(0)}>Return</a>
          </div>
        </div>
      </nav>
      <div class="container">
        {render_product(oneProduct)}
      </div>
      <div class="container">
        <h4>Update Product Information:</h4>
        <form className="py-4 px-5" onSubmit={handleSubmit(onSubmit)}>
  <div className="form-group py-1">

  <input  {...register("price", { required : true })}placeholder="Price" type="number" className="form-control w-50"></input>

  </div>
<button type="submit" class="btn btn-primary py-1">Submit</button>
  </form>
      </div>
    </div>)
  }

  /**
   * Add Product page:
   * 
   */
  function AddProduct() {

    const onSubmit = (data) => {
      data.id = product.length + 1;
      data.rating = {
        rate : 0.0,
        count : 0
      }
      data.description = "";
      console.log(data);
      setAddNewProduct(data);

      fetch("http://localhost:8081/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
      });
    }

    return (<div>
      <nav class="navbar fixed navbar-expand-md navbar-dark text-bg-dark shadow py-2">
        <div className="container-fluid">
          <h1>Update Products</h1>
          <div class="float-right">
            <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => updateHooks(0)}>Return</a>
          </div>
        </div>
      </nav>
      <form className="py-4 px-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group py-1">
          <input {...register("title", { required : true })}
            placeholder="Title" type="text" className="form-control w-50">
            {errors.title && (
              <p className="text-danger">Title is required.</p>
            )}
            </input>
        </div>
        <div className="form-group py-1">
          <input {...register("image", { required : true })} 
            placeholder="Image" type="url" className="form-control w-50">
            {errors.image && (
              <p className="text-danger">Image URL is required.</p>
            )}
            </input>
        </div>
        <div className="form-group py-1">
          <input {...register("price", { required : true })}
            placeholder="Price" type="number" className="form-control w-50">
              {errors.price && (
                <p className="text-danger">Price is required.</p>
              )}
            </input>
        </div>
        <div className="form-group py-1">
          <input {...register("category", { required : true })}
            placeholder="Category" type="text" className="form-control w-50">
              {errors.category && (
                <p className="text-danger">Category is required.</p>
              )}
            </input>
        </div>
      <button type="submit" class="btn btn-primary py-1">Submit</button>
      </form>
    </div>);
  }
  
  function RemoveProduct() {



    const onSubmit = (data) => {

      fetch("http://localhost:8081/products/"+data.id, {
        method: "DELETE",
        headers: { 'Content-type' : 'application/json' }
        });

    }

    return (
      <div>
          <div class="text-bg-dark">
            <nav className="navbar fixed navbar-expand-md navbar-dark bg-gray shadow py-2">
              <div className="container-fluid">
                <h1>Remove Product</h1>
                <div class="float-right">
                <nav class="nav nav-masthead justify-content-center float-md-end">
                  <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => updateHooks(0)}>Return</a>
                  </nav>
                </div>
              </div>
            </nav>
        </div>
        <form className="py-4 px-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group py-1">

          <input  {...register("id", { required : true })}placeholder="ID" type="number" className="form-control w-50"></input>

          </div>
          <button type="submit" class="btn btn-primary py-1">Submit</button>
        </form>

    
      </div>
    )

  }


  /**
   * About Us page:
   * This displays the About Us section, which
   * displays information about the students and
   * the course.
   */
  function AboutUs() {
    return (
      <div class="text-bg-dark">
        <div>
            <nav className="navbar fixed navbar-expand-md navbar-dark bg-gray shadow py-2">
              <div className="container-fluid">
                <h1>About Us</h1>
                <div class="float-right">
                <nav class="nav nav-masthead justify-content-center float-md-end">
                  <a class="nav-link fw-bold py-1 px-2 text-bg-dark" onClick={() => updateHooks(0)}>Return</a>
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
                    <img class="card-img-top card-img-bottom" src="IMG_3992.jpeg" alt="Picture of Sam"/>
                  </div>
                </div>

                <div class="card shadow-sm bg-dark">
                  <div class="card-body">
                    <h5 class="card-title text-white">Em Bradley-DeHaan</h5>
                    <p class="card-text text-white">Junior studying Software Engineering</p>
                    <div class="d-flex justify-content-between align-items-center">
                    </div>
                    <img class="card-img-top card-img-bottom" src="IMG_4867.jpg" alt="Picture of Em"/>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="h-auto">
      {(viewer === 0) && <Browse />}
      {(viewer === 1) && <OneProduct />}
      {(viewer === 2) && <AddProduct />}
      {(viewer === 3) && <RemoveProduct />}
      {(viewer === 4) && <AboutUs />}
    </div>
  );
}

export default App;
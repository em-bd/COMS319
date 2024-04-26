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

// /**
//  * Add Product page:
//  * Contains a form for the user to
//  * input information for a new
//  * product, uses POST Rest API to
//  * add new object to the database.
//  */
// function AddProduct() {
//     // new Product
//     const [addNewProduct, setAddNewProduct] = useState({
//       id: 0,
//       title: "",
//       price: 0.0,
//       description: "",
//       category: "",
//       image: "",
//       rating: {
//         rate: 0.0,
//         count: 0
//       },
//     });


// }

// /**
//  * Delete Product page:
//  * Displays a list of all products
//  * in the database and allows the
//  * user to delete any product of
//  * their choosing. Uses a 
//  * DELETE request to remove the
//  * specified item from the
//  * database entirely.
//  */
// function DeleteProduct() {

// }

// /**
//  * About Us page:
//  * Contains student and class information
//  */
// function AboutUs() {

// }

function App() {
  // browse:
  const [product, setProduct] = useState([]);
  // update one product:
  const [oneProduct, setOneProduct] = useState([]);
  var single_id = 0; // for the oneProduct view
  // // new product:
  const [addNewProduct, setAddNewProduct] = useState({
    id: 0,
    title: "",
    price: 0.0,
    description: "",
    category: "",
    image: "",
    rating: {
      rate: 0.0,
      count: 0
    },
  });

  // react hooks viewer:
  const [viewer, setViewer] = useState(0);

  function updateHooks(i) {
    setViewer(i);
  }

  useEffect(() => {
    getAllProducts();
  });
  function getAllProducts() {
    fetch("http://localhost:8081/products")
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }


  // function getOneProduct(id) {
  //   console.log(id);
  //   if (id >= 1 && id <= 20) {
  //     fetch("http://localhost:8081/products" + id)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("Show one product :", id);
  //         console.log(data);
  //         setOneProduct(data);
  //       });
  //     setViewer(1);
  //   } else {
  //     console.log("Wrong number of Product id.");
  //   }
  // }

  /**
   * Browse page:
   * Displays all products on the page,
   * calls a GET request to the database 
   */
  function Browse() {

    const handleClick = (productID) => {
      single_id = productID;
      updateHooks(1);
    }

    const render_products = (product) => {
      return (
      <div id="col" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {product.map((el) => (
          <button id={el.id} className="card shadow-sm mx-1" onClick={() => handleClick(el.id)}>
            <img src={el.image} className="card-img-top card-bottom" alt="image"/>
            <div class="card-body">
              <p class="card-text"> <strong>{el.title}</strong> ${el.price}</p>
              <p class="card-text">{el.rating.rate} ({el.rating.count})</p>
            </div>
          </button>
        ))}
      </div>);
    }

    return (<div>
      <nav class="navbar fixed navbar-expand-md navbar-light bg-white shadow py-2">
        <div className="container-fluid">
          <h1>Catalog</h1>
          <div class="float-right">
            <button type="button" class="btn btn-primary mx-1" onClick={() => updateHooks(2)}>
              Add Product </button>
            <button type="button" class="btn btn-primary" onClick={() => updateHooks(3)}>
              Remove Product</button>
          </div>
        </div>
      </nav>

      <div class="album py-5 bg-body-tertiary">
        <div class="container mx-auto">
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
  // const getOneProduct = (() => {
  //   console.log(single_id);

    if (id >= 1 && id <= 20) {
      fetch(`http://localhost:8081/products/${single_id}`)
        .then((response) => response.json())
        .then((data) => setOneProduct(data));
    } else {
      console.log("Wrong number of Product id.");
    }

    // const showOneItem = oneProduct.map((el) => (
    //   <div key={el.id}>
    //     <img src={el.image} width={30} alt="images" /> <br />
    //     Title: {el.title} <br />
    //     Category: {el.category} <br />
    //     Price: {el.price} <br />
    //     Rating: {el.rating.rate} <br />
    //     Count: {el.rating.count} <br />
    //   </div>
    // ));

    const render_product = (oneProduct) => {

    };

    return (<div>

    </div>)
  }

  // view to display determined by viewer:
  return (
    <div>
      {(viewer === 0) && <Browse />}
      {(viewer === 1) && <OneProduct />}
      {/* {(viewer === 2) && <AddProduct />}
      {(viewer === 3) && <DeleteProduct />}
      {(viewer === 4) && <AboutUs />} */}
    </div>
  );
}

export default App;

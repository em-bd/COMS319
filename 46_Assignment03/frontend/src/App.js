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
      count: 0,
    },
  });

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
      fetch("http://localhost:8081/products/" + id, {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => setOneProduct(data));
        .then((data) => {
          console.log("Show one product :", id);
          console.log(data);
          setOneProduct(data);

          // console.log(oneProduct.rating.rate);
          // console.log(oneProduct.rating.count);
        });
      setViewer(1);
    } else {
      console.log("Wrong number of Product id.");
      setViewer(0);
    }
  }

  const showOneItem = (
    <div key={oneProduct.id}>
      <img src={oneProduct.image} width={30} alt="images" /> <br />
      Title: {oneProduct.title} <br />
      Category: {oneProduct.category} <br />
      Price: {oneProduct.price} <br />
      {/* Rating: {oneProduct.rating.rate} <br />
      Count: {oneProduct.rating.count} <br /> */}
    </div>
  );

  function AddOneProduct() {
    fetch("http://localhost:8081/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(addNewProduct),
    });
  }

  return (
    <div>
      <h1>Catalog of Products</h1>
      <h3>Show all available Products.</h3>
      <button onClick={() => getAllProducts()}>Show All ...</button>
      {viewer === 0 && showAllItems}
      <h3>Show one Product by Id:</h3>
      <input
        type="text"
        id="message"
        name="message"
        placeholder="id"
        onChange={(e) => getOneProduct(e.target.value)}
      />{" "}
      <br />
      {viewer === 1 && showOneItem}
      <h3>Update Products</h3>
      <form onSubmit={AddOneProduct}>
      <input placeholder="ID" onSubmit={(e) => setAddNewProduct.id(e.target.value)}></input> <br />
      <input placeholder="Title" onSubmit={(e) => setAddNewProduct.title(e.target.value)}></input> <br />
      <input placeholder="Image" onSubmit={(e) => setAddNewProduct.image(e.target.value)}></input> <br />
      <input placeholder="Price" onSubmit={(e) => setAddNewProduct.price(e.target.value)}></input> <br />
      <input placeholder="Category" onSubmit={(e) => setAddNewProduct.category(e.target.value)}></input> <br />
      <input type="submit"></input>
      </form>
    </div>
  );

//   return (
//     <div>
//       <h1>Catalog of Products</h1>
//       <h3>Show all available Products.</h3>
//       <button onClick={() => getAllProducts()}>Show All ...</button>
//       {viewer === 0 && showAllItems}
//       <h3>Show one Product by Id:</h3>
//       <input
//         type="text"
//         id="message"
//         name="message"
//         placeholder="id"
//         onChange={(e) => getOneProduct(e.target.value)}
//       />{" "}
//       <br />
//       {viewer === 1 && showOneItem}
//       <h3>Update Products</h3>
//       <form onSubmit={AddOneProduct}>
//       <input placeholder="ID" onSubmit={(e) => setAddNewProduct.id(e.target.value)}></input> <br />
//       <input placeholder="Title" onSubmit={(e) => setAddNewProduct.title(e.target.value)}></input> <br />
//       <input placeholder="Image" onSubmit={(e) => setAddNewProduct.image(e.target.value)}></input> <br />
//       <input placeholder="Price" onSubmit={(e) => setAddNewProduct.price(e.target.value)}></input> <br />
//       <input placeholder="Category" onSubmit={(e) => setAddNewProduct.category(e.target.value)}></input> <br />
//       <input type="submit"></input>
//       </form>
// >>>>>>> 7904ced37e62e1cd9dbb34586e1d9af19947eb5b */}
//     </div>
//   );
}

export default App;

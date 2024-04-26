/**
 * Authors: Em Bradley-DeHaan,
 *          Samuel Craft
 * ISU Netids: emmieb@iastate.edu
 *          craftsam@iastate.edu
 * Date: April 27th, 2024
 */

import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

const [product, setProduct] = useState([]);
const [oneProduct, setOneProduct] = useState([]);
// new Product
const [addNewProduct, setAddNewProduct] = useState({
  id: 0,
  title: "",
  price: 0.0,
  description: "",
  category: "",
  image: "",
  rating: 0.0,
});

const [viewer, setViewer] = useState(0);

function App() {
  useEffect(() => {
    getAllProducts();
  }, []);
  function getAllProducts() {
    fetch("localhost:8081/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Show Catalog of Products :");
        console.log(data);
        setProduct(data);
      });
    setViewer(0);
  }

  const showAllItems = product.map((el) => (
    <div key={el.id}>
      <img src={el.image} width={30} alt="images" /> <br />
      Title: {el.title} <br />
      Category: {el.category} <br />
      Price: {el.price} <br />
      Rating :{el.rating} <br />
    </div>
  ));

  function getOneProduct(id) {
    console.log(id);
    if (id >= 1 && id <= 20) {
      fetch("localhost:8081/products" + id)
        .then((response) => response.json())
        .then((data) => {
          console.log("Show one product :", id);
          console.log(data);
          setOneProduct(data);
        });
       setViewer(1);
    } else {
      console.log("Wrong number of Product id.");
    }
  }

  const showOneItem = oneProduct.map((el) => (
    <div key={el.id}>
      <img src={el.image} width={30} alt="images" /> <br />
      Title: {el.title} <br />
      Category: {el.category} <br />
      Price: {el.price} <br />
      Rating: {el.rating} <br />
    </div>
  ));

  return (
    <div>
      <h1>Catalog of Products</h1>

      <h3>Show all available Products.</h3>
      <button onClick={() => getAllProducts()}>Show All ...</button>
      {(viewer === 0) && showAllItems}

      <h3>Show one Product by Id:</h3>
      <input
        type="text"
        id="message"
        name="message"
        placeholder="id"
        onChange={(e) => getOneProduct(e.target.value)}
      />
      {(viewer === 1) && showOneItem}

      {viewer === 0 && <Create />}
      {viewer === 1 && <Remove />}
      {viewer === 2 && <Update />}
      {viewer === 3 && <Delete />}
    </div>
  );
}

export default App;

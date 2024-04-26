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
    rating: {
      rate: 0.0,
      count: 0
    },
  });

  const [viewer, setViewer] = useState(0);

  useEffect(() => {
    getAllProducts();
  }, []);

  function getAllProducts() {
    fetch("http://localhost:8081/products", {
      method: "GET",
      headers: { "content-type": "application/json" },})
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
      Rating :{el.rating.rate} <br />
      Count :{el.rating.count} <br />
    </div>
  ));

  function getOneProduct(id) {
    console.log(id);
    if (id >= 1 && id <= 20) {
      fetch("http://localhost:8081/products/" + id, {
        method: "GET",
        headers: { "content-type": "application/json" },})
        .then((response) => response.json())
        .then((data) => {
          console.log("Show one product :", id);
          console.log(data);
          setOneProduct(data);

          console.log(oneProduct.rating.rate);
          console.log(oneProduct.rating.count);
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
      Rating: {oneProduct.rating.rate} <br />
      Count: {oneProduct.rating.count} <br />
    </div>
  );

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
      />
      {viewer === 1 && showOneItem}
    </div>
  );
}

export default App;

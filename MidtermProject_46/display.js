/**
 * 
 */

function loadProducts(myProducts) {
    let product = localStorage.getItem('name');
    let type = localStorage.getItem('type');
    var maincontainer = document.getElementById("product");
    // do something
}

// find a way to pass/fetch which was the previous page and what product was selected


fetch("./products.json")
.then(response => response.json())
.then(myProducts => loadProducts(myProducts));
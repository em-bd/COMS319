/**
 * 
 */

function loadProducts(myProducts) {
    var maincontainer = document.getElementById("product");
    for (let p in myProducts) {
        // do something
    }
}

// find a way to pass/fetch which was the previous page and what product was selected

fetch("./products.json")
.then(response => response.json())
.then(myProducts => loadProducts(myProducts));
/**
 * 
 */

var srcPage

function loadProducts(myProducts) {
    let src = localStorage.getItem('src')
    let product = localStorage.getItem('name');
    let type = localStorage.getItem('type');
    srcPage = type
    var maincontainer = document.getElementById("product");

    let displayHTML = document.getElementById("newDiv")

    displayHTML.innerHTML = `
    
    <img src = "${src}">
    <p> ${product + type} </p>
    
    `

    

    // do something
}

// find a way to pass/fetch which was the previous page and what product was selected


fetch("./product.json")
.then(response => response.json())
.then(myProducts => loadProducts(myProducts));

function goBack() {

window.location.href = srcPage + ".html"

}
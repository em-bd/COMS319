/**
 * Authors:Em Bradley-DeHaan
 *         Samuel Craft
 * Created: February 27th, 2024
 * ISU Netid: emmieb@iastate.edu,
 *             craftsam@iastate.edu
 */

function loadProducts(myProducts)   {
    //TODO: load products
}

fetch("./products.json")
    .then(response => response.json())
    .then(myProducts => loadProducts(myProducts));
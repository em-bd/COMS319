/**
 * Authors:Em Bradley-DeHaan
 *         Samuel Craft
 * Created: February 27th, 2024
 * ISU Netid: emmieb@iastate.edu,
 *             craftsam@iastate.edu
 */

function loadImplements(myProducts)   {
    // load implements
}

fetch("./product.json")
    .then(response => response.json())
    .then(myProducts => loadImplements(myProducts));
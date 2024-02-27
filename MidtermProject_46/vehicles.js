/**
 * Authors:Em Bradley-DeHaan
 *         Samuel Craft
 * Created: February 27th, 2024
 * ISU Netid: emmieb@iastate.edu,
 *             craftsam@iastate.edu
 */

function loadVehicles(myProducts)   {
    //TODO: load vehicles
}

fetch("./products.json")
    .then(response => response.json())
    .then(myProducts => loadVehicles(myProducts));
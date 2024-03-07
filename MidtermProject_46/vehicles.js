/**
 * Authors:Em Bradley-DeHaan
 *         Samuel Craft
 * Created: February 27th, 2024
 * ISU Netid: emmieb@iastate.edu,
 *             craftsam@iastate.edu
 */

function loadVehicles(myProducts)   {
    //TODO: load vehicles

    var vehicleTab = document.getElementById("col")

    vehicleTab.innerHTML = ""

    for (let i = 0; i < myProducts.vehicles.length; i++) {
        
        let source = myProducts.vehicles[i].src;
        let name = myProducts.vehicles[i].name;

        let addvehicleTab = document.createElement("div")

        addvehicleTab.classList.add("col")

        addvehicleTab.innerHTML = `


        <div class="card text-bg-dark">
           <img src = ${source} class = "card-img-top" alt = "..."></img>
            <div class="card-body">
              <p class="card-text"><strong>${name}</strong></p>
              <div class="d-flex justify-content-between align-items-center">
              </div>
            </div>
          </div>
          `
        vehicleTab.appendChild(addvehicleTab)
    }
}

fetch("./product.json")
    .then(response => response.json())
    .then(myProducts => loadVehicles(myProducts));
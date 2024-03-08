/**
 * Authors : Em Bradley-DeHaan
 *         Samuel Craft
 * Created : February 27th, 2024
 * ISU Netid : emmieb@iastate.edu,
 *            craftsam@iastate.edu
 */
var products
function loadVehicles(myProducts)   {
    products = myProducts
    var vehicleTab = document.getElementById("col")

    vehicleTab.innerHTML = ""

    for (let i = 0; i < myProducts.vehicles.length; i++) {
        
        source = myProducts.vehicles[i].src;
        name = myProducts.vehicles[i].name;

        let addvehicleTab = document.createElement("div");

        addvehicleTab.classList.add("col");

        addvehicleTab.innerHTML = `
        <button class="card text-bg-dark" onclick="btnClick(this.id)" id = "${i}">
           <img src = ${source} class = "card-img-top" alt = "..."></img>
            <div class="card-body">
              <p class="card-text"><strong>${name}</strong></p>
              <div class="d-flex justify-content-between align-items-center">
              </div>
            </div>
          </button>
          `
        vehicleTab.appendChild(addvehicleTab)
    }
}


fetch("./product.json")
    .then(response => response.json())
    .then(myProducts => loadVehicles(myProducts));
    



    function btnClick(clkID) {
        localStorage.clear()
        localStorage.setItem("name",products.vehicles[clkID].name);
        localStorage.setItem("src",products.vehicles[clkID].src);
        localStorage.setItem("type","vehicles");
        window.location.href = "display.html"
    }
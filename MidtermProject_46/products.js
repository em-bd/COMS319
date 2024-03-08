/**
 * Authors:Em Bradley-DeHaan
 *         Samuel Craft
 * Created: February 27th, 2024
 * ISU Netid: emmieb@iastate.edu,
 *             craftsam@iastate.edu
 */

function loadProducts(myProducts)   {
    
    var productTab = document.getElementById("col");

    productTab.innerHTML = "";

    for (let i = 0; i < myProducts.products.length; i++) {
        
        let source = myProducts.products[i].src;
        let name = myProducts.products[i].name;

        let addProductTab = document.createElement("div");

        addProductTab.classList.add("col");

        addProductTab.innerHTML = `
        <div class="card text-bg-dark">
           <img src = ${source} class = "card-img-top" alt = "..."></img>
            <div class="card-body">
              <p class="card-text"><strong>${name}</strong></p>
              <div class="d-flex justify-content-between align-items-center">
              </div>
            </div>
          </div>
          `;
        productTab.appendChild(addProductTab);
    }
}

fetch("./product.json")
    .then(response => response.json())
    .then(myProducts => loadProducts(myProducts));
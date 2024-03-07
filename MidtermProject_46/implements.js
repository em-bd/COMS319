/**
 * Authors:Em Bradley-DeHaan
 *         Samuel Craft
 * Created: February 27th, 2024
 * ISU Netid: emmieb@iastate.edu,
 *             craftsam@iastate.edu
 */

function loadImplements(myProducts)   {
    // load implements

    var productTab = document.getElementById("col")

    productTab.innerHTML = ""

    for (let i = 0; i < myProducts.implements.length; i++) {
        
        let source = myProducts.implements[i].src;
        let name = myProducts.implements[i].name;

        let addImplementTab = document.createElement("div")

        addImplementTab.classList.add("col")

        addImplementTab.innerHTML = `


        <div class="card text-bg-dark">
           <img src = ${source} class = "card-img-top" alt = "..."></img>
            <div class="card-body">
              <p class="card-text"><strong>${name}</strong></p>
              <div class="d-flex justify-content-between align-items-center">
              </div>
            </div>
          </div>
          `
        productTab.appendChild(addImplementTab)
    }
}

fetch("./product.json")
    .then(response => response.json())
    .then(myProducts => loadImplements(myProducts));
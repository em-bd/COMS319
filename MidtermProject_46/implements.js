/**
 * Authors:Em Bradley-DeHaan
 *         Samuel Craft
 * Created: February 27th, 2024
 * ISU Netid: emmieb@iastate.edu,
 *             craftsam@iastate.edu
 */
var products
function loadImplements(myProducts)   {
    // load implements
    products = myProducts
    var productTab = document.getElementById("col")

    productTab.innerHTML = ""

    for (let i = 0; i < myProducts.implements.length; i++) {
        
        let source = myProducts.implements[i].src;
        let name = myProducts.implements[i].name;

        let addImplementTab = document.createElement("div")

        addImplementTab.classList.add("col")

        addImplementTab.innerHTML = `


        <button class="card text-bg-dark" onclick="btnClick(this.id)" id = "${i}">
           <img src = ${source} class = "card-img-top" alt = "..."></img>
            <div class="card-body">
              <p class="card-text"><strong>${name}</strong></p>
              <div class="d-flex justify-content-between align-items-center">
              </div>
            </div>
          </button>
          `
        productTab.appendChild(addImplementTab)
    }
}

fetch("./product.json")
    .then(response => response.json())
    .then(myProducts => loadImplements(myProducts));

    function btnClick(clkID) {
        localStorage.clear()
        localStorage.setItem("name",products.implements[clkID].name);
        localStorage.setItem("src",products.implements[clkID].src);
        localStorage.setItem("type","implements");
        window.location.href = "display.html"
    }
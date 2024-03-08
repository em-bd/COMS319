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

    maincontainer.innerHTML = `
    <button class = "bg-dark text-white" onclick="goBack()">Go Back</button>
    <div class="row g-0">
      <div class="col">
        <img src="${src}" class="img-fluid rounded-start" alt="..." >
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title text-white">${product}</h5>
          <p class="card-text text-white">Space left blank for future content that will be added for the final project.</p>
        </div>
      </div>
    </div>
    
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
/**
 * Authors:Em Bradley-DeHaan
 *         Samuel Craft
 * Created: February 27th, 2024
 * ISU Netid: emmieb@iastate.edu,
 *             craftsam@iastate.edu
 */
var products
function loadImplements(myProducts)   {
    products = myProducts.implements;
    var productTab = document.getElementById("col");
    productTab.innerHTML = "";

    for (let i = 0; i < myProducts.implements.length; i++) {
        
        let source = products[i].src;
        let name = products[i].name;

        let addImplementTab = document.createElement("div");

        addImplementTab.classList.add("col");

        addImplementTab.innerHTML = `
        <button class="card text-bg-dark" onclick="btnClick(this.id)" id = "${i}">
           <img src = ${source} class = "card-img-top card-img-bottom" alt = "${products[i].alt}"></img>
            <div class="card-body">
              <p class="card-text"><strong>${name}</strong></p>
              <div class="d-flex justify-content-between align-items-center">
              </div>
            </div>
          </button>
          `;
        productTab.appendChild(addImplementTab);
    }
}

fetch("./data.json")
    .then(response => response.json())
    .then(myProducts => loadImplements(myProducts));

    function btnClick(clkID) {
        localStorage.clear();
        localStorage.setItem("name",products[clkID].name);
        localStorage.setItem("src",products[clkID].src);
        localStorage.setItem("type","implements");
        window.location.href = "display.html";
    }

// side bar collapsable
(() => {
  'use strict'
  const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})()


// price range slider
const sliderEl = document.getElementById("minpricerangeslider");
const sliderValue = document.querySelector(".minpricevalue");

sliderEl.addEventListener("input", (event) => {
  const tempSliderValue = event.target.value;
  sliderValue.textContent = tempSliderValue;

  const progress = (tempSliderValue / sliderEl.max) * 100;

  sliderEl.style.background = `linear-gradient(to right, #04AA6D ${progress}%, #d3d3d3 ${progress}%)`;
});

const sliderEl1 = document.getElementById("maxpricerangeslider");
const sliderValue1 = document.querySelector(".maxpricevalue");

sliderEl1.addEventListener("input", (event1) => {
  const tempSliderValue1 = event1.target.value;
  sliderValue1.textContent = tempSliderValue1;

  const progress1 = (tempSliderValue1 / sliderEl1.max) * 100;

  sliderEl1.style.background = `linear-gradient(to right, #d3d3d3 ${progress1}%, #04AA6D ${progress1}%)`;
});

// filter button:
function filterQuery() {
  const checkboxes = document.querySelectorAll("input.form-check-input");
  console.log(checkboxes.length);
  let vals = ["  ", "  "];
  let type = ["  ", "  "];
  var i = 0;

  if (checkboxes.length == 0)
    return;

  checkboxes.forEach((item) => {
    if (item.checked) {
      vals[i] = item.attributes.getNamedItem("id").nodeValue;
      type[i++] = item.attributes.getNamedItem("name").nodeValue;
    }
  })

  // just print all
  if (i == 0) {
    fetch("./data.json")
    .then(response => response.json())
    .then(myProducts => loadImplements(myProducts));
  }

  const productTab = document.getElementById("col");
  productTab.innerHTML = "";

  i = 0;
  for (let p in products) {
    // check with all filters, if it fits into all of them, print
    let display = false;
    let j = 0;
    for (let t in type) {
      // get the key idx that matches the type
      if (products[p][type[t]] == vals[j++] || products[p][type[t]] == "all") {
        display = true;
      }
    }
    if (display) {
      let addProductTab = document.createElement("div");

      addProductTab.classList.add("col");
      addProductTab.innerHTML = `
      <button class="card text-bg-dark" onclick="btnClick(this.id)" id = "${i++}">
      <img src = ${products[p].src} class = "card-img-top card-img-bottom" alt = "${products[p].alt}"></img>
       <div class="card-body">
         <p class="card-text"><strong>${products[p].name}</strong></p>
         <div class="d-flex justify-content-between align-items-center">
         </div>
       </div>
     </button>
      `;
      productTab.appendChild(addProductTab);
    }
  }
};
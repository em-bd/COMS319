/**
 * 
 */

// side bar collapsable
(() => {
  'use strict'
  const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})()


// price range slider
const sliderEl = document.getElementById("pricerangeslider");
const sliderValue = document.querySelector(".pricevalue");

sliderEl.addEventListener("input", (event) => {
  const tempSliderValue = event.target.value;
  sliderValue.textContent = tempSliderValue;

  const progress = (tempSliderValue / sliderEl.max) * 100;

  sliderEl.style.background = `linear-gradient(to right, #04AA6D ${progress}%, #d3d3d3 ${progress}%)`;
})

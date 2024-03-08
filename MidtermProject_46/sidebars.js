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

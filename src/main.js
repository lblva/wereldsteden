import './styles/style.css'
import './styles/reset.css'
// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {apiKey} from "./key.js";

// init Swiper:
const swiper = new Swiper('.swiper', {
  // configure Swiper to use modules
  modules: [Navigation, Pagination],
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// fetch weather
async function getweather(){
  const cities = document.querySelectorAll(".swiper-slide");
  
    cities.forEach(async city => {
    const cityElement = city.querySelector(".image-text");
    const lat = cityElement.dataset.lat;
    const lon = cityElement.dataset.lon;
    console.log(lat, lon);
 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    const temperature = data.main.temp;
    console.log(temperature);

    const temperatureElement = city.querySelector(".temperature__value");
    temperatureElement.innerHTML = `&nbsp;${Math.round(temperature)}°C`;
    const loaderElement = city.querySelector(".temperature__loader")
    loaderElement.style.display= "none";
    temperatureElement.style.display = "block";


  })
}

getweather();
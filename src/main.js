import './styles/style.css';
import './styles/reset.css';
// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { apiKey } from './key.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// init Swiper:
new Swiper('.swiper', {
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
async function getweather() {
  const cities = document.querySelectorAll('.swiper-slide');

  cities.forEach(async (city) => {
    const cityElement = city.querySelector('.image-text');
    const lat = cityElement.dataset.lat;
    const lon = cityElement.dataset.lon;
    console.log(lat, lon);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    );
    const data = await response.json();

    const temperature = data.main.temp;
    console.log(temperature);

    const temperatureElement = city.querySelector('.temperature__value');
    temperatureElement.innerHTML = `&nbsp;${Math.round(temperature)}°C`;
    const loaderElement = city.querySelector('.temperature__loader');
    loaderElement.style.display = 'none';
    temperatureElement.style.display = 'block';
  });
}

getweather();

const width = window.innerWidth,
  height = 500;

// Init scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
camera.position.z = 1;

// Load Earth texture
const loader = new THREE.TextureLoader();
const earthTexture = loader.load('wereldkaart.jpg');
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshBasicMaterial({ map: earthTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Init renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.rotateSpeed = 0.35;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

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
  height = 700;

// Init scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(120, width / height, 0.01, 10);
camera.position.z = 0.9;

// Load Earth texture
const geometry = new THREE.SphereGeometry(0.6, 32, 32);

const loader = new THREE.TextureLoader();

// Load the textures
const earthTexture = loader.load('earthmap1k.jpg');
const bumpMapTexture = loader.load('earthbump.jpg');

// Create the material
const material = new THREE.MeshPhongMaterial({
  map: earthTexture,
  bumpMap: bumpMapTexture,
  bumpScale: 0.5, // Increased bump scale for more pronounced details
  color: 0xffffff, // Adjust color if necessary
  specular: 0x333333, // Adjust specular highlights
  shininess: 10, // Adjust shininess for more pronounced highlights
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Set ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Set point light
const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

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

// Load the textures for the pins
const pinTexture = loader.load('pin.png');

// Function to create a pin mesh
function createPinMesh() {
  const pinMaterial = new THREE.MeshBasicMaterial({ map: pinTexture });
  const pinGeometry = new THREE.SphereGeometry(0.01, 32, 32);
  return new THREE.Mesh(pinGeometry, pinMaterial);
}

// Function to create a text sprite
function createTextSprite(text, size) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 500 * size; // Adjusted font size
  const scale = 2; // Scale factor for higher resolution
  canvas.width = scale * 256; // Set a higher resolution canvas
  canvas.height = scale * 64; // Set a higher resolution canvas
  context.scale(scale, scale); // Scale the context for higher resolution rendering
  context.font = `${fontSize}px Arial`; // Set font size directly
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillStyle = 'white';
  context.fillText(text, 128, 32); // Adjust text position
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.2, 0.1, 1); // Adjust scale as needed
  return sprite;
}

// Function to calculate the position on the globe's surface for a given latitude and longitude
function calculatePositionOfCity(lat, lon) {
  const radius = 0.5;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

// Add pins and text for cities
function addCityPinAndText(lat, lon, cityName) {
  const pinMesh = createPinMesh();
  const position = calculatePositionOfCity(lat, lon);
  pinMesh.position.copy(position.clone().multiplyScalar(1.2)); // Adjust the multiplication factor as needed

  scene.add(pinMesh);

  const pinText = createTextSprite(cityName, 0.075);
  pinText.position.copy(position.clone().multiplyScalar(1.3));
  pinText.name = cityName; // Assign name to identify the pin text later
  scene.add(pinText);
}

// Add pins and text for cities
addCityPinAndText(48.8566, 2.3522, 'Paris'); // Paris coordinates
addCityPinAndText(35.6895, 139.6917, 'Tokyo'); // Tokyo coordinates
addCityPinAndText(-22.9068, -43.1729, 'Rio de Janeiro'); // Rio de Janeiro coordinates
addCityPinAndText(6.5244, 3.3792, 'Lagos'); // Lagos coordinates
addCityPinAndText(40.7128, -74.006, 'New York'); // New York coordinates

// Fetch and update the temperature information for each city
// Fetch and update the temperature information for each city
async function getWeatherAndUpdatePins() {
  const citiesData = [
    { lat: 48.8566, lon: 2.3522, name: 'Paris' },
    { lat: 35.6895, lon: 139.6917, name: 'Tokyo' },
    { lat: -22.9068, lon: -43.1729, name: 'Rio de Janeiro' },
    { lat: 6.5244, lon: 3.3792, name: 'Lagos' },
    { lat: 40.7128, lon: -74.006, name: 'New York' },
  ];

  for (const cityData of citiesData) {
    const { lat, lon, name } = cityData;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    );
    const data = await response.json();

    const temperature = Math.round(data.main.temp);

    const pinText = scene.getObjectByName(name); // Get the pin text sprite by name

    // Update the text of the pin with the city name and temperature
    pinText.material.map.dispose(); // Dispose the old texture to prevent memory leaks
    pinText.material.map = createTextTexture(
      `${name}: ${temperature}°C`,
      0.075,
    );
  }
}

// Call getWeatherAndUpdatePins() to fetch and update the temperature information
getWeatherAndUpdatePins();

// Function to create text texture
function createTextTexture(text, size) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 380 * size; // Adjusted font size
  const scale = 2; // Scale factor for higher resolution
  canvas.width = scale * 256; // Set a higher resolution canvas
  canvas.height = scale * 64; // Set a higher resolution canvas
  context.scale(scale, scale); // Scale the context for higher resolution rendering
  context.font = `${fontSize}px Arial`; // Set font size directly
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillStyle = 'white';
  context.fillText(text, 128, 32); // Adjust text position
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

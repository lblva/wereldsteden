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
const camera = new THREE.PerspectiveCamera(120, width / height, 0.01, 10);
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

// Load the textures for the pins
const parisTexture = loader.load('pin.png');
const tokyoTexture = loader.load('pin.png');
const rioTexture = loader.load('pin.png');
const lagosTexture = loader.load('pin.png');
const newYorkTexture = loader.load('pin.png');

// Create materials for the pins
const parisMaterial = new THREE.MeshBasicMaterial({ map: parisTexture });
const tokyoMaterial = new THREE.MeshBasicMaterial({ map: tokyoTexture });
const rioMaterial = new THREE.MeshBasicMaterial({ map: rioTexture });
const lagosMaterial = new THREE.MeshBasicMaterial({ map: lagosTexture });
const newYorkMaterial = new THREE.MeshBasicMaterial({ map: newYorkTexture });

// Create meshes for the pins
const parisGeometry = new THREE.SphereGeometry(0.02, 32, 32);
const tokyoGeometry = new THREE.SphereGeometry(0.02, 32, 32);
const rioGeometry = new THREE.SphereGeometry(0.02, 32, 32);
const lagosGeometry = new THREE.SphereGeometry(0.02, 32, 32);
const newYorkGeometry = new THREE.SphereGeometry(0.02, 32, 32);

const parisMesh = new THREE.Mesh(parisGeometry, parisMaterial);
const tokyoMesh = new THREE.Mesh(tokyoGeometry, tokyoMaterial);
const rioMesh = new THREE.Mesh(rioGeometry, rioMaterial);
const lagosMesh = new THREE.Mesh(lagosGeometry, lagosMaterial);
const newYorkMesh = new THREE.Mesh(newYorkGeometry, newYorkMaterial);

// Set positions for the pins
const parisPosition = calculatePositionOfCity(48.8566, 2.3522); // Paris coordinates
const tokyoPosition = calculatePositionOfCity(35.6895, 139.6917); // Tokyo coordinates
const rioPosition = calculatePositionOfCity(-22.9068, -43.1729); // Rio de Janeiro coordinates
const lagosPosition = calculatePositionOfCity(6.5244, 3.3792); // Lagos coordinates
const newYorkPosition = calculatePositionOfCity(40.7128, -74.006); // New York coordinates

parisMesh.position.copy(parisPosition);
tokyoMesh.position.copy(tokyoPosition);
rioMesh.position.copy(rioPosition);
lagosMesh.position.copy(lagosPosition);
newYorkMesh.position.copy(newYorkPosition);

// Add pins to the scene
scene.add(parisMesh);
scene.add(tokyoMesh);
scene.add(rioMesh);
scene.add(lagosMesh);
scene.add(newYorkMesh);

// Add text to the pins
const parisText = createTextSprite('Paris', 0.075);
const tokyoText = createTextSprite('Tokyo', 0.075);
const rioText = createTextSprite('Rio de Janeiro', 0.075);
const lagosText = createTextSprite('Lagos', 0.075);
const newYorkText = createTextSprite('New York', 0.075);

parisText.position.copy(parisPosition.clone().multiplyScalar(1.2));
tokyoText.position.copy(tokyoPosition.clone().multiplyScalar(1.2));
rioText.position.copy(rioPosition.clone().multiplyScalar(1.2));
lagosText.position.copy(lagosPosition.clone().multiplyScalar(1.2));
newYorkText.position.copy(newYorkPosition.clone().multiplyScalar(1.2));

scene.add(parisText);
scene.add(tokyoText);
scene.add(rioText);
scene.add(lagosText);
scene.add(newYorkText);

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

function createTextSprite(text, size) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 600 * size; // Adjusted font size
  context.font = `${fontSize}px Arial`; // Set font size directly
  const width = context.measureText(text).width;
  const height = fontSize; // Fixed height
  canvas.width = width * 2; // Adjust canvas width for higher resolution
  canvas.height = height * 2; // Adjust canvas height for higher resolution
  context.font = `${fontSize}px Arial`;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillStyle = 'white';
  context.fillText(text, width / 2, height / 2); // Adjust text position
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.2, 0.2, 1);
  return sprite;
}
//depth of field maakt text wazig i think

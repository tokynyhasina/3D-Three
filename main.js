import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import stars from "./image/star.webp";
import earth from "./image/earth.jpg";

const renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.01);
const textureLaoder = new THREE.TextureLoader();

scene.background = textureLaoder.load(stars);

renderer.setSize(window.innerWidth, window.innerHeight);
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-10, 20, 20);

const grid = new THREE.GridHelper(30, 40);
scene.add(grid);

const planeGeometry = new THREE.PlaneGeometry(30, 30, 5, 4);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(4);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  map: textureLaoder.load(earth),
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

// const ambiantLight = new THREE.AmbientLight(0x333333);
// scene.add(ambiantLight);

// const directionLight = new THREE.DirectionalLight(0xcccccc, 0.8);
let step = 0;
let speed = 0.02;
// scene.add(directionLight);
// directionLight.castShadow = true;
// directionLight.position.set(-10, 20, 0);
// directionLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionLight, 5);
// scene.add(dLightHelper);

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.castShadow = true;
spotLight.angle = 0.2;
spotLight.position.set(-100, 100, 0);
const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const gui = new dat.GUI();

const options = {
  sphereColor: "#ffc444",
  wireframe: true,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
};

gui.addColor(options, "sphereColor").onChange((e) => {
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 3);

function animation() {
  renderer.render(scene, camera);

  step += options.speed;
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  sphere.rotation.y += 0.01;

  // sphere.position.y = 10 * Math.abs(Math.sin(step));
}

renderer.setAnimationLoop(animation);

document.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

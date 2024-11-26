import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const container3D = document.getElementById("vinyl-container");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let object;
let mixer;  // Animation mixer to control animations
let clock = new THREE.Clock();  // Needed to update animation mixer

// const controls = new OrbitControls(camera, document.getElementById("vinyl-container"));
// controls.enableRotate = false;  // Disable rotation
// controls.enablePan = false;     // Disable panning

// Load the GLTF model
const loader = new GLTFLoader();

loader.load(
    `models/Vinyl.glb`,
    function (gltf) {
        // If the file is loaded, add it to the scene
        object = gltf.scene;
        scene.add(object);
        
        // Check if there are animations and create an AnimationMixer
        //if (gltf.animations && gltf.animations.length) {
        //    mixer = new THREE.AnimationMixer(object);
        //    const action = mixer.clipAction(gltf.animations[0]); // Get the first animation
        //    action.play();  // Start the animation
        //}
    },
    function (xhr) {
        // Log loading progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        // Log errors
        console.error(error);
    }
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
if(container3D == null)
    console.log("Error")
renderer.setSize(window.innerWidth, window.innerHeight);



document.getElementById("vinyl-container").appendChild(renderer.domElement);

camera.position.z = 3;

const topLight = new THREE.DirectionalLight(0xFFFFFF, 1);
topLight.position.set(200, 200, 500);
topLight.target.position.set(0, 0, 0);
topLight.castShadow = false;
scene.add(topLight);

const frontLight = new THREE.DirectionalLight(0xFFFFFF, 1);
frontLight.position.set(0, 0, 500);
frontLight.target.position.set(0, 0, 0);
frontLight.castShadow = false;
scene.add(frontLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

function animate() {
    requestAnimationFrame(animate);

    // Update the animation mixer with the elapsed time
    if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
    }
    if (object) {
        //object.rotation.x -= 0.0005;
        object.rotation.y += 0.003;
        //object.rotation.z += 0.002;

    }
    renderer.render(scene, camera);
}

document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function updateResize() {
    camera.aspect = container3D.clientWidth / container3D.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container3D.clientWidth, container3D.clientHeight);
}

window.addEventListener("resize", updateResize);
document.addEventListener("DOMContentLoaded", updateResize);

animate();

const textureLoader = new THREE.TextureLoader();

async function fetchCurrentSong() {
    try {
        const response = await fetch('./php/current-song.php');
        const data = await response.json();
        const songInfoDiv = document.getElementById('song-info');

        if (data.song !== 'No song is currently playing') {
            songInfoDiv.innerHTML = `
            <div id="song-information">
                <p>${data.song}</p>
                <p>by ${data.artist}</p>
                <p>Album: ${data.album}</p>
            </div>
            `;

            textureLoader.load(
                data.albumArt,
                function (texture) {
                texture.flipY = false;

                    if (object) {
                        object.traverse((child) => {
                            if (child.isMesh) {
                                if (Array.isArray(child.material)) {
                                    child.material.forEach((material) => {
                                        if (material.name === "AlbumCover") {
                                            material.map = texture; // Set the new texture
                                            material.needsUpdate = true; // Ensure the material updates
                                        }
                                    });
                                } else if (child.material.name === "AlbumCover") {
                                    child.material.map = texture; 
                                    child.material.needsUpdate = true; 
                                }
                            }
                        });
                    }
                },
                undefined,
                function (err) {
                    console.error('Error loading album cover texture:', err);
                }
            );
        } else {
            songInfoDiv.innerHTML = `<p>${data.song}</p>`;
        }
    } catch (error) {
        console.error('Error fetching the current song:', error);
    }
}

// Fetch the current song immediately and then every 30 seconds
setInterval(fetchCurrentSong, 30000);

addEventListener("DOMContentLoaded", fetchCurrentSong);

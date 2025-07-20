// A C C E S S I N G   T H R E E. J S   G L O B A L S
// The THREE object is globally available because we imported it via a <script> tag in index.html

// =================================================================================================
// S C E N E   S E T U P
// =================================================================================================

// The Scene is the container for all 3D objects
const scene = new THREE.Scene();

// The Camera determines what we see. PerspectiveCamera is like the human eye.
// Arguments: Field of View (fov), Aspect Ratio, Near Clipping Plane, Far Clipping Plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 120); // Position the camera to get a good view

// The Renderer draws the scene onto the canvas
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), // Use the canvas from our HTML
  antialias: true // Smooths out the edges of objects
});
renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer size to full window
renderer.setPixelRatio(window.devicePixelRatio); // Use device's pixel ratio for crispness

// =================================================================================================
// L I G H T I N G
// =================================================================================================

// A PointLight acts like a light bulb, emitting light from a single point.
// We place it at the center to simulate the Sun's light.
const pointLight = new THREE.PointLight(0xffffff, 2, 300); // Color, Intensity, Distance
scene.add(pointLight);

// An AmbientLight illuminates all objects in the scene equally.
// This prevents the dark sides of planets from being completely black.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// =================================================================================================
// C A M E R A   C O N T R O L S
// =================================================================================================

// OrbitControls allow the user to orbit the camera around a target.
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Makes the movement feel smoother

// =================================================================================================
// H E L P E R S
// =================================================================================================

// A helper function to create planets, reducing code repetition.
function createPlanet(size, color, orbitRadius) {
    // Geometry is the shape of the object (a sphere in this case)
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    // Material is the "skin" of the object. MeshStandardMaterial reacts to light.
    const material = new THREE.MeshStandardMaterial({ color: color });
    const planet = new THREE.Mesh(geometry, material);

    // To make orbits simple, we create a pivot point (an empty Object3D) at the center.
    // The planet is added to this pivot. When we rotate the pivot, the planet orbits.
    const pivot = new THREE.Object3D();
    pivot.add(planet);
    scene.add(pivot);

    // Position the planet at its orbit radius from the center
    planet.position.x = orbitRadius;

    return { mesh: planet, pivot: pivot, orbitRadius: orbitRadius };
}

// =================================================================================================
// C R E A T I N G   T H E   C E L E S T I A L   B O D I E S
// =================================================================================================

// The Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
// MeshBasicMaterial is not affected by lights, so it appears to glow.
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet Data: [size, color, orbitRadius]
const planetData = [
    { name: 'Mercury', size: 1.5, color: 0xaaaaaa, orbitRadius: 20 },
    { name: 'Venus', size: 2.5, color: 0xffa500, orbitRadius: 35 },
    { name: 'Earth', size: 2.8, color: 0x0000ff, orbitRadius: 50 },
    { name: 'Mars', size: 2, color: 0xff4500, orbitRadius: 65 },
    { name: 'Jupiter', size: 6, color: 0xd2b48c, orbitRadius: 90 },
    { name: 'Saturn', size: 5, color: 0xf0e68c, orbitRadius: 120 },
    { name: 'Uranus', size: 4, color: 0xadd8e6, orbitRadius: 150 },
    { name: 'Neptune', size: 3.8, color: 0x00008b, orbitRadius: 180 },
];

// Create planets and store them in an array
const planets = planetData.map(data => ({
    ...data,
    ...createPlanet(data.size, data.color, data.orbitRadius),
    speed: 1.0 // Default speed multiplier
}));

// Saturn's Rings
const ringGeometry = new THREE.RingGeometry(7, 10, 32);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = -0.5 * Math.PI; // Rotate the ring to be horizontal
planets.find(p => p.name === 'Saturn').mesh.add(ring); // Add rings to Saturn's mesh

// Background Stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// =================================================================================================
// U I   C O N T R O L S
// =================================================================================================

const controlsContainer = document.getElementById('controls-container');
let isPaused = false;

// Create a slider for each planet
planets.forEach(planet => {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';

    const label = document.createElement('label');
    label.htmlFor = `${planet.name}-speed`;
    label.textContent = planet.name;
    
    const speedDisplay = document.createElement('span');
    speedDisplay.id = `${planet.name}-speed-value`;
    speedDisplay.textContent = `${planet.speed.toFixed(1)}x`;
    label.appendChild(speedDisplay);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `${planet.name}-speed`;
    slider.min = 0;
    slider.max = 5;
    slider.value = planet.speed;
    slider.step = 0.1;

    // Event listener to update speed when the slider is moved
    slider.addEventListener('input', (event) => {
        planet.speed = parseFloat(event.target.value);
        speedDisplay.textContent = `${planet.speed.toFixed(1)}x`;
    });

    controlGroup.appendChild(label);
    controlGroup.appendChild(slider);
    controlsContainer.appendChild(controlGroup);
});

// Pause/Resume Button
const pauseButton = document.createElement('button');
pauseButton.id = 'pause-button';
pauseButton.textContent = 'Pause Animation';
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume Animation' : 'Pause Animation';
});
controlsContainer.prepend(pauseButton); // Add button at the top of controls

// =================================================================================================
// A N I M A T I O N   L O O P
// =================================================================================================

// A clock to make animation frame-rate independent
const clock = new THREE.Clock();

function animate() {
    // This creates a loop that calls the animate function on every frame
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Animate planets only if not paused
    if (!isPaused) {
        // Self-rotation for the Sun
        sun.rotation.y += 0.001;

        // Animate each planet's orbit and self-rotation
        planets.forEach(planet => {
            // Orbit: Rotate the pivot point
            // The speed is proportional to 1 / orbitRadius to be somewhat realistic (Kepler's laws)
            planet.pivot.rotation.y += (0.5 / planet.orbitRadius) * planet.speed * 0.5;

            // Self-rotation: Rotate the planet's mesh itself
            planet.mesh.rotation.y += 0.005 * planet.speed;
        });
    }

    // Update camera controls
    controls.update();

    // Render the scene from the camera's perspective
    renderer.render(scene, camera);
}

// =================================================================================================
// W I N D O W   R E S I Z E   H A N D L I N G
// =================================================================================================

window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// =================================================================================================
// R E S P O N S I V E  U I  H A N D L I N G (Corrected)
// =================================================================================================

const mobileToggleButton = document.getElementById('mobile-controls-toggle');
// Re-selecting the container to be safe, as it was declared in a higher scope.
const uiControlsContainer = document.getElementById('controls-container'); 

// This function sets up the UI based on the current screen size
function setupResponsiveLayout() {
    if (window.innerWidth <= 600) {
        // --- Mobile View ---
        mobileToggleButton.style.display = 'block'; // Show the button
        uiControlsContainer.style.display = 'none';   // Hide the controls
        mobileToggleButton.textContent = 'Show Controls';
    } else {
        // --- Desktop View ---
        mobileToggleButton.style.display = 'none';  // Hide the button
        uiControlsContainer.style.display = 'flex';   // Show the controls
    }
}

// Add click listener for the toggle button
mobileToggleButton.addEventListener('click', () => {
    // Simple toggle based on the current display style
    const isHidden = uiControlsContainer.style.display === 'none';
    if (isHidden) {
        uiControlsContainer.style.display = 'flex';
        mobileToggleButton.textContent = 'Hide Controls';
    } else {
        uiControlsContainer.style.display = 'none';
        mobileToggleButton.textContent = 'Show Controls';
    }
});

// Add an event listener to adjust the layout when the window is resized
window.addEventListener('resize', setupResponsiveLayout);

// Set the initial layout as soon as the script runs
setupResponsiveLayout();

// Start the animation loop (only call this ONCE)
animate();
// Start the animation loop
animate();

# Solar-System-Simulation
🌌 A 3D Solar System Simulation using Three.js. Features real-time orbit and rotation of planets around the sun, adjustable speeds, pause/resume controls, and fully responsive design. Built with HTML, CSS, and JavaScript. Great for visualizing planetary motion in a browser. No installation needed — just open and explore!
3D Solar System Simulation
This project is a front-end assignment to create a mobile-responsive 3D simulation of the solar system using Three.js and plain JavaScript.

Features
3D Solar System: Renders the Sun and all 8 planets (Mercury to Neptune) in a 3D space.

Orbital Animation: All planets orbit the Sun at a default speed.

Real-time Speed Control: A UI panel with sliders allows the user to adjust the orbital speed of each planet individually.

Camera Controls: Users can drag to orbit the camera around the scene and scroll to zoom in and out.

Pause/Resume: A button to pause and resume the entire animation.

Responsive Design: The scene and UI controls adapt to different screen sizes, including mobile devices.

Bonus: Includes a starfield background and rings for Saturn.

How to Run
No special installation is required. Simply open the index.html file in any modern web browser (like Chrome, Firefox, or Edge).

Project Structure
index.html: The main HTML file that contains the structure of the page, including the <canvas> for the 3D scene and the container for UI controls. It imports the necessary scripts.

style.css: Contains all the styling for the page, the canvas, and the control panel. It uses Flexbox for layout and is designed to be responsive.

main.js: The core of the project. This file contains all the JavaScript logic for:

Scene Setup: Initializes the Three.js scene, camera, and renderer.

Lighting: Sets up a PointLight at the center (the Sun) and an AmbientLight to illuminate the entire scene.

Object Creation: Creates the Sun, planets, Saturn's rings, and the starfield background using SphereGeometry, RingGeometry, and various materials.

Orbit Mechanics: A key concept here is the use of an Object3D as a "pivot" for each planet. The planet mesh is added as a child to this pivot. To create the orbit, we simply rotate the pivot object, which is much simpler than calculating the planet's position manually on each frame.

Animation Loop: Uses requestAnimationFrame and THREE.Clock to create a smooth, continuous animation loop that updates the rotation of the planets and renders the scene on each frame.

UI Controls: Dynamically creates the sliders and buttons, and adds event listeners to them. When a slider's value changes, it updates a speed property on the corresponding planet object, which the animation loop then uses to calculate the new orbital speed.

Key Concepts for Demo Video Explanation
How Planets Were Created: "I used Three.js's SphereGeometry to create the shape for each planet and the Sun. I applied different MeshStandardMaterials with unique colors to make them distinct. The Sun uses a MeshBasicMaterial so it appears to glow and isn't affected by scene lighting."

How Orbits Were Created: "To create the orbits, I used a pivot-based system. For each planet, I created an invisible Object3D at the center of the scene. The planet's mesh was then added as a child to this pivot and moved outwards by its orbit radius. In the animation loop, I simply rotate the pivot on its Y-axis. This makes the planet attached to it move in a perfect circle, creating a smooth and simple orbit."

How Speed Control Works: "The speed controls are dynamically generated in JavaScript. Each slider has an 'input' event listener. When you move a slider, the listener fires a function that updates a 'speed' variable stored on that specific planet's JavaScript object. The main animation loop reads this speed variable on every single frame to calculate how much the planet's pivot should rotate. This is why the speed change appears to be instant."

/**
 * 3D Eyeball using Three.js
 * A sphere with an iris (separate geometry) on its surface
 */

document.addEventListener('DOMContentLoaded', () => {
    initEyeball();
});

function initEyeball() {
    const container = document.getElementById('eyeball-container');
    if (!container) return;

    const size = 160;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Eyeball group (so iris rotates with eyeball)
    const eyeGroup = new THREE.Group();
    scene.add(eyeGroup);

    // Eyeball sphere (white)
    const eyeGeometry = new THREE.SphereGeometry(1, 64, 64);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        roughness: 0.3,
        metalness: 0.0
    });
    const eyeball = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeGroup.add(eyeball);

    // Iris - a flat circle positioned on the surface of the eyeball
    const irisGeometry = new THREE.CircleGeometry(0.35, 64);
    const irisMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.5,
        metalness: 0.0
    });
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);

    // Position iris on the front surface of the eyeball
    // Slightly in front to avoid z-fighting
    iris.position.z = 1.01;
    eyeGroup.add(iris);

    // Pupil - smaller black circle on top of iris
    const pupilGeometry = new THREE.CircleGeometry(0.15, 64);
    const pupilMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.3,
        metalness: 0.0
    });
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.z = 1.02;
    eyeGroup.add(pupil);

    // Highlight - tiny white circle
    const highlightGeometry = new THREE.CircleGeometry(0.04, 32);
    const highlightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    highlight.position.set(-0.06, 0.06, 1.03);
    eyeGroup.add(highlight);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 3);
    scene.add(directionalLight);

    // Rotation state
    const rotationStep = Math.PI / 12;

    // Keyboard controls - rotate the whole group
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                eyeGroup.rotation.y -= rotationStep;
                break;
            case 'ArrowRight':
                eyeGroup.rotation.y += rotationStep;
                break;
            case 'ArrowUp':
                eyeGroup.rotation.x -= rotationStep;
                break;
            case 'ArrowDown':
                eyeGroup.rotation.x += rotationStep;
                break;
            default:
                return;
        }
        e.preventDefault();
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}

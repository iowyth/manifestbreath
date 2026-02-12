/**
 * 3D Eyeball using Three.js
 * A sphere with a curved iris (spherical cap) on its surface
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

    // Iris - a spherical cap that follows the eyeball's curve
    // SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    // thetaStart/thetaLength control the vertical arc (from top)
    // We want a small cap at the "front" (which we'll rotate into position)
    const irisRadius = 1.005; // Slightly larger than eyeball to sit on surface
    const irisAngle = 0.35; // How much of the sphere the iris covers (radians)

    const irisGeometry = new THREE.SphereGeometry(
        irisRadius,
        32, 32,
        0, Math.PI * 2,  // full rotation around
        0, irisAngle     // cap from top down to irisAngle
    );
    const irisMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.5,
        metalness: 0.0,
        side: THREE.DoubleSide
    });
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);
    // Rotate so the cap faces forward (+Z) instead of up (+Y)
    iris.rotation.x = Math.PI / 2;
    eyeGroup.add(iris);

    // Pupil - smaller spherical cap
    const pupilRadius = 1.01;
    const pupilAngle = 0.15;

    const pupilGeometry = new THREE.SphereGeometry(
        pupilRadius,
        32, 32,
        0, Math.PI * 2,
        0, pupilAngle
    );
    const pupilMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.3,
        metalness: 0.0,
        side: THREE.DoubleSide
    });
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.rotation.x = Math.PI / 2;
    eyeGroup.add(pupil);

    // Highlight - tiny spherical cap
    const highlightGeometry = new THREE.SphereGeometry(
        1.015,
        16, 16,
        0, Math.PI * 2,
        0, 0.04
    );
    const highlightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    // Position highlight off-center
    highlight.rotation.x = Math.PI / 2;
    highlight.rotation.z = 0.15;
    highlight.rotation.y = -0.15;
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

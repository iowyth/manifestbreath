/**
 * 3D Eyeball using Three.js
 * A sphere with an iris texture that rotates with arrow keys
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

    // Create eyeball texture with canvas
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 512;
    const ctx = textureCanvas.getContext('2d');

    // Draw eyeball texture: white with iris
    // Fill white
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, 512, 512);

    // Draw iris in the center of the texture
    // When mapped to sphere, center of texture = "front" of sphere
    const irisX = 256;
    const irisY = 256;
    const irisRadius = 100;

    // Iris gradient
    const irisGradient = ctx.createRadialGradient(
        irisX - 20, irisY - 20, 0,
        irisX, irisY, irisRadius
    );
    irisGradient.addColorStop(0, '#333');
    irisGradient.addColorStop(0.6, '#1a1a1a');
    irisGradient.addColorStop(1, '#000');

    ctx.beginPath();
    ctx.arc(irisX, irisY, irisRadius, 0, Math.PI * 2);
    ctx.fillStyle = irisGradient;
    ctx.fill();

    // Pupil
    ctx.beginPath();
    ctx.arc(irisX, irisY, irisRadius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();

    // Small highlight on pupil
    ctx.beginPath();
    ctx.arc(irisX - 15, irisY - 15, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(textureCanvas);

    // Sphere geometry and material
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.0
    });

    const eyeball = new THREE.Mesh(geometry, material);
    scene.add(eyeball);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 3);
    scene.add(directionalLight);

    // Rotation state
    const rotationStep = Math.PI / 12;

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                eyeball.rotation.y -= rotationStep;
                break;
            case 'ArrowRight':
                eyeball.rotation.y += rotationStep;
                break;
            case 'ArrowUp':
                eyeball.rotation.x -= rotationStep;
                break;
            case 'ArrowDown':
                eyeball.rotation.x += rotationStep;
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

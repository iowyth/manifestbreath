/**
 * Manifest Breath
 * 3D Eyeball navigation with shuffled content pages
 *
 * Content is defined in content.js - edit that file to add/modify pages
 */

document.addEventListener('DOMContentLoaded', () => {
    initWaveBackground();
    initEmailProtection();
    initEyeball();
    initContentNavigation();
});

/**
 * Animated wave background
 */
function initWaveBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'wave-bg';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Wave parameters
    const waves = [
        { y: 0.5, amplitude: 30, frequency: 0.015, speed: 0.02, color: 'rgba(180, 160, 200, 0.15)' },
        { y: 0.55, amplitude: 25, frequency: 0.02, speed: 0.015, color: 'rgba(160, 140, 180, 0.12)' },
        { y: 0.6, amplitude: 20, frequency: 0.025, speed: 0.025, color: 'rgba(200, 180, 220, 0.1)' }
    ];

    let time = 0;

    function draw() {
        ctx.clearRect(0, 0, width, height);

        waves.forEach(wave => {
            ctx.beginPath();
            ctx.moveTo(0, height);

            for (let x = 0; x <= width; x += 5) {
                const y = height * wave.y +
                    Math.sin(x * wave.frequency + time * wave.speed * 60) * wave.amplitude +
                    Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 30) * wave.amplitude * 0.5;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fillStyle = wave.color;
            ctx.fill();
        });

        time += 0.016;
        requestAnimationFrame(draw);
    }

    draw();
}

/**
 * Protect email from bots
 */
function initEmailProtection() {
    const link = document.getElementById('contact-link');
    if (!link) return;

    const user = link.dataset.user;
    const domain = link.dataset.domain;
    if (user && domain) {
        link.href = 'mailto:' + user + '@' + domain;
    }
}

/**
 * Generate HTML content for a page based on its type
 */
function generatePageContent(page) {
    switch (page.type) {
        case 'intro':
            return `<h1>${page.title}</h1>${page.content}`;

        case 'publication':
            return `
                <h1>${page.title}</h1>
                <p class="venue">${page.venue}</p>
                <p class="year">${page.year}</p>
                <p>${page.description}</p>
                <a href="${page.link}" target="_blank" rel="noopener noreferrer" class="read-link">Read →</a>
            `;

        case 'image':
            return `
                <img src="${page.src}" alt="${page.title}">
                <h2>${page.title}</h2>
                <p class="caption">${page.caption || ''}</p>
            `;

        case 'video':
            return `
                <div class="video-embed">
                    <iframe src="${page.embedUrl}" allowfullscreen></iframe>
                </div>
                <h2>${page.title}</h2>
                <p>${page.description || ''}</p>
            `;

        case 'code':
            const tags = (page.tech || []).map(t => `<span class="tech-tag">${t}</span>`).join('');
            return `
                <h1>${page.title}</h1>
                <div class="tech-stack">${tags}</div>
                <p>${page.description}</p>
                <a href="${page.repo}" target="_blank" rel="noopener noreferrer" class="repo-link">View Repository →</a>
            `;

        case 'text':
        default:
            return `<h1>${page.title}</h1>${page.content}`;
    }
}

/**
 * Render a page with slide animation
 * @param {Object} page - The page data
 * @param {string} direction - 'left', 'right', 'up', 'down' or null
 * @param {Function} onComplete - Callback when animation finishes
 */
function renderPage(page, direction = null, onComplete = null) {
    const card = document.getElementById('content-card');
    if (!card) return;

    const content = generatePageContent(page);

    // No animation for initial load
    if (!direction) {
        const panel = document.createElement('div');
        panel.className = `card-panel ${page.type}`;
        panel.innerHTML = content;
        card.innerHTML = '';
        card.appendChild(panel);
        if (onComplete) onComplete();
        return;
    }

    // Get the old panel
    const oldPanel = card.querySelector('.card-panel');

    // Create new panel
    const newPanel = document.createElement('div');
    newPanel.className = `card-panel ${page.type} incoming`;
    newPanel.innerHTML = content;

    // Direction mappings
    const inFrom = { left: 'from-left', right: 'from-right', up: 'from-top', down: 'from-bottom' };
    const outTo = { left: 'to-right', right: 'to-left', up: 'to-bottom', down: 'to-top' };

    // Animate old panel out
    if (oldPanel) {
        oldPanel.classList.add('outgoing', outTo[direction]);
        oldPanel.addEventListener('animationend', () => {
            oldPanel.remove();
        }, { once: true });
    }

    // Add new panel and animate in
    newPanel.classList.add(inFrom[direction]);
    card.appendChild(newPanel);

    // Clean up incoming class after animation and signal completion
    newPanel.addEventListener('animationend', () => {
        newPanel.classList.remove('incoming', inFrom[direction]);
        if (onComplete) onComplete();
    }, { once: true });
}

/**
 * Content navigation with shuffle
 */
function initContentNavigation() {
    // Find intro page index
    const introIndex = pages.findIndex(p => p.type === 'intro');

    // Create indices excluding intro, then shuffle (Fisher-Yates)
    const otherIndices = pages.map((_, i) => i).filter(i => i !== introIndex);
    for (let i = otherIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherIndices[i], otherIndices[j]] = [otherIndices[j], otherIndices[i]];
    }

    // Intro first, then shuffled others
    const indices = introIndex !== -1 ? [introIndex, ...otherIndices] : otherIndices;

    let position = 0;
    let isAnimating = false;

    // Show first page (no animation)
    renderPage(pages[indices[position]], null);

    // Expose navigation for eyeball to use
    // direction: 'left', 'right', 'up', 'down'
    window.navigateContent = (direction) => {
        // Ignore input during animation
        if (isAnimating) return false;

        isAnimating = true;

        const forward = (direction === 'right' || direction === 'down');

        if (forward) {
            position = (position + 1) % indices.length;
        } else {
            position = (position - 1 + indices.length) % indices.length;
        }
        renderPage(pages[indices[position]], direction, () => {
            isAnimating = false;
        });

        return true;
    };
}

/**
 * 3D Eyeball using Three.js
 */
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

    // Eyeball group
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

    // Iris - spherical cap
    const irisRadius = 1.005;
    const irisAngle = 0.35;
    const irisGeometry = new THREE.SphereGeometry(
        irisRadius, 32, 32,
        0, Math.PI * 2,
        0, irisAngle
    );
    const irisMaterial = new THREE.MeshStandardMaterial({
        color: 0x9B7EBD,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide
    });
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);
    iris.rotation.x = Math.PI / 2;
    eyeGroup.add(iris);

    // Pupil - smaller spherical cap
    const pupilGeometry = new THREE.SphereGeometry(
        1.01, 32, 32,
        0, Math.PI * 2,
        0, 0.15
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 3);
    scene.add(directionalLight);

    // Smooth rotation with realistic eye limits
    const rotationStep = Math.PI / 12; // 15 degrees per step (smooth movement)
    const maxRotation = 1.3;  // ~75 degrees - where iris disappears (back is one zone)
    let targetRotationX = 0;
    let targetRotationY = 0;
    const lerpFactor = 0.1; // Smoothing factor (0-1, lower = smoother)

    // Clamp rotation to limits
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        let direction = null;

        switch (e.key) {
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
        }

        if (direction) {
            e.preventDefault();
            // Only rotate eye if navigation succeeded (not blocked by animation)
            if (window.navigateContent(direction)) {
                if (direction === 'left') targetRotationY -= rotationStep;
                if (direction === 'right') targetRotationY += rotationStep;
                if (direction === 'up') targetRotationX -= rotationStep;
                if (direction === 'down') targetRotationX += rotationStep;

                // Clamp to eye limits - back of eye is one position
                targetRotationX = clamp(targetRotationX, -maxRotation, maxRotation);
                targetRotationY = clamp(targetRotationY, -maxRotation, maxRotation);
            }
        }
    });

    // Animation loop with smooth rotation
    function animate() {
        requestAnimationFrame(animate);

        // Lerp toward target rotation
        eyeGroup.rotation.x += (targetRotationX - eyeGroup.rotation.x) * lerpFactor;
        eyeGroup.rotation.y += (targetRotationY - eyeGroup.rotation.y) * lerpFactor;

        renderer.render(scene, camera);
    }

    animate();
}

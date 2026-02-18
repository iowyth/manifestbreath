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

        case 'interactive':
            return `<div class="interactive-container" data-interactive="${page.interactive}"></div>`;

        case 'text':
        default:
            return `<h1>${page.title}</h1>${page.content}`;
    }
}

/**
 * Initialize interactive content within a panel
 */
function initInteractives(panel) {
    const containers = panel.querySelectorAll('.interactive-container');
    containers.forEach(container => {
        const type = container.dataset.interactive;
        if (type === 'mobius-attractor') {
            initMobiusAttractor(container);
        }
    });
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
        initInteractives(panel);
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
    initInteractives(newPanel);

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
 * 3D Eyeball using Three.js with quaternion slerp
 *
 * The back of the eyeball is ONE position. Uses quaternion slerp for
 * smooth rotation that can be directed through the back (long way).
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

    // Position system: -3 to +3 for front, "back" is one position
    const maxPos = 3;
    const stepAngle = 0.35;
    const edgeAngle = maxPos * stepAngle; // 1.05 rad

    // Track cumulative rotation - don't normalize, let it wind up
    let currentY = 0;
    let currentX = 0;
    let targetY = 0;
    let targetX = 0;

    // Track which "lap" we're on (increments each full rotation)
    let lapY = 0;
    let lapX = 0;

    // Position tracking: -3 to +3 for front, "back" as separate state
    let positionY = 0;
    let positionX = 0;
    let atBackY = false;
    let atBackX = false;
    let enteredBackFromY = 0; // +1 or -1
    let enteredBackFromX = 0;

    const slerpFactor = 0.12;

    // Calculate absolute target rotation for a given position and lap
    function calcTarget(position, lap, atBack, enteredFrom) {
        const base = lap * 2 * Math.PI;
        if (atBack) {
            // Back is at π (or -π depending on entry direction)
            return base + (enteredFrom > 0 ? Math.PI : -Math.PI);
        }
        return base + position * stepAngle;
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        let direction = null;

        switch (e.key) {
            case 'ArrowLeft': direction = 'left'; break;
            case 'ArrowRight': direction = 'right'; break;
            case 'ArrowUp': direction = 'up'; break;
            case 'ArrowDown': direction = 'down'; break;
        }

        if (direction) {
            e.preventDefault();
            if (window.navigateContent(direction)) {
                // Handle Y axis (left/right)
                if (direction === 'left' || direction === 'right') {
                    const delta = direction === 'right' ? 1 : -1;

                    if (atBackY) {
                        // Currently at back
                        if (delta === enteredBackFromY) {
                            // Continue through - exit to opposite side, advance lap
                            lapY += delta;
                            positionY = -enteredBackFromY * maxPos;
                            atBackY = false;
                        } else {
                            // Go back the way we came
                            positionY = enteredBackFromY * maxPos;
                            atBackY = false;
                        }
                    } else {
                        // At front
                        positionY += delta;
                        if (Math.abs(positionY) > maxPos) {
                            // Entering back
                            atBackY = true;
                            enteredBackFromY = delta;
                            positionY = 0; // doesn't matter when at back
                        }
                    }

                    targetY = calcTarget(positionY, lapY, atBackY, enteredBackFromY);
                }

                // Handle X axis (up/down) - same logic
                if (direction === 'up' || direction === 'down') {
                    const delta = direction === 'down' ? 1 : -1;

                    if (atBackX) {
                        if (delta === enteredBackFromX) {
                            lapX += delta;
                            positionX = -enteredBackFromX * maxPos;
                            atBackX = false;
                        } else {
                            positionX = enteredBackFromX * maxPos;
                            atBackX = false;
                        }
                    } else {
                        positionX += delta;
                        if (Math.abs(positionX) > maxPos) {
                            atBackX = true;
                            enteredBackFromX = delta;
                            positionX = 0;
                        }
                    }

                    targetX = calcTarget(positionX, lapX, atBackX, enteredBackFromX);
                }
            }
        }
    });

    // Animation loop using quaternion slerp
    function animate() {
        requestAnimationFrame(animate);

        // Smooth interpolation toward target
        currentY += (targetY - currentY) * slerpFactor;
        currentX += (targetX - currentX) * slerpFactor;

        // Apply rotation via quaternion
        const quatY = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), currentY
        );
        const quatX = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0), currentX
        );

        eyeGroup.quaternion.copy(quatX.multiply(quatY));

        renderer.render(scene, camera);
    }

    animate();
}

/**
 * Möbius-Klein Attractor
 * Ported from sorce site
 */
function initMobiusAttractor(container) {
    const width = container.clientWidth || 280;
    const height = 200;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Parameters
    const numTracers = 200;
    const trailLength = 50;
    const R = 2.0;
    const r = 0.7;

    // Pre-compute u and v arrays
    const uArr = new Float32Array(numTracers);
    const vArr = new Float32Array(numTracers);
    for (let i = 0; i < numTracers; i++) {
        uArr[i] = (i / (numTracers - 1)) * 2 * Math.PI;
        vArr[i] = (i / (numTracers - 1)) * 2 * Math.PI;
    }

    // Trail buffers
    const trailX = [], trailY = [], trailZ = [];
    for (let t = 0; t < trailLength; t++) {
        trailX.push(new Float32Array(numTracers));
        trailY.push(new Float32Array(numTracers));
        trailZ.push(new Float32Array(numTracers));
    }

    // Dynamic time scaling
    let globalEffectiveT = 0;
    const baseDt = 0.25;
    const alphaSpeed = 0.1;
    const betaDt = 0.3;
    let prevDt = baseDt;
    let prevPoints = new Float32Array(numTracers * 3);
    let globalQPrev = [0, 0, 0, 1];

    // Quaternion helpers
    function normalizeQuat(q) {
        const len = Math.sqrt(q[0]*q[0] + q[1]*q[1] + q[2]*q[2] + q[3]*q[3]);
        return [q[0]/len, q[1]/len, q[2]/len, q[3]/len];
    }

    function slerpQuat(qa, qb, t) {
        let dot = qa[0]*qb[0] + qa[1]*qb[1] + qa[2]*qb[2] + qa[3]*qb[3];
        if (dot < 0) { qb = [-qb[0], -qb[1], -qb[2], -qb[3]]; dot = -dot; }
        if (dot > 0.9995) {
            return normalizeQuat([qa[0]+t*(qb[0]-qa[0]), qa[1]+t*(qb[1]-qa[1]), qa[2]+t*(qb[2]-qa[2]), qa[3]+t*(qb[3]-qa[3])]);
        }
        const theta0 = Math.acos(dot), theta = theta0 * t;
        const sinTheta = Math.sin(theta), sinTheta0 = Math.sin(theta0);
        const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0, s1 = sinTheta / sinTheta0;
        return [s0*qa[0]+s1*qb[0], s0*qa[1]+s1*qb[1], s0*qa[2]+s1*qb[2], s0*qa[3]+s1*qb[3]];
    }

    function applyQuat(q, x, y, z) {
        const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
        const ix = qw*x + qy*z - qz*y, iy = qw*y + qz*x - qx*z;
        const iz = qw*z + qx*y - qy*x, iw = -qx*x - qy*y - qz*z;
        return [ix*qw + iw*(-qx) + iy*(-qz) - iz*(-qy), iy*qw + iw*(-qy) + iz*(-qx) - ix*(-qz), iz*qw + iw*(-qz) + ix*(-qy) - iy*(-qx)];
    }

    function mobiusKleinAttractor(t, quat, outX, outY, outZ) {
        const plasmaT1 = Math.sin(t * 0.02), plasmaT2 = Math.cos(t * 0.02);
        for (let i = 0; i < numTracers; i++) {
            const u = uArr[i], v = vArr[i];
            const kleinFactor = Math.cos(u) * Math.sin(v);
            const mobiusFactor = Math.sin(u/2 + v/2) * kleinFactor;
            let x = (R + r * kleinFactor + plasmaT1 * 0.5) * Math.cos(u);
            let y = (R + r * kleinFactor + plasmaT1 * 0.5) * Math.sin(u);
            let z = (r * Math.sin(u/2) + plasmaT2 * 0.3) * Math.cos(v);
            const phi = Math.sin(v * 4 + plasmaT1 * 0.7) * mobiusFactor;
            const theta = Math.cos(u * 3 + plasmaT2 * 0.3) * mobiusFactor;
            const omega = Math.sin(v * 2 + plasmaT1 * 0.5) * mobiusFactor;
            const fastScale = 0.3;
            let bx = x + Math.sin(t * 0.1 + phi) * fastScale;
            let by = y + Math.cos(t * 0.1 + theta) * fastScale;
            let bz = z + Math.sin(t * 0.1 + omega) * fastScale;
            const rotated = applyQuat(quat, bx, by, bz);
            outX[i] = rotated[0]; outY[i] = rotated[1]; outZ[i] = rotated[2];
        }
    }

    // Initialize
    const tempX = new Float32Array(numTracers), tempY = new Float32Array(numTracers), tempZ = new Float32Array(numTracers);
    mobiusKleinAttractor(0, [0,0,0,1], tempX, tempY, tempZ);
    for (let t = 0; t < trailLength; t++) {
        for (let i = 0; i < numTracers; i++) {
            trailX[t][i] = tempX[i]; trailY[t][i] = tempY[i]; trailZ[t][i] = tempZ[i];
        }
    }
    for (let i = 0; i < numTracers; i++) {
        prevPoints[i*3] = tempX[i]; prevPoints[i*3+1] = tempY[i]; prevPoints[i*3+2] = tempZ[i];
    }

    // Geometry
    const totalPoints = trailLength * numTracers;
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05, vertexColors: true, transparent: true, opacity: 0.9,
        sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frame = 0;

    function siteColormap(t) {
        let r, g, b;
        if (t < 0.5) {
            const s = t * 2;
            r = 0.867*(1-s) + 0.016*s; g = 0.812*(1-s) + 0.051*s; b = 1.0*(1-s) + 0.882*s;
        } else {
            const s = (t - 0.5) * 2;
            r = 0.016*(1-s) + 0.227*s; g = 0.051*(1-s) + 0.157*s; b = 0.882*(1-s) + 0.459*s;
        }
        return [r, g, b];
    }

    function update() {
        frame++;
        const qCandidate = normalizeQuat([Math.sin(frame*0.01), Math.cos(frame*0.01), Math.sin(frame*0.005), 1]);
        const qInterp = slerpQuat(globalQPrev, qCandidate, 0.2);
        globalQPrev = qInterp;

        mobiusKleinAttractor(globalEffectiveT, qInterp, tempX, tempY, tempZ);

        let totalDisp = 0;
        for (let i = 0; i < numTracers; i++) {
            const dx = tempX[i] - prevPoints[i*3], dy = tempY[i] - prevPoints[i*3+1], dz = tempZ[i] - prevPoints[i*3+2];
            totalDisp += Math.sqrt(dx*dx + dy*dy + dz*dz);
        }
        const avgSpeed = totalDisp / numTracers;
        const newDt = baseDt / (1 + alphaSpeed * avgSpeed);
        const dt = (1 - betaDt) * prevDt + betaDt * newDt;
        prevDt = dt;
        globalEffectiveT += dt;

        for (let i = 0; i < numTracers; i++) {
            prevPoints[i*3] = tempX[i]; prevPoints[i*3+1] = tempY[i]; prevPoints[i*3+2] = tempZ[i];
        }

        const oldX = trailX.shift(), oldY = trailY.shift(), oldZ = trailZ.shift();
        for (let i = 0; i < numTracers; i++) { oldX[i] = tempX[i]; oldY[i] = tempY[i]; oldZ[i] = tempZ[i]; }
        trailX.push(oldX); trailY.push(oldY); trailZ.push(oldZ);

        const posAttr = geometry.attributes.position, colAttr = geometry.attributes.color;
        let zMin = Infinity, zMax = -Infinity;
        for (let t = 0; t < trailLength; t++) {
            for (let i = 0; i < numTracers; i++) {
                const z = trailZ[t][i];
                if (z < zMin) zMin = z; if (z > zMax) zMax = z;
            }
        }
        const zRange = zMax - zMin + 0.001;

        let idx = 0;
        for (let t = 0; t < trailLength; t++) {
            const trailFade = 0.4 + 0.6 * ((t + 1) / trailLength);
            for (let i = 0; i < numTracers; i++) {
                posAttr.array[idx*3] = trailX[t][i]; posAttr.array[idx*3+1] = trailY[t][i]; posAttr.array[idx*3+2] = trailZ[t][i];
                const zNorm = (trailZ[t][i] - zMin) / zRange;
                const [r, g, b] = siteColormap(zNorm);
                colAttr.array[idx*3] = r * trailFade; colAttr.array[idx*3+1] = g * trailFade; colAttr.array[idx*3+2] = b * trailFade;
                idx++;
            }
        }
        posAttr.needsUpdate = true; colAttr.needsUpdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);
        update();
        renderer.render(scene, camera);
    }
    animate();
}

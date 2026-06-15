/**
 * Manifest Breath
 * 3D Eyeball navigation with grid content pages
 *
 * Content is defined in content.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Shared state for eyeball rotation targets
    let targetY = 0;
    let targetX = 0;
    let eyeballStateY = 0;
    let eyeballStateX = 0;

    initWaveBackground();
    initEmailProtection();
    initEyeball();
    initContentNavigation();

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

        const waves = [
            {
                y: 0.5,
                amplitude: 30,
                H1: 1.0, H2: 3.0, H3: 5.0,
                B: 0.3, S: 0.15, twist: 0.4,
                L: 12.0, speed: 0.5,
                color: 'rgba(180, 160, 200, 0.15)'
            },
            {
                y: 0.55,
                amplitude: 25,
                H1: 1.2, H2: 2.5, H3: 4.0,
                B: 0.25, S: 0.1, twist: -0.3,
                L: 10.0, speed: 0.4,
                color: 'rgba(160, 140, 180, 0.12)'
            },
            {
                y: 0.6,
                amplitude: 20,
                H1: 0.8, H2: 3.5, H3: 6.0,
                B: 0.35, S: 0.2, twist: 0.6,
                L: 15.0, speed: 0.6,
                color: 'rgba(200, 180, 220, 0.1)'
            }
        ];

        let time = 0;

        function draw() {
            ctx.clearRect(0, 0, width, height);

            waves.forEach(wave => {
                ctx.beginPath();
                ctx.moveTo(0, height);

                for (let x = 0; x <= width; x += 5) {
                    const u = x / width;
                    const xScale = u * wave.L;
                    
                    const t1 = xScale * wave.H1 + time * wave.speed;
                    const t2 = xScale * wave.H2 + time * wave.speed * 1.6;
                    const t3 = xScale * wave.H3 + time * wave.speed * 2.2;
                    const tz = xScale * wave.H2 + time * wave.speed * 0.8;
                    const tTwist = xScale * wave.twist + time * wave.speed * 0.5;

                    const yLocal = Math.sin(t1) + wave.B * Math.sin(t2) + wave.S * Math.sin(t3);
                    const zLocal = Math.sin(tz) + wave.S * Math.cos(t3);
                    const yTwisted = yLocal * Math.cos(tTwist) - zLocal * Math.sin(tTwist);
                    
                    const y = height * wave.y + yTwisted * wave.amplitude;
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
     * Protect email from bots (for static contact link in footer)
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
     * Helper to update dynamic contact links inside panels
     */
    function setupDynamicEmailProtection(panel) {
        const dynamicLink = panel.querySelector('#contact-link-dynamic');
        if (dynamicLink) {
            const user = dynamicLink.dataset.user;
            const domain = dynamicLink.dataset.domain;
            if (user && domain) {
                dynamicLink.href = 'mailto:' + user + '@' + domain;
            }
        }
    }

    /**
     * Generate HTML content for a page based on its type
     */
    function generatePageContent(page) {
        switch (page.type) {
            case 'intro':
                return `<h1>${page.title}</h1>${page.content}`;

            case 'column-title':
                return `
                    <div class="column-title-page">
                        <h1>${page.title}</h1>
                        <div class="nav-arrow-hint">↓ press down to browse</div>
                    </div>
                `;

            case 'publication':
                return `
                    <h1>${page.title}</h1>
                    <p class="venue">${page.venue}</p>
                    <p class="year">${page.year}</p>
                    <p>${page.description}</p>
                    <a href="${page.link}" target="_blank" rel="noopener noreferrer" class="read-link">${page.linkText || 'Read'} →</a>
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

            case 'audio':
                const isDirectAudio = page.embedUrl.includes('.mp3') || page.embedUrl.includes('traffic.libsyn.com');
                const playerElement = isDirectAudio
                    ? `<audio controls src="${page.embedUrl}" style="width:100%; margin-top:0.5rem;"></audio>`
                    : `<iframe src="${page.embedUrl}" width="100%" height="152" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
                return `
                    <div class="audio-embed ${isDirectAudio ? 'direct-audio' : ''}">
                        ${playerElement}
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
                return `<div class="interactive-container" data-interactive="${page.interactive}"></div>
                        <h2>${page.title}</h2>
                        <p>${page.description || ''}</p>`;

            case 'contact':
                return `
                    <div class="contact-page">
                        <h1>${page.title}</h1>
                        <p class="contact-intro">Feel free to reach out via email, subscribe to my Substack, or find me on social media.</p>
                        <div class="contact-links">
                            <a href="#" id="contact-link-dynamic" data-user="${page.emailUser}" data-domain="${page.emailDomain}" class="contact-btn">Email Me</a>
                            <a href="${page.substackUrl}" target="_blank" rel="noopener noreferrer" class="contact-btn">Substack</a>
                            <a href="${page.instagramUrl}" target="_blank" rel="noopener noreferrer" class="contact-btn">Instagram</a>
                            <a href="${page.blueskyUrl}" target="_blank" rel="noopener noreferrer" class="contact-btn">Bluesky</a>
                        </div>
                    </div>
                `;

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
     */
    function renderPage(page, direction = null, onComplete = null) {
        const card = document.getElementById('content-card');
        if (!card) return;

        // Clean up any stale panels from interrupted animations
        const panels = card.querySelectorAll('.card-panel');
        if (panels.length > 1) {
            for (let i = 0; i < panels.length - 1; i++) {
                panels[i].remove();
            }
        }

        const content = generatePageContent(page);

        // No animation for initial load
        if (!direction) {
            const panel = document.createElement('div');
            panel.className = `card-panel ${page.type}`;
            panel.innerHTML = content;
            card.innerHTML = '';
            card.appendChild(panel);
            initInteractives(panel);
            setupDynamicEmailProtection(panel);
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
        setupDynamicEmailProtection(newPanel);

        // Clean up incoming class after animation and signal completion
        newPanel.addEventListener('animationend', () => {
            newPanel.classList.remove('incoming', inFrom[direction]);
            if (onComplete) onComplete();
        }, { once: true });
    }

    /**
     * Grid Content Navigation
     */
    function initContentNavigation() {
        let currentCol = 2; // Center column (iowyth)
        let currentRow = 0; // Intro page
        let isAnimating = false;

        // Helper to parse column/row from hash
        function parseHash(hash) {
            if (!hash || hash === '#') {
                return { colId: 'iowyth', rowIdx: 0 };
            }
            const parts = hash.replace(/^#\/?/, '').split('/');
            const colId = parts[0];
            const rowIdx = parseInt(parts[1], 10) || 0;
            return { colId, rowIdx };
        }

        // Navigate based on URL hash (Single Source of Truth)
        function navigateToHash(hash) {
            const { colId, rowIdx } = parseHash(hash);
            let targetCol = grid.findIndex(g => g.id === colId);
            if (targetCol === -1) {
                targetCol = 2; // default to center column (iowyth)
            }
            const colLength = grid[targetCol].items.length;
            const targetRow = Math.max(0, Math.min(rowIdx, colLength - 1));

            // If it matches current state exactly, nothing to do
            if (targetCol === currentCol && targetRow === currentRow) {
                return;
            }

            isAnimating = true;

            const oldCol = currentCol;
            const oldRow = currentRow;

            // Determine direction of movement based on coordinate delta
            let direction = null;
            if (targetCol !== oldCol) {
                const diff = (targetCol - oldCol + 5) % 5;
                if (diff === 1) direction = 'right';
                else if (diff === 4) direction = 'left';
            } else if (targetRow !== oldRow) {
                const diff = (targetRow - oldRow + colLength) % colLength;
                if (diff === 1) direction = 'down';
                else if (diff === 4) direction = 'up';
            }

            currentCol = targetCol;
            currentRow = targetRow;

            // Update eyeball rotation Y (horizontal)
            if (oldCol !== currentCol) {
                let diffY;
                if (oldCol === 4 && currentCol === 0 && direction === 'right') {
                    diffY = 6;
                } else if (oldCol === 0 && currentCol === 4 && direction === 'left') {
                    diffY = -6;
                } else {
                    const currentYMod = ((eyeballStateY % 10) + 10) % 10;
                    const targetYMod = (currentCol - 2 + 10) % 10;
                    diffY = (targetYMod - currentYMod) % 10;
                    if (diffY > 5) diffY -= 10;
                    else if (diffY < -4) diffY += 10;
                }
                eyeballStateY += diffY;
                targetY = eyeballStateY * (Math.PI / 5);

                // Reset eyeball X (vertical rotation) when changing columns
                const currentStateX = ((eyeballStateX % 12) + 12) % 12;
                let diffX = (0 - currentStateX) % 12;
                if (diffX > 6) diffX -= 12;
                else if (diffX < -5) diffX += 12;
                eyeballStateX += diffX;
                targetX = eyeballStateX * (Math.PI / 6);
            } else if (oldRow !== currentRow) {
                // Update eyeball rotation X (vertical) within same column
                const currentXMod = ((eyeballStateX % 12) + 12) % 12;
                const targetXMod = (currentRow % 12 + 12) % 12;
                let diffX;
                if (oldRow === colLength - 1 && currentRow === 0 && direction === 'down') {
                    diffX = (12 - (colLength - 1));
                } else if (oldRow === 0 && currentRow === colLength - 1 && direction === 'up') {
                    diffX = -(12 - (colLength - 1));
                } else {
                    diffX = (targetXMod - currentXMod) % 12;
                    if (diffX > 6) diffX -= 12;
                    else if (diffX < -5) diffX += 12;
                }
                eyeballStateX += diffX;
                targetX = eyeballStateX * (Math.PI / 6);
            }

            renderPage(grid[currentCol].items[currentRow], direction, () => {
                isAnimating = false;
            });
        }

        // Initial Page Load Initialization
        const initialHash = window.location.hash;
        const { colId, rowIdx } = parseHash(initialHash);
        let targetCol = grid.findIndex(g => g.id === colId);
        if (targetCol === -1) targetCol = 2;
        const colLength = grid[targetCol].items.length;
        const targetRow = Math.max(0, Math.min(rowIdx, colLength - 1));

        currentCol = targetCol;
        currentRow = targetRow;

        // Sync eyeball orientation to initial state
        eyeballStateY = currentCol - 2;
        targetY = eyeballStateY * (Math.PI / 5);
        eyeballStateX = currentRow;
        targetX = eyeballStateX * (Math.PI / 6);

        renderPage(grid[currentCol].items[currentRow], null);

        // Keyboard navigation handler (updates hash instead of state)
        document.addEventListener('keydown', (e) => {
            let keyDirection = null;
            switch (e.key) {
                case 'ArrowLeft': keyDirection = 'left'; break;
                case 'ArrowRight': keyDirection = 'right'; break;
                case 'ArrowUp': keyDirection = 'up'; break;
                case 'ArrowDown': keyDirection = 'down'; break;
            }

            if (keyDirection) {
                e.preventDefault();
                if (isAnimating) return;

                let nextCol = currentCol;
                let nextRow = currentRow;

                if (keyDirection === 'left' || keyDirection === 'right') {
                    const delta = keyDirection === 'right' ? 1 : -1;
                    nextCol = (currentCol + delta + 5) % 5;
                    nextRow = 0;
                } else if (keyDirection === 'up' || keyDirection === 'down') {
                    const delta = keyDirection === 'down' ? 1 : -1;
                    const len = grid[currentCol].items.length;
                    nextRow = (currentRow + delta + len) % len;
                }

                window.location.hash = `#${grid[nextCol].id}/${nextRow}`;
            }
        });

        // Touch Swipe navigation handler
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return; // ignore multi-touch gestures

            const target = e.target;
            // Exclude canvas, iframes, audio players, or interactive widgets
            if (target.closest('iframe') || target.closest('canvas') || target.closest('audio') || target.closest('.interactive-container')) {
                return;
            }

            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (isAnimating) return;

            const target = e.target;
            if (target.closest('iframe') || target.closest('canvas') || target.closest('audio') || target.closest('.interactive-container')) {
                return;
            }

            const diffX = e.changedTouches[0].clientX - touchStartX;
            const diffY = e.changedTouches[0].clientY - touchStartY;
            const duration = Date.now() - touchStartTime;

            const threshold = 50; // minimum swipe distance in pixels
            const maxDuration = 300; // maximum swipe time in milliseconds

            if (duration > maxDuration) return;

            let swipeDirection = null;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > threshold) {
                    swipeDirection = diffX > 0 ? 'left' : 'right'; // Swipe right moves left, swipe left moves right
                }
            } else {
                if (Math.abs(diffY) > threshold) {
                    swipeDirection = diffY > 0 ? 'up' : 'down'; // Swipe down moves up, swipe up moves down
                }
            }

            if (swipeDirection) {
                let nextCol = currentCol;
                let nextRow = currentRow;

                if (swipeDirection === 'left' || swipeDirection === 'right') {
                    const delta = swipeDirection === 'right' ? 1 : -1;
                    nextCol = (currentCol + delta + 5) % 5;
                    nextRow = 0;
                } else if (swipeDirection === 'up' || swipeDirection === 'down') {
                    const delta = swipeDirection === 'down' ? 1 : -1;
                    const len = grid[currentCol].items.length;
                    nextRow = (currentRow + delta + len) % len;
                }

                window.location.hash = `#${grid[nextCol].id}/${nextRow}`;
            }
        });

        // Listen for hash changes to trigger animations
        window.addEventListener('hashchange', () => {
            navigateToHash(window.location.hash);
        });
    }

    /**
     * 3D Eyeball using Three.js with quaternion slerp
     */
    function initEyeball() {
        const container = document.getElementById('eyeball-container');
        if (!container) return;

        const size = 160;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(size, size);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const eyeGroup = new THREE.Group();
        scene.add(eyeGroup);

        const eyeGeometry = new THREE.SphereGeometry(1, 64, 64);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.3,
            metalness: 0.0
        });
        const eyeball = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eyeGroup.add(eyeball);

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

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 2, 3);
        scene.add(directionalLight);

        let currentY = 0;
        let currentX = 0;
        const slerpFactor = 0.12;

        function animate() {
            requestAnimationFrame(animate);

            currentY += (targetY - currentY) * slerpFactor;
            currentX += (targetX - currentX) * slerpFactor;

            const quatY = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0), currentY
            );
            const quatX = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1, 0, 0), currentX
            );

            eyeGroup.quaternion.copy(quatY.multiply(quatX));

            renderer.render(scene, camera);
        }

        animate();
    }

    /**
     * Möbius-Klein Attractor
     */
    function initMobiusAttractor(container) {
        const width = container.clientWidth || 280;
        const height = 200;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const numTracers = 200;
        const trailLength = 50;
        const R = 2.0;
        const r = 0.7;

        const uArr = new Float32Array(numTracers);
        const vArr = new Float32Array(numTracers);
        for (let i = 0; i < numTracers; i++) {
            uArr[i] = (i / (numTracers - 1)) * 2 * Math.PI;
            vArr[i] = (i / (numTracers - 1)) * 2 * Math.PI;
        }

        const trailX = [], trailY = [], trailZ = [];
        for (let t = 0; t < trailLength; t++) {
            trailX.push(new Float32Array(numTracers));
            trailY.push(new Float32Array(numTracers));
            trailZ.push(new Float32Array(numTracers));
        }

        let globalEffectiveT = 0;
        const baseDt = 0.5;
        const alphaSpeed = 0.1;
        const betaDt = 0.3;
        let prevDt = baseDt;
        let prevPoints = new Float32Array(numTracers * 3);
        let globalQPrev = [0, 0, 0, 1];

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
            const theta0 = Math.acos(Math.min(1.0, Math.max(-1.0, dot)));
            const sinTheta0 = Math.sin(theta0);
            const s0 = Math.sin((1 - t) * theta0) / sinTheta0;
            const s1 = Math.sin(t * theta0) / sinTheta0;
            return normalizeQuat([s0*qa[0]+s1*qb[0], s0*qa[1]+s1*qb[1], s0*qa[2]+s1*qb[2], s0*qa[3]+s1*qb[3]]);
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

        const tempX = new Float32Array(numTracers), tempY = new Float32Array(numTracers), tempZ = new Float32Array(numTracers);
        mobiusKleinAttractor(0, [0,0,0,1], tempX, tempY, tempZ);
        for (let i = 0; i < numTracers; i++) {
            prevPoints[i*3] = tempX[i]; prevPoints[i*3+1] = tempY[i]; prevPoints[i*3+2] = tempZ[i];
        }

        const totalPoints = trailLength * numTracers;
        const positions = new Float32Array(totalPoints * 3);
        const colors = new Float32Array(totalPoints * 3); // RGB
        const alphas = new Float32Array(totalPoints);     // Alpha
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

        function createFuzzyParticleTexture() {
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            return new THREE.CanvasTexture(canvas);
        }

        const material = new THREE.PointsMaterial({
            size: 0.18, // slightly larger for soft overlapping smoke look
            map: createFuzzyParticleTexture(),
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            depthWrite: false
        });

        material.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                'void main() {',
                'attribute float alpha;\nvarying float vAlpha;\nvoid main() {\nvAlpha = alpha;'
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                'void main() {',
                'varying float vAlpha;\nvoid main() {'
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                'vec4 diffuseColor = vec4( diffuse, opacity );',
                'vec4 diffuseColor = vec4( diffuse, opacity * vAlpha );'
            );
        };

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let frame = 0;

        function blueYellowRedColormap(t) {
            t = Math.max(0.0, Math.min(1.0, t));
            let r, g, b;
            if (t < 0.5) {
                const s = t * 2.0;
                r = s;
                g = s;
                b = 1.0 - s;
            } else {
                const s = (t - 0.5) * 2.0;
                r = 1.0;
                g = 1.0 - s;
                b = 0.0;
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

            const posAttr = geometry.attributes.position, colAttr = geometry.attributes.color, alphaAttr = geometry.attributes.alpha;
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
                    posAttr.array[idx*3] = trailX[t][i];
                    posAttr.array[idx*3+1] = trailZ[t][i]; // Python Z -> Three.js Y (vertical)
                    posAttr.array[idx*3+2] = trailY[t][i]; // Python Y -> Three.js Z (depth)
                    
                    const zNorm = (trailZ[t][i] - zMin) / zRange;
                    const [r, g, b] = blueYellowRedColormap(zNorm);
                    const alpha = (0.5 + 0.5 * (1.0 - Math.abs(zNorm - 0.5) * 2.0)) * trailFade;
                    
                    colAttr.array[idx*3] = r;
                    colAttr.array[idx*3+1] = g;
                    colAttr.array[idx*3+2] = b;
                    alphaAttr.array[idx] = alpha;
                    idx++;
                }
            }
            posAttr.needsUpdate = true; colAttr.needsUpdate = true; alphaAttr.needsUpdate = true;
        }

        let lastTime = 0;
        const interval = 30; // ms

        function animate(currentTime) {
            if (!container.contains(renderer.domElement)) {
                renderer.dispose();
                geometry.dispose();
                material.dispose();
                return;
            }
            requestAnimationFrame(animate);

            if (!currentTime) currentTime = performance.now();
            if (!lastTime) lastTime = currentTime;
            const elapsed = currentTime - lastTime;

            if (elapsed >= interval) {
                const steps = Math.min(Math.floor(elapsed / interval), 4);
                for (let i = 0; i < steps; i++) {
                    update();
                }
                lastTime = currentTime - (elapsed % interval);
                renderer.render(scene, camera);
            }
        }
        animate();
    }
});

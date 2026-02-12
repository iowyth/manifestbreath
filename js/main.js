/**
 * Manifest Breath
 * 3D Eyeball navigation with shuffled content pages
 */

document.addEventListener('DOMContentLoaded', () => {
    initEmailProtection();
    initEyeball();
    initContentNavigation();
});

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
 * Content pages - each page has a type and content
 */
const pages = [
    {
        type: 'intro',
        title: 'iowyth hezel ulthiin',
        content: '<p>scholar · artist · weaver of worlds</p><p>Press arrow keys to explore.</p>'
    },
    {
        type: 'publication',
        title: 'The Phenomenology of Dissensus',
        venue: 'Review of Education, Pedagogy, and Cultural Studies',
        year: '2024',
        description: 'An exploration of epistemic communities and the phenomenology of belief in alternative cosmologies.',
        link: 'https://www.tandfonline.com/doi/full/10.1080/10714413.2024.2427894'
    },
    {
        type: 'publication',
        title: 'Before and After Gravity',
        venue: 'Canadian Journal of Theology, Mental Health and Disability',
        year: '2024',
        description: 'A series of intimate drawings exploring the sublime as a site of queer spiritual connection.',
        link: 'https://jps.library.utoronto.ca/index.php/cjtmhd/article/view/44515'
    },
    {
        type: 'publication',
        title: 'The Witch: A Pedagogy of Immanence',
        venue: 'Dio Press (Monograph)',
        year: '2023',
        description: 'A journey through trauma to resilience, seeking seeds of an Indigenous way of being within settler culture.',
        link: 'https://www.diopress.com/the-witch'
    },
    {
        type: 'publication',
        title: 'The Capitol Riots',
        venue: 'Routledge (Co-edited)',
        year: '2022',
        description: 'Digital Media, Disinformation, and Democracy Under Attack.',
        link: 'https://www.routledge.com/The-Capitol-Riots-Digital-Media-Disinformation-and-Democracy-Under-Attack/Jeppesen-Hoechsmann-ulthiin-VanDyke-McKee/p/book/9781032246864'
    },
    {
        type: 'publication',
        title: 'Body as Prism',
        venue: 'Canadian Journal of Environmental Education',
        year: '2020',
        description: 'Somatic pedagogy in the development of embodied ecological awareness.',
        link: 'https://cjee.lakeheadu.ca/article/view/1655'
    },
    {
        type: 'text',
        title: 'About',
        content: '<p>I am a performance artist and PhD student whose practice moves between dance, voice, illustration, and writing—examining participatory culture through a métis-crip-queer lens.</p><p>My work focuses on building horizontal power relations through community-based praxis, integrating creative expression with social justice and the utopic visioning of radical social alternatives.</p>'
    }
];

/**
 * Render a page to HTML based on its type
 */
function renderPage(page) {
    const card = document.getElementById('content-card');
    if (!card) return;

    // Remove old type classes
    card.className = 'card';

    switch (page.type) {
        case 'intro':
            card.classList.add('intro');
            card.innerHTML = `
                <h1>${page.title}</h1>
                ${page.content}
            `;
            break;

        case 'publication':
            card.classList.add('publication');
            card.innerHTML = `
                <h1>${page.title}</h1>
                <p class="venue">${page.venue}</p>
                <p class="year">${page.year}</p>
                <p>${page.description}</p>
                <a href="${page.link}" target="_blank" rel="noopener noreferrer" class="read-link">Read →</a>
            `;
            break;

        case 'image':
            card.classList.add('image');
            card.innerHTML = `
                <img src="${page.src}" alt="${page.title}">
                <h2>${page.title}</h2>
                <p class="caption">${page.caption || ''}</p>
            `;
            break;

        case 'video':
            card.classList.add('video');
            card.innerHTML = `
                <div class="video-embed">
                    <iframe src="${page.embedUrl}" allowfullscreen></iframe>
                </div>
                <h2>${page.title}</h2>
                <p>${page.description || ''}</p>
            `;
            break;

        case 'code':
            card.classList.add('code');
            const tags = (page.tech || []).map(t => `<span class="tech-tag">${t}</span>`).join('');
            card.innerHTML = `
                <h1>${page.title}</h1>
                <div class="tech-stack">${tags}</div>
                <p>${page.description}</p>
                <a href="${page.repo}" target="_blank" rel="noopener noreferrer" class="repo-link">View Repository →</a>
            `;
            break;

        case 'text':
        default:
            card.innerHTML = `
                <h1>${page.title}</h1>
                ${page.content}
            `;
            break;
    }
}

/**
 * Content navigation with shuffle
 */
function initContentNavigation() {
    // Create shuffled order (Fisher-Yates)
    const indices = pages.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let position = 0;

    // Show first page
    renderPage(pages[indices[position]]);

    // Expose navigation for eyeball to use
    window.navigateContent = (direction) => {
        if (direction > 0) {
            position = (position + 1) % indices.length;
        } else {
            position = (position - 1 + indices.length) % indices.length;
        }
        renderPage(pages[indices[position]]);
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
        color: 0x1a1a1a,
        roughness: 0.5,
        metalness: 0.0,
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

    // Rotation
    const rotationStep = Math.PI / 12;

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        let navigated = false;

        switch (e.key) {
            case 'ArrowLeft':
                eyeGroup.rotation.y -= rotationStep;
                window.navigateContent(-1);
                navigated = true;
                break;
            case 'ArrowRight':
                eyeGroup.rotation.y += rotationStep;
                window.navigateContent(1);
                navigated = true;
                break;
            case 'ArrowUp':
                eyeGroup.rotation.x -= rotationStep;
                window.navigateContent(-1);
                navigated = true;
                break;
            case 'ArrowDown':
                eyeGroup.rotation.x += rotationStep;
                window.navigateContent(1);
                navigated = true;
                break;
        }

        if (navigated) {
            e.preventDefault();
        }
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}

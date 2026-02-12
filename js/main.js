/**
 * Manifest Breath - Horizontal scroll site
 * Wheel scrolls horizontally like a sideways page
 */

document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initDotNav();
    initClickNav();
    initActiveTracking();
    initPortfolio();
});

/**
 * Smooth horizontal scroll from wheel input
 */
function initHorizontalScroll() {
    const main = document.querySelector('.main-content');
    if (!main) return;

    main.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
        main.scrollLeft += delta;
    }, { passive: false });
}

/**
 * Create dot navigation and keyboard nav
 */
function initDotNav() {
    const main = document.querySelector('.main-content');
    const panels = document.querySelectorAll('.panel');
    if (!main || !panels.length) return;

    // Create dot container
    const dotNav = document.createElement('nav');
    dotNav.className = 'dot-nav';

    // Create dots for each panel
    panels.forEach((panel, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Go to ${panel.id || 'section ' + (i + 1)}`);
        dot.addEventListener('click', () => {
            panel.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        });
        dotNav.appendChild(dot);
    });

    document.body.appendChild(dotNav);

    // Keyboard navigation - snap to panels
    let currentIndex = 0;
    const goTo = (index) => {
        if (index < 0 || index >= panels.length) return;
        currentIndex = index;
        panels[index].scrollIntoView({ behavior: 'smooth', inline: 'start' });
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            goTo(currentIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goTo(currentIndex - 1);
        }
    });

    // Update currentIndex on scroll
    main.addEventListener('scroll', () => {
        const scrollPos = main.scrollLeft;
        panels.forEach((panel, i) => {
            if (scrollPos >= panel.offsetLeft - 50) {
                currentIndex = i;
            }
        });
    });
}

/**
 * Click nav to scroll to section
 */
function initClickNav() {
    const links = document.querySelectorAll('.sidebar-menu a');
    const main = document.querySelector('.main-content');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href.startsWith('#')) return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target && main) {
                main.scrollTo({
                    left: target.offsetLeft - main.offsetLeft,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Track scroll position to update active states (nav + dots)
 */
function initActiveTracking() {
    const main = document.querySelector('.main-content');
    const panels = document.querySelectorAll('.panel');
    const navLinks = document.querySelectorAll('.sidebar-menu a');

    if (!main || !panels.length) return;

    const update = () => {
        const scrollPos = main.scrollLeft + main.offsetWidth / 3;

        panels.forEach((panel, i) => {
            const start = panel.offsetLeft;
            const end = start + panel.offsetWidth;
            const isActive = scrollPos >= start && scrollPos < end;

            // Update nav links
            const id = panel.getAttribute('id');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.toggle('active', isActive);
                }
            });

            // Update dots
            const dots = document.querySelectorAll('.dot-nav .dot');
            if (dots[i]) {
                dots[i].classList.toggle('active', isActive);
            }
        });
    };

    main.addEventListener('scroll', update);
    setTimeout(update, 100); // Initial update after dots created
}

/**
 * ==========================================================================
 * PORTFOLIO: Load works from works.json
 *
 * Supports:
 * - Images: { type: "image", src: "images/photo.jpg", title: "Title" }
 * - Vimeo:  { type: "vimeo", vimeoId: "123456789", title: "Title" }
 * ==========================================================================
 */
async function initPortfolio() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    try {
        const response = await fetch('works.json');
        if (!response.ok) return;

        const works = await response.json();

        // Clear existing placeholder items
        grid.innerHTML = '';

        // Build gallery from works.json
        for (const work of works) {
            const item = await createGalleryItem(work);
            if (item) grid.appendChild(item);
        }
    } catch (e) {
        // works.json not found or invalid - keep existing HTML gallery
        console.log('Portfolio: Using HTML gallery (works.json not found)');
    }
}

/**
 * Create a gallery item element
 */
async function createGalleryItem(work) {
    const link = document.createElement('a');
    link.href = `works/${work.id}.html`;
    link.className = 'gallery-item';

    const thumb = document.createElement('div');
    thumb.className = 'gallery-thumb';

    if (work.type === 'image' && work.src) {
        // Image: use as background
        thumb.style.backgroundImage = `url('${work.src}')`;
        thumb.style.backgroundSize = 'cover';
        thumb.style.backgroundPosition = 'center';
    } else if (work.type === 'vimeo' && work.vimeoId) {
        // Vimeo: fetch thumbnail from oEmbed API
        try {
            const vimeoData = await fetchVimeoThumbnail(work.vimeoId);
            if (vimeoData.thumbnail) {
                thumb.style.backgroundImage = `url('${vimeoData.thumbnail}')`;
                thumb.style.backgroundSize = 'cover';
                thumb.style.backgroundPosition = 'center';
            }
            // Add play icon overlay for videos
            thumb.innerHTML = '<div class="video-play-icon"></div>';
        } catch (e) {
            // Keep gradient placeholder if Vimeo fetch fails
        }
    }

    link.appendChild(thumb);
    return link;
}

/**
 * Fetch Vimeo video thumbnail using oEmbed
 */
async function fetchVimeoThumbnail(vimeoId) {
    const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`);
    if (!response.ok) throw new Error('Vimeo fetch failed');

    const data = await response.json();
    return {
        thumbnail: data.thumbnail_url,
        title: data.title
    };
}

/**
 * Manifest Breath - Horizontal scroll site
 * Wheel scrolls horizontally like a sideways page
 */

document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initClickNav();
    initActiveLink();
    initPortfolio();
});

/**
 * Smooth horizontal scroll from wheel input
 */
function initHorizontalScroll() {
    const main = document.querySelector('.main-content');
    if (!main) return;

    // Wheel to horizontal scroll
    main.addEventListener('wheel', (e) => {
        e.preventDefault();
        // Use both deltaY and deltaX for better trackpad support
        const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
        main.scrollLeft += delta;
    }, { passive: false });

    // Also allow keyboard scrolling
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            main.scrollLeft += 100;
        } else if (e.key === 'ArrowLeft') {
            main.scrollLeft -= 100;
        }
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
 * Update active nav link based on scroll position
 */
function initActiveLink() {
    const links = document.querySelectorAll('.sidebar-menu a');
    const main = document.querySelector('.main-content');
    const sections = document.querySelectorAll('.panel');

    if (!main || !sections.length) return;

    const update = () => {
        const scrollPos = main.scrollLeft + main.offsetWidth / 3;

        sections.forEach(section => {
            const start = section.offsetLeft - main.offsetLeft;
            const end = start + section.offsetWidth;

            if (scrollPos >= start && scrollPos < end) {
                const id = section.getAttribute('id');
                links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    };

    main.addEventListener('scroll', update);
    update();
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

/**
 * Manifest Breath - Horizontal scroll site
 * Wheel scrolls horizontally, keyboard nav snaps to panels
 */

document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initKeyboardNav();
    initClickNav();
    initActiveTracking();
    initPortfolio();
    initEmailProtection();
});

/**
 * Protect email from bots by assembling it from data attributes
 */
function initEmailProtection() {
    const emailLink = document.getElementById('email-link');
    if (!emailLink) return;

    const user = emailLink.dataset.user;
    const domain = emailLink.dataset.domain;
    if (user && domain) {
        emailLink.href = 'mailto:' + user + '@' + domain;
    }
}

/**
 * Convert vertical wheel to horizontal scroll
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
 * Keyboard navigation - arrow keys snap to panels
 */
function initKeyboardNav() {
    const main = document.querySelector('.main-content');
    const panels = document.querySelectorAll('.panel');
    if (!main || !panels.length) return;

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
 * Click sidebar nav to scroll to section
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
 * Track scroll position to update active nav link
 */
function initActiveTracking() {
    const main = document.querySelector('.main-content');
    const panels = document.querySelectorAll('.panel');
    const navLinks = document.querySelectorAll('.sidebar-menu a');

    if (!main || !panels.length) return;

    const update = () => {
        const scrollPos = main.scrollLeft + main.offsetWidth / 3;

        panels.forEach((panel) => {
            const start = panel.offsetLeft;
            const end = start + panel.offsetWidth;
            const isActive = scrollPos >= start && scrollPos < end;

            const id = panel.getAttribute('id');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.toggle('active', isActive);
                }
            });
        });
    };

    main.addEventListener('scroll', update);
    update();
}

/**
 * Portfolio: Load works from works.json
 */
async function initPortfolio() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    try {
        const response = await fetch('works.json');
        if (!response.ok) return;

        const works = await response.json();
        grid.innerHTML = '';

        for (const work of works) {
            const item = await createGalleryItem(work);
            if (item) grid.appendChild(item);
        }
    } catch (e) {
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
        thumb.style.backgroundImage = `url('${work.src}')`;
        thumb.style.backgroundSize = 'cover';
        thumb.style.backgroundPosition = 'center';
    } else if (work.type === 'vimeo' && work.vimeoId) {
        try {
            const vimeoData = await fetchVimeoThumbnail(work.vimeoId);
            if (vimeoData.thumbnail) {
                thumb.style.backgroundImage = `url('${vimeoData.thumbnail}')`;
                thumb.style.backgroundSize = 'cover';
                thumb.style.backgroundPosition = 'center';
            }
            thumb.innerHTML = '<div class="video-play-icon"></div>';
        } catch (e) {
            // Keep gradient placeholder
        }
    }

    link.appendChild(thumb);
    return link;
}

/**
 * Fetch Vimeo video thumbnail
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

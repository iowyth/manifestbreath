/**
 * Manifest Breath - Horizontal scroll site
 * Wheel scrolls horizontally like a sideways page
 */

document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initClickNav();
    initActiveLink();
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

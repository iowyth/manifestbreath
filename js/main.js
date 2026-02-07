/**
 * Manifest Breath - Main JavaScript
 * Horizontal scrolling site (like a normal page, but sideways)
 */

document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initClickNav();
    initActiveLink();
});

/**
 * Convert wheel to horizontal scroll (natural, like a sideways page)
 */
function initHorizontalScroll() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    mainContent.addEventListener('wheel', (e) => {
        e.preventDefault();
        mainContent.scrollLeft += e.deltaY;
    }, { passive: false });
}

/**
 * Click navigation
 */
function initClickNav() {
    const navLinks = document.querySelectorAll('.sidebar-menu a');
    const mainContent = document.querySelector('.main-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href.startsWith('#')) return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target && mainContent) {
                mainContent.scrollTo({
                    left: target.offsetLeft - mainContent.offsetLeft,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Update active nav link on scroll
 */
function initActiveLink() {
    const navLinks = document.querySelectorAll('.sidebar-menu a');
    const mainContent = document.querySelector('.main-content');
    const panels = document.querySelectorAll('.panel');

    if (!mainContent || !panels.length) return;

    const updateActiveLink = () => {
        const scrollPos = mainContent.scrollLeft;
        const panelWidth = panels[0].offsetWidth;
        const currentIndex = Math.round(scrollPos / panelWidth);

        if (panels[currentIndex]) {
            const id = panels[currentIndex].getAttribute('id');

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    mainContent.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

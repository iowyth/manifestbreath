/**
 * Manifest Breath - Main JavaScript
 * Left sidebar + horizontal scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initNavigation();
});

/**
 * Horizontal scroll on main content
 */
function initHorizontalScroll() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // Convert vertical wheel to horizontal scroll
    mainContent.addEventListener('wheel', (e) => {
        e.preventDefault();
        mainContent.scrollLeft += e.deltaY;
    }, { passive: false });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!mainContent) return;

        const scrollAmount = window.innerWidth * 0.8;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            mainContent.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            mainContent.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    });

    // Touch swipe
    let touchStartX = 0;

    mainContent.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mainContent.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            mainContent.scrollBy({
                left: diff > 0 ? window.innerWidth : -window.innerWidth,
                behavior: 'smooth'
            });
        }
    }, { passive: true });
}

/**
 * Navigation
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-menu a');
    const mainContent = document.querySelector('.main-content');
    const panels = document.querySelectorAll('.panel');

    // Click to scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href.startsWith('#')) return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target && mainContent) {
                const targetLeft = target.offsetLeft - mainContent.offsetLeft;
                mainContent.scrollTo({ left: targetLeft, behavior: 'smooth' });
            }
        });
    });

    // Update active link on scroll
    if (mainContent && panels.length) {
        mainContent.addEventListener('scroll', () => {
            const scrollPos = mainContent.scrollLeft;
            const panelWidth = panels[0].offsetWidth;

            panels.forEach((panel, index) => {
                const panelLeft = panel.offsetLeft - mainContent.offsetLeft;

                if (scrollPos >= panelLeft - panelWidth / 2 &&
                    scrollPos < panelLeft + panelWidth / 2) {
                    const id = panel.getAttribute('id');

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
}

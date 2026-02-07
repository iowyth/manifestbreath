/**
 * Manifest Breath - Main JavaScript
 * Left sidebar + horizontal snap scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
    initSnapScroll();
    initNavigation();
});

/**
 * Snap scrolling between panels
 */
function initSnapScroll() {
    const mainContent = document.querySelector('.main-content');
    const panels = document.querySelectorAll('.panel');
    if (!mainContent || !panels.length) return;

    let isScrolling = false;
    let currentIndex = 0;

    // Get current panel index based on scroll position
    function getCurrentIndex() {
        const scrollPos = mainContent.scrollLeft;
        const panelWidth = panels[0].offsetWidth;
        return Math.round(scrollPos / panelWidth);
    }

    // Scroll to specific panel
    function scrollToPanel(index) {
        if (index < 0) index = 0;
        if (index >= panels.length) index = panels.length - 1;

        const targetPanel = panels[index];
        if (targetPanel) {
            mainContent.scrollTo({
                left: targetPanel.offsetLeft - mainContent.offsetLeft,
                behavior: 'smooth'
            });
            currentIndex = index;
        }
    }

    // Wheel navigation - scroll one panel at a time
    mainContent.addEventListener('wheel', (e) => {
        e.preventDefault();

        if (isScrolling) return;

        isScrolling = true;
        currentIndex = getCurrentIndex();

        if (e.deltaY > 0 || e.deltaX > 0) {
            scrollToPanel(currentIndex + 1);
        } else {
            scrollToPanel(currentIndex - 1);
        }

        // Debounce
        setTimeout(() => {
            isScrolling = false;
        }, 600);
    }, { passive: false });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            isScrolling = true;
            currentIndex = getCurrentIndex();
            scrollToPanel(currentIndex + 1);
            setTimeout(() => { isScrolling = false; }, 600);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            isScrolling = true;
            currentIndex = getCurrentIndex();
            scrollToPanel(currentIndex - 1);
            setTimeout(() => { isScrolling = false; }, 600);
        }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchStartY = 0;

    mainContent.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    mainContent.addEventListener('touchend', (e) => {
        if (isScrolling) return;

        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            isScrolling = true;
            currentIndex = getCurrentIndex();

            if (diffX > 0) {
                scrollToPanel(currentIndex + 1);
            } else {
                scrollToPanel(currentIndex - 1);
            }

            setTimeout(() => { isScrolling = false; }, 600);
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

    // Click to scroll to section
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

    // Update active link on scroll
    if (mainContent && panels.length) {
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
}

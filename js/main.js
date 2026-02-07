/**
 * Manifest Breath - Main JavaScript
 * Left sidebar + horizontal snap scrolling
 *
 * Navigation:
 * - Mouse wheel = scroll vertically within section content
 * - Arrow keys = move between sections horizontally
 * - Nav clicks = jump to section
 */

document.addEventListener('DOMContentLoaded', () => {
    initKeyboardNav();
    initClickNav();
    initActiveLink();
});

/**
 * Keyboard navigation between sections
 */
function initKeyboardNav() {
    const mainContent = document.querySelector('.main-content');
    const panels = document.querySelectorAll('.panel');
    if (!mainContent || !panels.length) return;

    let isScrolling = false;

    function getCurrentIndex() {
        const scrollPos = mainContent.scrollLeft;
        const panelWidth = panels[0].offsetWidth;
        return Math.round(scrollPos / panelWidth);
    }

    function scrollToPanel(index) {
        if (index < 0) index = 0;
        if (index >= panels.length) index = panels.length - 1;

        const targetPanel = panels[index];
        if (targetPanel) {
            mainContent.scrollTo({
                left: targetPanel.offsetLeft - mainContent.offsetLeft,
                behavior: 'smooth'
            });
        }
    }

    document.addEventListener('keydown', (e) => {
        // Don't interfere if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (isScrolling) return;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            isScrolling = true;
            scrollToPanel(getCurrentIndex() + 1);
            setTimeout(() => { isScrolling = false; }, 600);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            isScrolling = true;
            scrollToPanel(getCurrentIndex() - 1);
            setTimeout(() => { isScrolling = false; }, 600);
        }
    });
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

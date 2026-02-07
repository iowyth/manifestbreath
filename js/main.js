/**
 * Manifest Breath - Main JavaScript
 * Horizontal scrolling navigation + 90s bitmap aesthetic
 */

document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initNavigation();
    initPortfolioTabs();
    initScrollProgress();
});

/**
 * Convert vertical scroll to horizontal
 */
function initHorizontalScroll() {
    const sections = document.querySelectorAll('body > section, body > .section, body > .footer');

    // Enable horizontal scrolling with mouse wheel
    document.addEventListener('wheel', (e) => {
        // Don't hijack scroll if user is scrolling within an overflow element
        if (e.target.closest('.publications-list, .portfolio-grid')) {
            return;
        }

        e.preventDefault();
        document.documentElement.scrollLeft += e.deltaY;
        document.body.scrollLeft += e.deltaY;
    }, { passive: false });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const scrollAmount = window.innerWidth * 0.8;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            smoothScrollBy(scrollAmount);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            smoothScrollBy(-scrollAmount);
        } else if (e.key === 'Home') {
            e.preventDefault();
            smoothScrollTo(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            smoothScrollTo(document.body.scrollWidth);
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - scroll right
                smoothScrollBy(window.innerWidth);
            } else {
                // Swipe right - scroll left
                smoothScrollBy(-window.innerWidth);
            }
        }
    }
}

/**
 * Smooth horizontal scroll helper
 */
function smoothScrollBy(amount) {
    window.scrollBy({
        left: amount,
        behavior: 'smooth'
    });
}

function smoothScrollTo(position) {
    window.scrollTo({
        left: position,
        behavior: 'smooth'
    });
}

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section[id]');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll to section on nav click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const targetPosition = targetSection.offsetLeft;
                smoothScrollTo(targetPosition);
            }
        });
    });

    // Update active nav link based on scroll position
    function updateActiveNav() {
        const scrollPos = window.scrollX || document.documentElement.scrollLeft;

        sections.forEach(section => {
            const sectionLeft = section.offsetLeft;
            const sectionWidth = section.offsetWidth;

            if (scrollPos >= sectionLeft - sectionWidth / 2 &&
                scrollPos < sectionLeft + sectionWidth / 2) {
                const id = section.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Handle anchor links (like hero scroll button)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                smoothScrollTo(targetElement.offsetLeft);
            }
        });
    });
}

/**
 * Portfolio tabs functionality
 */
function initPortfolioTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Update button states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update panel visibility
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === tabId) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/**
 * Scroll progress indicator
 */
function initScrollProgress() {
    const sections = document.querySelectorAll('section[id]');

    // Create progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress';

    sections.forEach((section, index) => {
        const dot = document.createElement('button');
        dot.className = 'scroll-progress-dot';
        dot.setAttribute('aria-label', `Go to ${section.id}`);
        dot.dataset.index = index;

        dot.addEventListener('click', () => {
            smoothScrollTo(section.offsetLeft);
        });

        progressContainer.appendChild(dot);
    });

    document.body.appendChild(progressContainer);

    // Update active dot
    function updateProgressDots() {
        const scrollPos = window.scrollX || document.documentElement.scrollLeft;
        const dots = progressContainer.querySelectorAll('.scroll-progress-dot');

        sections.forEach((section, index) => {
            const sectionLeft = section.offsetLeft;
            const sectionWidth = section.offsetWidth;

            if (scrollPos >= sectionLeft - sectionWidth / 2 &&
                scrollPos < sectionLeft + sectionWidth / 2) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        });
    }

    window.addEventListener('scroll', updateProgressDots);
    updateProgressDots();
}

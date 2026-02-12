/**
 * Eyeball Navigation
 * Two-axis rotation on a sphere, controlled by arrow keys
 */

document.addEventListener('DOMContentLoaded', () => {
    initEyeball();
});

function initEyeball() {
    const iris = document.querySelector('.iris');
    if (!iris) return;

    // Two angles for spherical position (in radians)
    let theta = 0; // horizontal rotation (left/right)
    let phi = 0;   // vertical rotation (up/down)

    // How much each keypress rotates (in radians)
    const step = Math.PI / 8; // 22.5 degrees

    // Maximum offset of iris from center (as fraction of available space)
    const maxOffset = 0.35;

    function updateIris() {
        const eyeball = document.querySelector('.eyeball');

        // Project spherical coordinates to 2D
        // x = sin(theta) * cos(phi) — horizontal position
        // y = sin(phi) — vertical position
        // z = cos(theta) * cos(phi) — depth (front/back of sphere)

        const x = Math.sin(theta) * Math.cos(phi);
        const y = Math.sin(phi);
        const z = Math.cos(theta) * Math.cos(phi);

        // Convert to percentage offset from center
        const offsetX = x * maxOffset * 100;
        const offsetY = y * maxOffset * 100;

        // Foreshortening: iris becomes elliptical based on viewing angle
        // scaleX shrinks when iris is at left/right edges
        // scaleY shrinks when iris is at top/bottom edges
        const scaleX = Math.max(0.2, Math.abs(z));
        const scaleY = Math.max(0.2, Math.sqrt(z * z + x * x)); // vertical foreshortening

        // Opacity: visible when z > 0 (front), hidden when behind
        const opacity = Math.max(0, Math.min(1, z * 3));

        iris.style.transform = `translate(calc(-50% + ${offsetX}%), calc(-50% + ${offsetY}%)) scale(${scaleX}, ${scaleY})`;
        iris.style.opacity = opacity;

        // Rotate the eyeball's highlight to match sphere rotation
        // The highlight should appear opposite to where the iris is going
        const highlightX = 30 - (x * 20); // base 30%, shift with rotation
        const highlightY = 30 - (y * 20); // base 30%, shift with rotation

        eyeball.style.background = `radial-gradient(
            circle at ${highlightX}% ${highlightY}%,
            #fff 0%,
            #f0f0f0 30%,
            #d0d0d0 70%,
            #a0a0a0 100%
        )`;
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                theta -= step;
                break;
            case 'ArrowRight':
                theta += step;
                break;
            case 'ArrowUp':
                phi -= step;
                break;
            case 'ArrowDown':
                phi += step;
                break;
            default:
                return; // Don't update for other keys
        }

        e.preventDefault();

        // Wrap angles to keep them in reasonable range
        // (not strictly necessary but keeps values clean)
        theta = theta % (2 * Math.PI);
        phi = phi % (2 * Math.PI);

        updateIris();
    });

    // Initial position
    updateIris();
}

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
        // Project spherical coordinates to 2D
        // x = sin(theta) * cos(phi) — horizontal position
        // y = sin(phi) — vertical position
        // z = cos(theta) * cos(phi) — depth (for scale)

        const x = Math.sin(theta) * Math.cos(phi);
        const y = Math.sin(phi);
        const z = Math.cos(theta) * Math.cos(phi);

        // Convert to percentage offset from center
        const offsetX = x * maxOffset * 100;
        const offsetY = y * maxOffset * 100;

        // Scale based on depth (closer = bigger, further = smaller)
        // z ranges from -1 to 1, map to scale 0.7 to 1.0
        const scale = 0.85 + (z * 0.15);

        iris.style.transform = `translate(calc(-50% + ${offsetX}%), calc(-50% + ${offsetY}%)) scale(${scale})`;
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

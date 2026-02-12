/**
 * 3D Eyeball Navigation
 * A sphere rendered on canvas with an iris on its surface
 * Arrow keys rotate the sphere in 3D
 */

document.addEventListener('DOMContentLoaded', () => {
    initEyeball();
});

function initEyeball() {
    const canvas = document.getElementById('eyeball-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;

    // Camera/projection settings
    const focalLength = 300;
    const cameraZ = 200;

    // Rotation angles (in radians)
    let rotationX = 0;
    let rotationY = 0;

    // Rotation step per keypress
    const step = Math.PI / 12;

    // Iris position on sphere surface (starts facing forward)
    // This is a point at the "north pole" of the sphere initially
    const irisBasePosition = { x: 0, y: 0, z: radius };
    const irisRadius = radius * 0.35;

    // 3D Rotation functions
    function rotateX(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: point.x,
            y: point.y * cos - point.z * sin,
            z: point.y * sin + point.z * cos
        };
    }

    function rotateY(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: point.x * cos + point.z * sin,
            y: point.y,
            z: -point.x * sin + point.z * cos
        };
    }

    // Project 3D point to 2D with perspective
    function project(point) {
        const scale = focalLength / (focalLength + cameraZ - point.z);
        return {
            x: centerX + point.x * scale,
            y: centerY + point.y * scale,
            scale: scale,
            z: point.z // keep z for depth sorting
        };
    }

    function draw() {
        ctx.clearRect(0, 0, size, size);

        // Apply rotations to iris position
        let irisPos = { ...irisBasePosition };
        irisPos = rotateX(irisPos, rotationX);
        irisPos = rotateY(irisPos, rotationY);

        // Project iris to 2D
        const iris2D = project(irisPos);

        // Calculate iris apparent size (foreshortening)
        // When iris is at edge, it appears as an ellipse
        const irisDepthRatio = irisPos.z / radius; // -1 to 1
        const irisApparentRadius = irisRadius * iris2D.scale * Math.max(0, irisDepthRatio);

        // Draw eyeball (white sphere with shading)
        // Calculate highlight position based on rotation
        const highlightX = centerX - rotationY * 10;
        const highlightY = centerY - rotationX * 10;

        const gradient = ctx.createRadialGradient(
            highlightX, highlightY, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#f5f5f5');
        gradient.addColorStop(0.7, '#d0d0d0');
        gradient.addColorStop(1, '#a0a0a0');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw iris only if it's on the front half of the sphere
        if (irisPos.z > 0) {
            // Iris gradient (dark with slight highlight)
            const irisGradient = ctx.createRadialGradient(
                iris2D.x - irisApparentRadius * 0.3,
                iris2D.y - irisApparentRadius * 0.3,
                0,
                iris2D.x,
                iris2D.y,
                irisApparentRadius
            );
            irisGradient.addColorStop(0, '#333');
            irisGradient.addColorStop(0.5, '#1a1a1a');
            irisGradient.addColorStop(1, '#000');

            // Draw iris as ellipse (foreshortened circle)
            ctx.beginPath();

            // Calculate ellipse axes based on viewing angle
            const ellipseScaleX = Math.abs(Math.cos(rotationY)) * 0.5 + 0.5;
            const ellipseScaleY = Math.abs(Math.cos(rotationX)) * 0.5 + 0.5;

            ctx.save();
            ctx.translate(iris2D.x, iris2D.y);
            ctx.scale(ellipseScaleX, ellipseScaleY);
            ctx.beginPath();
            ctx.arc(0, 0, irisApparentRadius, 0, Math.PI * 2);
            ctx.restore();

            ctx.fillStyle = irisGradient;
            ctx.fill();
        }

        // Subtle edge shadow on the eyeball
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                rotationY -= step;
                break;
            case 'ArrowRight':
                rotationY += step;
                break;
            case 'ArrowUp':
                rotationX -= step;
                break;
            case 'ArrowDown':
                rotationX += step;
                break;
            default:
                return;
        }
        e.preventDefault();
        draw();
    });

    // Initial draw
    draw();
}

const canvas = document.getElementById('kolamCanvas');
const c = canvas.getContext('2d');

let scale = 1; // Initial scale
let rotationAngle = 0; // Track rotation angle

function drawDot(x, y, radius, color) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2);
    c.fillStyle = color;
    c.fill();
}

function drawPattern(kolamType, gridSize, dotRadius) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const horizontalSpacing = dotRadius * 4 * scale;
    const verticalSpacing = dotRadius * 6 * scale;
    const scaledDotRadius = dotRadius * scale;

    // Extract maxDots and startingDots from gridSize (e.g., "5x1")
    const [maxDots, startingDots] = gridSize.split('x').map(Number);

    switch (kolamType) {
        case 'square':
            for (let i = 0; i < startingDots; i++) {
                for (let j = 0; j < maxDots; j++) {
                    const x = centerX - (maxDots / 2 - j) * horizontalSpacing;
                    const y = centerY - (startingDots / 2 - i) * verticalSpacing;
                    drawDot(x, y, scaledDotRadius, 'black');
                }
            }
            break;

        case 'nerpulli':
            const totalRowsNerupulli = maxDots - startingDots + 1;
            const midRowNerupulli = Math.floor(totalRowsNerupulli / 2);

            for (let row = 0; row < totalRowsNerupulli; row++) {
                let dots;

                if (row === 0 || row === totalRowsNerupulli - 1) {
                    dots = startingDots;
                } else if (row === midRowNerupulli) {
                    dots = maxDots;
                } else if (row < midRowNerupulli) {
                    dots = startingDots + row * 2;
                } else {
                    dots = startingDots + (totalRowsNerupulli - row - 1) * 2;
                }

                dots = Math.min(dots, maxDots);

                const y = centerY - verticalSpacing * (row - midRowNerupulli);
                const startX = centerX - horizontalSpacing * (dots - 1) / 2;

                for (let col = 0; col < dots; col++) {
                    drawDot(startX + col * horizontalSpacing, y, scaledDotRadius, 'black');
                }
            }
            break;

        case 'idaipulli':
            const totalRowsIdaipulli = 2 * (maxDots - startingDots) + 1;
            const compactHorizontalSpacing = horizontalSpacing * 1.5;
            const compactVerticalSpacing = verticalSpacing * 0.6;

            for (let row = 0; row <= maxDots - startingDots; row++) {
                const numDots = startingDots + row;
                const y = centerY - compactVerticalSpacing * (maxDots - startingDots - row);
                const startX = centerX - compactHorizontalSpacing * (numDots - 1) / 2;
                for (let col = 0; col < numDots; col++) {
                    drawDot(startX + col * compactHorizontalSpacing, y, scaledDotRadius, 'black');
                }
            }

            for (let row = 1; row <= maxDots - startingDots; row++) {
                const numDots = maxDots - row;
                const y = centerY + compactVerticalSpacing * row;
                const startX = centerX - compactHorizontalSpacing * (numDots - 1) / 2;
                for (let col = 0; col < numDots; col++) {
                    drawDot(startX + col * compactHorizontalSpacing, y, scaledDotRadius, 'black');
                }
            }
            break;

        case 'circular':
            const totalSpokes = startingDots;
            const dotsPerSpoke = Math.floor(maxDots / 2);
            const angleStep = (2 * Math.PI) / totalSpokes;

            drawDot(centerX, centerY, scaledDotRadius, 'black');

            for (let spoke = 0; spoke < totalSpokes; spoke++) {
                const angle = spoke * angleStep;

                for (let dotIndex = 1; dotIndex <= dotsPerSpoke; dotIndex++) {
                    const distance = dotIndex * (horizontalSpacing * 1.5);
                    const x = centerX + Math.cos(angle) * distance;
                    const y = centerY + Math.sin(angle) * distance;

                    drawDot(x, y, scaledDotRadius, 'black');
                }
            }
            break;

        case 'house':
            let triangleHeight = Math.floor(maxDots / 2) + 1;
            let lastTriangleRowY = 0;

            for (let row = 0; row < triangleHeight; row++) {
                const numDots = 2 * row + 1;
                const y = centerY - verticalSpacing * (triangleHeight - row - 1);
                const startX = centerX - horizontalSpacing * (numDots - 1) / 2;

                for (let col = 0; col < numDots; col++) {
                    drawDot(startX + col * horizontalSpacing, y, scaledDotRadius, 'black');
                }

                lastTriangleRowY = y;
            }

            const squareStartX = centerX - horizontalSpacing * (maxDots - 1) / 2;
            const squareStartY = lastTriangleRowY + verticalSpacing;

            for (let row = 0; row < startingDots; row++) {
                const y = squareStartY + verticalSpacing * row;
                for (let col = 0; col < maxDots; col++) {
                    const x = squareStartX + col * horizontalSpacing;
                    drawDot(x, y, scaledDotRadius, 'black');
                }
            }
            break;

        case 'custom':
            const customShape = document.getElementById('customShape').value.trim().toLowerCase();
            const pattern = shapePatterns[customShape];
            if (pattern) {
                pattern.forEach(([x, y]) => {
                    const drawX = centerX + x * horizontalSpacing;
                    const drawY = centerY + y * verticalSpacing;
                    drawDot(drawX, drawY, scaledDotRadius, 'black');
                });
            } else {
                alert(`Shape "${customShape}" not recognized. Try "heart", "tree", "circle", "star", "diamond", "cross", or "arrow".`);
            }
            break;

        default:
            console.error(`Invalid kolam type: ${kolamType}`);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('diamondForm');
    const increaseScaleButton = document.getElementById('increaseScale');
    const decreaseScaleButton = document.getElementById('decreaseScale');
    const printButton = document.getElementById('printButton');
    const rotateButton = document.getElementById('rotateButton');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const kolamType = document.getElementById('kolamType').value;
        const gridSize = document.getElementById('gridSize').value.trim();
        const [maxDots, startingDots] = gridSize.split('x').map(Number);

        if (maxDots > 0 && startingDots > 0) {
            drawPattern(kolamType, gridSize, 5);
        } else {
            alert('Please enter valid grid dimensions in the format "5x1".');
        }
    });

    increaseScaleButton.addEventListener('click', () => {
        scale += 0.1;
        form.dispatchEvent(new Event('submit'));
    });

    decreaseScaleButton.addEventListener('click', () => {
        scale = Math.max(0.1, scale - 0.1);
        form.dispatchEvent(new Event('submit'));
    });

    printButton.addEventListener('click', () => {
        const canvasData = canvas.toDataURL();
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print Pattern</title></head><body>');
        printWindow.document.write(`<img src="${canvasData}" width="800" height="600"/>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        printWindow.onload = function () {
            printWindow.print();
        };
    });

    // Rotate button event listener
    rotateButton.addEventListener('click', rotateCanvas);
});

// Rotate the canvas by 90 degrees
function rotateCanvas() {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    rotationAngle += Math.PI / 2; // Increase rotation by 90 degrees
    
    // Save the current context
    c.save();
    
    // Translate to the center of the canvas
    c.translate(canvasWidth / 2, canvasHeight / 2);
    
    // Rotate by 90 degrees (in radians)
    c.rotate(rotationAngle);
    
    // Translate back to the top-left corner
    c.translate(-canvasHeight / 2, -canvasWidth / 2);
    
    // Redraw the pattern
    const kolamType = document.getElementById('kolamType').value;
    const gridSize = document.getElementById('gridSize').value.trim();
    const [maxDots, startingDots] = gridSize.split('x').map(Number);
    drawPattern(kolamType, gridSize, 5);
    
    // Restore the context to the original state
    c.restore();
}

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;


function drawDiamond(rows, dotRadius) {
    c.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const spacing = dotRadius * 6; 

    
    for (let i = 0; i < rows; i++) {
        const y = centerY - spacing * (rows - i - 1);
        const startX = centerX - spacing * i;

        for (let j = 0; j <= 2 * i; j++) {
            drawDot(startX + j * spacing, y, dotRadius);
        }
    }

   
    for (let i = rows - 2; i >= 0; i--) {
        const y = centerY + spacing * (rows - i - 2);
        const startX = centerX - spacing * i;

        for (let j = 0; j <= 2 * i; j++) {
            drawDot(startX + j * spacing, y, dotRadius);
        }
    }
}

// Function to draw a single dot
function drawDot(x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2);
    c.fillStyle = 'black';
    c.fill();
}

// Form event listener
document.getElementById('diamondForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent page reload
    const rows = parseInt(document.getElementById('rowsInput').value);
    if (rows > 0) {
        drawDiamond(rows, 5); 
    } else {
        alert("Please enter a valid number of rows greater than 0.");
    }
});

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c= canvas.getContext('2d');


function drawPattern(rows, dotRadius){
    var center= canvas.width/2;
    var start= 100;
    var spacing = dotRadius * 3;

    for(let i=0;i<rows;i++){
        let y= start + spacing * i;
        let leftx= center - spacing * i;
        let rightx= center + spacing * i;
         
        for (let j = 0; j <= 2 * i; j++) {
            let x = leftx + j * spacing;

            if (j === 0 || j === 2 * i || i === rows - 1) {
                drawDot(x, y, dotRadius);
            }
        }
    }
}

function drawDot(x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fillStyle = 'black';
    c.fill();
}

drawPattern(10, 5);
    


console.log(canvas);

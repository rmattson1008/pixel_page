
let CELL = 16;
let INTERVAL = 250;
const STORAGEKEY = 'gol-seed';
const status = document.getElementById('status');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const lineColor = '#338';

fillColor = '0x0';
// const fillColor2 = 'crimson'
let seedIndex = -1;
let timer = 0;
let iterations = 0;
let ROWS = 0;
let COLS = 0;
let grid = null;

nextColor = function() {
    // copied 

    while (0x0 <= fillColor <= 0x1000000) {
        fillColor++;
        let hexcode = '#' + fillColor.toString(16).padStart(6, "0");
    }
    return hexcode;
    
    // var stringToColour = function(str) {
    //     var hash = 0;
    //     for (var i = 0; i < str.length; i++) {
    //       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    //     }
    //     var colour = '#';
    //     for (var i = 0; i < 3; i++) {
    //       var value = (hash >> (i * 8)) & 0xFF;
    //       colour += ('00' + value.toString(16)).substr(-2);
    //     }
    //     return colour;
    //   }


    // Number(color)
    // color--;
    // return '#' + color;
}
// apply rules to a cell
isAlive = function(cell, i, j) {
    let result = cell[i][j];
    // result = false;
    let numNeighbors = countNeighbors(i, cell, j);
    
    // Rules
    if (cell[i][j] == false && numNeighbors == 3) {
        result = true;
    } else if (cell[i][j] == true && (numNeighbors < 2 )){//|| numNeighbors > 3)){
        result = false;
    }
    // } else;
    // if (numNeighbors < 2) {
    //     result = false; // cell dies
    // } else if (2 <= numNeighbors < 3 && cell[i][j] == true) {
    //     result = true; // no change
    // } else if (numNeighbors == 3 && cell[i][j] == false) {
    //     result = true; // cell is born
    // } else if (numNeighbors >= 3 && cell[i][j] == true){
    //     result = false;
    // }

    // console.log(`${i} ${j} ${numNeighbors} ${result}`);
    return result;
};

// evolve lifecycle
evolve = function() {
    const cell = [...Array(ROWS)].map((v,i) => Array.from(grid[i]));
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j] = isAlive(cell, i, j);
        }
    }
    draw();
    iterations += 1;
    feedback();
    // console.log(iterations);
}

// start auto evolution
start = function() {
    timer = setInterval(evolve, INTERVAL);
}

// stop auto evolution
stop = function() {
    if (!!timer) {
        clearInterval(timer);
        timer = 0;
        draw();
    }
}

// draw grid lines
redraw = function() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.lineWidth = 2.0;
    ctx.strokeRect(1, 1, canvas.clientWidth-2.0, canvas.clientHeight-2.0);
    ctx.lineWidth = 1.0;

    if (!!timer || CELL < 4) { return; }

    ctx.beginPath();
    for (let i = 0; i < ROWS; i++) {
        ctx.moveTo(0.5, i * CELL + 0.5);
        ctx.lineTo(COLS * CELL + 0.5, i * CELL + 0.5);
        for (let j = 0; j < COLS; j++) {
            ctx.moveTo(j * CELL + 0.5, 0.5);
            ctx.lineTo(j * CELL + 0.5, ROWS * CELL + 0.5);
        }
    }
    ctx.stroke();
}

// draw population
draw = function() {
    // console.log(grid);
    redraw();
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (!!grid[i][j]) {
                ctx.fillRect(j * CELL + 1.0, i * CELL + 1.0, CELL - 1.0, CELL - 1.0);
                // nextColor();
                ctx.fillStyle = nextColor();
                console.log({fillColor}, {hexcode})
            }
        }
    }
}


// apply seed values to grid
seed = function(seedTable) {
    for (let i = 0; i < seedTable.length; i++) {
        for (let j = 0; j < seedTable[i].length; j++) {
            grid[i][seedTable[i][j]] = true;
        }
    }
    draw();
}

// toggle cell on mouse click
toggle = function(ev) {
    // calculate cell from mouse position
    let i = Math.floor(ev.offsetY / CELL);
    let j = Math.floor(ev.offsetX / CELL);
    // console.log(i + ' ' + j);

    grid[i][j] = !grid[i][j];
    draw();
}


keypress = function(ev) {
    console.log(ev.code);
    switch (ev.code) {
        case 'Enter':
            if (!timer) { start(); } else { stop(); }
            break;

        case 'Space':
            stop();
            evolve();
            break;

    }
}

feedback = function() {
    // status.innerText = `${CELL} | ${INTERVAL} | ${iterations}`
}


// initialize grid
init = function() {
    ROWS = Math.floor(canvas.clientHeight / CELL) + 1;
    COLS = Math.floor(canvas.clientWidth / CELL) + 1;
    console.log(`${ROWS} ${COLS}`);
    grid = [...Array(ROWS)].map(() => Array(COLS).fill(false));
    saved = JSON.parse(window.localStorage.getItem(STORAGEKEY) || '[]');
    iterations = 0;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;
    draw();
    feedback();
}

// handle mouse clicks
canvas.addEventListener('mouseup', toggle);

// handle key presses
document.addEventListener('keyup', keypress);

// initialize app
init();
function countNeighbors(i, cell, j) {
    let numNeighbors = 0;

    //corners 
    if (i == 0) {
        // console.log(' in first case');
        numNeighbors = cell[i][j + 1] + cell[i + 1][j] + cell[i + 1][j + 1]; //corner
        if (j != 0) {
            numNeighbors += cell[i][j - 1] + cell[i + 1][j + 1];
        } else if (j != (COLS - 1)) {
            numNeighbors += cell[i + 1][j + 1] + cell[i][j + 1];
        }
    } else if (i == (ROWS - 1)) {
        numNeighbors = cell[i - 1][j - 1] + cell[i - 1][j] + cell[i][j - 1];
        if (j != (COLS - 1)) {
            numNeighbors += cell[i - 1][j + 1] + cell[i][j];
        } else if (j != 0) {
            numNeighbors += cell[i][j - 1] + cell[i - 1][j - 1];
        }
    } else { //general
        // console.log(' in general case');
        numNeighbors = cell[i - 1][j - 1] + cell[i - 1][j] + cell[i - 1][j + 1] + cell[i][j - 1] + cell[i][j + 1] + cell[i + 1][j - 1] + cell[i + 1][j] + cell[i + 1][j + 1];
    }
    return numNeighbors;
}




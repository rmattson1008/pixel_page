
// let CELL = 16;
let CELL = 12;
let INTERVAL = 150;
const STORAGEKEY = 'gol-seed';
const status = document.getElementById('status');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const lineColor = '#338';
let COLOR = 0x0; //TODO - clean

let fillColor = 0xFFFFFE;
// const fillColor2 = 'crimson'
let seedIndex = -1;
let timer = 0;
let iterations = 0;
let ROWS = 0;
let COLS = 0;
let grid = null;
let color_vals;
let gen_color = 0xAD33BF;

// TODO - enter is sticky
nextColor = function() {

    while (0x0 <= fillColor < 0xFFFFFF) {
        // fillColor -= 0x010101;

        let red = 0x010000;
        let green = 0x000200;
        let blue = 0x000003;
        let scale = 7;
        let seed = Math.floor(Math.random()*2);


        if (seed == 0) {
            fillColor += red * scale;
        } else if (seed == 1){
            fillColor += green * scale;
        } else if (seed == 2) {
            fillColor += blue * scale;
        }

        // fillColor += 0x2000;
        // fillColor += 0x10;
        // fillColor -= 0x010101;
        // fillColor -= 0x05070B;
        // fillColor = Math.random();
        // step = Math.floor(Math.random()*1118481);
        // fillColor -= 0x010203;
        // fillColor += 0x100000;
        // fillColor *= fillColor;
        // fillColor *= 0x20;
        // fillColor += 0x2;
        // fillColor %= 0xFFFFFF;
        // fillColor += step;
        fillColor %= 0xFFFFFF;
        console.log(fillColor);
        return;
        // let hexcode = "#" + fillColor.toString(16).padStart(6, "0");
        // return hexcode;
    }
    
  
}
// apply rules to a cell
isAlive = function(cell, i, j) {
    let result = cell[i][j];
    // result = false;
    let numNeighbors = countNeighbors(i, cell, j);
    
    // Rules
    if (result == false && numNeighbors == 3) {
        // ctx.fillStyle = nextColor();
        result = true;
        color_vals[i][j] = fillColor;
    } else if (result == true && (numNeighbors < 3)) {
        result = false;
        color_vals[i][j] = 0x0;
    } else if (result == false && numNeighbors >= 5) {
        result = true;
        color_vals[i][j] = fillColor;
    }

    // console.log(`${i} ${j} ${numNeighbors} ${result}`);
    return result;
};

// evolve lifecycle
evolve = function() {
    nextColor();
    const cell = [...Array(ROWS)].map((v,i) => Array.from(grid[i]));
    // const cell_colours = [...Array(ROWS)].map((v,i) => Array.from(color_vals[i]));
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
    // ctx.fillStyle = nextColor(); // take from color vals
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (!!grid[i][j]) {
                COLOR = "#" + color_vals[i][j].toString(16).padStart(6, "0");
                ctx.fillStyle = COLOR;
                console.log(COLOR);
                ctx.fillRect(j * CELL + 1.0, i * CELL + 1.0, CELL - 1.0, CELL - 1.0);
                // nextColor();
                // ctx.fillStyle = COLOR;
                // nextColor();
                // console.log({"here"});
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
    console.log(i + ' ' + j);

    if (grid[i][j]== false ){
        grid[i][j] = !grid[i][j];
        color_vals[i][j] = fillColor;
    } else {
        grid[i][j] = !grid[i][j];
        // color_vals[i][j] = 0x0;
    }
    
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
    color_vals = [...Array(ROWS)].map(() => Array(COLS).fill(fillColor));
    // grid = make2DArray(COLS, ROWS);

    // color_vals = make2DArray(COLS,ROWS);
    // gen_color = 0xAD33BF; // TODO - error check
    saved = JSON.parse(window.localStorage.getItem(STORAGEKEY) || '[]');
    iterations = 0;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    draw();
    feedback();
}

// adapted
function make2DArray(COLS, ROWS) {
    let arr = new Array(ROWS);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(COLS);
    }
    return arr;
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





let CELL = 16;
let INTERVAL = 250;
const STORAGEKEY = 'gol-seed';
const status = document.getElementById('status');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const lineColor = '#338';
const fillColor = 'skyblue';
// const fillColor2 = 'crimson'
let seedIndex = -1;
let timer = 0;
let iterations = 0;
let ROWS = 0;
let COLS = 0;
let grid = null;


// apply rules to a cell
isAlive = function(snapshot, i, j) {
    let result = snapshot[i][j];
    // result = false;
    let numNeighbors = 0;

    //corners 
    if (i == 0) {
        // console.log(' in first case');
        numNeighbors = snapshot[i][j+1] + snapshot[i+1][j] + snapshot[i+1][j+1]; //corner
        if (j !=0 ) {
            numNeighbors+= snapshot[i][j-1] + snapshot[i+1][j+1];
        } else if (j != (COLS-1) ) {
            numNeighbors += snapshot[i+1][j+1] + snapshot[i][j+1]
        }
    }  else if (i == (ROWS -1) ) {
        numNeighbors = snapshot[i-1][j-1] + snapshot[i-1][j]+ snapshot[i][j-1];
        if (j != (COLS -1)){
            numNeighbors+= snapshot[i-1][j+1] + snapshot[i][j];
        } else if (j != 0) {
            numNeighbors += snapshot[i][j-1] + snapshot[i-1][j-1]; 
        }
    }   else { //general
        // console.log(' in general case');
        numNeighbors = snapshot[i-1][j-1] + snapshot[i-1][j] + snapshot[i-1][j+1] + snapshot[i][j-1] + snapshot[i][j+1] + snapshot[i+1][j-1] + snapshot[i+1][j] + snapshot[i+1][j+1];
    }
    

    if (snapshot[i][j] == false && numNeighbors == 3 ){
        result = true;
    } else if (snapshot[i][j] == true && (numNeighbors < 2 || numNeighbors > 3)){
        result = false;
    }
    // } else;
    // if (numNeighbors < 2) {
    //     result = false; // cell dies
    // } else if (2 <= numNeighbors < 3 && snapshot[i][j] == true) {
    //     result = true; // no change
    // } else if (numNeighbors == 3 && snapshot[i][j] == false) {
    //     result = true; // cell is born
    // } else if (numNeighbors >= 3 && snapshot[i][j] == true){
    //     result = false;
    // }

    console.log(`${i} ${j} ${numNeighbors} ${result}`);
    return result;
};

// evolve lifecycle
evolve = function() {
    const snapshot = [...Array(ROWS)].map((v,i) => Array.from(grid[i]));
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j] = isAlive(snapshot, i, j);
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
                ctx.fillStyle = fillColor;
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

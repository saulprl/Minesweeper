let scl;
let grid;
let remaining;
let mines;
let cols, rows;
let finished;
let blownUp;
let displayed;

function setup() {
    window.oncontextmenu = () => {
        return false;
    };

    createCanvas(640.5, 640.5);
    resetSketch();
}

function draw() {
    background(51);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    let remains = 0;
    let minesLeft = mines;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (!grid[i][j].mine) {
                if (!grid[i][j].revealed) {
                    remains++;
                }
            } else if (grid[i][j].flagged) {
                minesLeft--;
            }
        }
    }
    remaining = remains;

    if (remaining === 0 || minesLeft === 0) {
        finished = true;
    }

    if (displayed) {
        noLoop();
    }

    if (finished) {
        if ((remaining === 0 || minesLeft === 0) && !blownUp) {
            gameOver(1);
        } else {
            gameOver(0);
        }
    }
}

function makeGrid(cols, rows) {
    let gridCols = new Array(cols);

    for (let i = 0; i < gridCols.length; i++) {
        gridCols[i] = new Array(rows);
    }

    return gridCols;
}

function mousePressed(event) {
    switch (event.button) {
        case 0:
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY)) {
                        if (grid[i][j].revealed) {
                            grid[i][j].revealAround();
                        } else {
                            grid[i][j].reveal();
                        }

                        if (grid[i][j].mine && !grid[i][j].flagged) {
                            finished = true;
                            blownUp = true;
                        }
                    }
                }
            }
            break;
        case 2:
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY)) {
                        grid[i][j].flag();
                    }
                }
            }
            break;
    }
}

function keyPressed() {
    switch (keyCode) {
        case 13:
            displayed = false;
            loop();
            resetSketch();
            break;
    }
}

function gameOver(state) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].reveal();
        }
    }

    switch (state) {
        case 0:
            fill(255, 0, 0);
            textSize(40);
            strokeWeight(4);
            textAlign(CENTER, CENTER);
            text('Game Over', width / 2, height / 2);

            textSize(27);
            textAlign(CENTER, CENTER);
            strokeWeight(3);
            text('Press \'Enter\' to try again', (width / 2), (height / 2) + 30);
            displayed = true;
            break;
        case 1:
            textSize(40);
            fill(0, 0, 255);
            textAlign(CENTER, CENTER);
            strokeWeight(4);
            text('You won!', width / 2, height / 2);

            textSize(27);
            textAlign(CENTER, CENTER);
            strokeWeight(3);
            text('Press \'Enter\' to play again!', (width / 2), (height / 2) + 30);
            break;
    }
}

function resetSketch() {
    scl = 40;
    cols = floor(width / scl);
    rows = floor(height / scl);
    grid = makeGrid(cols, rows);
    mines = 0;
    remaining = 0;
    finished = false;
    blownUp = false;
    displayed = false;
    frameCount = 0;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j, scl);
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].countMinesAround();

            if (grid[i][j].mine) {
                mines++;
            }
        }
    }
}
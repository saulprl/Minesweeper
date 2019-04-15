function Cell(i, j, scl) {
    this.i = i;
    this.j = j;
    this.scl = scl;
    this.x = this.i * scl;
    this.y = this.j * scl;
    this.mine = random(1) > 0.85;
    this.minesAround = 0;
    this.toReveal = false;
    this.revealed = false;
    this.flagged = false;

    this.show = function() {
        stroke(2);
        strokeWeight(2);
        if (this.flagged && !this.revealed) {
            fill(225, 20, 0);
        } else if (!this.revealed) {
            fill(155);
        }


        rect(this.x, this.y, scl, scl);

        if (this.toReveal && !this.flagged) {

            fill(200);
            rect(this.x, this.y, scl, scl);
            this.revealed = true;

            if (this.mine) {
                noStroke();
                fill(25);
                ellipse(this.x + (this.scl / 2), this.y + (this.scl / 2), scl / 2);
            } else {
                if (this.minesAround !== 0) {
                    fill(0);
                    textSize(17);
                    strokeWeight(1);
                    textAlign(CENTER, CENTER);
                    text(this.minesAround, this.x + (scl / 2), this.y + (scl / 2) + 2);
                } else {
                    for (let xOff = -1; xOff <= 1; xOff++) {
                        for (let yOff = -1; yOff <= 1; yOff++) {
                            let k = this.i + xOff;
                            let l = this.j + yOff;

                            if (k > -1 && k < cols && l > -1 && l < rows) {
                                grid[k][l].reveal();
                            }
                        }
                    }
                }
            }
        } else {
            this.toReveal = false;
        }
    };

    this.contains = function(x, y) {
        return (x > this.x && x < this.x + this.scl && y > this.y && y < this.y + this.scl)
    };

    this.reveal = function() {
        this.toReveal = true;
    };

    this.countMinesAround = function() {
        if (this.mine) {
            return -1;
        }

        let total = 0;
        for (let xOff = -1; xOff <= 1; xOff++) {
            for (let yOff = -1; yOff <= 1; yOff++) {
                let k = this.i + xOff;
                let l = this.j + yOff;

                if (k > -1 && k < cols && l > -1 && l < rows) {
                    let neighbor = grid[k][l];
                    if (neighbor.mine) {
                        total++;
                    }
                }
            }
        }

        this.minesAround = total;
    };

    this.flag = function() {
        this.flagged = !this.flagged;
    };

    this.revealAround = function() {
        if (this.revealed) {
            let flaggedAround = 0;

            for (let xOff = -1; xOff <= 1; xOff++) {
                for (let yOff = -1; yOff <= 1; yOff++) {
                    let k = this.i + xOff;
                    let l = this.j + yOff;

                    if (k > -1 && k < cols && l > -1 && l < rows) {
                        if (grid[k][l].flagged) {
                            flaggedAround++;
                        }
                    }
                }
            }

            if (flaggedAround === this.minesAround) {
                for (let xOff = -1; xOff <= 1; xOff++) {
                    for (let yOff = -1; yOff <= 1; yOff++) {
                        let k = this.i + xOff;
                        let l = this.j + yOff;

                        if (k > -1 && k < cols && l > -1 && l < rows) {
                            if (!grid[k][l].flagged) {
                                grid[k][l].reveal();
                            }
                        }
                    }
                }
            }
        }
    };
}
const blackPieces = {
    "pawn": "♟",
    "king": "♚", 
    "queen": "♛", 
    "bishop": "♝", 
    "knight": "♞", 
    "rook": "♜"
}
const whitePieces = { 
    "pawn": "♙",
    "king": "♔", 
    "queen": "♕", 
    "bishop": "♗", 
    "knight": "♘", 
    "rook": "♖"
}

class Piece { 
    constructor(piece, isWhite, board) {
        this.piece = piece;
        this.isWhite = isWhite;
        this.board = board;
    }
    display() {
        return this.isWhite ? whitePieces[this.piece] : blackPieces[this.piece]
    }
    canCapture(capturedPiece) {
        return capturedPiece ? this.isWhite !== capturedPiece.isWhite : false
    }
    availableMoves(xPos, yPos) {
        return []
    }
    move(fromX, fromY, toX, toY) {
        const moves = this.availableMoves(fromX, fromY)
        if(moves.some(xy => xy[0] === toX && xy[1] === toY)) {
            this.board[toX][toY] = this.board[fromX][fromY]
            this.board[fromX][fromY] = null
        }
    }
}

class Pawn extends Piece {
    constructor(isWhite, board) {
        super("pawn", isWhite, board);
    }
    availableMoves(xPos, yPos) {
        const direction = this.isWhite ? 1 : -1
        const starting = this.isWhite ? xPos === 1 : xPos === 6
        let moves = []
        for(let i = -1; i <= 1; i++) {
            const x = xPos + direction
            const y = yPos + i
            if(i !== 0 && this.canCapture(this.board[x][y])) {
                moves.push([x, y])
            } else if (i === 0 && !this.canCapture(this.board[x][y])) {
                moves.push([x, y])
                if(starting) { moves.push([xPos + (direction * 2), y]) }
            }
        }
        return moves
    }
}
class King extends Piece {
    constructor(isWhite, board) {
        super("king", isWhite, board);
    }
}
class Queen extends Piece {
    constructor(isWhite, board) {
        super("queen", isWhite, board);
    }
}
class Knight extends Piece {
    constructor(isWhite, board) {
        super("knight", isWhite, board);
    }
}
class Bishop extends Piece {
    constructor(isWhite, board) {
        super("bishop", isWhite, board);
    }
}
class Rook extends Piece {
    constructor(isWhite, board) {
        super("rook", isWhite, board);
    }
}

let grid = [...Array(8)].map(e => Array(8).fill(null));

for(let i = 0; i < 8; i++) {
    grid[1][i] = new Pawn(true, grid)
    grid[6][i] = new Pawn(false, grid)
}
//grid[1][7].move(1, 7, 2, 7)
//grid[6][6].move(6, 6, 5, 6);

function renderBoard() {
    const boardDiv = document.querySelector('.board') 
    boardDiv.innerHTML = ""
    let num = 0
    grid.forEach(row => {
        r = document.createElement('div');
        numDiv = document.createElement('span')
        numDiv.innerHTML = num
        r.appendChild(numDiv)
        row.forEach(square => {
            s = document.createElement('span');
            s.innerHTML = square ? square.display() : "#"
            r.appendChild(s);
        });
        num += 1
        boardDiv.appendChild(r)
    });
    r = document.createElement('div');
    for(let i = 0; i < 8; i++) {
        s = document.createElement('span');
        s.innerHTML = ` ${i}`
        r.appendChild(s)
    }
    boardDiv.appendChild(r)
}
renderBoard()
processInputs()
function processInputs() {
    const input = document.querySelector('input')
    input.addEventListener('keypress', (e) => {
        if(e.key === "Enter")
        {
            values = input.value.split(" ")
            values = values.map(x => Number(x))
            console.log(values)
            grid[values[0]][values[1]].move(values[0], values[1], values[2], values[3])
            renderBoard()
        }
    })
}


console.log(grid)

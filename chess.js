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

grid[1][0].move(1, 0, 3, 0)
grid[6][0].move(6, 0, 5, 0);

function renderBoard() {
    const boardDiv = document.querySelector('.board') 
    boardDiv.innerHTML = ""
    grid.forEach(row => {
        r = document.createElement('div');
        row.forEach(square => {
            s = document.createElement('span');
            s.innerHTML = square ? square.display() : "#"
            r.appendChild(s);
        });
        boardDiv.appendChild(r)
    });
}
renderBoard()
//grid[2][0].move(2, 0, 3, 0)
//renderBoard()


console.log(grid)

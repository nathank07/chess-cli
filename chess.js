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
        this.board = board
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
    showAvailableMoves(xPos, yPos) {
        return this.availableMoves(xPos, yPos)
    }
}

class Pawn extends Piece {
    constructor(isWhite, board) {
        super("pawn", isWhite, board);
    }
    availableMoves(xPos, yPos) {
        const x = this.isWhite ? xPos + 1 : xPos - 1
        let moves = []
        for(let i = -1; i <= 1; i++) {
            const y = yPos + i
            if(i !== 0 && this.canCapture(this.board[x][y])) {
                moves.push([x, y])
            } else if (i === 0 && !this.canCapture(this.board[x][y])) {
                moves.push([x, y])
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

const board = document.querySelector('.board') 

grid.forEach(row => {
    r = document.createElement('div');
    row.forEach(square => {
        s = document.createElement('span');
        s.innerHTML = square ? square.display() : "#"
        r.appendChild(s);
    });
    board.appendChild(r)
});


console.log(grid)

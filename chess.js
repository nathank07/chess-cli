const pieces = {
    "pawn": "♟",
    "king": "♚", 
    "queen": "♛", 
    "bishop": "♝", 
    "knight": "♞", 
    "rook": "♜"
}

class Piece { 
    constructor(piece, isWhite, board) {
        this.piece = piece;
        this.isWhite = isWhite;
        this.board = board
    }
    display() {
        return console.log(pieces[this.piece])
    }
    canCapture(capturedPiece) {
        return capturedPiece !== "#" ? this.isWhite !== capturedPiece.isWhite : false
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

let grid = [...Array(8)].map(e => Array(8).fill('#'));


grid[2][0] = new Pawn(false, grid)
grid[2][1] = new Pawn(false, grid)
grid[1][1] = new Pawn(true, grid)
grid[2][2] = new Pawn(false, grid)

grid[1][1].availableMoves(1, 1).forEach(array => {
    console.log(array[0], array[1])
});

console.log(grid)

const pieces = {
    "pawn": "♟",
    "king": "♚", 
    "queen": "♛", 
    "bishop": "♝", 
    "knight": "♞", 
    "rook": "♜"
}

class Piece { 
    constructor(piece, color) {
        this.piece = piece;
        this.color = color;
    }
    display() {
        return console.log(pieces[this.piece])
    }
    canCapture(capturedPiece) {
        return this.color !== capturedPiece.color
    }
}

pawn = new Piece("pawn", true)
pawn2 = new Piece("pawn", false)

console.log(pawn.piece)
pawn.display()
console.log(pawn.canCapture(pawn2))
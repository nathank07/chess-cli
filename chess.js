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

const grid = [...Array(8)].map(e => Array(8).fill(null));

function Piece ( { name, isWhite, availableMoves, board } ) { 
    return {
        name: name,
        isWhite: isWhite,
        availableMoves: availableMoves,
        board: board,
        display: () => {
            return isWhite ? whitePieces[name] : blackPieces[name]
        },
        canCapture: (capturedPiece) => {
            return capturedPiece ? isWhite !== capturedPiece.isWhite : false
        },
        move: (fromX, fromY, toX, toY) => {
            const moves = availableMoves(fromX, fromY) || [] 
            if(moves.some(xy => xy[0] === toX && xy[1] === toY)) {
                board[toX][toY] = board[fromX][fromY]
                board[fromX][fromY] = null
            }
        }
    }
}

function Pawn( { isWhite, board } ) {
    const piece = Piece({
        name: "pawn",
        isWhite: isWhite,
        board: board,
        availableMoves: (xPos, yPos) => {
            const direction = isWhite ? 1 : -1
            const starting = isWhite ? xPos === 1 : xPos === 6
            let moves = []
            for(let i = -1; i <= 1; i++) {
                const x = xPos + direction
                const y = yPos + i
                if(i !== 0 && piece.canCapture(board[x][y])) {
                    moves.push([x, y])
                } else if (i === 0 && !piece.canCapture(board[x][y])) {
                    moves.push([x, y])
                    if(starting) { moves.push([xPos + (direction * 2), y]) }
                }
            }
            return moves
        }
    })
    return piece;
}

function createPiece(piece, isWhite) {
    let createdPiece = {};
    switch(piece){
        case "pawn":
            createdPiece = Pawn({ isWhite: isWhite, board: grid })
            break
        default:
            createdPiece = { availableMoves: () => [] }
    }
    const genericPiece = Piece( {
        name: piece, 
        isWhite: isWhite,
        availableMoves: createdPiece.availableMoves,
        board: grid} )
    return {
        ...genericPiece,
        ...createdPiece
    }
}

grid[1][1] = createPiece("pawn", true)
console.log(grid[1][1].display())
//grid[1][1].move(1, 1, 3, 1)
console.log(grid[1][1].availableMoves(1, 1))


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


// for(let i = 0; i < 8; i++) {
//     grid[1][i] = new Pawn(true, grid)
//     grid[6][i] = new Pawn(false, grid)
// }

// function renderBoard() {
//     const boardDiv = document.querySelector('.board') 
//     boardDiv.innerHTML = ""
//     let num = 0
//     grid.forEach(row => {
//         r = document.createElement('div');
//         numDiv = document.createElement('span')
//         numDiv.innerHTML = num
//         r.appendChild(numDiv)
//         row.forEach(square => {
//             s = document.createElement('span');
//             s.innerHTML = square ? square.display() : "#"
//             r.appendChild(s);
//         });
//         num += 1
//         boardDiv.appendChild(r)
//     });
//     r = document.createElement('div');
//     for(let i = 0; i < 8; i++) {
//         s = document.createElement('span');
//         s.innerHTML = ` ${i}`
//         r.appendChild(s)
//     }
//     boardDiv.appendChild(r)
// }
// renderBoard()
// processInputs()
// function processInputs() {
//     const input = document.querySelector('input')
//     input.addEventListener('keypress', (e) => {
//         if(e.key === "Enter")
//         {
//             values = input.value.split(" ")
//             values = values.map(x => Number(x))
//             console.log(values)
//             grid[values[0]][values[1]].move(values[0], values[1], values[2], values[3])
//             renderBoard()
//         }
//     })
// }


console.log(grid)

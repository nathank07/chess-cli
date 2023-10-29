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

                if(outOfBounds(x, y)) { continue }

                if(i !== 0 && piece.canCapture(board[x][y])) {
                    moves.push([x, y])
                } 

                else if (i === 0 && !piece.canCapture(board[x][y])) {
                    if(starting) { moves.push([xPos + (direction * 2), y]) }
                    moves.push([x, y])
                }

            }
            return moves
        }
    })
    return piece;
}
function King( { isWhite, board } ) {
    const piece = Piece({
        
        name: "king",
        isWhite: isWhite,
        board: board,

        inCheck: (xPos, yPos) => {
            let check = false;
            board.forEach(row => {
                row.forEach(square => {
                    if(square.availableMoves().some(xy => xy[0] === xPos && xy[1] === yPos)) {
                        check = true;
                    }
                })
            });
            return check;
        },

        availableMoves: (xPos, yPos) => {
            let moves = []
            for(let i = -1; i <= 1; i++) {
                const x = i + xPos
                for(let j = -1; j <= 1; j++) {
                    const y = i + yPos

                    if(outOfBounds(x, y)) { continue }

                    if(board[x][y] === null || piece.canCapture(board[x][y])) {
                        moves.push([(x, y)])
                    }
                }
            }
            return moves
        },

    })
    return piece;
}
function Knight( { isWhite, board } ) {
    const piece = Piece({
        name: "knight",
        isWhite: isWhite,
        board: board,

        availableMoves: (xPos, yPos) => {
            let moves = [];
            const knightMoves = [
                [2, 1],
                [1, 2],
                [-2, 1],
                [-1, 2],
                [2, -1],
                [1, -2],
                [-2, -1],
                [-1, -2]
            ]
            knightMoves.forEach(move => {
                const x = xPos + move[0]
                const y = yPos + move[1]
                if(!outOfBounds(x, y) && (board[x][y] === null || piece.canCapture(board[x][y]))) {
                    moves.push([x, y])
                }
            });
            
            return moves
        }
    })
    return piece;
}
function createPiece(piece, isWhite) {
    let createdPiece = {};

    switch(piece){
        case "pawn":
            createdPiece = Pawn( { isWhite: isWhite, board: grid } )
            break
        case "king":
            createdPiece = King( { isWhite: isWhite, board: grid } )
            break
        case "knight":
            createdPiece = Knight( { isWhite: isWhite, board: grid } )
            break
        case "rook":
            createdPiece = Rook( { isWhite: isWhite, board: grid } )
            break
        case "bishop":
            createdPiece = Bishop( { isWhite: isWhite, board: grid } )
            break
        default:
            createdPiece = { availableMoves: () => [] }
            break
    }

    const genericPiece = Piece( {
        name: piece, 
        isWhite: isWhite,
        availableMoves: createdPiece.availableMoves,
        board: grid
    })

    return {
        ...genericPiece,
        ...createdPiece
    }
}

class Queen extends Piece {
    constructor(isWhite, board) {
        super("queen", isWhite, board);
    }
}
function Bishop( { isWhite, board } ) {
    const piece = Piece({
        name: "bishop",
        isWhite: isWhite,
        board: board,

        availableMoves: (xPos, yPos) => {
            const directions = [
                [1, 1],
                [1, -1], 
                [-1, 1], 
                [-1, -1]  
              ];
            let moves = []
            for (const direction of directions) {
                let [dx, dy] = direction;
                let x = xPos + dx;
                let y = yPos + dy;
                while (!outOfBounds(x, y)) {
                    if (board[x][y] === null || piece.canCapture(board[x][y])) {
                        moves.push([x, y]);
                        if (piece.canCapture(board[x][y])) {
                            break;
                        }
                    } else {
                        break;
                    }
                    x += dx;
                    y += dy;
                }
              }
              
            return moves
        }
    })

    return piece;
}
function Rook( { isWhite, board } ) {
    const piece = Piece({
        name: "rook",
        isWhite: isWhite,
        board: board,

        availableMoves: (xPos, yPos) => {
            const directions = [
                [1, 0],
                [-1, 0], 
                [0, 1], 
                [0, -1]  
              ];
            let moves = []
            for (const direction of directions) {
                let [dx, dy] = direction;
                let x = xPos + dx;
                let y = yPos + dy;
                while (!outOfBounds(x, y)) {
                    if (board[x][y] === null || piece.canCapture(board[x][y])) {
                        moves.push([x, y]);
                        if (piece.canCapture(board[x][y])) {
                            break;
                        }
                    } else {
                        break;
                    }
                    x += dx;
                    y += dy;
                }
              }
              
            return moves
        }
    })

    return piece;
}

function outOfBounds(x, y){
    return x < 0 || y < 0 || x >= 8 || y >= 8
}

for(let i = 0; i < 8; i++) {
    grid[1][i] = createPiece("knight", true)
    grid[6][i] = createPiece("knight", false)
}

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

//console.log(grid[1][1].availableMoves(1, 1))
//grid[1][1].availableMoves(1, 1)

grid[3][3] = createPiece("rook", true)
console.log(grid[3][3].availableMoves(3, 3))


renderBoard()
processInputs()
console.log(grid)

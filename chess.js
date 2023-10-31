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
            return isWhite ? whitePieces[name] || "" : blackPieces[name] || ""
        },

        canCapture: (capturedPiece) => {
            return capturedPiece ? isWhite !== capturedPiece.isWhite : false
        },

        move: (fromX, fromY, toX, toY) => {
            const moves = availableMoves(fromX, fromY)
            if(moves.some(xy => xy[0] === toX && xy[1] === toY)) {
                const index = moves.findIndex(xy => xy[0] === toX && xy[1] === toY);
                // Remove any en passant remnants
                for(let i = 0; i < 7; i++) {
                    if(board[2][i] && board[2][i].name === "passant") {
                        board[2][i] = null
                    }
                    if(board[5][i] && board[5][i].name === "passant") {
                        board[5][i] = null
                    }
                }
                board[toX][toY] = board[fromX][fromY]
                board[fromX][fromY] = null
                // Any additional things you may want a piece to do
                if(moves[index].length > 2) {
                    moves[index][2]()
                }
                
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
                    if(board[x][y].name === "passant") {
                        moves.push([x, y, () => {
                            board[x - direction][y] = null
                        }])
                    }
                    moves.push([x, y])
                } 

                else if (i === 0 && !piece.canCapture(board[x][y])) {
                    if(starting) { 
                        // add en passant object for this move
                        moves.push([xPos + (direction * 2), y, () => {
                            board[xPos + direction][y] = createPiece("passant", isWhite);
                        }]) 
                    }
                    moves.push([x, y])
                }

            }
            return moves
        },
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
    const pieceInfo = { isWhite: isWhite, board: grid }
    switch(piece){
        case "pawn":
            createdPiece = Pawn(pieceInfo)
            break
        case "king":
            createdPiece = King(pieceInfo)
            break
        case "knight":
            createdPiece = Knight(pieceInfo)
            break
        case "rook":
            createdPiece = Rook(pieceInfo)
            break
        case "bishop":
            createdPiece = Bishop(pieceInfo)
            break
        case "queen":
            createdPiece = Queen(pieceInfo)
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

function Queen( { isWhite, board } ) {
    const piece = Piece({
        name: "queen",
        isWhite: isWhite,
        board: board,
        availableMoves: (xPos, yPos) => {
            const bishop = Bishop({ isWhite: isWhite, board: grid });
            const rook = Rook({ isWhite: isWhite, board: grid });
            return bishop.availableMoves(xPos, yPos).concat(rook.availableMoves(xPos, yPos))
        }
    })
    return piece;
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


function renderBoard() {
    const boardDiv = document.querySelector('#board') 
    boardDiv.innerHTML = ""
    let num = 0
    let darkSquare = false;
    grid.forEach(row => {
        r = document.createElement('div');
        r.classList.add('row')
        row.forEach(square => {
            s = document.createElement('div');
            s.classList.add("square")
            darkSquare = !darkSquare
            if(darkSquare) { s.classList.add('darkSquare') }
            s.innerHTML = square ? square.display() : ""
            r.appendChild(s);
        });
        num += 1
        darkSquare = !darkSquare
        boardDiv.appendChild(r)
    });
    r = document.createElement('div');
    for(let i = 0; i < 8; i++) {
        s = document.createElement('span');
        s.innerHTML = ` ${i}`
        r.appendChild(s)
    }
    //boardDiv.appendChild(r)
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
            console.log(grid)
        }
    })
}

grid[1][1] = createPiece("pawn", true)
grid[3][2] = createPiece("pawn", false)

renderBoard()
processInputs()
console.log(grid)

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

function Piece ( { name, isWhite, standardMoves, board } ) { 
    return {

        name: name,
        isWhite: isWhite,
        standardMoves: standardMoves,
        board: board,

        display: () => {
            return isWhite ? whitePieces[name] || "" : blackPieces[name] || ""
        },

        canCapture: (capturedPiece) => {
            return capturedPiece ? isWhite !== capturedPiece.isWhite : false
        },

        move: (fromX, fromY, toX, toY) => {
            const moves = filterLegal(fromX, fromY, isWhite, standardMoves(fromX, fromY), board)
            if(moves.some(xy => xy[0] === toX && xy[1] === toY)) {
                const index = moves.findIndex(xy => xy[0] === toX && xy[1] === toY);
                // Remove any en passant remnants
                for(let i = 0; i < 8; i++) {
                    if(board[2][i] && board[2][i].name === "passant") {
                        board[2][i] = null
                        break
                    }
                    if(board[5][i] && board[5][i].name === "passant") {
                        board[5][i] = null
                        break
                    }
                }

                // Move piece
                board[toX][toY] = board[fromX][fromY]
                board[fromX][fromY] = null

                // Any additional things you may want a piece to do
                if(moves[index].length > 2) {
                    moves[index][2]()
                }
                return true;
            }
            return false
        }

    }
}

function Pawn( { isWhite, board } ) {
    const piece = Piece({
        name: "pawn",
        isWhite: isWhite,
        board: board,

        standardMoves: (xPos, yPos) => {
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

                else if (i === 0 && board[xPos + direction][y] == null) {
                    if(starting && board[xPos + (direction * 2)][y] == null) { 
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

        standardMoves: (xPos, yPos) => {
            let moves = []
            for(let i = -1; i <= 1; i++) {
                const x = i + xPos
                for(let j = -1; j <= 1; j++) {
                    const y = j + yPos

                    if(outOfBounds(x, y)) { continue }

                    if(board[x][y] === null || piece.canCapture(board[x][y])) {
                        moves.push([x, y])
                    }
                }
            }
            return moves
        },

    })

    piece.inCheck = (xPos, yPos) => {
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(board[i][j] && board[i][j].standardMoves(i, j).some(xy => xy[0] === xPos && xy[1] === yPos)) {
                    return true
                }
            }
        }
        return false
    }

    return piece;
}
function Knight( { isWhite, board } ) {
    const piece = Piece({
        name: "knight",
        isWhite: isWhite,
        board: board,

        standardMoves: (xPos, yPos) => {
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
function createPiece(piece, isWhite, board = grid) {
    let createdPiece = {};
    const pieceInfo = { isWhite: isWhite, board: board }
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
            createdPiece = { standardMoves: () => { return [] } }
            break
    }

    const genericPiece = Piece( {
        name: piece, 
        isWhite: isWhite,
        standardMoves: createdPiece.standardMoves,
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
        standardMoves: (xPos, yPos) => {
            const bishop = Bishop({ isWhite: isWhite, board: grid });
            const rook = Rook({ isWhite: isWhite, board: grid });
            return bishop.standardMoves(xPos, yPos).concat(rook.standardMoves(xPos, yPos))
        }
    })
    return piece;
}
function Bishop( { isWhite, board } ) {
    const piece = Piece({
        name: "bishop",
        isWhite: isWhite,
        board: board,

        standardMoves: (xPos, yPos) => {
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

        standardMoves: (xPos, yPos) => {
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

function isLegal(fromX, fromY, toX, toY, isWhite, board) {
    const boardClone = cloneBoard(board)
    boardClone[toX][toY] = boardClone[fromX][fromY]
    boardClone[fromX][fromY] = null
    let kingSquare;
    let moves = []
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(boardClone[i][j]) {
                const pieceMoves = boardClone[i][j].standardMoves(i, j)
                const color = boardClone[i][j].isWhite
                if(boardClone[i][j].name == "king" && color == isWhite){
                    kingSquare = [i, j]
                }
                if(color != isWhite) {
                    pieceMoves.map(move => moves.push(move))
                }
            }            
        }
    }
    if(kingSquare && moves.some(move => move[0] === kingSquare[0] && move[1] === kingSquare[1])) {
        console.log(moves)
        return false;
    }
    return true
}

function filterLegal(fromX, fromY, isWhite, standardMoves, board) {
    return standardMoves.filter(move => 
        isLegal(fromX, fromY, move[0], move[1], isWhite, board)
    );
}


function cloneBoard(board) {
    const newBoard = [...Array(8)].map(e => Array(8).fill(null));
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if(board[i][j]) {
                newBoard[i][j] = createPiece(board[i][j].name, board[i][j].isWhite, newBoard);
            }
        }
    }
    return newBoard;
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
            grid[values[0]][values[1]].move(values[0], values[1], values[2], values[3])
            renderBoard()
            console.log(grid)
        }
    })
}
for(let i = 0; i < 8; i++) {
    grid[1][i] = createPiece("pawn", true)
    grid[6][i] = createPiece("pawn", false)
}
grid[0][0] = createPiece("rook", true)
grid[0][7] = createPiece("rook", true)
grid[7][7] = createPiece("rook", false)
grid[7][0] = createPiece("rook", false)

grid[0][1] = createPiece("knight", true)
grid[0][6] = createPiece("knight", true)
grid[7][6] = createPiece("knight", false)
grid[7][1] = createPiece("knight", false)

grid[0][2] = createPiece("bishop", true)
grid[0][5] = createPiece("bishop", true)
grid[7][5] = createPiece("bishop", false)
grid[7][2] = createPiece("bishop", false)

//grid[0][3] = createPiece("king", true)
grid[0][4] = createPiece("queen", true)
grid[7][3] = createPiece("king", false)
grid[7][4] = createPiece("queen", false)

//grid[1][4] = createPiece("queen", false)

grid[3][3] = createPiece("king", true)

console.log(grid[3][3].standardMoves(3, 3))

renderBoard()
processInputs()
console.log(grid)

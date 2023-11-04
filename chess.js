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

function Piece ( { name, isWhite, xPos, yPos, standardMoves, board } ) { 
    return {

        name: name,
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        standardMoves: standardMoves,
        board: board,

        display: () => {
            return isWhite ? whitePieces[name] || "" : blackPieces[name] || ""
        },

        canCapture: (capturedPiece) => {
            return capturedPiece ? isWhite !== capturedPiece.isWhite : false
        },

        move: (toX, toY) => {
            const moves = filterLegal(xPos, yPos, isWhite, standardMoves(), board)
            if(moves.some(pos => pos[0] === toX && pos[1] === toY)) {
                const index = moves.findIndex(pos => pos[0] === toX && pos[1] === toY);
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
                createPiece(name, isWhite, toX, toY, board)
                board[xPos][yPos] = null

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

function Pawn( { isWhite, xPos, yPos, board } ) {
    const piece = Piece({
        name: "pawn",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        board: board,

        standardMoves: () => {
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
                            createPiece("passant", isWhite, xPos + direction, y);
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
function King( { isWhite, xPos, yPos, board } ) {
    const piece = Piece({
        name: "king",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        board: board,

        standardMoves: () => {
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
                if(board[i][j] && board[i][j].standardMoves().some(pos => pos[0] === xPos && pos[1] === yPos)) {
                    return true
                }
            }
        }
        return false
    }

    return piece;
}
function Knight( { isWhite, xPos, yPos, board } ) {
    const piece = Piece({
        name: "knight",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        board: board,

        standardMoves: () => {
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
function createPiece(piece, isWhite, xPos, yPos, board = grid) {
    let createdPiece = {};
    const pieceInfo = { isWhite: isWhite, xPos: xPos, yPos: yPos, board: board }
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
        xPos: xPos,
        yPos, yPos,
        standardMoves: createdPiece.standardMoves,
        board: board
    })

    board[xPos][yPos] = {
        ...genericPiece,
        ...createdPiece
    }

    return board[xPos][yPos]
}

function Queen( { isWhite, xPos, yPos, board } ) {
    const piece = Piece({
        name: "queen",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        board: board,
        standardMoves: () => {
            const bishop = Bishop({ isWhite: isWhite, xPos: xPos, yPos: yPos, board: grid });
            const rook = Rook({ isWhite: isWhite, xPos: xPos, yPos: yPos, board: grid });
            return bishop.standardMoves().concat(rook.standardMoves())
        }
    })
    return piece;
}
function Bishop( { isWhite, xPos, yPos, board } ) {
    const piece = Piece({
        name: "bishop",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        board: board,

        standardMoves: () => {
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
function Rook( { isWhite, xPos, yPos, board } ) {
    const piece = Piece({
        name: "rook",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        board: board,

        standardMoves: () => {
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
    const piece = boardClone[fromX][fromY]
    createPiece(piece.name, piece.isWhite, toX, toY, boardClone)
    boardClone[fromX][fromY] = null
    let kingSquare;
    let moves = []
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(boardClone[i][j]) {
                const pieceMoves = boardClone[i][j].standardMoves()
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
        return false;
    }
    return true
}

function filterLegal(xPos, yPos, isWhite, standardMoves, board) {
    return standardMoves.filter(move => 
        isLegal(xPos, yPos, move[0], move[1], isWhite, board)
    );
}


function cloneBoard(board) {
    const newBoard = [...Array(8)].map(e => Array(8).fill(null));
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if(board[x][y]) {
                createPiece(board[x][y].name, board[x][y].isWhite, x, y, newBoard);
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
            grid[values[0]][values[1]].move(values[2], values[3])
            renderBoard()
            console.log(grid)
        }
    })
}
for(let i = 0; i < 8; i++) {
    createPiece("pawn", true, 1, i)
    createPiece("pawn", false, 6, i)
}
createPiece("rook", true, 0, 0)
createPiece("rook", true, 0, 7)
createPiece("rook", false, 7, 7)
createPiece("rook", false, 7, 0)

createPiece("knight", true, 0, 1)
createPiece("knight", true, 0, 6)
createPiece("knight", false, 7, 6)
createPiece("knight", false, 7, 1)

createPiece("bishop", true, 0, 2)
createPiece("bishop", true, 0, 5)
createPiece("bishop", false, 7, 5)
createPiece("bishop", false, 7, 2)

//createPiece("king", true, 0, 3)

createPiece("queen", true, 0, 4)
createPiece("king", false, 7, 3)
createPiece("queen", false, 7, 4)
createPiece("king", true, 0, 3)

//createPiece("queen", false, 1, 4)



renderBoard()
processInputs()
console.log(grid)

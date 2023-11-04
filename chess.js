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

const chessGame = {
    board: [...Array(8)].map(e => Array(8).fill(null)),
    whitesMove: true,
    whiteState: {
        shortCastle: true,
        longCastle: true,
    },
    blackState: {
        shortCastle: true,
        longCastle: true,
    }
}

function Piece ( { name, isWhite, xPos, yPos, standardMoves, game } ) { 
    return {

        name: name,
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        standardMoves: standardMoves,
        game: game,

        display: () => {
            return isWhite ? whitePieces[name] || "" : blackPieces[name] || ""
        },

        canCapture: (capturedPiece) => {
            return capturedPiece ? isWhite !== capturedPiece.isWhite : false
        },

        move: (toX, toY) => {
            const moves = filterLegal(xPos, yPos, isWhite, standardMoves(), game.board)
            if(game.whitesMove === isWhite && moves.some(pos => pos[0] === toX && pos[1] === toY)) {
                const index = moves.findIndex(pos => pos[0] === toX && pos[1] === toY);
                // Remove any en passant remnants
                for(let i = 0; i < 8; i++) {
                    if(game.board[2][i] && game.board[2][i].name === "passant") {
                        game.board[2][i] = null
                        break
                    }
                    if(game.board[5][i] && game.board[5][i].name === "passant") {
                        game.board[5][i] = null
                        break
                    }
                }

                // Move piece and change side's move
                createPiece(name, isWhite, toX, toY, game)
                game.board[xPos][yPos] = null
                game.whitesMove = !game.whitesMove

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

function Pawn( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "pawn",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

        standardMoves: () => {
            const direction = isWhite ? 1 : -1
            const starting = isWhite ? xPos === 1 : xPos === 6
            let moves = []
            for(let i = -1; i <= 1; i++) {
                const x = xPos + direction
                const y = yPos + i

                if(outOfBounds(x, y)) { continue }

                if(i !== 0 && piece.canCapture(game.board[x][y])) {
                    if(game.board[x][y].name === "passant") {
                        moves.push([x, y, () => {
                            game.board[x - direction][y] = null
                        }])
                    }
                    moves.push([x, y])
                } 

                else if (i === 0 && game.board[xPos + direction][y] == null) {
                    if(starting && game.board[xPos + (direction * 2)][y] == null) { 
                        // add en passant object for this move
                        moves.push([xPos + (direction * 2), y, () => {
                            createPiece("passant", isWhite, xPos + direction, y, game);
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
function King( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "king",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

        standardMoves: () => {
            const moves = []
            const canCastle = game.whiteState === undefined ? false : checkCastleLegality(isWhite, game)
            const castleState = isWhite ? game.whiteState : game.blackState
            const kingRow = isWhite ? 0 : 7
            for(let i = -1; i <= 1; i++) {
                const x = i + xPos
                for(let j = -1; j <= 1; j++) {
                    const y = j + yPos

                    if(outOfBounds(x, y)) { continue }

                    if(game.board[x][y] === null || piece.canCapture(game.board[x][y])) {
                        moves.push([x, y, () => {
                            castleState.longCastle = false
                            castleState.shortCastle = false
                        }])
                    }
                }
            }
            if(canCastle) {
                if(canCastle.short) {
                    moves.push([kingRow, 1, () => {
                        castleState.longCastle = false
                        castleState.shortCastle = false
                        console.log("move rook")
                    }])
                }
                if(canCastle.long) {
                    moves.push([kingRow, 5, () => {
                        castleState.longCastle = false
                        castleState.shortCastle = false
                        console.log("move rook")
                    }])
                }
            }
            return moves
        },

    })

    piece.inCheck = () => {
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(game.board[i][j] && game.board[i][j].standardMoves().some(pos => pos[0] === xPos && pos[1] === yPos)) {
                    return true
                }
            }
        }
        return false
    }

    return piece;
}
function Knight( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "knight",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

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
                if(!outOfBounds(x, y) && (game.board[x][y] === null || piece.canCapture(game.board[x][y]))) {
                    moves.push([x, y])
                }
            });
            
            return moves
        }
    })
    return piece;
}
function createPiece(piece, isWhite, xPos, yPos, game = chessGame) {
    let createdPiece = {};
    const pieceInfo = { isWhite: isWhite, xPos: xPos, yPos: yPos, game: game }
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
        game: game
    })

    game.board[xPos][yPos] = {
        ...genericPiece,
        ...createdPiece
    }

    return game.board[xPos][yPos]
}

function Queen( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "queen",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,
        standardMoves: () => {
            const bishop = Bishop({ isWhite: isWhite, xPos: xPos, yPos: yPos, game: game });
            const rook = Rook({ isWhite: isWhite, xPos: xPos, yPos: yPos, game: game });
            return bishop.standardMoves().concat(rook.standardMoves())
        }
    })
    return piece;
}
function Bishop( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "bishop",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

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
                    if (game.board[x][y] === null || piece.canCapture(game.board[x][y])) {
                        moves.push([x, y]);
                        if (piece.canCapture(game.board[x][y])) {
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
function Rook( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "rook",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

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
                    if (game.board[x][y] === null || piece.canCapture(game.board[x][y])) {
                        moves.push([x, y]);
                        if (piece.canCapture(game.board[x][y])) {
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
    createPiece(piece.name, piece.isWhite, toX, toY, {board: boardClone})
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

function checkCastleLegality(isWhite, game) {
    const castleState = isWhite ? game.whiteState : game.blackState
    const kingRow = isWhite ? 0 : 7
    if(castleState === undefined || !castleState.shortCastle && !castleState.longCastle) {
        return false
    }
    // Get all of the moves here instead of isLegal because these don't have to be legal captures
    const moves = []
    const boardClone = cloneBoard(game.board)
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(game.board[i][j] && game.board[i][j].isWhite === !isWhite) {
                boardClone[i][j].standardMoves().map(move => moves.push(move))
            }            
        }
    }
    let short = true
    let long = true
    if(castleState.shortCastle) {
        if(moves.some(move => move[0] === kingRow && move[1] === 2) 
        || moves.some(move => move[0] === kingRow && move[1] === 1)) {
            short = false
        }
    }
    if(castleState.longCastle) {
        if(moves.some(move => move[0] === kingRow && move[1] === 4) 
        || moves.some(move => move[0] === kingRow && move[1] === 5)) {
            long = false
        }
    }
    console.log(short, long)
    return {short, long}
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
                createPiece(board[x][y].name, board[x][y].isWhite, x, y, {board: newBoard});
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
    chessGame.board.forEach(row => {
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
            chessGame.board[values[0]][values[1]].move(values[2], values[3])
            renderBoard()
            console.log(chessGame)
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


// createPiece("knight", true, 0, 1)
// createPiece("knight", true, 0, 6)
// createPiece("knight", false, 7, 6)
// createPiece("knight", false, 7, 1)

// createPiece("bishop", true, 0, 2)
// createPiece("bishop", true, 0, 5)
// createPiece("bishop", false, 7, 5)
// createPiece("bishop", false, 7, 2)


// createPiece("queen", true, 0, 4)
createPiece("king", false, 7, 3)
// createPiece("queen", false, 7, 4)
createPiece("king", true, 0, 3)

createPiece("rook", false, 1, 2)
console.log("gguu", chessGame.board[1][2].standardMoves())

console.log(chessGame.board[0][3].standardMoves())




renderBoard()
processInputs()
console.log(chessGame)

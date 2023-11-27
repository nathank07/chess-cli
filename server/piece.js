function Piece ( { name, isWhite, xPos, yPos, standardMoves, game } ) { 
    return {
        name: name,
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        standardMoves: standardMoves,
        game: game,

        canCapture: (capturedPiece) => {
            return capturedPiece ? isWhite !== capturedPiece.isWhite : false
        },

        move: (toX, toY, promotion) => {
            const moves = standardMoves().filter(move => 
                isLegal(xPos, yPos, move[0], move[1], isWhite, game.board)
            );
            if(game.whitesMove === isWhite && moves.some(pos => pos[0] === toX && pos[1] === toY)) {
                const index = moves.findIndex(pos => pos[0] === toX && pos[1] === toY);
                game.lastMove = [convertLocationToNotation(xPos, yPos), convertLocationToNotation(toX, toY)]

                if(game.board[toX][toY] && name !== "pawn" && game.board[toX][toY].name === "passant") {
                    game.lastMoveSound = "place"
                }

                if(name === "pawn" || game.lastMoveSound === "capture") {
                    game.fiftyMoveRule = 0
                } else {
                    game.fiftyMoveRule += 1
                }

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
                if(promotion) {
                    name = promotion
                }
                createPiece(name, isWhite, toX, toY, game)
                game.board[xPos][yPos] = null
                game.whitesMove = !game.whitesMove

                // Any additional things you may want a piece to do
                if(moves[index].length > 2 && !promotion) {
                    const func = moves[index][2]()
                    if(func && func[Symbol.toStringTag] === 'Promise') {
                        return (async () => {
                            const piece = await func
                            undoMove(game, false)
                            game.board[xPos][yPos].move(toX, toY, piece, true)
                            return true
                        })()
                    }
                }

                if(inCheck(game)) {
                    game.lastMoveSound = "check"
                }

                return true
            }
            return false
        },
        moves: () => {
            return standardMoves().filter(move => 
                isLegal(xPos, yPos, move[0], move[1], isWhite, game.board)
            );
        }

    }
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

function inCheck(game) {
    let check = false
    game.board.forEach((row, x) => {        
        row.forEach((square, y) => {
            if(game.board[x][y] && game.board[x][y].name === "king" && game.board[x][y].inCheck()) {
                check = convertLocationToNotation(x, y)
            }
        })
    });
    return check
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
                    if (game.board[x][y] === null || piece.canCapture(game.board[x][y]) || game.board[x][y].name === "passant") {
                        moves.push([x, y, () => {
                            if(xPos === 0 && yPos === 0) { game.whiteState.shortCastle = false }
                            if(xPos === 0 && yPos === 7) { game.whiteState.longCastle = false }
                            if(xPos === 7 && yPos === 0) { game.blackState.shortCastle = false }
                            if(xPos === 7 && yPos === 7) { game.blackState.longCastle = false }
                        }]);
                        if (piece.canCapture(game.board[x][y]) && game.board[x][y].name !== "passant") {
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
                    if (game.board[x][y] === null || piece.canCapture(game.board[x][y]) || game.board[x][y].name === "passant") {
                        moves.push([x, y]);
                        if (piece.canCapture(game.board[x][y]) && game.board[x][y].name !== "passant") {
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
                if(canCastle.short && game.board[kingRow][1] === null && game.board[kingRow][2] === null) {
                    moves.push([kingRow, 1, () => {
                        castleState.longCastle = false
                        castleState.shortCastle = false
                        game.board[kingRow][0] = null
                        createPiece("rook", isWhite, kingRow, 2, game)
                    }])
                }
                if(canCastle.long && game.board[kingRow][4] === null && game.board[kingRow][5] === null && game.board[kingRow][6] === null) {
                    moves.push([kingRow, 5, () => {
                        castleState.longCastle = false
                        castleState.shortCastle = false
                        game.board[kingRow][7] = null
                        createPiece("rook", isWhite, kingRow, 4, game)
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
            if(game.board[i][j]) {
                if(game.board[i][j].isWhite === !isWhite) {
                    boardClone[i][j].standardMoves().map(move => moves.push(move))
                }
                if(game.board[i][j].name === "king" && game.board[i][j].isWhite === isWhite){
                    if(boardClone[i][j].inCheck()) {
                        return false;
                    }
                }         
            }   
        }
    }
    let short = false
    let long = false
    if(castleState.shortCastle) {
        if(!moves.some(move => move[0] === kingRow && move[1] === 2) 
        && !moves.some(move => move[0] === kingRow && move[1] === 1)) {
            short = true
        }
        if(game.board[kingRow][0].isWhite !== isWhite || game.board[kingRow][0].name !== "rook") {
            castleState.shortCastle = false
            short = false
        }
    }
    if(castleState.longCastle) {
        if(!moves.some(move => move[0] === kingRow && move[1] === 4) 
        && !moves.some(move => move[0] === kingRow && move[1] === 5)) {
            long = true
        }
        if(game.board[kingRow][7].isWhite !== isWhite || game.board[kingRow][7].name !== "rook") {
            castleState.longCastle = false
            long = false
        }
    }
    return {short, long}
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
                        continue
                    }
                    if(x === 0 || x === 7) {
                        moves.push([x, y, async () => {
                            //promotion logic
                            return "queen"
                        }])
                        continue
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
                    if(x === 0 || x === 7) {
                        moves.push([x, y, async () => {
                            //promotion logic
                            return "queen"                            
                        }])
                        continue
                    }
                    moves.push([x, y])
                }

            }
            return moves
        },
    })
    return piece;
}

function convertLocationToNotation(xPos, yPos) {
    const file = {
        0: "h",
        1: "g",
        2: "f",
        3: "e",
        4: "d",
        5: "c",
        6: "b",
        7: "a"
    }
    return `${file[yPos]}${xPos + 1}`
}

function createPiece(piece, isWhite, xPos, yPos, game) {
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

module.exports.createPiece = createPiece
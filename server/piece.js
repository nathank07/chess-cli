const { Chess } = require('chess.js')

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

        move: (toX, toY, promotion, uci) => {
            if(uci !== undefined && threeFoldRepetition(game)) {
                return false
            }
            if(game.fiftyMoveRule > 100) {
                return false
            }
            const moves = standardMoves().filter(move => 
                isLegal(xPos, yPos, move[0], move[1], isWhite, game.board)
            );
            if(game.whitesMove === isWhite && moves.some(pos => pos[0] === toX && pos[1] === toY)) {
                const index = moves.findIndex(pos => pos[0] === toX && pos[1] === toY);
                game.lastMove = [convertLocationToNotation(xPos, yPos), convertLocationToNotation(toX, toY)]

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
                if(uci) {
                    game.uci.push(uci)
                }
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
                if(uci !== undefined) {
                    const gameResult = gameOver(game)
                    return gameResult ? gameResult : true
                }
                return true
            }
            return false
        },
        moves: () => {
            if(game.fiftyMoveRule > 100 || threeFoldRepetition(game) || game.whitesMove !== isWhite) {
                return []
            }
            return standardMoves().filter(move => 
                isLegal(xPos, yPos, move[0], move[1], isWhite, game.board)
            )
        }

    }
}

function threeFoldRepetition(game) {
    const newChessGame = FENtoBoard(game.fen)
    const positions = []
    game.uci.forEach((UCI) => {
        const startSquare = convertNotationtoLocation(UCI.substring(0, 2).toLowerCase())
        const endSquare = convertNotationtoLocation(UCI.substring(2, 4).toLowerCase())
        const promotion = UCI.substring(4, 5)
        const pieces = {
            "q": "queen",
            "r": "rook",
            "n": "knight",
            "b": "bishop"
        }
        newChessGame.board[startSquare[0]][startSquare[1]].move(endSquare[0], endSquare[1], promotion ? pieces[promotion.toLowerCase()] : false, undefined, true)
        positions.push(gametoFEN(newChessGame).split(" ")[0])
    })
    let numberOfPositions = 0
    positions.forEach(position => {
        const totalCurrentPos = positions.filter(pos => pos === position).length
        if(totalCurrentPos >= numberOfPositions) {
            numberOfPositions = totalCurrentPos
        }
    });
    return numberOfPositions >= 3
}

// Avoids circular dependencies... Too lazy to refactor...
function convertNotationtoLocation(notation) {
    const file = {
        "h": 0,
        "g": 1,
        "f": 2,
        "e": 3,
        "d": 4,
        "c": 5,
        "b": 6,
        "a": 7
    }
    return [Number(notation[1].toLowerCase()) - 1, file[notation[0]]]
}

function FENtoBoard(FENstring) {
    const chessGame = {
        board: [...Array(8)].map(e => Array(8).fill(null)),
        whitesMove: true,
        whiteState: {
            shortCastle: false,
            longCastle: false,
        },
        blackState: {
            shortCastle: false,
            longCastle: false,
        },
        lastMove: null,
        fiftyMoveRule: 0,
        fen: FENstring
    }
    
    const pieces = {
        "p": "pawn",
        "q": "queen",
        "b": "bishop",
        "n": "knight",
        "r": "rook",
        "k": "king"
    }

    FENstring = FENstring.split(" ")

    const board = [...FENstring[0].split("/")].reverse()

    board.forEach((row, i) => {
        row = row.replace(/\d+/g, (number) => {
            return "#".repeat(Number(number))
        })
        row.split("").reverse().forEach((char, j) => {
            const isWhite = char === char.toUpperCase()
            if(char !== "#") {
                createPiece(pieces[char.toLowerCase()], isWhite, i, j, chessGame)
            }
        });
    });
    
    chessGame.whitesMove = FENstring[1] === "w"

    FENstring[2].split("").forEach(char => {
        if(char === "k") {
            chessGame.blackState.shortCastle = true
        }
        if(char === "q") {
            chessGame.blackState.longCastle = true
        }
        if(char === "K") {
            chessGame.whiteState.shortCastle = true
        }
        if(char === "Q") {
            chessGame.whiteState.longCastle = true
        }
    });

    if(FENstring[3] !== "-") {
        const loc = convertNotationtoLocation(FENstring[3])
        createPiece("passant", !chessGame.whitesMove, loc[0], loc[1], chessGame)
    }

    chessGame.fiftyMoveRule = Number(FENstring[4])

    return chessGame
}

function outOfBounds(x, y){
    return x < 0 || y < 0 || x >= 8 || y >= 8
}

function gametoFEN(game) {
    const pieces = {
        "pawn": "p",
        "queen": "q", 
        "bishop": "b",
        "knight": "n",
        "rook": "r",
        "king": "k",
    }

    let number = 0
    let FEN = ""
    let passantSquare
    game.board.forEach((row, i) => {
        row.forEach((square, j) => {
            if(square === null) {
                number += 1
            }
            if(square && square.name === "passant") {
                number += 1
                passantSquare = [i, j]
            }
            if(square && square.name !== "passant") {
                const piece = pieces[square.name]
                FEN += number ? number : ""
                FEN += square.isWhite ? piece.toUpperCase() : piece
                number = 0
            }
        })
        FEN += number ? number : ""
        number = 0
        FEN += "/"
    })
    FEN = FEN.substring(0, FEN.length - 1) + " "

    FEN += game.whitesMove ? "w " : "b "

    if(game.whiteState.shortCastle) {
        FEN += "K"
    }
    if(game.whiteState.longCastle) {
        FEN += "Q"
    }
    if(game.blackState.shortCastle) {
        FEN += "k"
    }
    if(game.blackState.longCastle) {
        FEN += "q"
    }
    if(!game.whiteState.shortCastle && !game.whiteState.longCastle && !game.blackState.shortCastle && !game.blackState.longCastle) {
        FEN += "-"
    }

    FEN += " "

    FEN += passantSquare ? convertLocationToNotation(passantSquare[0], passantSquare[1]) : "-"

    FEN += ` ${game.fiftyMoveRule} 1`

    return FEN
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

function gameOver(game) {
    if(game.fiftyMoveRule > 100) {
        return { result: "Stalemate", reason: "Fifty move rule" }
    }
    if(threeFoldRepetition(game)) {
        return { result: "Stalemate", reason: "Threefold Repetition" }
    }
    try {
        const chess = new Chess(gametoFEN(game))
        if(chess.isCheckmate()) {
            return { result: !game.whitesMove ? "White" : "Black", reason: "Checkmate" }
        }
        if(chess.isStalemate()) {
            return { result: "Stalemate", reason: "No more moves" }
        }
        if(chess.isInsufficientMaterial()) {
            return { result: "Stalemate", reason: "Insufficient material"}
        }
    } catch (e) {
        console.log(gametoFEN(game))
        console.log(e)
        const gameOverObject = fallbackGameOver(game)
        if(gameOverObject) {
            return gameOverObject
        }
    }
    return false
}

function fallbackGameOver(game) {
    // This solution is too slow so I use chess.js for this
    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            if(game.board[x][y] && game.board[x][y].isWhite === game.whitesMove && game.board[x][y].moves().length > 0) {
                return false
            }
        }
    }
    if(inCheck(game)) {
        return { result: !game.whitesMove ? "White" : "Black", reason: "Checkmate" }
    }
    return { result: "Stalemate", reason: "No more moves" }
}

module.exports.createPiece = createPiece
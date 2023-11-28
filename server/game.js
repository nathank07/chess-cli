const { createPiece } = require("./piece.js")

function moveUCI(game, UCI) {
    const startSquare = convertNotationtoLocation(UCI.substring(0, 2).toLowerCase())
    const endSquare = convertNotationtoLocation(UCI.substring(2, 4).toLowerCase())
    const promotion = UCI.substring(4, 5)
    const pieces = {
        "q": "queen",
        "r": "rook",
        "n": "knight",
        "b": "bishop"
    }
    if( game.board[startSquare[0]][startSquare[1]] &&
        game.board[startSquare[0]][startSquare[1]].move(endSquare[0], endSquare[1], promotion ? pieces[promotion.toLowerCase()] : false, UCI)) {
        return true
    } else {
        return false
    }
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
        fen: FENstring,
        uci: [],
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

module.exports.moveUCI = moveUCI
module.exports.FENtoBoard = FENtoBoard
module.exports.convertNotationtoLocation = convertNotationtoLocation

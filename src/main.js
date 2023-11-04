import "./styles.css"
import createPiece from "./pieces/piece.js"


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

export default chessGame



function renderBoard() {
    const boardDiv = document.querySelector("#board")
    boardDiv.innerHTML = ""
    let darkSquare = false
    chessGame.board.forEach(row => {
        row.forEach(square => {
            const div = document.createElement('div')
            div.classList.add("square")
            darkSquare = !darkSquare
            if(darkSquare) { div.classList.add('darkSquare') }
            div.innerHTML = square ? square.display() : ""
            boardDiv.appendChild(div)
        });
        darkSquare = !darkSquare
    });
}
function processInputs() {
    const input = document.querySelector('input')
    input.addEventListener('keypress', (e) => {
        if(e.key === "Enter")
        {
            let values = input.value.split(" ")
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
createPiece("rook", false, 2, 1)

createPiece("knight", true, 0, 1)
createPiece("knight", true, 0, 6)
createPiece("knight", false, 7, 6)
createPiece("knight", false, 7, 1)

createPiece("bishop", true, 0, 2)
createPiece("bishop", true, 0, 5)
createPiece("bishop", false, 7, 5)
createPiece("bishop", false, 7, 2)


createPiece("queen", true, 0, 4)
createPiece("king", false, 7, 3)
createPiece("queen", false, 7, 4)
createPiece("king", true, 0, 3)

//createPiece("rook", false, 1, 2)



renderBoard()
processInputs()
console.log(chessGame)

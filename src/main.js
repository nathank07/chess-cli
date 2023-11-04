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
    const boardDiv = document.querySelector('#board') 
    boardDiv.innerHTML = ""
    let num = 0
    let darkSquare = false;
    chessGame.board.forEach(row => {
        let r = document.createElement('div');
        r.classList.add('row')
        row.forEach(square => {
            let s = document.createElement('div');
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
    let r = document.createElement('div');
    for(let i = 0; i < 8; i++) {
        let s = document.createElement('span');
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

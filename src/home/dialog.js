import newGame from "../game/websockets.js"

export default function linkDialog(createGameDialog) {
    createGameDialog.querySelector('#length').onchange = () => {
        const length = createGameDialog.querySelector('#length').value
        createGameDialog.querySelector('#length-span').textContent = length
    }
    createGameDialog.querySelector('#increment').onchange = () => {
        const increment = createGameDialog.querySelector('#increment').value
        createGameDialog.querySelector('#increment-span').textContent = increment
    }

    createGameDialog.querySelector('#create-final').addEventListener('click', async () => {
        const timeControl = {
            seconds: Number(createGameDialog.querySelector('#length').value),
            increment: Number(createGameDialog.querySelector('#increment').value)
        }
        const fen = createGameDialog.querySelector('#fen').value
        const isBlack = !createGameDialog.querySelector('#white').checked
        console.log(isBlack)
        const game = await newGame(fen, timeControl)
        window.location.href = window.location.origin + "/" + game.id + "/" + `${isBlack ? "?black=true" : ""}`
    })
}

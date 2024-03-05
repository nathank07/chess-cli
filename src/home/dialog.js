import newGame from "../game/websockets.js"
import checkRadio from "./main.js"

export default function linkDialog(createGameDialog) {
    const lengthRadio = document.querySelector('.radio-container.length > .tabs')
    const incrementRadio = document.querySelector('.radio-container.increment > .tabs')
    const colorRadio = document.querySelector('.radio-container.side > .tabs')

    createGameDialog.querySelector('#create-final').addEventListener('click', async () => {
        const seconds = returnTime(checkRadio(lengthRadio))
        const increment = returnTime(checkRadio(incrementRadio))
        const isBlack = checkRadio(colorRadio) === "Random" ? Math.random() > 0.5 : checkRadio(colorRadio) === "Black"
        const timeControl = {
            seconds: seconds,
            increment: increment
        }
        const fen = createGameDialog.querySelector('#fen').value
        const game = await newGame(fen, timeControl)
        window.location.href = window.location.origin + "/game/" + game.id + `${isBlack ? "?black=true" : ""}`
    })
}

function returnTime(time) {
    const unit = time.slice(-1)
    switch(unit) {
        case 's':
            return Number(time.slice(0, -1))
        case 'm':
            return Number(time.slice(0, -1)) * 60
        case 'h':
            return Number(time.slice(0, -1)) * 3600
        default:
            return Number(time)
    }
}

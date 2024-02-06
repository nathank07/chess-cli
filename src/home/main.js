import './home.css'
import '../header/header.css'
import '../footer/footer.css'
import newGame from "../game/websockets.js"
import { changePlayerSide } from "../chess/modify.js"
import { createTimerDiv } from '../game/main.js'
import createLiveBoards from './livegames.js'
import getFinishedGames from './completegames.js'

loadGames()

const createGameDialog = document.querySelector('dialog')
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
    window.location.href = window.location.href + game.id + `${isBlack ? "?black=true" : ""}`
})

document.querySelector("#create-game").addEventListener('click', () => {
    createGameDialog.showModal()
})

async function loadGames() {
    const finishedGames = await getFinishedGames()
    const live = document.querySelector('#game-list')
    const finished = document.querySelector('#game-history')
    createLiveBoards(live)
    createBoards(finishedGames, finished)    
} 


function createBoards(games, divHolder) {
    if(games.length === 0) {
        divHolder.replaceWith(createLiveEmpty())
        return
    }
    games.forEach(game => {
        const parent = document.createElement('a')
        const players = document.createElement('div')
        const whiteTimer = document.createElement('div')
        const blackTimer = document.createElement('div')
        const id = game.id
        whiteTimer.setAttribute('gameid', id) 
        blackTimer.setAttribute('gameid', id) 
        whiteTimer.id = 'whiteTimer'
        blackTimer.id = 'blackTimer'
        players.classList.add('preview-players')
        players.appendChild(game.whiteUserSpan)
        const vs = document.createElement('span')
        vs.textContent = " vs "
        players.appendChild(vs)
        players.appendChild(game.blackUserSpan)
        parent.appendChild(players)
        parent.appendChild(game.div)
        parent.appendChild(whiteTimer)
        parent.appendChild(blackTimer)
        parent.setAttribute('id', id)
        parent.href = `${window.location.origin}/game/${id}`
        changePlayerSide(game, true)
        if(game.whiteClock && game.blackClock) {
            createTimerDiv(game, true, whiteTimer)
            createTimerDiv(game, false, blackTimer)
        }
        divHolder.appendChild(parent)
    });
}
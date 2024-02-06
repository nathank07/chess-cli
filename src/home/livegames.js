import { existingGame } from "../game/websockets"
import { changePlayerSide } from "../chess/modify.js"
import { createTimerDiv } from '../game/main.js'

export default async function createLiveBoards(divHolder) {
    const gameIDs = await getLiveIDs() 
    if(gameIDs.length === 0) {
        divHolder.replaceWith(createLiveEmpty())
        return
    }
    gameIDs.forEach(async gameID => {
        const parent = document.createElement('a')
        const whiteTimer = document.createElement('div')
        const blackTimer = document.createElement('div')
        whiteTimer.setAttribute('gameid', gameID) 
        blackTimer.setAttribute('gameid', gameID)
        whiteTimer.id = 'whiteTimer'
        blackTimer.id = 'blackTimer'
        const game = await getLive(gameID, parent, () => {
            createTimerDiv(game, true, whiteTimer)
            createTimerDiv(game, false, blackTimer)
        })
        parent.appendChild(game.blackUserSpan)
        parent.appendChild(blackTimer)
        parent.appendChild(game.div)
        parent.appendChild(game.whiteUserSpan)
        parent.appendChild(whiteTimer)
        parent.setAttribute('id', gameID)
        parent.href = `${window.location.origin}/game/${gameID}`
        changePlayerSide(game, true)
        if(game.whiteClock && game.blackClock) {
            createTimerDiv(game, true, whiteTimer)
            createTimerDiv(game, false, blackTimer)
        }
        divHolder.appendChild(parent)
    });
}

function getLiveIDs() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch('/api/game/live', { cache: "no-cache" })
            const games = await res.json()
            if(!games) {
                resolve([])
                return
            }
            resolve(games)
        }
        catch (e) {
            reject(e)
        }
    })
}

function getLive(gameID, divHolder, updateFunction) {
    return new Promise(async (resolve, reject) => {
        try {
            const importedGame = await existingGame(gameID, divHolder, updateFunction)
            resolve(importedGame)
        }
        catch (e) {
            reject(e)
        }
    })
}

function createLiveEmpty() {
    const messageContainer = document.createElement('div')

    const message = document.createElement('h2')
    message.textContent = "No Live Games"
    const emoji = document.createElement('div')
    emoji.textContent = "😢"
    emoji.classList.add('large-emoji')

    const createGameButton = document.createElement('button')
    createGameButton.textContent = "Create a New Game"
    createGameButton.id = "create-game"
    createGameButton.addEventListener('click', () => {
        const createGameDialog = document.querySelector('dialog')
        createGameDialog.showModal()
    })

    messageContainer.appendChild(emoji)
    messageContainer.appendChild(message)
    messageContainer.appendChild(createGameButton)
    messageContainer.id = "no-games"
    
    return messageContainer
}
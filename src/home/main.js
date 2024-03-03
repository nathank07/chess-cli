import './home.css'
import '../header/header.css'
import '../footer/footer.css'
import { changePlayerSide } from "../chess/modify.js"
import { createTimerDiv } from '../game/main.js'
import createLiveBoards from './livegames.js'
import linkDialog from './dialog.js'
import showCompleteList from './completegames.js'

loadGames()

const createGameDialog = document.querySelector('dialog')
linkDialog(createGameDialog)
const history = document.querySelector('.history')
history.firstElementChild.addEventListener('click', () => {
    history.lastElementChild.classList.toggle('disabled')
    const dropDownArrow = history.firstElementChild.lastElementChild
    dropDownArrow.classList.toggle('rotate')
})

async function loadGames() {
    const usernameSpan = document.querySelector('#user-dropdown > span');
    const username = usernameSpan ? usernameSpan.textContent : null
    const live = document.querySelector('#game-list')
    const finished = document.querySelector('#game-history-list')
    createLiveBoards(live)
    showCompleteList(finished, username)  
} 

import { importGame } from '../chess/board.js'
import { changePlayerSide } from '../chess/modify.js'

export function getFinishedGames(user, amount = 100) {
    return new Promise(async (resolve, reject) => {
        try {
            const endpoint = user ? `/api/game/games/${user}?total=${amount}` : `/api/game/games/?total=${amount}`
            const res = await fetch(endpoint, { cache: "no-cache" })
            const games = await res.json()
            const importedGames = []
            if(!games) {
                resolve(importedGames)
            }
            games.forEach(game => {
                const importedGame = importGame([game.fen, [...game.uci.split(' ')]], false)
                changePlayerSide(importedGame, true)
                Object.assign(importedGame, game)
                importedGames.push(importedGame)
            });
            resolve(importedGames)
        }
        catch (e) {
            reject(e)
        }
    })
}

export default async function showCompleteList(divHolder, user, amount = 100) {
    const gamesArr = [];
    const games = await getFinishedGames(user, amount)
    const emptyRemainders = games.length < 10 ? 10 - (games.length % 10) : 0
    const preview = document.querySelector('#game-preview')
    const emptyDivs = document.querySelectorAll('#game-history-list > div:not(#game-history-list > div:first-child')
    emptyDivs.forEach(emptyDiv => {
        emptyDiv.remove()
    });
    let activeLink;
    games.forEach((game, index) => {
        const link = document.createElement('a')
        const boardParent = document.createElement('div')
        boardParent.appendChild(game.div)
        const date = document.createElement('div')
        const timeControlParent = document.createElement('div')
        const timeControlText = document.createElement('div')
        const timeControlIcon = document.createElement('i')
        const white = document.createElement('div')
        const black = document.createElement('div')
        const players = document.createElement('div')
        date.classList.add('date')
        timeControlParent.classList.add('time-control')
        timeControlIcon.classList.add('material-symbols-outlined')
        players.classList.add('players')
        white.classList.add('white-player')
        black.classList.add('black-player')
        boardParent.id = 'preview-board'

        date.innerHTML = formatDate(game.game_created)
        timeControlText.innerHTML = game.time_control.slice(-2) === '+0' ? game.time_control.slice(0, -2) : game.time_control
        timeControlIcon.innerHTML = 'schedule'
        if(game.time_control.slice(-2) !== "+0") {
            timeControlIcon.innerHTML = 'more_time';
            // +2px because schedule icon is slightly smaller
            timeControlIcon.style.fontSize = "26px";
        } 
        white.innerHTML = `<div class="side">${trophy(true, game)}</div><div>${game.whitePlayer}</div>`
        black.innerHTML = `<div class="side">${trophy(false, game)}</div><div>${game.blackPlayer}</div>`

        timeControlParent.appendChild(timeControlIcon)
        timeControlParent.appendChild(timeControlText)
        players.appendChild(white)
        players.appendChild(black)
        link.appendChild(timeControlParent)
        link.appendChild(players)
        link.appendChild(reason(game))
        link.appendChild(date)
        link.href = `${window.location.origin}/game/${game.id}`
        link.addEventListener('mouseenter', () => {
            preview.firstElementChild.replaceWith(boardParent);
            if(activeLink) {
                activeLink.classList.remove('active')
            }
            activeLink = link
            activeLink.classList.add('active')
        });
        if(!user) {
            const usernameSpan = document.querySelector('#user-dropdown > span')
            if(usernameSpan) {
                user = usernameSpan.textContent
            }
        }
        if(game.whitePlayer === user || game.blackPlayer === user) {
            const winner = returnWinner(game)
            switch(winner) {
                case 'white':
                    link.classList.add(game.whitePlayer === user ? 'win' : 'loss')
                    break
                case 'black':
                    link.classList.add(game.blackPlayer === user ? 'win' : 'loss')
                    break
                case 'draw':
                    link.classList.add('draw')
                    break
                default:
                    break
            }
        }
        if(index === 0) {
            activeLink = link
            activeLink.classList.add('active')
        }
        if(gamesArr[Math.trunc(index / 10)] === undefined) {
            gamesArr[Math.trunc(index / 10)] = []
        }
        gamesArr[Math.trunc(index / 10)].push(link)
        if(Math.trunc(index / 10) === 0) {
            divHolder.appendChild(link)
        }
    });
    for(let i = 0; i < emptyRemainders; i++) {
        const emptyCell = document.createElement('div')
        divHolder.appendChild(emptyCell)
    }
    divHolder.appendChild(createPaginator(gamesArr))
    if(games[0] && games[0].div !== undefined) {
        preview.firstElementChild.replaceWith(games[0].div.parentNode)
    }
}

function createPaginator(games) {
    const minPage = 0
    let currentPage = 0;
    const maxPage = games.length ? games.length - 1 : 0
    for(let i = 0; i < 10; i++) {
        if(maxPage === 0) {
            break
        }
        if(games[maxPage][i] === undefined) {
            const emptyCell = document.createElement('div')
            games[maxPage][i] = emptyCell
        }
    }
    const paginator = document.createElement('div')
    paginator.classList.add('paginator')
    const prev = document.createElement('button')
    const next = document.createElement('button')
    const prevIcon = document.createElement('i')
    const nextIcon = document.createElement('i')
    prevIcon.innerHTML = 'arrow_back'
    nextIcon.innerHTML = 'arrow_forward'
    prevIcon.classList.add('material-symbols-outlined')
    nextIcon.classList.add('material-symbols-outlined')
    prev.appendChild(prevIcon)
    next.appendChild(nextIcon)
    prev.addEventListener('click', () => {
        if(currentPage > minPage) {
            games[currentPage].forEach((game, index) => {
                if(games[currentPage - 1][index] !== undefined && games[currentPage - 1][index] !== null) {
                    game.parentNode.replaceChild(games[currentPage - 1][index], game)
                }
            })
            currentPage--
        }
    })
    next.addEventListener('click', () => {
        if(currentPage < maxPage) {
            games[currentPage].forEach((game, index) => {
                if(games[currentPage + 1][index] !== undefined && games[currentPage + 1][index] !== null) {
                    game.parentNode.replaceChild(games[currentPage + 1][index], game)
                }
            })
            currentPage++
        }
    })
    paginator.appendChild(prev)
    paginator.appendChild(next)
    return paginator
}

export function refresh(divHolder, user, amount) {
    const paginator = divHolder.lastElementChild.cloneNode(true)
    for(let i in divHolder.children) {
        if(i > 0 && i < divHolder.children.length - 1) {
            const emptyDiv = document.createElement('div')
            divHolder.children[i].replaceWith(emptyDiv)
        }
    }
    divHolder.lastElementChild.remove()
    divHolder.appendChild(paginator)
    showCompleteList(divHolder, user, amount)
}

function formatDate(date) {
    const now = new Date();
    const gameDate = new Date(date);
    const diff = now - gameDate;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
        return `${minutes} Minute${minutes === 1 ? "" : "s"} Ago`;
    } else if (hours < 24) {
        return `${hours} Hour${hours === 1 ? "" : "s"} Ago`;
    } else if (days < 15) {
        return `${days} Day${days === 1 ? "" : "s"} Ago`;
    } else {
        const month = gameDate.toLocaleString('default', { month: 'short' });
        const day = gameDate.getDate();
        const year = gameDate.getFullYear();
        return `${month} ${day}, ${year}`;
    }
}

function trophy(isWhite, game) {
    const lwinner = game.winner ? game.winner.toLowerCase() : 'draw';
    const side = isWhite ? 'white' : 'black';
    if (lwinner !== 'draw' && lwinner !== 'stalemate') {
        return lwinner === side ? `<i class="material-symbols-outlined winner">check</i>` : '';
    }
    return '';
}

function returnWinner(game) {
    const lwinner = game.winner ? game.winner.toLowerCase() : 'draw';
    console.log(lwinner)
    if (lwinner !== 'draw' && lwinner !== 'stalemate') {
        return lwinner === 'white' ? 'white' : 'black';
    }
    return 'draw';
}

function reason(game) {
    const lsreason = game.reason ? game.reason.toLowerCase().split(' ')[0] : '';
    const reasonParent = document.createElement('div');
    const icon = document.createElement('i');
    const text = document.createElement('div');
    new ResizeObserver(() => {
        text.style.display = text.parentNode.clientWidth < 100 ? 'none' : 'block';
    }).observe(reasonParent);
    reasonParent.classList.add('reason');
    icon.classList.add('material-symbols-outlined');
    let iconInner;
    let textInner;
    switch(lsreason) {
        case "checkmate":
            iconInner = 'done_all'
            textInner = 'Checkmate'
            break
        case "resign":
            iconInner = 'flag'
            textInner = 'Resignation'
            break
        case "time":
            iconInner = 'history_toggle_off'
            textInner = 'Flagged'
            break
        // Stalemate due to no moves
        case "no":
            iconInner = 'horizontal-rule'
            textInner = 'Stalemate'
            break
        case "insufficient":
            iconInner = 'pulse-alert'
            textInner = 'No Material'
            break
        case "threefold":
            iconInner = 'cycle';
            textInner = 'Threefold Repetition';
            break
        case "fifty":
            iconInner = 'tactic';
            textInner = 'Fifty Move Rule';
            break
        // This is if the game times out (server), this should not appear in match history
        case "game":
            iconInner = 'question_mark';
            textInner = 'Server Timeout';
            break
        default:
            iconInner = 'question_mark';
            textInner = 'Unknown';
            break
    }
    icon.innerHTML = iconInner;
    icon.title = textInner;
    text.innerHTML = textInner;
    reasonParent.appendChild(icon);
    reasonParent.appendChild(text);
    return reasonParent;
}
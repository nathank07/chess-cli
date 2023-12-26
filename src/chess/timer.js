export default function ChessTimer(secondsLength, secondsIncrement, updateFunction, timerFinishedFunction, linkedTimer) {
    const timer = {
        timerStarted: new Date().getTime(),
        timeLeft: secondsLength * 1000,
        length: secondsLength * 1000,
        increment: secondsIncrement * 1000,
        isRunning: false,
        updateFunction: updateFunction,
        timerFinishedFunction: timerFinishedFunction,
        linkedTimer: linkedTimer
    }
    timer.start = () => {
        if(!timer.isRunning) {
            timer.timerStarted = new Date().getTime()
            timer.length = timer.timeLeft
            timer.isRunning = true
            updateTimer(timer);
            setInterval(function interval() {
                updateTimer(timer, interval)
            }, 100);
        }
    }
    timer.alternate = () => {
        if(timer.linkedTimer && timer.linkedTimer.start && timer.linkedTimer.pause) {
           if(timer.linkedTimer.isRunning) {
                timer.linkedTimer.pause()
                timer.start()
            } else {
                timer.linkedTimer.start()
                timer.pause()
            }
        }
    }
    timer.pause = () => {
        if(timer.isRunning) {
            timer.length += timer.increment
            updateTimer(timer)
            timer.isRunning = false
            if(updateFunction) {
                updateFunction(timer.timeLeft)
            }
        }
    }
    return timer
}

function updateTimer(timer, fn) {
    if (timer.isRunning) {
        const time = new Date().getTime()
        timer.timeLeft = timer.length - (time - timer.timerStarted)
        if(timer.updateFunction) {
            timer.updateFunction(timer.timeLeft)
        }
        if(timer.timeLeft <= 0) {
            if(timer.timerFinishedFunction) { timer.timerFinishedFunction() }
            if(timer.updateFunction) { timer.updateFunction(0) }
            timer.timeLeft = 0
            timer.isRunning = false
        }
    } else {
        clearInterval(fn)
    }
}
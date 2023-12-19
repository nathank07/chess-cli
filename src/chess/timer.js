export default function ChessTimer(secondsLength, secondsIncrement, updateFunction, timerFinishedFunction, linkedTimer) {
    const timer = {
        timerStarted: new Date().getTime(),
        timeLeft: secondsLength * 1000,
        increment: secondsIncrement * 1000,
        isRunning: false,
        updateFunction: updateFunction,
        timerFinishedFunction: timerFinishedFunction,
        ticks: 0,
        linkedTimer: linkedTimer
    }
    timer.start = () => {
        if(!timer.isRunning) {
            timer.timerStarted = new Date().getTime()
            timer.isRunning = true
            timer.ticks = 0
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
            timer.timeLeft += timer.increment
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
        timer.ticks += 1
        timer.timeLeft -= ((time - timer.timerStarted) / timer.ticks)
        if(timer.updateFunction) {
            timer.updateFunction(timer.timeLeft)
        }
        if(timer.timeLeft <= 0) {
            if(timer.timerFinishedFunction) { timer.timerFinishedFunction() }
            timer.updateFunction(0)
            timer.timeLeft = 0
            timer.isRunning = false
        }
    } else {
        clearInterval(fn)
    }
}
// This function is called every second to update the timer
function updateTimer () {
    time += -1
    console.log(`Time remaining: ${time} seconds`)
    if (time <= 0) {
        console.log("Game over!")
    } else {
        setTimeout(updateTimer, 1000);
    }
}
function kick () {
    strength = Math.floor(Math.random() * 10) + 1
    if (strength > 5) {
        score += 1
        console.log("Goal!")
    } else {
        console.log("Missed!")
    }
}
let score = 0
let strength = 0
let time = 0
time = 30
kick
updateTimer

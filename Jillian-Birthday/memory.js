/* ==========================================
   MEMORY MATCH GAME
   Part 3.1
========================================== */

// Images used in the game
const images = [
    "images/jillian1.jpg",
    "images/jillian2.jpg",
    "images/jillian3.jpg",
    "images/jillian4.jpg",
    "images/jillian5.jpg",
    "images/jillian6.jpg",
    "images/jillian7.jpg",
    "images/jillian8.jpg"
];

// Duplicate images to make pairs
let cards = [...images, ...images];

// Get HTML elements
const gameBoard = document.getElementById("gameBoard");
const movesText = document.getElementById("moves");
const timerText = document.getElementById("timer");
const pairsText = document.getElementById("pairs");

const restartBtn = document.getElementById("restartBtn");

const winScreen = document.getElementById("winScreen");
const finalMoves = document.getElementById("finalMoves");
const finalTime = document.getElementById("finalTime");

const giftBtn = document.getElementById("giftBtn");
const giftScreen = document.getElementById("giftScreen");
const closeGift = document.getElementById("closeGift");

// Game variables
let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let matchedPairs = 0;

let seconds = 0;
let timerStarted = false;
let timer;

// Shuffle cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start timer
function startTimer() {

    timer = setInterval(() => {

        seconds++;

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        timerText.textContent =
            String(mins).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0");

    }, 1000);

}

// Create the cards
function createBoard() {

    gameBoard.innerHTML = "";

    shuffle(cards);

    cards.forEach(image => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.image = image;

        card.innerHTML = `
            <div class="front">🎂</div>
            <div class="back">
                <img src="${image}" alt="Memory Photo">
            </div>
        `;

        card.addEventListener("click", flipCard);

        gameBoard.appendChild(card);

    });

}

// Start the game
createBoard();
/* ==========================================
   MEMORY MATCH GAME
   Part 3.2
========================================== */

// Flip a card
function flipCard() {

    // Prevent clicking while cards are flipping
    if (lockBoard) return;

    // Prevent clicking the same card twice
    if (this === firstCard) return;

    // Start timer on first move
    if (!timerStarted) {
        timerStarted = true;
        startTimer();
    }

    // Flip the card
    this.classList.add("flip");

    // First card selected
    if (!firstCard) {
        firstCard = this;
        return;
    }

    // Second card selected
    secondCard = this;

    moves++;
    movesText.textContent = moves;

    checkMatch();

}

// Check if the two cards match
function checkMatch() {

    if (firstCard.dataset.image === secondCard.dataset.image) {

        disableCards();

    } else {

        unflipCards();

    }

}

// Keep matching cards face up
function disableCards() {

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    matchedPairs++;

    pairsText.textContent = matchedPairs + " / 8";

    resetTurn();

    // Player wins
    if (matchedPairs === 8) {

        clearInterval(timer);

        setTimeout(showWinScreen, 600);

    }

}

// Flip unmatched cards back over
function unflipCards() {

    lockBoard = true;

    setTimeout(() => {

        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        resetTurn();

    }, 1000);

}

// Reset turn variables
function resetTurn() {

    firstCard = null;
    secondCard = null;
    lockBoard = false;

}

// Restart the game
restartBtn.addEventListener("click", () => {

    clearInterval(timer);

    timerStarted = false;
    seconds = 0;

    moves = 0;
    matchedPairs = 0;

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    timerText.textContent = "00:00";
    movesText.textContent = "0";
    pairsText.textContent = "0 / 8";

    createBoard();

});
/* ==========================================
   MEMORY MATCH GAME
   Part 3.3
========================================== */

// Show the win screen
function showWinScreen() {

    finalMoves.textContent = "Moves: " + moves;
    finalTime.textContent = "Time: " + timerText.textContent;

    winScreen.classList.remove("hidden");

}

// Open the birthday surprise
giftBtn.addEventListener("click", () => {

    winScreen.classList.add("hidden");
    giftScreen.classList.remove("hidden");

});

// Close the birthday surprise
closeGift.addEventListener("click", () => {

    giftScreen.classList.add("hidden");

});

// Allow ESC key to close the birthday surprise
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        giftScreen.classList.add("hidden");
    }

});

// Optional: Press R to restart the game
document.addEventListener("keydown", (event) => {

    if (event.key.toLowerCase() === "r") {
        restartBtn.click();
    }

});
// ===============================
// Background Music
// ===============================

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

// Set volume (15%)
music.volume = 0.15;

let playing = false;

// Play when user first clicks anywhere
document.addEventListener("click", () => {

    if (!playing) {

        music.play();

        playing = true;

        musicBtn.textContent = "🔇 Pause Music";

    }

}, { once: true });

// Play/Pause button
musicBtn.addEventListener("click", () => {

    if (music.paused) {

        music.play();

        musicBtn.textContent = "🔇 Pause Music";

    } else {

        music.pause();

        musicBtn.textContent = "🔊 Play Music";

    }

});
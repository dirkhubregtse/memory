let pairs;
let currentPlayer = 1;
let score = { 1: 0, 2: 0 };
let flippedCards = [];
let totalMatches = 0;
let cards = [];
let player1ScoreElement = document.getElementById("player1-score");
let player2ScoreElement = document.getElementById("player2-score");


function startGame() {
     pairs = 8;
    generateCards();
    renderGameBoard();
    document.getElementById("game-board").classList.remove("hidden");
    document.getElementById("scoreboard").classList.remove("hidden");
    document.getElementById("current-player").innerText = `Speler ${currentPlayer} is aan de beurt`;
    player1ScoreElement.innerText = "Speler 1: 0 punten";
    player2ScoreElement.innerText = "Speler 2: 0 punten";
    document.getElementById("game-board").classList.add(`active-player-${currentPlayer}`);
    
}

function generateCards() {
    cards = [];
    const images = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image6.jpg", "image7.jpg", "image8.jpg"]; 

    for (let i = 0; i < pairs; i++) {
        cards.push(`./images/${images[i]}`);
        cards.push(`./images/${images[i]}`);
    }

    cards = shuffleArray(cards);
}

function renderGameBoard() {
    const gameBoard = document.getElementById("game-board");
    const cardSize = "100px"; // Set the desired size of the cards

    for (let i = 0; i < cards.length; i++) {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.dataset.index = i;

        // Add an <img> element with the source of the image
        const imgElement = document.createElement("img");
        imgElement.src = cards[i]; // Updated to use the full path to the images
        imgElement.alt = "Card Image";

        // Set the dimensions of the image to match the card size
        imgElement.style.width = cardSize;
        imgElement.style.height = cardSize;

        // Hide the image initially
        imgElement.style.display = "none";

        cardElement.appendChild(imgElement);

        // Add a click event listener for flipping the card
        cardElement.addEventListener("click", () => flipCard(cardElement));

        gameBoard.appendChild(cardElement);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function ComputersTurn() {
    // Simulate the computer's move by flipping a random card after a delay
    setTimeout(() => {     
        let cardsLeft = ((pairs - flippedCards.length) * 2);  
        if (cardsLeft >1) {
            const randomIndex = Math.floor(Math.random() * cardsLeft);
            console.log(cardsLeft);
            console.log(randomIndex);


            // Check for a match after the computer's move
            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }, 1000);

}

function flipCard(card) {
    const index = parseInt(card.dataset.index);
    // Check if the card is already flipped or if it's non-matching
        if (!flippedCards.includes(index) && flippedCards.length < 2) {
        // Show the image
        card.firstChild.style.display = "block";

        flippedCards.push(index);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
    

    // If two non-matching cards are flipped, reset them after a short delay
    if (flippedCards.length === 2 && cards[flippedCards[0]] !== cards[flippedCards[1]]) {
        setTimeout(() => {
            resetNonMatchingCards();
        }, 1000);
    }
}

function resetNonMatchingCards() {
    const [index1, index2] = flippedCards;
    const card1 = document.querySelector(`[data-index="${index1}"]`);
    const card2 = document.querySelector(`[data-index="${index2}"]`);

    // Hide the images of non-matching cards after a short delay
    setTimeout(() => {
        card1.firstChild.style.display = "none";
        card2.firstChild.style.display = "none";

        // Make the cards clickable again
        card1.style.pointerEvents = "auto";
        card2.style.pointerEvents = "auto";

        flippedCards = [];
    }, 1000);
}

function checkMatch() {
    const [index1, index2] = flippedCards;
    const card1 = document.querySelector(`[data-index="${index1}"]`);
    const card2 = document.querySelector(`[data-index="${index2}"]`);

    if (cards[index1] === cards[index2]) {
        score[currentPlayer]++;
        totalMatches++;
        updateScore();

        // Remove the event listeners from matching cards to prevent further clicks
        card1.removeEventListener("click", () => flipCard(card1));
        card2.removeEventListener("click", () => flipCard(card2));

        // Set a short delay before hiding the matching cards
        setTimeout(() => {
            hideCard(card1);
            hideCard(card2);

            console.log(totalMatches);
            console.log(pairs);


            // Check if all cards are matched
            //if (document.querySelectorAll('.card[style*="display: none;"]').length === pairs * 2) {
            if (totalMatches == pairs) {
                endGame();
                console.log("endgame");
                
            } else {
                console.log("NOendgame");
                // Reset flippedCards array
                flippedCards = [];

                // Set a short delay before updating the text indicating the current player's turn
                setTimeout(() => {
                    document.getElementById("current-player").innerText = `Speler ${currentPlayer} is aan de beurt`;
                }, 100);
            }
        }, 100);
    } else {
        // Hide the images of non-matching cards after a short delay
        setTimeout(() => {
            if (!isCardFlipped(card1)) {    
                hideCard(card1);
            }
            if (!isCardFlipped(card2)) {
                hideCard(card2);
            }

            // Make the cards clickable again
            card1.style.pointerEvents = "auto";
            card2.style.pointerEvents = "auto";

            // Reset flippedCards array
            flippedCards = [];
            
            // Switch to the next player's turn
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            if (currentPlayer === 2){
                ComputersTurn() 
                isComputerTurn = true
            }

            document.getElementById("current-player").innerText = `Speler ${currentPlayer} is aan de beurt`;
            
            // Change the border color based on the active player
            document.getElementById("game-board").classList.remove("active-player-1", "active-player-2");
            document.getElementById("game-board").classList.add(`active-player-${currentPlayer}`);
        }, 1000);
    }
}

function hideCard(card) {
    // Hide the entire card element
    card.style.visibility = "hidden";
}

function isCardFlipped(card) {
    // Check if the card is flipped by checking its source
    return card.firstChild.src !== "";
}

function updateScore() {
    player1ScoreElement.innerText = `Speler 1: ${score[1]} punten`;
    player2ScoreElement.innerText = `Speler 2: ${score[2]} punten`;
}

function endGame() {
    const totalMatches = pairs;
    const totalCards = pairs * 2;

    if (totalMatches === pairs) {
        // All cards are matched
        const winner = score[1] > score[2] ? 1 : score[1] < score[2] ? 2 : 0;

        let winnerText, scoresText;
        if (winner === 0) {
            winnerText = "Gelijkspel!";
            scoresText = `Score: Speler 1 - ${score[1]}, Speler 2 - ${score[2]}`;
        } else {
            winnerText = `Speler ${winner} wint!`;
            scoresText = `Score: Speler 1 - ${score[1]}, Speler 2 - ${score[2]}`;
        }

        // Show the popup
        document.getElementById("winner").innerText = winnerText;
        document.getElementById("scores").innerText = scoresText;
        document.getElementById("popup").classList.remove("hidden");
    }
}


function closePopup() {
    // Hide the popup
    document.getElementById("popup").style.display = "none";
}


function resetGame() {
    // Verwijder de kaarten en scores van het spelbord
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    // Verberg het scorebord
    document.getElementById("scoreboard").classList.add("hidden");

    // Reset variabelen naar de beginwaarden
    pairs = 0;
    currentPlayer = 1;
    score = { 1: 0, 2: 0 };
    flippedCards = [];
    cards = [];
    totalMatches = 0;

    // Reset de tekst voor het aantal kaart-paren
    document.getElementById("pairs").value = 2;

    // Voeg hier extra resetlogica toe als dat nodig is

    // Voeg de klasse "hidden" toe aan de game-board container om het te verbergen
    gameBoard.classList.add("hidden");

    // Verwijder de randkleur van het spelbord
    gameBoard.classList.remove("active-player-1", "active-player-2");

    // Voeg de klasse "hidden" toe aan de winner- en scores-elementen
    document.getElementById("winner").classList.add("hidden");
    document.getElementById("scores").classList.add("hidden");
}       

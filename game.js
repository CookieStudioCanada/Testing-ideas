// Grab elements from the document using their IDs to interact with them later
const startGameBtn = document.getElementById('startGame');
const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');
const dealerCardsDiv = document.getElementById('dealerCards');
const playerCardsDiv = document.getElementById('playerCards');
const outcomeDiv = document.getElementById('outcome');

// Initialize arrays to hold the player's and dealer's cards
let playerCards = [], dealerCards = [];
// Initialize the deck array to hold the card deck
let deck = [];

// Function to create a deck of cards
function createDeck() {
    // Define the suits and values arrays
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    // Empty the deck to start fresh
    deck = [];
    // Loop through each suit and value to create the deck
    for (let suit of suits) {
        for (let value of values) {
            // Push a card object with suit and value to the deck
            deck.push({suit, value});
        }
    }
    // Shuffle the deck after it's created
    shuffleDeck();
}

// Function to shuffle the deck
function shuffleDeck() {
    // Loop through the deck in reverse order
    for (let i = deck.length - 1; i > 0; i--) {
        // Pick a random index before the current element
        const j = Math.floor(Math.random() * (i + 1));
        // Swap the current element with the element at the random index
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to start the game
function startGame() {
    // Create and shuffle the deck
    createDeck();
    // Deal two cards to both the player and the dealer
    playerCards = [deck.pop(), deck.pop()];
    dealerCards = [deck.pop(), deck.pop()];
    // Update the UI with the dealt cards
    updateUI();
}

// Function to handle the "Hit" action
function hit() {
    // Add a new card to the player's hand
    playerCards.push(deck.pop());
    // Check if the player's hand value exceeds 21 (bust)
    if (getHandValue(playerCards) > 21) {
        outcomeDiv.textContent = 'Busted! Dealer wins.';
        endGame();
    } else {
        // Update the UI with the new card
        updateUI();
    }
}

// Function to handle the "Stand" action
function stand() {
    // The dealer takes cards until their hand value is 17 or higher
    while (getHandValue(dealerCards) < 17) {
        dealerCards.push(deck.pop());
    }
    // Determine the outcome of the game
    determineOutcome();
}

// Function to calculate the value of a hand
function getHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    // Loop through each card in the hand
    for (let card of hand) {
        if (card.value >= '2' && card.value <= '10') {
            // Add the numeric value for number cards
            value += parseInt(card.value);
        } else if (card.value === 'A') {
            // Count aces as 11 initially and track the number of aces
            aceCount += 1;
            value += 11;
        } else {
            // Face cards (J, Q, K) are worth 10
            value += 10;
        }
    }
    // Convert aces from 11 to 1 as needed to avoid busting
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount -= 1;
    }
    return value;
}

// Function to determine the outcome of the game
function determineOutcome() {
    const playerValue = getHandValue(playerCards);
    const dealerValue = getHandValue(dealerCards);
    
    // Compare the hand values to determine the winner
    if (dealerValue > 21 || playerValue > dealerValue) {
        outcomeDiv.textContent = 'You win!';
    } else if (dealerValue > playerValue) {
        outcomeDiv.textContent = 'Dealer wins!';
    } else {
        outcomeDiv.textContent = 'It\'s a tie!';
    }
    // End the game after determining the outcome
    endGame();
}

// Function to disable the buttons after the game ends
function endGame() {
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

// Function to update the UI with the current hands
function updateUI() {
    // Display the dealer's and player's cards
    dealerCardsDiv.innerHTML = dealerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
    playerCardsDiv.innerHTML = playerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
}

// Add event listeners to buttons to start the game and handle actions
startGameBtn.addEventListener('click', startGame);
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);

// Initialize the game state by disabling action buttons until the game starts
hitBtn.disabled = true;
standBtn.disabled = true;
startGameBtn.addEventListener('click', () => {
    hitBtn.disabled = false;
    standBtn.disabled = false;
});
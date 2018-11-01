/*
 * Create a list that holds all of your cards
 */
let cards = [
    'fa-diamond',
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-anchor',
    'fa-bolt',
    'fa-bolt',
    'fa-cube',
    'fa-cube',
    'fa-leaf',
    'fa-leaf',
    'fa-bicycle',
    'fa-bicycle',
    'fa-bomb',
    'fa-bomb'
];

let modal;
let moveCounter = 0;
let openCards = [];
let timerStarted;
let timer = 0;

initApp();

function initApp() {
    initGame();
    initCongratsModal();
    addRestartListener();
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function initGame() {
    initCardDeck();
    addClickListenersToCards();
    resetMoveCounter();
    resetTimer();
}

/*
* Init the congrats modal, which is the modal displayed
* when the user finished the game
*/
function initCongratsModal() {
    modal = document.getElementById('congrats-modal');
    let modalCloseButton = document.querySelector('.close');

    // If the user clicks outside of the modal, close it
    // This code snippet was adapted from:
    // https://www.w3schools.com/howto/howto_css_modals.asp
    // on 10/30/2018
    // and modified to include the modalCloseButton
    window.onclick = function(event) {
        if (event.target === modal || event.target === modalCloseButton) {
            modal.style.display = "none";
        }
    }

    document.querySelector('.modal-yes-button')
        .addEventListener('click', () => {
            closeModal();
            initGame();
        });

    document.querySelector('.modal-no-button')
        .addEventListener('click', () => {
            closeModal();
        });
}

function closeModal() {
    modal.style.display = "none";
}

function addRestartListener() {
    document.querySelector('.restart').addEventListener('click', initGame);
}

function initCardDeck() {
    const deck = document.querySelector('.deck');
    deck.innerHTML = '';

    // cards = shuffle(cards);
    cards.forEach(function(card) {
        const cardHTML =`
            <li class="card" data-card="${card}">
                <i class="fa ${card}"></i>
            </li>
        `;
        const liElement = document.createElement('li');

        deck.appendChild(liElement);
        liElement.outerHTML = cardHTML;
    });

    openCards = [];
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function addClickListenersToCards() {
    const allCards = document.querySelectorAll('.card');

    allCards.forEach(function(card) {
        card.addEventListener('click', handleCardClick)
    });
}

function handleCardClick() {
    if(!timerStarted) {
        startTimer();
    }

    const card = this;
    if(!isCardOpen(card)) {
        openCard(card);

        if(openCards.length === 2) {
            if(isMatch()) {
                lockOpenCards();
            } else {
                setTimeout(closeOpenCards, 1500);
            }

            incrementMoveCounter();

            if(allCardsMatched()) {
                endGame();
            }
        }
    }
}

function startTimer() {
    timerStarted = setInterval(increaseTimer, 1000);
}

function increaseTimer() {
    timer++;
    renderTimerValue(timer);
}

function isCardOpen(card) {
    return card.classList.contains('open') || card.classList.contains('match');
}

function openCard(card) {
    card.classList.add('open', 'show');
    openCards.push(card);
}

function isMatch() {
    return openCards[0].dataset.card === openCards[1].dataset.card;
}

function lockOpenCards() {
    openCards.forEach(function(openCard) {
        openCard.classList.add('match');
    });
    openCards = [];
}

function closeOpenCards() {
    openCards.forEach(function(openCard) {
        openCard.classList.remove('open', 'show');
    });
    openCards = [];
}

function incrementMoveCounter() {
    moveCounter++;
    document.querySelectorAll('.moves').forEach(function(moveCounterElem) {
        moveCounterElem.innerText = moveCounter;
    });
}

function allCardsMatched() {
    return document.querySelectorAll('.card.match').length === 16;
}

function endGame() {
    stopTimer();
    displayCongratsModal();
}

function stopTimer() {
    clearInterval(timerStarted);
    timerStarted = null;
}

function displayCongratsModal() {
    modal.style.display = 'block';
}

function resetMoveCounter() {
    moveCounter = 0;
    document.querySelector('.moves').innerText = moveCounter;
}

function resetTimer() {
    timer = 0;
    renderTimerValue(timer);
    clearInterval(timerStarted);
    timerStarted = null;
}

function renderTimerValue(timer) {
    const timerDisplayString = getTimerDisplayString(timer);
    document.querySelectorAll('.timer').forEach(function(timerElem) {
        timerElem.innerText = timerDisplayString;
    });
}

function getTimerDisplayString(timer) {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    if(minutes < 10) {
        minutes = '0' + minutes;
    }
    if(seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}
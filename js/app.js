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
let congratsModal;
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
* Initialize the game by initializing the card deck and
* resetting the score panel and timer
*/
function initGame() {
    initCardDeck();
    addClickListenersToCards();
    resetMoveCounter();
    resetTimer();
    resetStars();
}

/*
* Initialize the congrats modal, which is the modal displayed
* when the user finished the game
*/
function initCongratsModal() {
    congratsModal = document.getElementById('congrats-modal');
    const modalCloseButton = document.querySelector('.close');

    // If the user clicks outside of the modal, close it
    // This code snippet was adapted from:
    // https://www.w3schools.com/howto/howto_css_modals.asp
    // on 10/30/2018
    window.onclick = function(event) {
        if (event.target === congratsModal || event.target === modalCloseButton) {
            closeModal();
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
    congratsModal.style.display = "none";
}

function addRestartListener() {
    document.querySelector('.restart').addEventListener('click', initGame);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function initCardDeck() {
    const deck = document.querySelector('.deck');
    deck.innerHTML = '';

    cards = shuffle(cards);

    cards.forEach(card => {
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

function addClickListenersToCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.addEventListener('click', handleCardClick));
}

/*
* Click listener for all card clicks
*/
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
                closeOpenCards();
            }

            incrementMoveCounter();
            updateStarRating();

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
    // a card is "open" if it has 'open' and 'match classes'
    return card.classList.contains('open') || card.classList.contains('match');
}

function openCard(card) {
    // a card is "open" if it has 'open' and 'match classes'
    card.classList.add('open', 'show');
    openCards.push(card);
}

function isMatch() {
    return openCards[0].dataset.card === openCards[1].dataset.card;
}

function lockOpenCards() {
    openCards.forEach(function(openCard) {
        // perform bounce animation for 1500ms
        openCard.classList.add('animated', 'bounce');
        // clear the animation classes so that they can happen again
        setTimeout(() => openCard.classList.remove('animated', 'bounce'), 1500);

        // cards matched
        openCard.classList.add('match');
    });
    openCards = [];
}

function closeOpenCards() {
    openCards.forEach(function(openCard) {
        // perform shake animation for 1500 ms then close the cards
        openCard.classList.add('animated', 'shake');
        setTimeout(() => {
            // clear the animation classes so that they can happen again
            openCard.classList.remove('animated', 'shake');
            openCard.classList.remove('open', 'show');
        }, 1500);

    });
    openCards = [];
}

function incrementMoveCounter() {
    moveCounter++;
    const moveCounterElems = document.querySelectorAll('.moves');
    moveCounterElems.forEach(moveCounterElem => moveCounterElem.innerText = moveCounter);
}

function updateStarRating() {
    if(moveCounter === 12) {
        unfillStarIcon('star-3');
    } else if(moveCounter === 20) {
        unfillStarIcon('star-2');
    }
}

function unfillStarIcon(starClass) {
    const starIcons = document.querySelectorAll('.' + starClass);
    starIcons.forEach(starIcon => {
        starIcon.classList.remove('fa-star');
        starIcon.classList.add('fa-star-o');
    });
}

function allCardsMatched() {
    return document.querySelectorAll('.card.match').length === 16;
}

/*
* End the game by stopping the timer and showing the congrats modal
*/
function endGame() {
    stopTimer();
    displayCongratsModal();
}

function stopTimer() {
    clearInterval(timerStarted);
    timerStarted = null;
}

function displayCongratsModal() {
    congratsModal.style.display = 'block';
}

function resetMoveCounter() {
    moveCounter = 0;
    const moveCounterElems = document.querySelectorAll('.moves');
    moveCounterElems.forEach(moveCounterElem => moveCounterElem.innerText = moveCounter);
}

function resetTimer() {
    timer = 0;
    renderTimerValue(timer);
    clearInterval(timerStarted);
    timerStarted = null;
}

function renderTimerValue(timer) {
    const timerDisplayString = getTimerDisplayString(timer);
    const timerElems = document.querySelectorAll('.timer');
    timerElems.forEach(timerElem => timerElem.innerText = timerDisplayString);
}

function resetStars() {
    const starIcons = document.querySelectorAll('.fa-star-o');
    starIcons.forEach(starIcon => {
        starIcon.classList.remove('fa-star-o');
        starIcon.classList.add('fa-star');
    });
}

/*
* Display the timer as mm:ss
*/
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
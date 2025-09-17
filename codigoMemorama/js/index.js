const boardEl = document.getElementById('game-board');
const attemptsEl = document.getElementById('attempts');
const timerEl = document.getElementById('timer');
const difficultyEl = document.getElementById('difficulty');
const newGameBtn = document.getElementById('new-game');
const bestListEl = document.getElementById('best-list');

let gridSize = parseInt(difficultyEl.value, 10);
let totalCards = gridSize * gridSize;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let attempts = 0;

let timerInterval = null;
let startTime = null;

let pendingUnflip = null;

const emojiPool = [
    '🍎', '🍌', '🍓', '🍇', '🍉', '🍒', '🍍', '🥭', '🥥', '🍑',
    '🍋', '🥝', '🥑', '🍆', '🥕', '🌽', '🍅', '🥦', '🥔', '🍠',
    '🍞', '🧀', '🍗', '🥓', '🍔', '🍕', '🌭', '🥪', '🌮', '🌯',
    '🍿', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '🍮',
    '⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🎱', '🏓', '🏸', '🥅'
];

const formatTime = ms => {
    if (!ms) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

function saveBestScore(size, attemptsCount, timeMs) {
    const key = `memorama_best_${size}`;
    const prev = JSON.parse(localStorage.getItem(key) || 'null');
    const newScore = { attempts: attemptsCount, time: timeMs, date: new Date().toISOString() };
    if (!prev || timeMs < prev.time || (timeMs === prev.time && attemptsCount < prev.attempts)) {
        localStorage.setItem(key, JSON.stringify(newScore));
        return true;
    }
    return false;
}

function loadBestScores() {
    bestListEl.innerHTML = '';
    [4, 6, 10].forEach(size => {
        const key = `memorama_best_${size}`;
        const item = JSON.parse(localStorage.getItem(key) || 'null');
        const li = document.createElement('li');
        if (item) {
            li.textContent = `${size}x${size} — Tiempo: ${formatTime(item.time)} — Intentos: ${item.attempts} (${new Date(item.date).toLocaleString()})`;
        } else {
            li.textContent = `${size}x${size} — sin registro`;
        }
        bestListEl.appendChild(li);
    });
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timerEl.textContent = formatTime(Date.now() - startTime);
    }, 250);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}

function incrementAttempts() {
    attempts++;
    attemptsEl.textContent = attempts;
}

function buildBoardFromDeck(deck) {
    if (pendingUnflip && pendingUnflip.timeoutId) clearTimeout(pendingUnflip.timeoutId);
    pendingUnflip = null;

    boardEl.innerHTML = '';
    boardEl.className = 'board size-' + gridSize;
    matchesFound = 0;
    attempts = 0;
    attemptsEl.textContent = attempts;
    timerEl.textContent = '00:00';
    stopTimer();

    deck.forEach((symbol, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.tabIndex = 0;
        card.dataset.symbol = symbol;
        card.dataset.index = idx;

        const inner = document.createElement('div');
        inner.className = 'card-inner';

        const faceFront = document.createElement('div');
        faceFront.className = 'card-face card-front';
        faceFront.textContent = symbol;

        const faceBack = document.createElement('div');
        faceBack.className = 'card-face card-back';

        const backImg = document.createElement('img');
        backImg.src = 'recursos/carta.jpg'; // revisa ruta

        backImg.style.objectFit = 'cover';
        faceBack.appendChild(backImg);

        inner.appendChild(faceFront);
        inner.appendChild(faceBack);
        card.appendChild(inner);

        card.addEventListener('click', onCardClick);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });

        boardEl.appendChild(card);
    });
}

function createBoard(size) {
    if (pendingUnflip && pendingUnflip.timeoutId) clearTimeout(pendingUnflip.timeoutId);
    pendingUnflip = null;

    gridSize = size;
    totalCards = size * size;

    const pairsNeeded = totalCards / 2;
    const selected = [];
    for (let i = 0; i < pairsNeeded; i++) selected.push(emojiPool[i % emojiPool.length]);
    const deck = shuffleArray([...selected, ...selected]);
    buildBoardFromDeck(deck);
    saveCurrentGameState();
}

function onCardClick(e) {
    const card = e.currentTarget;
    if (lockBoard) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    if (attempts === 0 && !timerInterval) startTimer();
    card.classList.add('flipped');

    animateWave();

    if (!firstCard) {
        firstCard = card;
        saveCurrentGameState();
        return;
    }

    secondCard = card;
    lockBoard = true;
    incrementAttempts();

    const symbolA = firstCard.dataset.symbol;
    const symbolB = secondCard.dataset.symbol;

    if (symbolA === symbolB) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchesFound += 2;

        if (pendingUnflip && pendingUnflip.timeoutId) {
            clearTimeout(pendingUnflip.timeoutId);
            pendingUnflip = null;
        }

        resetTurn();

        if (matchesFound === totalCards) {
            stopTimer();
            const elapsed = Date.now() - startTime;
            const isBest = saveBestScore(gridSize, attempts, elapsed);
            setTimeout(() => {
                alert(`¡Felicidades! Terminaste en ${formatTime(elapsed)} con ${attempts} intentos.` + (isBest ? ' Nuevo mejor resultado 👍' : ''));
                loadBestScores();
                sessionStorage.removeItem('memorama_current');
            }, 200);
        } else saveCurrentGameState();
    } else {
        const idxA = firstCard.dataset.index;
        const idxB = secondCard.dataset.index;

        if (pendingUnflip && pendingUnflip.timeoutId) clearTimeout(pendingUnflip.timeoutId);

        const aRef = firstCard, bRef = secondCard;
        pendingUnflip = {
            indices: [idxA, idxB],
            timeoutId: setTimeout(() => {
                aRef.classList.remove('flipped');
                bRef.classList.remove('flipped');
                pendingUnflip = null;
                resetTurn(false);
                saveCurrentGameState();
            }, 700)
        };
        saveCurrentGameState();
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}
function animateWave() {
  const flippedCards = Array.from(boardEl.querySelectorAll('.card.flipped .card-inner'));
  flippedCards.forEach((inner, i) => {
    inner.classList.remove('wave');
    setTimeout(() => {
      inner.classList.add('wave');
    }, i * 50);
  });
}

function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function saveCurrentGameState() {
    const cards = Array.from(boardEl.children).map(c => {
        const idx = c.dataset.index;
        const matched = c.classList.contains('matched');
        const isPending = pendingUnflip && Array.isArray(pendingUnflip.indices) && pendingUnflip.indices.includes(idx);
        const flipped = matched ? true : (c.classList.contains('flipped') && !isPending);
        return { symbol: c.dataset.symbol, flipped, matched };
    });
    const deck = cards.map(c => c.symbol);
    const state = {
        gridSize,
        deck,
        cards,
        timerElapsed: startTime ? (Date.now() - startTime) : 0,
        attempts
    };
    sessionStorage.setItem('memorama_current', JSON.stringify(state));
}

function loadCurrentGameState() {
    const saved = sessionStorage.getItem('memorama_current');
    if (!saved) return false;
    try {
        const state = JSON.parse(saved);
        if (pendingUnflip && pendingUnflip.timeoutId) clearTimeout(pendingUnflip.timeoutId);
        pendingUnflip = null;

        gridSize = state.gridSize;
        totalCards = gridSize * gridSize;
        buildBoardFromDeck(state.deck);

        const cards = Array.from(boardEl.children);
        state.cards.forEach((c, i) => {
            if (c.matched) cards[i].classList.add('matched');
        });

        attempts = state.attempts || 0;
        attemptsEl.textContent = attempts;

        startTime = Date.now() - state.timerElapsed;
        startTimer();
        return true;
    } catch (err) {
        console.error('No se pudo restaurar partida', err);
        return false;
    }
}

// Nuevo juego
newGameBtn.addEventListener('click', () => {
    const size = parseInt(difficultyEl.value, 10);
    if (pendingUnflip && pendingUnflip.timeoutId) clearTimeout(pendingUnflip.timeoutId);
    pendingUnflip = null;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    sessionStorage.removeItem('memorama_current');
    stopTimer();
    createBoard(size);
});

difficultyEl.addEventListener('change', e => {
    const size = parseInt(e.target.value, 10);
    if (pendingUnflip && pendingUnflip.timeoutId) clearTimeout(pendingUnflip.timeoutId);
    pendingUnflip = null;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    sessionStorage.removeItem('memorama_current');
    stopTimer();
    createBoard(size);
});

(function init() {
    if (!loadCurrentGameState()) {
        createBoard(gridSize);
    }
    loadBestScores();
})();


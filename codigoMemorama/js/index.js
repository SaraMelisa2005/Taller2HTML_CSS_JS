/* Memorama — lógica del juego */

// Variables principales
const boardEl = document.getElementById('game-board');
const attemptsEl = document.getElementById('attempts');
const timerEl = document.getElementById('timer');
const difficultyEl = document.getElementById('difficulty');
const newGameBtn = document.getElementById('new-game');
const bestListEl = document.getElementById('best-list');

let gridSize = parseInt(difficultyEl.value, 10); // 4,6,10 => grid is size x size
let totalCards = gridSize * gridSize;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let attempts = 0;
let timerInterval = null;
let startTime = null;

// Emoji pool — suficiente variedad para 50 pares (10x10)
const emojiPool = [
    '🍎', '🍌', '🍓', '🍇', '🍉', '🍒', '🍍', '🥭', '🥥', '🍑',
    '🍋', '🥝', '🥑', '🍆', '🥕', '🌽', '🍅', '🥦', '🥔', '🍠',
    '🍞', '🧀', '🍗', '🥓', '🍔', '🍕', '🌭', '🥪', '🌮', '🌯',
    '🍿', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '🍮',
    '⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🎱', '🏓', '🏸', '🥅'
];

// Helpers
const formatTime = ms => {
    if (!ms) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function saveBestScore(size, attemptsCount, timeMs) {
    const key = `memorama_best_${size}`;
    const prev = JSON.parse(localStorage.getItem(key) || 'null');
    const newScore = { attempts: attemptsCount, time: timeMs, date: new Date().toISOString() };

    // Priorizar menor tiempo y luego menor intentos
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
            li.textContent = `${size}×${size} — Tiempo: ${formatTime(item.time)} — Intentos: ${item.attempts} (${new Date(item.date).toLocaleString()})`;
        } else {
            li.textContent = `${size}×${size} — sin registro`;
        }
        bestListEl.appendChild(li);
    })
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timerEl.textContent = formatTime(elapsed);
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

function createBoard(size) {
    boardEl.innerHTML = '';
    boardEl.className = 'board size-' + size;
    gridSize = size;
    totalCards = size * size;
    matchesFound = 0;
    attempts = 0;
    attemptsEl.textContent = attempts;
    timerEl.textContent = '00:00';

    // Prepare icons (pairs)
    const pairsNeeded = totalCards / 2;
    if (pairsNeeded > emojiPool.length) {
        console.warn('No hay suficientes símbolos únicos en emojiPool — se repetirán.');
    }

    // Take the first N unique emojis and duplicate
    const selected = [];
    for (let i = 0; i < pairsNeeded; i++) {
        selected.push(emojiPool[i % emojiPool.length]);
    }

    const deck = shuffleArray([...selected, ...selected]);

    // Build DOM
    deck.forEach((symbol, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.tabIndex = 0; // keyboard focus
        card.dataset.symbol = symbol;
        card.dataset.index = idx;

        const inner = document.createElement('div');
        inner.className = 'card-inner';

        const faceFront = document.createElement('div');
        faceFront.className = 'card-face card-front';
        faceFront.textContent = symbol;

        const faceBack = document.createElement('div');
        faceBack.className = 'card-face card-back';
        faceBack.innerHTML = '&#x1F512;'; // padlock as back placeholder

        inner.appendChild(faceFront);
        inner.appendChild(faceBack);
        card.appendChild(inner);

        // Event listeners
        card.addEventListener('click', onCardClick);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });

        boardEl.appendChild(card);
    });
}

function onCardClick(e) {
    const card = e.currentTarget;
    if (lockBoard) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    // Start timer on first move
    if (attempts === 0 && !timerInterval) {
        startTimer();
    }

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;

    // Increase attempts as soon as two cards are revealed
    incrementAttempts();

    const symbolA = firstCard.dataset.symbol;
    const symbolB = secondCard.dataset.symbol;

    if (symbolA === symbolB) {
        // Match!
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchesFound += 2;
        resetTurn(true);

        if (matchesFound === totalCards) {
            // Game finished
            stopTimer();
            const elapsed = Date.now() - startTime;
            const isBest = saveBestScore(gridSize, attempts, elapsed);
            setTimeout(() => {
                const msg = `¡Felicidades! Terminaste en ${formatTime(elapsed)} con ${attempts} intentos.` + (isBest ? ' Nuevo mejor resultado 👍' : '');
                alert(msg);
                loadBestScores();
            }, 200);
        }
    } else {
        // Not a match — hide after short delay
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetTurn(false);
        }, 700);
    }
}

function resetTurn(matched) {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Fisher–Yates shuffle
function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// UI wiring
newGameBtn.addEventListener('click', () => {
    const size = parseInt(difficultyEl.value, 10);
    stopTimer();
    createBoard(size);
});

difficultyEl.addEventListener('change', (e) => {
    const size = parseInt(e.target.value, 10);
    // auto start new board when difficulty changes
    stopTimer();
    createBoard(size);
});

// Initialize
(function init() {
    createBoard(gridSize);
    loadBestScores();
})();
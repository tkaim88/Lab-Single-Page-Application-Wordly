// API
const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// DOM elements
const searchForm = document.getElementById('searchForm');
const wordInput = document.getElementById('wordInput');
const resultsArea = document.getElementById('resultsArea');
const errorBox = document.getElementById('errorBox');
const errorMsg = document.getElementById('errorMsg');
const loadingMessage = document.getElementById('loadingMessage');
const darkModeBtn = document.getElementById('darkModeBtn');
const savedWordsList = document.getElementById('savedWordsList');

let savedWords = [];

// SAVED WORDS

function loadSavedWords() {
    const saved = localStorage.getItem('dictionarySavedWords');
    if (saved) {
        savedWords = JSON.parse(saved);
        showSavedWords();
    }
}

function saveWordsToStorage() {
    localStorage.setItem('dictionarySavedWords', JSON.stringify(savedWords));
}

function showSavedWords() {
    savedWordsList.innerHTML = '';

    if (savedWords.length === 0) {
        savedWordsList.innerHTML = '<p>No saved words yet.</p>';
        return;
    }

    savedWords.forEach(word => {
        const span = document.createElement('span');
        span.className = 'savedWord';
        span.textContent = word;

        span.addEventListener('click', () => {
            wordInput.value = word;
            handleSearch(new Event('submit'));
        });

        savedWordsList.appendChild(span);
    });
}

function addSavedWord(word) {
    if (!savedWords.includes(word)) {
        savedWords.push(word);
    } else {
        savedWords = savedWords.filter(w => w !== word);
    }
    saveWordsToStorage();
    showSavedWords();
}

//  UI HELPERS

function showError(message) {
    errorMsg.textContent = message;
    errorBox.classList.remove('hidden');
}

function hideError() {
    errorBox.classList.add('hidden');
}

function showLoading() {
    loadingMessage.classList.remove('hidden');
}

function hideLoading() {
    loadingMessage.classList.add('hidden');
}

// DISPLAY

function displayWord(data, searchedWord) {
    resultsArea.innerHTML = '';

    const entry = data[0];

    const word = entry.word || searchedWord;
    const phonetic = entry.phonetic || '';

    let html = `
        <div class="wordCard">
            <h2>${word}</h2>
            <p>${phonetic}</p>
            <button class="saveBtn">❤️ Save</button>
    `;

    entry.meanings.forEach(meaning => {
        html += `<h4>${meaning.partOfSpeech}</h4>`;

        meaning.definitions.forEach(def => {
            html += `<p>${def.definition}</p>`;
        });
    });

    html += `</div>`;
    resultsArea.innerHTML = html;

    const saveBtn = document.querySelector('.saveBtn');
    saveBtn.addEventListener('click', () => addSavedWord(word));
}

// API

async function getWordData(word) {
    const response = await fetch(API_URL + word);

    if (!response.ok) {
        throw new Error('Word not found');
    }

    return response.json();
}

// SEARCH

async function handleSearch(e) {
    if (e) e.preventDefault();

    const word = wordInput.value.trim();

    if (!word) {
        showError('Enter a word');
        return;
    }

    hideError();
    showLoading();

    try {
        const data = await getWordData(word);
        displayWord(data, word);
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

// DARK MODE

function toggleDarkMode() {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
        darkModeBtn.textContent = '☀️ Light Mode';
    } else {
        darkModeBtn.textContent = '🌙 Dark Mode';
    }
}

// INIT

searchForm.addEventListener('submit', handleSearch);
darkModeBtn.addEventListener('click', toggleDarkMode);

loadSavedWords();
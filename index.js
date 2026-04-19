// Wordly Dictionary
// API for getting word definitions
const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Get all the HTML elements I need
const searchForm = document.getElementById('searchForm');
const wordInput = document.getElementById('wordInput');
const resultsArea = document.getElementById('resultsArea');
const errorBox = document.getElementById('errorBox');
const errorMsg = document.getElementById('errorMsg');
const loadingMessage = document.getElementById('loadingMessage');
const darkModeBtn = document.getElementById('darkModeBtn');
const savedWordsList = document.getElementById('savedWordsList');

// Array to store saved words
let savedWords = [];

// SAVED WORDS FUNCTIONS

// Load saved words from localStorage when page loads
function loadSavedWords() {
    const saved = localStorage.getItem('dictionarySavedWords');
    if (saved) {
        savedWords = JSON.parse(saved);
        showSavedWords();
    }
}

// Save words to localStorage
function saveWordsToStorage() {
    localStorage.setItem('dictionarySavedWords', JSON.stringify(savedWords));
}

// Display saved words on the page
function showSavedWords() {
    // Clear the list first
    savedWordsList.innerHTML = '';
    
    if (savedWords.length === 0) {
        savedWordsList.innerHTML = '<p>No saved words yet. Click "Save" on any word!</p>';
        return;
    }
    
    // Add each saved word as a button
    for (let i = 0; i < savedWords.length; i++) {
        const word = savedWords[i];
        const wordSpan = document.createElement('span');
        wordSpan.className = 'savedWord';
        wordSpan.innerHTML = word + ' <span class="deleteWord" data-word="' + word + '">❌</span>';
        
        // Click on the word to search it
        wordSpan.addEventListener('click', function(e) {
            // If clicking the delete button, don't search
            if (e.target.className === 'deleteWord') {
                return;
            }
            wordInput.value = word;
            // Trigger search
            const fakeEvent = new Event('submit');
            searchForm.dispatchEvent(fakeEvent);
        });
        
        savedWordsList.appendChild(wordSpan);
    }
    
    // Add delete functionality to all delete buttons
    const deleteButtons = document.querySelectorAll('.deleteWord');
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', function(e) {
            e.stopPropagation();
            const wordToRemove = this.getAttribute('data-word');
            removeSavedWord(wordToRemove);
        });
    }
}

// Remove a word from saved list
function removeSavedWord(word) {
    const index = savedWords.indexOf(word);
    if (index !== -1) {
        savedWords.splice(index, 1);
        saveWordsToStorage();
        showSavedWords();
        
        // Update the save button if this word is currently displayed
        const allSaveBtns = document.querySelectorAll('.saveBtn');
        for (let i = 0; i < allSaveBtns.length; i++) {
            if (allSaveBtns[i].getAttribute('data-word') === word) {
                allSaveBtns[i].textContent = '❤️ Save';
                allSaveBtns[i].style.backgroundColor = '#ed64a6';
            }
        }
    }
}

// Save a word to favorites
function addSavedWord(word, button) {
    // Check if word is already saved
    if (!savedWords.includes(word)) {
        savedWords.push(word);
        saveWordsToStorage();
        showSavedWords();
        button.textContent = '✅ Saved';
        button.style.backgroundColor = '#48bb78';
    } else {
        // If already saved remove it
        removeSavedWord(word);
        button.textContent = '❤️ Save';
        button.style.backgroundColor = '#ed64a6';
    }
}

// ERROR HANDLING 

function showError(message) {
    errorMsg.textContent = message;
    errorBox.classList.remove('hidden');
    // Hide error after 4 seconds
    setTimeout(function() {
        errorBox.classList.add('hidden');
    }, 4000);
}

function hideError() {
    errorBox.classList.add('hidden');
}

function showLoading() {
    loadingMessage.classList.remove('hidden');
    resultsArea.innerHTML = '';
}

function hideLoading() {
    loadingMessage.classList.add('hidden');
}

// DISPLAY WORD DATA

function displayWord(data, searchedWord) {
    resultsArea.innerHTML = '';
    
    // The API returns an array of entries
    let entries = [];
    if (Array.isArray(data)) {
        entries = data;
    } else {
        entries = [data];
    }
    
    // Loop through each entry
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const word = entry.word || searchedWord;
        const phonetic = entry.phonetic || '';
        const phoneticsArray = entry.phonetics || [];
        const meanings = entry.meanings || [];
        
        // Find audio URL if available
        let audioUrl = '';
        for (let j = 0; j < phoneticsArray.length; j++) {
            if (phoneticsArray[j].audio) {
                audioUrl = phoneticsArray[j].audio;
                break;
            }
        }
        
        // Check if this word is saved
        const isWordSaved = savedWords.includes(word);
        
        // Create the word card
        const card = document.createElement('div');
        card.className = 'wordCard';
        
        // Build the HTML
        let cardHTML = '<div class="wordTitle">';
        cardHTML += '<div>';
        cardHTML += '<h2>' + capitalizeFirstLetter(word) + '</h2>';
        if (phonetic) {
            cardHTML += '<p class="pronounce">' + phonetic + '</p>';
        }
        cardHTML += '</div>';
        cardHTML += '<div>';
        
        if (audioUrl) {
            cardHTML += '<button class="listenBtn" data-audio="' + audioUrl + '">🔊 Listen</button>';
        }
        
        const saveButtonText = isWordSaved ? '✅ Saved' : '❤️ Save';
        const saveButtonColor = isWordSaved ? '#48bb78' : '#ed64a6';
        cardHTML += '<button class="saveBtn" data-word="' + word + '" style="background-color: ' + saveButtonColor + ';">' + saveButtonText + '</button>';
        cardHTML += '</div>';
        cardHTML += '</div>';
        
        // Add meanings
        for (let k = 0; k < meanings.length; k++) {
            const meaning = meanings[k];
            const partOfSpeech = meaning.partOfSpeech || 'Unknown';
            const definitions = meaning.definitions || [];
            const synonyms = meaning.synonyms || [];
            
            cardHTML += '<div class="meaningBox">';
            cardHTML += '<h4>' + partOfSpeech + '</h4>';
            
            // Add definitions
            for (let d = 0; d < definitions.length; d++) {
                const def = definitions[d];
                cardHTML += '<div class="definition">';
                cardHTML += '<strong>' + (d + 1) + '.</strong> ' + (def.definition || 'No definition available');
                if (def.example) {
                    cardHTML += '<div class="example">📖 "' + def.example + '"</div>';
                }
                cardHTML += '</div>';
            }
            
            // Add synonyms
            if (synonyms.length > 0) {
                cardHTML += '<div class="synonymList"><strong>Synonyms:</strong><br>';
                const maxSynonyms = Math.min(synonyms.length, 5);
                for (let s = 0; s < maxSynonyms; s++) {
                    cardHTML += '<span class="synonymBadge">' + synonyms[s] + '</span>';
                }
                cardHTML += '</div>';
            }
            
            cardHTML += '</div>';
        }
        
        card.innerHTML = cardHTML;
        resultsArea.appendChild(card);
        
        // Add event listener for audio button
        const audioBtn = card.querySelector('.listenBtn');
        if (audioBtn) {
            audioBtn.addEventListener('click', function() {
                const audioUrl = this.getAttribute('data-audio');
                const audio = new Audio(audioUrl);
                audio.play().catch(function(err) {
                    console.log('Audio error:', err);
                });
            });
        }
        
        // Add event listener for save button
        const saveBtn = card.querySelector('.saveBtn');
        saveBtn.addEventListener('click', function() {
            const wordToSave = this.getAttribute('data-word');
            addSavedWord(wordToSave, this);
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// API REQUEST

async function getWordData(word) {
    const response = await fetch(API_URL + word);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('"' + word + '" not found. Please check spelling.');
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
    
    const data = await response.json();
    return data;
}

// HANDLE SEARCH

async function handleSearch(event) {
    event.preventDefault();
    
    const word = wordInput.value.trim().toLowerCase();
    
    // Check if empty
    if (word === '') {
        showError('Please enter a word to search');
        return;
    }
    
    // Clear previous results and errors
    resultsArea.innerHTML = '';
    hideError();
    showLoading();
    
    try {
        const wordData = await getWordData(word);
        displayWord(wordData, word);
        hideLoading();
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// DARK MODE 

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    
    if (document.body.classList.contains('dark')) {
        darkModeBtn.textContent = 'Light Mode';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeBtn.textContent = 'Dark Mode';
        localStorage.setItem('darkMode', 'disabled');
    }
}

function loadDarkModePreference() {
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting === 'enabled') {
        document.body.classList.add('dark');
        darkModeBtn.textContent = 'Light Mode';
    }
}

// SETUP EVENT LISTENERS 

searchForm.addEventListener('submit', handleSearch);
darkModeBtn.addEventListener('click', toggleDarkMode);

// INITIALIZE APP

loadSavedWords();
loadDarkModePreference();
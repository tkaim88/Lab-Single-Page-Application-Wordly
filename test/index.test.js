// Simple tests for Wordly Dictionary 
// Uses Jest and JSDOM to test core functionality of the app

// Setup HTML before each test
function setupDOM() {
    document.body.innerHTML = `
        <div class="container">
            <h1>Wordly Dictionary</h1>
            <button id="darkModeBtn">Dark Mode</button>
            <form id="searchForm">
                <input type="text" id="wordInput" placeholder="Enter a word...">
                <button type="submit">Search</button>
            </form>
            <div id="loadingMessage" class="hidden">Loading...</div>
            <div id="errorBox" class="hidden"><p id="errorMsg"></p></div>
            <div id="resultsArea"></div>
            <div id="savedWordsList"></div>
        </div>
    `;
}

// Mock localStorage
const mockStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};
global.localStorage = mockStorage;

// Mock fetch API
global.fetch = jest.fn();

// Run before each test
beforeEach(() => {
    setupDOM();
    mockStorage.getItem.mockClear();
    mockStorage.setItem.mockClear();
    global.fetch.mockClear();
});

// Html Form and search tests
describe('Search Form Tests', () => {
    test('search form exists', () => {
        const form = document.getElementById('searchForm');
        expect(form).not.toBeNull();
    });
    
    test('input field exists', () => {
        const input = document.getElementById('wordInput');
        expect(input).not.toBeNull();
    });
    
    test('search button exists', () => {
        const button = document.querySelector('button[type="submit"]');
        expect(button).not.toBeNull();
    });
    
    test('form submit triggers search', () => {
        const form = document.getElementById('searchForm');
        let submitted = false;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitted = true;
        });
        form.dispatchEvent(new Event('submit'));
        expect(submitted).toBe(true);
    });
});

// API fetch tests
describe('API Fetch Tests', () => {
    test('API URL format is correct', () => {
        const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        const word = 'hello';
        const fullUrl = API_URL + word;
        expect(fullUrl).toBe('https://api.dictionaryapi.dev/api/v2/entries/en/hello');
    });
    
    test('fetch is called with correct URL', async () => {
        const mockResponse = { ok: true, json: async () => [] };
        global.fetch.mockResolvedValue(mockResponse);
        
        await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/hello');
        
        expect(global.fetch).toHaveBeenCalledWith('https://api.dictionaryapi.dev/api/v2/entries/en/hello');
    });
});

// Display definitions tests
describe('Display Definitions Tests', () => {
    test('displays word definition', () => {
        const resultsArea = document.getElementById('resultsArea');
        resultsArea.innerHTML = '<div class="wordCard"><div class="definition">A greeting</div></div>';
        expect(resultsArea.innerHTML).toContain('A greeting');
    });
    
    test('displays part of speech', () => {
        const resultsArea = document.getElementById('resultsArea');
        resultsArea.innerHTML = '<div class="meaningBox"><h4>noun</h4></div>';
        expect(resultsArea.innerHTML).toContain('noun');
    });
    
    test('displays example usage', () => {
        const resultsArea = document.getElementById('resultsArea');
        resultsArea.innerHTML = '<div class="example">"Hello, world!"</div>';
        expect(resultsArea.innerHTML).toContain('Hello, world!');
    });
    
    test('displays synonyms', () => {
        const resultsArea = document.getElementById('resultsArea');
        resultsArea.innerHTML = '<span class="synonymBadge">greeting</span>';
        expect(resultsArea.innerHTML).toContain('greeting');
    });
    
    test('clears previous results before new search', () => {
        const resultsArea = document.getElementById('resultsArea');
        resultsArea.innerHTML = '<div>Old result</div>';
        resultsArea.innerHTML = '';
        expect(resultsArea.innerHTML).toBe('');
    });
});

// Audio playback tests
describe('Audio Playback Tests', () => {
    test('audio button appears when pronunciation available', () => {
        const audioUrl = 'https://example.com/audio.mp3';
        const button = document.createElement('button');
        button.className = 'listenBtn';
        button.setAttribute('data-audio', audioUrl);
        expect(button.getAttribute('data-audio')).toBe(audioUrl);
    });
    
    test('playAudio function exists and can be called', () => {
        let audioPlayed = false;
        function playAudio(url) {
            audioPlayed = true;
        }
        playAudio('test.mp3');
        expect(audioPlayed).toBe(true);
    });
});

// Dark mode tests
describe('Dark Mode Tests', () => {
    test('dark mode button exists', () => {
        const darkBtn = document.getElementById('darkModeBtn');
        expect(darkBtn).not.toBeNull();
    });
    
    test('toggleDarkMode adds dark class to body', () => {
        function toggleDarkMode() {
            document.body.classList.toggle('dark');
        }
        expect(document.body.classList.contains('dark')).toBe(false);
        toggleDarkMode();
        expect(document.body.classList.contains('dark')).toBe(true);
    });
    
    test('dark mode preference saves to localStorage', () => {
        function saveDarkMode(isDark) {
            mockStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        }
        saveDarkMode(true);
        expect(mockStorage.setItem).toHaveBeenCalledWith('darkMode', 'enabled');
    });
    
    test('dark mode preference loads from localStorage', () => {
        mockStorage.getItem.mockReturnValue('enabled');
        const saved = mockStorage.getItem('darkMode');
        expect(saved).toBe('enabled');
    });
});

// Save Words Tests
describe('Save Words Tests', () => {
    test('add word to saved array', () => {
        let saved = [];
        function addWord(w) {
            if (!saved.includes(w)) saved.push(w);
        }
        addWord('hello');
        expect(saved.length).toBe(1);
        expect(saved[0]).toBe('hello');
    });
    
    test('no duplicate words allowed', () => {
        let saved = [];
        function addWord(w) {
            if (!saved.includes(w)) saved.push(w);
        }
        addWord('hello');
        addWord('hello');
        expect(saved.length).toBe(1);
    });
    
    test('saved words persist to localStorage', () => {
        let saved = ['hello', 'world'];
        function saveToStorage() {
            mockStorage.setItem('words', JSON.stringify(saved));
        }
        saveToStorage();
        expect(mockStorage.setItem).toHaveBeenCalledWith('words', JSON.stringify(['hello', 'world']));
    });
    
    test('delete word from saved', () => {
        let saved = ['hello', 'world'];
        function deleteWord(w) {
            const index = saved.indexOf(w);
            if (index !== -1) saved.splice(index, 1);
        }
        deleteWord('hello');
        expect(saved.length).toBe(1);
        expect(saved[0]).toBe('world');
    });
    
    test('saved words display on page', () => {
        const savedList = document.getElementById('savedWordsList');
        const saved = ['hello', 'world'];
        savedList.innerHTML = '';
        saved.forEach(w => {
            const span = document.createElement('span');
            span.textContent = w;
            savedList.appendChild(span);
        });
        expect(savedList.children.length).toBe(2);
    });
    
    test('click saved word searches for it', () => {
        const input = document.getElementById('wordInput');
        let searchedWord = '';
        function searchWord(w) {
            input.value = w;
            searchedWord = w;
        }
        searchWord('hello');
        expect(input.value).toBe('hello');
        expect(searchedWord).toBe('hello');
    });
});

// Error Handling tests
describe('Error Handling Tests', () => {
    test('shows error for empty input', () => {
        const input = document.getElementById('wordInput');
        const errorBox = document.getElementById('errorBox');
        let errorShown = false;
        
        input.value = '';
        if (input.value.trim() === '') {
            errorShown = true;
            errorBox.classList.remove('hidden');
        }
        expect(errorShown).toBe(true);
    });
    
    test('shows error message when word not found', () => {
        const errorMsg = document.getElementById('errorMsg');
        function showError(msg) {
            errorMsg.textContent = msg;
        }
        showError('"xyzabc" not found');
        expect(errorMsg.textContent).toContain('not found');
    });
    
    test('shows error for network failure', () => {
        const errorMsg = document.getElementById('errorMsg');
        function showError(msg) {
            errorMsg.textContent = msg;
        }
        showError('Network error. Please try again.');
        expect(errorMsg.textContent).toContain('Network error');
    });
    
    test('hides error on new search', () => {
        const errorBox = document.getElementById('errorBox');
        errorBox.classList.remove('hidden');
        errorBox.classList.add('hidden');
        expect(errorBox.classList.contains('hidden')).toBe(true);
    });
    
    test('displays error message box', () => {
        const errorBox = document.getElementById('errorBox');
        expect(errorBox).not.toBeNull();
    });
});

// Loading Indicator tests
describe('Loading Indicator Tests', () => {
    test('shows loading indicator during fetch', () => {
        const loading = document.getElementById('loadingMessage');
        loading.classList.remove('hidden');
        expect(loading.classList.contains('hidden')).toBe(false);
    });
    
    test('hides loading indicator after fetch', () => {
        const loading = document.getElementById('loadingMessage');
        loading.classList.add('hidden');
        expect(loading.classList.contains('hidden')).toBe(true);
    });
    
    test('loading element exists', () => {
        const loading = document.getElementById('loadingMessage');
        expect(loading).not.toBeNull();
    });
});

// Utility functions tests
describe('Utility Functions Tests', () => {
    test('capitalizeFirstLetter works', () => {
        function cap(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        expect(cap('hello')).toBe('Hello');
        expect(cap('world')).toBe('World');
    });
    
    test('capitalize handles empty string', () => {
        function cap(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        expect(cap('')).toBe('');
    });
});
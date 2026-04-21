# Wordly Dictionary

A simple dictionary Single Page Application (SPA) that lets you search for words, get definitions, listen to pronunciations, save favorite words, and switch between light and dark mode.

## About Me

Hi, I'm Thomas! This is my Wordly Dictionary project for my web development course.

**🔗 Live Demo:** [Wordly Dictionary](https://lab-single-page-application-wordly.vercel.app/)

Feel free to try it out! Search for any word, save your favorites, and switch to dark mode. 

## Live Demo

Open `index.html` in your browser to run the application.

## Features

- **Search for words** - Type any word and get its definition
- **View definitions** - See the word's meaning, part of speech, and example sentences
- **Listen to pronunciation** - Click the listen button to hear how the word sounds
- **View synonyms** - See related words for each definition
- **Save favorite words** - Click the heart button to save words you like
- **Delete saved words** - Remove words from your saved list
- **Click saved words to search** - Click any saved word to automatically search for it
- **Dark mode** - Switch between light and dark themes (saves your preference)
- **Loading indicator** - Shows when the app is fetching data
- **Error handling** - Shows friendly error messages for invalid words or network issues

## How It Works

1. You type a word into the search box
2. The app sends a request to the Free Dictionary API
3. The API returns data about the word
4. The app displays the definition, pronunciation, part of speech, examples, and synonyms
5. You can save words to your favorites list
6. Your saved words are stored in your browser's localStorage

## Technologies Used

- **HTML** - Page structure
- **CSS** - Styling and dark mode
- **JavaScript** - Functionality, API calls, DOM manipulation
- **Free Dictionary API** - Word data source
- **Jest** - Testing framework

## File Structure

wordly-dictionary/
│
├── index.html # Main HTML file
├── styles.css # CSS styles
├── index.js # JavaScript functionality
├── package.json # Dependencies and scripts
├── jest.config.js # Jest configuration
│
├── test/
│ └── index.test.js # Test file
│
└── README.md # This file


## Key JavaScript Functions

| Function | Description |
|----------|-------------|
| `getWordData(word)` | Fetches word data from the API |
| `displayWord(data, searchedWord)` | Displays word information on the page |
| `handleSearch(event)` | Handles form submission and search |
| `addSavedWord(word, button)` | Adds a word to saved list |
| `removeSavedWord(word)` | Removes a word from saved list |
| `showSavedWords()` | Displays all saved words |
| `toggleDarkMode()` | Switches between light and dark mode |
| `showError(message)` | Shows error messages |
| `showLoading()` / `hideLoading()` | Shows/hides loading indicator |
| `playAudio(audioUrl)` | Plays pronunciation audio |
| `capitalizeFirstLetter(string)` | Capitalizes first letter of a word |

## API Reference

This app uses the **Free Dictionary API**:
https://api.dictionaryapi.dev/api/v2/entries/en/{word}


Example response includes:
- `word` - The word searched
- `phonetic` - Pronunciation guide
- `phonetics[].audio` - Audio file URL
- `meanings[].partOfSpeech` - Noun, verb, adjective, etc.
- `meanings[].definitions[].definition` - Word definition
- `meanings[].definitions[].example` - Example sentence
- `meanings[].synonyms` - Related words


## Bug Fixes & Improvements

### Fixed Issues
- Fixed search not working due to mismatched HTML element IDs
- Corrected DOM element selectors in JavaScript
- Fixed dark mode not applying due to CSS file not loading
- Resolved incorrect stylesheet path causing MIME type error
- Improved dark mode styles for better visibility

### Improvements
- Cleaned and simplified JavaScript structure
- Added better error handling for API requests
- Improved UI feedback (loading + error messages)
- Ensured saved words feature works correctly

### Notes
The main issue was incorrect linking of the CSS file, which prevented styles (including dark mode) from applying.


## Setup Instructions

### To run the app:

1. Clone or download all files to your computer
2. Make sure all files are in the same folder:
   - `index.html`
   - `styles.css`
   - `index.js`
3. Open `index.html` in any web browser
4. Start searching for words!

### To run tests:

```bash
# Install dependencies
npm install

# Run tests
npm test
Testing
The project includes Jest tests that verify:

HTML elements exist

Search form works

Error messages display

Loading indicator shows/hides

Dark mode toggles

Saved words add, remove, and persist

Definitions display correctly

API URL format is correct

Error Handling
The app handles these error cases:

Empty search input

Word not found in dictionary

Network connection issues

Audio playback failures

Browser Support
Works on all modern browsers:

Chrome

Firefox

Safari

Edge

Acknowledgments
Free Dictionary API for providing free word data

My web development instructor for guidance on this project

Author
Student Thomas komora buko - Web Development Course

Grade Requirements Met
Single Page Application (no page reloads)

Search form with input and submit button

Fetch data from external API

Display definitions, part of speech, examples

Audio playback for pronunciation

Display synonyms

Dark mode styling

Save words to localStorage

Delete saved words

Error handling for invalid input

Error handling for failed API requests

Loading indicator

Responsive design

Jest tests for all features
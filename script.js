/**
 *  Calls API for generating a set of random words.
 */
async function getRandomWords(numberOfWords) {
    const url = `https://random-word-api.herokuapp.com/word?number=${numberOfWords}`;

    const result = 
        await fetch(url, {method: "GET"})
        .then(response => response.json());

    return result;
}

/**
 *  Calls Free Dictionary API for checking passed word.
 */

async function searchDictionary(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    const result = 
        await fetch(url, {method: "GET"})
        .then(response => response.json());

    return result;
}

/**
 *  Iterates array of given words until condition is met, if it exists or not in the API.
 */

async function getExistingWord(allWords) {
    
    for (let word of allWords) {
        const foundWordInDictionary = await searchDictionary(word);
        if (foundWordInDictionary && foundWordInDictionary.title != "No Definitions Found") {
            return foundWordInDictionary;
        }
    }
    return null;
}

function setGame(word) {
    const characters = [];
    for (let i = 0; i < word.length; i++) {
        const character = {
            value: word[i],
            display: true
        };
        characters.push(character);
    };
    startGame(word, characters);
    // hideRandomCharacters(characters, game);
    // return characters;
}

function hideRandomCharacters(characters, gameObj) {
    const half = Math.round(characters.length / 2);
    const randomNumbers = [];

    while(randomNumbers.length < half){
        var randomNumber = Math.floor(Math.random() * characters.length) + 1;
        if(randomNumbers.indexOf(randomNumber) === -1) randomNumbers.push(randomNumber);
    }
    randomNumbers.sort((a, b) => a-b);
    switchDisplayValue(characters, randomNumbers);
    return randomNumbers;
}

function switchDisplayValue(index, gameObj) {
    for (let i = 0; i < index.length; i++) {
        gameObj.characters[index].display = false;
    }
    console.log(characters);
}

function startGame(currentWord, currentWordCharacters) {
    const game = {
        word: currentWord,
        characters: currentWordCharacters,
        correctAnswers: 0,
        incorrectAnswers: 0,
    }
    hideRandomCharacters(currentWordCharacters, game);
    console.log(game);
    return game;
}

async function start() {
    let chosenWordForGame = null;

    while (chosenWordForGame === null) {
        const randomWords = await getRandomWords(10);
        chosenWordForGame = await getExistingWord(randomWords);
        // console.log(randomWords);
    }
    setGame(chosenWordForGame[0].word);
    // startGame(chosenWordForGame[0].word, characters);
}

// debugger;

start();
startGame()

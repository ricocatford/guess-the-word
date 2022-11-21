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
            position: i
        };
        characters.push(character);
    };
    hideRandomCharacters(characters);
    startGame(word, characters);
    return characters;
}

function hideRandomCharacters(characters) {
    const half = Math.round(characters.length / 2);
    const randomNumbers = [];

    while(randomNumbers.length < half){
        var randomNumber = Math.floor(Math.random() * characters.length) + 1;
        if(randomNumbers.indexOf(randomNumber) === -1) randomNumbers.push(randomNumber);
    }
    console.log(randomNumbers);
    randomNumbers.sort((a, b) => a-b);
    console.log(randomNumbers);
    // switchVisibility(characters, randomNumbers);
    return randomNumbers;
}

// function switchVisibility(characters, indexesToHide) {
//     for (let i = 0; i < characters.length; i++) {
//         if (indexesToHide[i])
//     }
// }

function startGame(currentWord, currentWordCharacters) {
    const game = {
        word: currentWord,
        characters: currentWordCharacters,
        correctAnswers: 0,
        incorrectAnswers: 0,
    }
    console.log(game);
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


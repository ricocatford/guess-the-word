let game = {
    rounds: 0,
    upscore: 0,
    downscore: 0,
    fails: 0,
    word: null,
}

/**
 * Calls API for generating a set of random words.
 */
async function getRandomWords(numberOfWords) {
    const url = `https://random-word-api.herokuapp.com/word?number=${numberOfWords}`;
    const result = 
        await fetch(url, {method: "GET"})
        .then(response => response.json());
    return result;
}

/**
 * Calls Free Dictionary API for checking passed word.
 */
async function searchDictionary(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const result = 
        await fetch(url, {method: "GET"})
        .then(response => response.json());
    return result;
}

/**
 * Iterates array of given words until condition is met, if it exists or not in the API.
 */
async function checkWord(allWords) {
    for (let word of allWords) {
        const foundWordInDictionary = await searchDictionary(word);
        if (
            foundWordInDictionary 
            && foundWordInDictionary.title != "No Definitions Found"
            && foundWordInDictionary.length > 0
        ) {
            selectedWordDefinition = foundWordInDictionary[0];
            if (
                selectedWordDefinition.word
                && selectedWordDefinition.word.length > 2
                && selectedWordDefinition.word.length < 11
            )
                return selectedWordDefinition;
        }
    }
    return null;
}

/**
 * Splits chosen word for game into characters.
 */
function splitWord(word) {
    const characters = [];
    if (word && word.length > 2) {
        for (let i = 0; i < word.length; i++) {
            const character = {
                value: word[i],
                display: true
            };
            characters.push(character);
        };
    }
    return characters;
}

/**
 * Sets game for game and calls function for hiding random characters.
 */
function setWord(chosenWordForGame) {
    const wordCharacters = splitWord(chosenWordForGame.word);
    const hiddenCharactersIndexes = generateHiddenCharactersIndexes(wordCharacters);
    const processedWordCharacters = switchDisplayOff(wordCharacters, hiddenCharactersIndexes);
    game.word = {
        characters: processedWordCharacters,
    }
    startRound();
}

function generateHiddenCharactersIndexes(word) {
    const half = Math.round(word.length / 2);
    const randomNumbers = [];
    while (randomNumbers.length < half) {
        const randomNumber = Math.floor(Math.random() * word.length);
        const indexOfRandomNumber = randomNumbers.indexOf(randomNumber) // Test later.
        if (randomNumbers.indexOf(randomNumber) === -1) {
            randomNumbers.push(randomNumber);
        }
    }
    randomNumbers.sort((a, b) => a - b);
    return randomNumbers;
}

function switchDisplayOff(wordCharacters, hiddenCharactersIndexes) {
    for (let index of hiddenCharactersIndexes) {
        wordCharacters[index].display = false;
    }
    return wordCharacters;
}

/**
 * Displays word iterating through array of word characters.
 */
function displayWord() {
    game.word.characters.map(character => {
        $("#app").append(`
            <div class="character-wrapper">
                <p class=${character.display ? "visible" : "hidden"}>${character.value}</p>
            </div>
        `);
    });
}

function startRound() {
    displayWord();
}

/**
 * Declares what is the chosen word for the game.
 */
async function start() {
    $("#app").empty();
    let chosenWordForGame = null;
    while (chosenWordForGame === null) {
        const randomWords = await getRandomWords(10);
        chosenWordForGame = await checkWord(randomWords);
    }
    setWord(chosenWordForGame)
}

start();
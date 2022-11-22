let game = {
    word: null,
    rounds: 0,
    upscore: 0,
    downscore: 0,
    fails: 0,
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
        if (foundWordInDictionary && foundWordInDictionary.title != "No Definitions Found") {
            return foundWordInDictionary;
        }
    }
    return null;
}

/**
 * Splits chosen word for game into characters.
 */
function splitWord(word) {
    const characters = [];
    for (let i = 0; i < word.length; i++) {
        const character = {
            value: word[i],
            display: true
        };
        characters.push(character);
    };
    setWord(characters);
    return characters;
}

/**
 * Sets game for game and calls function for hiding random characters.
 */
function setWord(word) {
    game.word = word;
    generateRandomNumbers(word);
    console.log(game);
    return game;
}

function generateRandomNumbers(word) {
    const half = Math.round(word.length / 2);
    const randomNumbers = [];

    while (randomNumbers.length < half) {
        var randomNumber = Math.floor(Math.random() * word.length) + 1;
        if (randomNumbers.indexOf(randomNumber) === -1) randomNumbers.push(randomNumber);
    }
    randomNumbers.sort((a, b) => a-b);

    switchDisplayOff(randomNumbers);
    return randomNumbers;
}

function switchDisplayOff(index) {
    if (index.length > 0 && game.word != undefined) {
        for (let i = 0; i < index.length; i++) {
            var ind = index[i];
            game.word[ind].display = false;
        }
        startRound();
        return game;
    }
    // for (let i = 0; i < index.length; i++) {
    //     var ind = index[i];
    //     game.word[ind].display = false;
    // }
    // startRound(game);
    // return game;
}

function displayGame(game) {
    $("#app").empty();
    game.word.map(character => {
        $("#app").append(`
            <div class="character-wrapper">
                <p class=${character.display ? "visible" : "hidden"}>${character.value}</p>
            </div>
        `);
    });
    // game.word.map(item => {
    //     $("#app").append(`
    //         <p>${item.value}</p>
    //     `);
    // });
}

function startRound() {
    displayGame(game);
    console.log("Click!");
}

/**
 * Declares what is the chosen word for the game.
 */
async function start() {
    let chosenWordForGame = null;

    while (chosenWordForGame === null) {
        const randomWords = await getRandomWords(10);
        chosenWordForGame = await checkWord(randomWords);
    }
    splitWord(chosenWordForGame[0].word);
    return chosenWordForGame;
}

start();
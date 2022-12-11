/**
 * Game object.
 */
let game = {
    won: 0,
    lost: 0,
    word: null,
};

/**
 * Calls API for generating a set of random words.
 */
async function getRandomWords(numberOfWords) {
    const url = `https://random-word-api.vercel.app/api?words=${numberOfWords}`;
    const result = 
        await fetch(url, {method: "GET"})
        .then(response => response.json());
    return result;
}

/**
 * Calls dictionary API for checking (passed) word.
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
            let selectedWordDefinition = foundWordInDictionary[0];
            if (
                selectedWordDefinition.word
                && selectedWordDefinition.word.length > 3
                && selectedWordDefinition.word.length < 9
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
                position: i,
                display: true
            };
            characters.push(character);
        };
    }
    return characters;
}

/**
 * Sets word for game and calls function for hiding random characters.
 */
function setWord(chosenWordForGame) {
    const wordCharacters = splitWord(chosenWordForGame.word);
    const hiddenCharactersIndexes = generateHiddenCharactersIndexes(wordCharacters);
    const processedWordCharacters = switchDisplayOff(wordCharacters, hiddenCharactersIndexes);
    game.word = {
        word: chosenWordForGame.word,
        characters: processedWordCharacters,
        meaning: chosenWordForGame.meanings[0].definitions[0].definition,
        phonetic: chosenWordForGame.phonetic
    };
}

/**
 * Generates random indexes.
 */
function generateHiddenCharactersIndexes(word) {
    const half = Math.round(word.length / 2);
    const randomNumbers = [];
    while (randomNumbers.length < half) {
        const randomNumber = Math.floor(Math.random() * word.length);
        const indexOfRandomNumber = randomNumbers.indexOf(randomNumber);
        if (indexOfRandomNumber === -1) {
            randomNumbers.push(randomNumber);
        }
    }
    randomNumbers.sort((a, b) => a - b);
    return randomNumbers;
}

/**
 * Switches display field to false of (passed) random indexes.
 */
function switchDisplayOff(wordCharacters, hiddenCharactersIndexes) {
    for (let index of hiddenCharactersIndexes) {
        wordCharacters[index].display = false;
    }
    return wordCharacters;
}

/**
 * Displays word characters as inputs.
 */
function displayTurn() {
    $("#app-definition-wrapper").append(`
            <p>${game.word.meaning}</p>
    `);
    game.word.characters.map(character => {
        if (character.display) {
            $("#app-form-inputs-wrapper").append(`
                <input id="character-${character.position}" class="character-field" type="text" value="${character.value}" disabled></input>
            `);
        } else {
            $("#app-form-inputs-wrapper").append(`
                <input id="character-${character.position}" class="character-field" type="text" value="" autocomplete="off" maxlength="1"></input>
            `);
        }
    });
}

/**
 * Displays current score.
 */
function displayScore() {
    $(".score-lost").text(`${game.lost}`);
    $(".score-won").text(`${game.won}`);
}

/**
 * Checks if the answer is right or wrong.
 */
async function checkAnswer(event) {
    event.preventDefault();
    let correctCharacters = checkIfCorrectCharacters();
    if (correctCharacters) {
        game.won++;
    } else {
        game.lost++;
    }
    displayResult(correctCharacters);
}

/**
 * Checks input by input, all characters.
 */
function checkIfCorrectCharacters() {
    for (let i = 0; i < game.word.characters.length; i++) {
        const currentInputValue = $(`#character-${i}`).val();
        if (currentInputValue != game.word.characters[i].value) {
            return false;
        }
    }
    return true;
}
/**
 * Displays result modal.
 */
function displayResult(isItWin) {
    $("#modal").show();
    
    $("#result-wrapper").empty().append(`
        <h1 class="heading result-game-word">${game.word.word}</h1>
        <p class="result-game-phonetic">${game.word.phonetic ? game.word.phonetic : ""}</p>
        <p class="result-game-hint">${game.word.meaning}</p>
        <p class="result">You have <span class="result-highlight">${isItWin ? "won" : "lost"}</span> the round!</p>
    `);
    displayScore();
}

/**
 * Starts game round.
 */
async function startRound() {
    $("#modal").hide();
    $("#app-definition-wrapper").empty();
    $("#app-form-inputs-wrapper").empty();
    let chosenWordForGame = null;
    while (chosenWordForGame === null) {
        const randomWords = await getRandomWords(10);
        chosenWordForGame = await checkWord(randomWords);
    }
    setWord(chosenWordForGame);
    displayTurn();
    displayScore();
}

startRound();
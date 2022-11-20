
async function getRandomWords(numberOfWords) {
    const url = `https://random-word-api.herokuapp.com/word?number=${numberOfWords}`;

    const result = 
        await fetch(url, {method: "GET"})
        .then(response => response.json());

    return result;
}

async function searchDictionary(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    const result = 
        await fetch(url, {method: "GET"})
        .then(response => response.json());

    return result;
}

async function getExistingWord(allWords) {
    
    for (let word of allWords) {
        const foundWordInDictionary = await searchDictionary(word);
        if (foundWordInDictionary && foundWordInDictionary.title != "No Definitions Found") {
            return foundWordInDictionary;
        }
    }
    return null;
}

function splitWordIntoCharacters(word) {
    const characters = [];
    for (let i = 0; i < word.length; i++) {
        characters.push(word[i]);
    };
    console.log(characters);
}

async function start() {
    let chosenWordForGame = null;

    while (chosenWordForGame === null) {
        const randomWords = await getRandomWords(10);
        chosenWordForGame = await getExistingWord(randomWords);
        console.log(randomWords);
    }
    console.log(chosenWordForGame);
    splitWordIntoCharacters(chosenWordForGame[0].word);
}

// debugger;

start();


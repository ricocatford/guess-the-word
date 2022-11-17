
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

async function getRightWord(allWords) {
    for (let word of allWords) {
        const foundWordDictionary = await searchDictionary(word);

        for (let i = 0; i < foundWordDictionary.length; i++) {
            const currentWordDictionary = foundWordDictionary[i];
            const currentWordMeanings = currentWordDictionary.meanings;

            for (let j = 0; j < currentWordMeanings.length; j++) {
                const currentMeaning = currentWordMeanings[j];

                if (currentMeaning.antonyms.length > 0 || currentMeaning.synonyms.length > 0) {
                    console.log("We got one!");
                    console.log(currentMeaning.definitions);
                    return {
                        word: word,
                        antonyms: currentMeaning.antonyms,
                        synonyms: currentMeaning.synonyms
                    };
                }
            }
        }
        
    }
    return null;
}

async function start() {
    let chosenWordForGame = null;

    while (chosenWordForGame === null) {
        const randomWords = await getRandomWords(10);
        chosenWordForGame = await getRightWord(randomWords);
    }
    console.log(chosenWordForGame);
    startGame(chosenWordForGame);
}

function startGame(wordForGame) {
    $("h1").text(wordForGame.word);
    $("#antonyms").text("Antonyms: " + wordForGame.antonyms);
    $("#synonyms").text("Synonyms: " + wordForGame.synonyms);
}

start();
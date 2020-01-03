function generateAlreadyCorrectlyGuessedMapRegionsCSSRules(correctGuesses){
    console.log(correctGuesses, 'correct guesses assembled during the main game, used here for generated styles with each state update.')
    return correctGuesses.length ? `p{color:red}`: ``
}

export default generateAlreadyCorrectlyGuessedMapRegionsCSSRules;
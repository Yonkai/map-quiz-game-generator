import join from 'lodash/join'

function generateLastIncorrectlyGuessedMapRegionsCSSRules(lastIncorrectGuess){
    console.log('generateLastIncorrectlyGuessedMapRegionsCSSRules ', 'has been called.')
    // console.log(correctGuesses, 'correct guesses assembled during the main game, used here for generated styles with each state update.')
    // // Make css rules up based on correct guesses if any correct guesses have been made thus far
    // const generatedCSS = correctGuesses.length ? correctGuesses.map((correctGuess,index) => {
    //     return `#${correctGuess}{fill:darkgreen}`
    // }) : ``
    // // Use lodash to convert the mapped array into a string
    // const assembledGeneratedCSS = join(generatedCSS, ' ');
    // // Return the string to be used in the styled-jsx interpolated CSS if any correct guesses have been made
    // // otherwise return nothing
    // return correctGuesses.length ? assembledGeneratedCSS : ``
    return ``
}

export default generateLastIncorrectlyGuessedMapRegionsCSSRules;
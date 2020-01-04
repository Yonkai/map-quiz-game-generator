const generateLastIncorrectlyGuessedMapRegionsCSSRules = (lastIncorrectGuess) => {
  if(lastIncorrectGuess !== 'initialValue'){  
  console.log('generateLastIncorrectlyGuessedMapRegionsCSSRules', ' has been called.')
    console.log(lastIncorrectGuess, 'the last incorrect guess from main game, used here for generated styles with each state update.')
    // Make css rules up based on last incorrect guesse if any incorrect guesses have been made thus far
    // Use CSS3 animation
    const generatedCSS = lastIncorrectGuess ? 
    `#${lastIncorrectGuess}{
            animation: flashIncorrectColors .25s step-start 3;
          }
          
          @keyframes flashIncorrectColors {
            50% {
              fill:black;
            }
            100% {
              fill:grey;  
            }
          }
    }`: ``
    console.log(generatedCSS)
    // Return the string to be used in the styled-jsx interpolated CSS animation if any incorrect guess have been made
    // otherwise return an empty string
    return generatedCSS
  } else {
    return ``;
  }
}

export default generateLastIncorrectlyGuessedMapRegionsCSSRules;
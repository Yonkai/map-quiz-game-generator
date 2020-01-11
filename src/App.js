// React
import React, { Component } from 'react';

// React-svg maps, svg-maps, custom maps
import Morytania from "./custom-maps/Morytania/index";
import free2play from './custom-maps/Free-To-Play-OP/index';
import TestMap from "./custom-maps/plain-map-test/index";
import { CheckboxSVGMap } from "react-svg-map";

//Lodash util functions
import shuffle from 'lodash/shuffle'
import difference from 'lodash/difference'
import union from 'lodash/union'
import without from 'lodash/without'

//Npm packages
import Timer from 'react-compound-timer'
import ReactTooltip from 'react-tooltip'
import uuidv4 from 'uuid/v4';

//Util. functions
import generateAlreadyCorrectlyGuessedMapRegionsCSSRules from './util/generateAlreadyCorrectlyGuessedMapRegionsCSSRules'
import generateLastIncorrectlyGuessedMapRegionsCSSRules from './util/generateLastIncorrectlyGuessedMapRegionsCSSRules'

class App extends Component {
  constructor(props) {
    super(props);
    this.gameScoreIncrement = 555;

    this.state = { 
      regionsClicked:[],
      lastRegionClicked:[],
      shuffledGuessList:false,
      alreadyCorrectlyGuessedMapRegions:'initialValue',
      lastIncorrectGuess:'initialValue',
      currentGameScore:0,
      gameStarted:false,
      gameFinished: false,
      guidePlayerMessage:'Click Start to play',
      guessThis:'',
      SVGMapKey: 123456789,
      SVGMap: Morytania
    }

      // This binding is necessary to make `this` work in the callback
      this.handleMapRegionClick = this.handleMapRegionClick.bind(this);
      this.initiateMapGame= this.initiateMapGame.bind(this);
      this.resetMapGame= this.resetMapGame.bind(this);
      this.switchMapGame = this.switchMapGame.bind(this);
      this.svgMap = React.createRef();
    }
  
    handleMapRegionClick(locations) {
      console.log('handling specific region click.')

      // Check to see if game as been started
      if(this.state.gameStarted && (!this.state.gameFinished)){
        console.log(locations,'event')
        
        // Init regions clicked set
        // Grab the names of the map from the event
        //TODO:reset checkboxes after each reset button click, this assumes each game begins with all map svg's unchecked/false.
        const regionsClickedSet = locations.map((path, index) => {
          return path.attributes[6].value;
        })
        //Get last clicked region by finding the last removed or added item from regionsClickedSet
        let lastRegionClicked = 'none'
        console.log(regionsClickedSet.length, 'The new regionsClickedSet not in state and its length');
        console.log(this.state.regionsClicked.length, 'The regionsClicked in state and its length');
        console.log(' The regions clicked arrays for both newly generate are used for finding the last clicked region.')

        // An item was added
        if(regionsClickedSet.length > this.state.regionsClicked.length){
        // If item gets added difference the new array against old array to get last clicked region
        lastRegionClicked = difference(regionsClickedSet,this.state.regionsClicked)
        console.log('An item has been added')

        // And if an item was removed:
        } else if(regionsClickedSet.length < this.state.regionsClicked.length){
        // If item gets removed difference the old array against the new array to get last clicked region
        lastRegionClicked = difference(this.state.regionsClicked,regionsClickedSet)
        console.log('An item has been removed')
        }
        else {
          console.error('Something went wrong trying to see if an item was removed or added.')
        }
        
        this.setState(prevState => ({
        regionsClicked: regionsClickedSet,
        lastRegionClicked: lastRegionClicked,
      }), () => {
        // Processing what to do after a region has been clicked.
        // Callback after setting state from region clicking, this is to prevent race conditions.
        console.log('Region clicked callback calledbacked.')
        // If the player guesses incorrectly by the last interacted with region NOT BEING the 
        // 'guessThis' set inside initiateMapGame, recalculate the score
        if(this.state.lastRegionClicked[0] !== this.state.guessThis){
          console.log('that guess was incorrect')
         // 1. Update state value that contains last incorrect guess to dynamically render the CSS animation for wrong guesses
          const nextIncorrectGuess = this.state.lastRegionClicked[0]

        // 2. Recalculate game score.
          const nextGameScore = this.state.currentGameScore - this.gameScoreIncrement;  

        // 3. Update state from step 1 and 2.
        this.setState(prevState => ({
          lastIncorrectGuess:nextIncorrectGuess,
          currentGameScore:nextGameScore
        }))
        }
        // If the player guesses correctly by the last interacted with region BEING the 
        // 'guessThis' set inside initiateMapGame:
        else if(this.state.lastRegionClicked[0] === this.state.guessThis){
          console.log('that guess was correct!')
          // 1. remove the correctly guessed item from shuffledGuessList state array
          const updatedShuffleGuessList = without(this.state.shuffledGuessList,this.state.lastRegionClicked[0])
          console.log(this.state.shuffledGuessList, 'prev. shuffledGuessList before being without\'d with lodash and correct guess.')
          console.log(updatedShuffleGuessList, 'new, updated shuffleGuessList after have correct guess removed.')
          updatedShuffleGuessList.length === 0 ? console.log('Game finished. Nothing left to guess.') : console.log('You\'re still playing.')
          // 2. select a new guessThis state value via the newly changed shuffleGuessList
          // FIFO selection style
          const nextGuessThis = updatedShuffleGuessList[0] ? updatedShuffleGuessList[0] : 'nothing, game done.'
          // 3. update the guidePlayerMessage based on the newly selected guessThis state value vis the newly changed shuffleGuessList
          const nextGuidePlayerMessage = `Click on ${nextGuessThis}`
          // 4. update array that contains all the already correctly guessed map regions in order to dynamically render the dark green coloring in the CSS
          const nextAlreadyCorrectlyGuessedMapRegions = union(this.state.alreadyCorrectlyGuessedMapRegions, this.state.lastRegionClicked)

          console.log(nextAlreadyCorrectlyGuessedMapRegions, 'An array of already correctly guessed regions')
          console.log(nextGuessThis, '(the next "Guess This" based on FIFO\'ing updated shuffle guess list)')
          console.log(nextGuidePlayerMessage, '(based on new guessThis state value, tells player what to guess next.)')
         
          // 5. Recalculate the score
          const nextGameScore = this.state.currentGameScore + this.gameScoreIncrement;

          // 6. Update state from steps 1 -> 5:
          this.setState(prevState => ({
            shuffledGuessList:updatedShuffleGuessList,
            guessThis: nextGuessThis,
            guidePlayerMessage: nextGuidePlayerMessage,
            alreadyCorrectlyGuessedMapRegions:nextAlreadyCorrectlyGuessedMapRegions,
            currentGameScore:nextGameScore
          }))
        } else{
          // There should only be correct or incorrect guesses.
          console.error('Error something went wrong trying to figure out if the guess was correct or not')
        }
      });
      
    } else {
      console.log('game not initialized')
    }
    } 

    initiateMapGame(){
        console.log('Init map game.');
        // Note: When this function is called the Timer component start function is called alongside it.

        if(!(this.state.shuffledGuessList)){
          // Declare constant for all area names 
          const allAreaNames = this.svgMap.current.props.map.locations.map((obj,index)=>{return obj.name})
          console.log(this.svgMap.current)
          
          //reset all aria-checked to false
          const shuffledAreaNames = shuffle(allAreaNames)
          
          // FIFO selection style
          const initGuessThis = shuffledAreaNames[0]

          // Generate new svgmap key
          const newSvgMapKey = uuidv4()

          // Set shuffled guess list, initial guess, guide message, and game start flag to state.
          // Remount the svgmap component by changing the key so the aria-checkeds reset
          // alreadyCorrectlyGuessedMapRegions and lastIncorrectGuess set here for reference
          this.setState(prevState => ({
            shuffledGuessList: shuffledAreaNames,
            guessThis:initGuessThis,
            guidePlayerMessage:`Click on ${initGuessThis}`,
            gameStarted:true,
            alreadyCorrectlyGuessedMapRegions:'initialValue',
            lastIncorrectGuess:'initialValue',
            SVGMapKey:newSvgMapKey
          }));
      }
    }

    resetMapGame(){
      // Generate new SVG Map key to remount svg map component so that the aria-checkeds reset.
      const newSvgMapKey = uuidv4();

      this.setState(prevState => ({
          regionsClicked:[],
          lastRegionClicked:[],
          shuffledGuessList:false,
          alreadyCorrectlyGuessedMapRegions:'initialValue',
          lastIncorrectGuess:'initialValue',
          currentGameScore:0,
          gameStarted:false,
          gameFinished: false,
          guidePlayerMessage:'Click Start to begin.',
          guessThis:'',
          SVGMapKey:newSvgMapKey
        }));
    }

    switchMapGame(nextMap){
      // Generate new SVG Map key to remount svg map component so that the aria-checkeds reset.
      const newSvgMapKey = uuidv4();
      let nextSVGMap;

      // Fake enum based on argument from buttons, should formalized this if I add lots of maps.
      // TODO: Can definiteeely compoisition this out into a seperate component for clean execution.
      switch(nextMap) {
        case 'morytania':
          nextSVGMap = Morytania
          break;
        case 'TestMap':
          nextSVGMap = TestMap
          break;
        case 'free2play':
          nextSVGMap = free2play;
          break;
        default:
          nextSVGMap = Morytania;
          console.error('Something went wrong assigning svg map value')
      }

      // Note that only this one changes the state value for the SVGMap because the default is an actual map option
      // instead of "nothing."
      this.setState(prevState => ({
          regionsClicked:[],
          lastRegionClicked:[],
          shuffledGuessList:false,
          alreadyCorrectlyGuessedMapRegions:'initialValue',
          lastIncorrectGuess:'initialValue',
          currentGameScore:0,
          gameStarted:false,
          gameFinished: false,
          guidePlayerMessage:'Click Start to begin.',
          guessThis:'',
          SVGMapKey:newSvgMapKey,
          SVGMap: nextSVGMap
        }));
    }

  render() {
    return (
    <div className='main-container'>
      <div className='main-game-control-features-container'>

          <div className='control-item-1 guide-player'>
              <p>{this.state.guidePlayerMessage}</p>
          </div>

          <Timer
              initialTime={0}
              startImmediately={false}
              >
            {({ start, resume, pause, stop, reset, timerState }) => (
            <>
              <div className='control-item-2 start-button'>
                <button onClick={()=>{this.initiateMapGame();start();}}>Start</button> 
              </div>

              <div className='control-item-3 reset-button'>   
                  <button onClick={()=>{this.resetMapGame();reset();stop();}}>Reset</button>
              </div>

              <div className='control-item-4 score-container'>
                <p>{`Score: ${this.state.currentGameScore}`}</p>
              </div>
              {/* Timer: */}
              <div className='control-item-5 timer'>
                      <p className='the-timer'>
                          <Timer.Minutes />:
                          <Timer.Seconds /> 
                      </p>
              </div>
            </>
            )}
            </Timer>
        </div>
        {this.state.guessThis !== '' ? <ReactTooltip id='svgMapItem' place="right" type="success">
          <span>{`${this.state.guessThis}`}</span>
        </ReactTooltip> : null }

        <div className='svg-map-grid-item' data-tip data-for='svgMapItem' >
        {/* {this.state.map()} */}
        <CheckboxSVGMap key={this.state.SVGMapKey} ref={this.svgMap} map={this.state.SVGMap} onChange={(locations) => this.handleMapRegionClick(locations)}/>
          {/* TODO steps for setting up with test-map:
              1. Each area intitially starts out same color representing not gussed yet. (green) 1
              1.5 Start button initiates the game, initating various state values like the timer, score, guess order array, and more? 1
              6. A name appears over the area if it is incorrectly guessed, showings its name. 1
              7. The name that needs to be guessed follows the cursor. 1
              8. After every area has been given a correct guess a popover(modal?) appears and shows the score
                 and ranking, the game is set back to the initial state after the user clicks away via. reset function
              9. Reset button can reset everything to initial state 1

              ---------
              Needed map color condition states, add text messages alongside to guide player:
              - The map and start button has not be interacted with at all: all regions solid white. 1
              - A region is hovered before start button has been hit: turns red while hovered. 1
              - A region is hovered after start button has been hit: turns light green. 1

              - A region is checked after start button has been hit and the guess is correct: that region turns dark green 1
               until the end-game where it is reset back to initial properties. 0
              - A region is checked after start button has been hit and the guess is incorrect: that region flashes its name quickly
              above the region of the click for 1 second before going back to solid white until the end game where it is reset
          */}
          <div className="bottom-nav">
            <button className="bottom-nav-item" onClick={() => this.switchMapGame('morytania')}>Play Morytania</button>
            <button className="bottom-nav-item" onClick={() => this.switchMapGame('free2play')}>Play F2P OG</button>
            <button className="bottom-nav-item" onClick={() => this.switchMapGame('TestMap')}>Play TestMap74</button>
            <a href='https://github.com' className="bottom-nav-item source-code-anchor">Source code</a>
          </div>
          <ul>
          {/* set key props here: */}
          {this.state.regionsClicked.map((name,index)=>{
            return <li>,'{name}',</li>
          })}
          </ul>

        <style jsx>{`
            .svg-map {
              width: 100%;
              height: auto;
              stroke: black;
              stroke-linecap: round;
              stroke-linejoin: round; 
              background: #EECDA3;  /* fallback for old browsers */
              background: -webkit-linear-gradient(to right, #EF629F, #EECDA3);  /* Chrome 10-25, Safari 5.1-6 */
              background: linear-gradient(to bottom, #EF629F, #EECDA3); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
              max-height:85vh;

            }

            .svg-map__location {
              fill: white;
              cursor: pointer;
            }

            .svg-map__location:focus{
              fill:white;
              outline:0;
            }
                
            body{
              background: #16BFFD;  /* fallback for old browsers */
              background: -webkit-linear-gradient(to right, #CB3066, #16BFFD);  /* Chrome 10-25, Safari 5.1-6 */
              background: linear-gradient(to right, #CB3066, #16BFFD); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            }

            .main-container{
              width:100%;
              display:grid;
              justify-items:center;
            }

            .svg-map-grid-item{
              width:95%;
              max-width:1100px;
            }

            li{
              display:inline-block;
              margin-left:10px;
              color:black;
            }

            h1{
              background:white;
              margin-top:0px;
              margin-bottom:0px;
              margin-left:25px;
            }

            .header-container-item{
              justify-self:start;
            }

            p{
              color:yellow;
              font-size:20px;
              margin:0;
            }
            
            button{
              font-size:22px;
              width:100%;
              margin:0;
              padding:0;
            }

            .main-game-control-features-container {
              padding: 0;
              margin: 0;
              list-style: none;
              
              display: -webkit-box;
              display: -moz-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              display: grid;
              grid-template-columns:1fr 1fr;
              width:95%;
              grid-auto-columns:1fr;
              max-width:1100px;
            }
            
            .control-item-1,.control-item-2,.control-item-3,.control-item-4,.control-item-5 {
              width:100%;
              background:black;
            }

            .control-item-1,control-item-4{
              grid-column: 1 / span 2;
              font-size:22px;
              justify-self:start;
            }

            .the-timer{
              font-size:22px;
              color:white;
            }

            .bottom-nav{
              padding: 0;
              margin: 0;
              list-style: none;
              display:grid;
              grid-template-columns:1fr 1fr 1fr;
              grid-gap:10px;
            }

            .bottom-nav-item{
              font-size:18px;
              font-variant:small-caps;
            }

            .source-code-anchor{
              background:white;
              font-variant:small-caps;
              text-align:center;
            }
    `}</style>
      <style jsx>{`
          ${`.svg-map__location:hover {
            fill: ${this.state.gameStarted ? `#72d54c`:`#af1414`};
            outline: 0; 
          }`}
          
          /* correct guesses should have precedence over incorrect guess via CSS rule ordering.. */  
          ${generateAlreadyCorrectlyGuessedMapRegionsCSSRules(this.state.alreadyCorrectlyGuessedMapRegions)}
          ${generateLastIncorrectlyGuessedMapRegionsCSSRules(this.state.lastIncorrectGuess)}
        `}
     </style>
      </div>
      </div>
      );
    }
}
 
export default App;
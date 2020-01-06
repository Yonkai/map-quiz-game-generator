import React, { Component } from 'react';
import PlainMapTest from "./custom-map-test/plain-map-test/index";
import { CheckboxSVGMap } from "react-svg-map";
import shuffle from 'lodash/shuffle'
import difference from 'lodash/difference'
import union from 'lodash/union'
import without from 'lodash/without'
import Timer from 'react-compound-timer'
import ReactTooltip from 'react-tooltip'
import generateAlreadyCorrectlyGuessedMapRegionsCSSRules from './util/generateAlreadyCorrectlyGuessedMapRegionsCSSRules'
import generateLastIncorrectlyGuessedMapRegionsCSSRules from './util/generateLastIncorrectlyGuessedMapRegionsCSSRules'
import uuidv1 from 'uuid/v1';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      regionsClicked:[],
      lastRegionClicked:[],
      shuffledGuessList:false,
      alreadyCorrectlyGuessedMapRegions:'initialValue',
      lastIncorrectGuess:'initialValue',
      currentGameScore:100,
      gameStarted:false,
      gameFinished: false,
      guidePlayerMessage:'Click Start to begin.',
      guessThis:'',
      SVGMapKey: 342234
    }
      // This binding is necessary to make `this` work in the callback
      this.handleMapRegionClick = this.handleMapRegionClick.bind(this);
      this.initiateMapGame= this.initiateMapGame.bind(this);
      this.resetMapGame= this.resetMapGame.bind(this);
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
          console.error('error')
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
         // 1 Update state value that contains last incorrect guess to dynamically render the CSS animation for wrong guesses
          const nextIncorrectGuess = this.state.lastRegionClicked[0]

        // 2. Update state from step 1
        this.setState(prevState => ({
          lastIncorrectGuess:nextIncorrectGuess
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
          // 2. select a new guessThis state value via the newly changed shuffleGuessList
          // FIFO selection style
          const nextGuessThis = updatedShuffleGuessList[0]
          // 3. update the guidePlayerMessage based on the newly selected guessThis state value vis the newly changed shuffleGuessList
          const nextGuidePlayerMessage = `Click on ${nextGuessThis}`
          // 4. update array that contains all the already correctly guessed map regions in order to dynamically render the dark green coloring in the CSS
          const nextAlreadyCorrectlyGuessedMapRegions = union(this.state.alreadyCorrectlyGuessedMapRegions, this.state.lastRegionClicked)

          console.log(nextAlreadyCorrectlyGuessedMapRegions, 'An array of already correctly guessed regions')
          console.log(nextGuessThis, '(the next "Guess This" based on FIFO\'ing updated shuffle guess list)')
          console.log(nextGuidePlayerMessage, '(based on new guessThis state value, tells player what to guess next.)')
          // 5. TODO: update/recalculate the score

          // 6. Update state from steps 1 -> 5:
          this.setState(prevState => ({
            shuffledGuessList:updatedShuffleGuessList,
            guessThis: nextGuessThis,
            guidePlayerMessage: nextGuidePlayerMessage,
            alreadyCorrectlyGuessedMapRegions:nextAlreadyCorrectlyGuessedMapRegions
          }))
        } else{
          // There should only be correct or incorrect guesses I think.
          console.error('Error something went wrong trying to figure out if the guess was correct or not')
        }
        // If the player has guessed incorrectly more than 5 times in a row, cause the area that is the correct
        // region to begin flashing
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
          const newSvgMapKey = uuidv1()

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
      // Generate new SVG Map key to remount component so that the aria-checkeds reset.
      const newSvgMapKey = uuidv1();

      this.setState(prevState => ({
          regionsClicked:[],
          lastRegionClicked:[],
          shuffledGuessList:false,
          alreadyCorrectlyGuessedMapRegions:'initialValue',
          lastIncorrectGuess:'initialValue',
          currentGameScore:100,
          gameStarted:false,
          gameFinished: false,
          guidePlayerMessage:'Click Start to begin.',
          guessThis:'',
          SVGMapKey:newSvgMapKey
        }));
    }

    isLocationSelected(location,index){
      console.log('test')
      return true;
    }

    //TODO: End-game and start-game are broken... examine that logic. Add gate to prevent beginning logic? race conditions??
  render() {
    return (
    <div className='main-container'>
        <div className='svg-map-grid-item' data-tip data-for='svgMapItem' >
        {this.state.guessThis !== '' ? <ReactTooltip id='svgMapItem' place="right" type="success">
          <span>{`${this.state.guessThis}`}</span>
        </ReactTooltip> : null }
        {/* {this.state.map()} */}
        <CheckboxSVGMap key={this.state.SVGMapKey} ref={this.svgMap} map={PlainMapTest} onChange={(locations) => this.handleMapRegionClick(locations)}/>
          <p>{`Current Score: ${this.state.currentGameScore}%`}</p>
        <Timer
        initialTime={0}
        startImmediately={false}
    >
    {({ start, resume, pause, stop, reset, timerState, initiateMapGame }) => (
            <React.Fragment>
                <div>
                    <Timer.Minutes /> min : 
                    <Timer.Seconds /> sec
                </div>
                <div>{timerState}</div>
                <br />
                <div>
                  {/* Note to self: I thought the correct context was this.props not this.. oops. */}
                    <button onClick={()=>{this.initiateMapGame();start();}}>Start</button>
                    <button onClick={()=>{this.resetMapGame();reset();}}>Reset</button>
                </div>
            </React.Fragment>
        )}
    </Timer>
          <p>{this.state.guidePlayerMessage}</p>
          {/* TODO steps for setting up with test-map:
              1. Each area intitially starts out same color representing not gussed yet. (green) 1
              1.5 Start button initiates the game, initating various state values like the timer, score, guess order array, and more? 1
              6. A name appears over the area if it is incorrectly guessed, showings its name. 0
              7. The name that needs to be guessed follows the cursor. 0
              8. After every area has been given a correct guess a popover(modal?) appears and shows the score
                 and ranking, the game is set back to the initial state after the user clicks away via. reset function
              9. Reset button can reset everything to initial state 0

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
              border:1px solid black;
              stroke-width: 5;
              stroke-linecap: round;
              stroke-linejoin: round; }
              .svg-map__location {
                fill: white;
                cursor: pointer; 
              }
                .svg-map__location:focus{
                  fill:white;
                  outline:0;
                }
                
            body{
              background:white;
            }

            .main-container{
              width:100%;
              display:grid;
              justify-items:center;
            }

            .svg-map-grid-item{
              width:90%;
              max-width:1000px;
            }

            li{
              display:inline-block;
              margin-left:10px;
              color:black;
            }

            h1{
              font-size:26px;
              width: 100%; 
              justify-self:start;
              background:white;
              margin-top:3px;
              margin-bottom:0;
              text-align:center;
            }

            p{
              color:black;
              margin:0;
            }

    `}</style>
      <style jsx>{`
          ${`.svg-map__location:hover {
            fill: ${this.state.gameStarted ? `lightgreen`:`red`};
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
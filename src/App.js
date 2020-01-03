import React, { Component } from 'react';
import PlainMapTest from "./custom-map-test/plain-map-test/index";
import { CheckboxSVGMap } from "react-svg-map";
import shuffle from 'lodash/shuffle'
import difference from 'lodash/difference'
import Timer from 'react-compound-timer'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      regionsClicked:[],
      lastRegionClicked:[],
      shuffledGuessList:false,
      currentGameScore:100,
      gameStarted:false,
      gameFinished: false,
      guidePlayerMessage:'Click Start to begin.',
    }
      // This binding is necessary to make `this` work in the callback
      this.handleMapRegionClick = this.handleMapRegionClick.bind(this);
      this.initiateMapGame= this.initiateMapGame.bind(this);
    }
  
    handleMapRegionClick(e) {
      console.log('handling specific region click.')
      // Check to see if game as been started
      if(this.state.gameStarted && (!this.state.gameFinished)){
        console.log(e,'event')
        
        
        // Init regions clicked set
        // Grab the names of the map from the event
        const regionsClickedSet = e.map((path, index)=> {
          return path.attributes[6].value;
        })
        //Get last clicked region by finding the last removed or added item from regionsClickedSet
        let lastRegionClicked = 'none'
        console.log(regionsClickedSet.length, 'notstate');
        console.log(this.state.regionsClicked.length, 'state');

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
        // Callback after setting state from region clicking, this is to prevent race conditions.
        console.log('Region clicked callback calledbacked.')
        // If the player guesses incorrectly by the last interacted with region NOT BEING the 
        // 'guessThis' set inside initiateMapGame and recalculate the score

        
        // If the player guesses correctly by the last interacted with region BEING the 
        // 'guessThis' set inside initiateMapGame and recalculate the score

        // If the player has guessed incorrectly more than 5 times in a row, cause the area that is the correct
        // region to begin flashing
      });


      
    } else{
      console.log('game not initialized')
    }
    } 

    initiateMapGame(){
        console.log('Init map game.');
        // Note: When this function is called the Timer component start function is called alongside it.

        if(!(this.state.shuffledGuessList)){
          // Declare constant for all area names 
          //TODO: grab these dynamically
          const allAreaNames = ['path55','path65','path61','path85','path70','path74','path81','path72','path57','path83']
          const shuffledAreaNames = shuffle(allAreaNames)
          // FIFO selection style
          const initGuessThis = shuffledAreaNames[0]
          // Set shuffled guess list, initial guess, guide message, and game start flag to state.
          this.setState(prevState => ({
            shuffledGuessList: shuffledAreaNames,
            guessThis:initGuessThis,
            guidePlayerMessage:`Click on ${initGuessThis}`,
            gameStarted:true
          }));
      }
    }

  render() {
    return (
    <div className='main-container'>
        <div className='svg-map-grid-item'>
      <h1 className='game-header' data-testid="game-header">Geography Quiz Game</h1>
        {/* {this.state.map()} */}
        <CheckboxSVGMap map={PlainMapTest} onChange={(e) => this.handleMapRegionClick(e)}/>
          <p>{`Current Score: ${this.state.currentGameScore}%`}</p>
        <Timer
        initialTime={0}
        startImmediately={false}
        initiateMapGame={this.initiateMapGame}
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
                    <button onClick={reset}>Reset</button>
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
                 and ranking, the game is set back to the initial state after the user clicks away via. 
              9. Reset button can reset everything to initial state

              ---------
              Needed map color condition states, add text messages alongside to guide player:
              - The map and start button has not be interacted with at all: all regions solid white. 1
              - A region is hovered before start button has been hit: turns red while hovered. 1
              - A region is hovered after start button has been hit: turns light green.

              - A region is checked after start button has been hit and the guess is correct: that region turns dark green
               until the end game where it is reset.
              - A region is checked after start button has been hit and the guess is incorrect: that region flashes its name quickly
              above the region of the click for 1 second before going back to solid white until the end game where it is reset
          */}
          <ul>
          {this.state.regionsClicked.map((name,index)=>{
            return <li>,'{name}',</li>
          })}
          </ul>

        </div>
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
                .svg-map__location:focus, .svg-map__location:hover {
                  fill: red;
                  outline: 0; 
                }
                .svg-map__location[aria-checked=true] 
                {
                  fill: #f4bc44; 
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
      </div>
      );
  }
}
 
export default App;
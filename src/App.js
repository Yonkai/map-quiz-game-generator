import React, { Component } from 'react';
import PlainMapTest from "./custom-map-test/plain-map-test/index";
import { CheckboxSVGMap } from "react-svg-map";
import shuffle from 'lodash/shuffle'
import Timer from 'react-compound-timer'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      regionsClicked:[],
      shuffledGuessList:[],
      currentGameScore:0,
      gameStarted:false
    }
      // This binding is necessary to make `this` work in the callback
      this.handleMapRegionClick = this.handleMapRegionClick.bind(this);
      this.initiateMapGame= this.initiateMapGame.bind(this);
    }
  
    handleMapRegionClick(e) {
      console.log('handling specific region click.')
      if(this.state.gameStarted){
      const regionsClickedSet = e.map((path,index)=> {
        return path.attributes[6].value;
      })
      this.setState(prevState => ({
        regionsClicked: regionsClickedSet
      }));
    } else{
      console.error('need to hit the start button to begin game.')
    }
    } 

    initiateMapGame(){
      //Note: When this function is called the Timer component start function is called alongside it.
        console.log('iniating map game...');
        //TODO: grab these dynamically
        //declare constant for all area names 
        const allAreaNames = ['path55','path65','path61','path85','path70','path74','path81','path72','path57','path83']
        //init. shuffle area names array for guess order and set to state, use lodash to shuffle.
        const shuffledAreaNames = shuffle(allAreaNames) 
        //set shuffled guess list to state
        this.setState(prevState => ({
          shuffledGuessList: shuffledAreaNames
        }));
        //init. game scores and set to state
        const initialGameScore = 100;
        this.setState(prevState => ({
          currentGameScore: initialGameScore
        }));
        //set bool flag in state for handleMapRegionClick function conditional
        const gameStartedFlag=true;
        this.setState(prevState => ({
          gameStarted: gameStartedFlag
        }));

    }

  render() {
    const allAreaNames = ['path55','path65','path61','path85','path70','path74','path81','path72','path57','path83']
    return (
    <div className='main-container'>
        <div className='svg-map-grid-item'>
      <h1 className='game-header' data-testid="game-header">Geography Quiz Game</h1>
        {/* {this.state.map()} */}
        <CheckboxSVGMap map={PlainMapTest} onChange={(e) => this.handleMapRegionClick(e)}/>
          <p>{`% correct <total guesses/current guess position in names being looped through)>`}</p>
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
                    <button onClick={()=>{this.initiateMapGame();start();}}>Start Game</button>
                    <button onClick={reset}>Reset Game</button>
                </div>
            </React.Fragment>
        )}
    </Timer>
          <p>{`Click on <randomly selected area>`}</p>
          {/* TODO steps for setting up with test-map:
              1. Each area intitially starts out same color representing not gussed yet. (green) 1
              1.5 Start button initiates the game, initating various state values like the timer, score, guess order array, and more? 1
              2. After a 1st CORRECT guess the area turns white. 0
              3. After a 2nd-4th CORRECT guess the area turns blue. 0vb
              4. After a 5th+ CORRECT guess the area turns red. 0
              5. When 5 incorrect guesses are made in a row area flashes showing the correct area. 0
              6. A name appears over the area if it is incorrectly guessed, showings its name. 0
              7. The name that needs to be guessed follows the cursor. 0
              8. After every area has been given a guess a popover(modal?) appears and shows the score
                 and ranking. 0
              9. Reset button can reset everything to initial state
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
              stroke: #666;
              border:1px solid black;
              stroke-width: 5;
              stroke-linecap: round;
              stroke-linejoin: round; }
              .svg-map__location {
                fill: #a1d99b;
                cursor: pointer; }
                .svg-map__location:focus, .svg-map__location:hover {
                  fill: #b8e2b3;
                  outline: 0; }
                .svg-map__location[aria-checked=true] 
                {
                  fill: #f4bc44; 
                }

            body{
              background:#6277a6;
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
              color:white;
            }

            h1{
              font-size:26px;
              width: 100%; 
              justify-self:start;
              background:yellow;
              margin-top:3px;
              margin-bottom:0;
              text-align:center;
            }

            p{
              color:white;
              margin:0;
            }
    `}</style>
      </div>
      );
  }
}
 
export default App;
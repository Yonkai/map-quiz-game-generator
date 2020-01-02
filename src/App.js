import React, { Component } from 'react';
import PlainMapTest from "./custom-map-test/plain-map-test/index";
import { CheckboxSVGMap } from "react-svg-map";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { regionsClicked:[] }
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick(e) {
      const regionsClickedSet = e.map((path,index)=> {
        return path.attributes[6].value;
      })
      this.setState(regionsClicked => ({
        regionsClicked: regionsClickedSet
      }));
    }  

  render() { 
    return (
    <div className='main-container'>
        <div className='svg-map-grid-item'>
      <h1 className>Geography Quiz Game</h1>
        {/* {this.state.map()} */}
        <CheckboxSVGMap map={PlainMapTest} onChange={(e) => this.handleClick(e)}/>
          <p>{`% correct <total guesses/current guess position in names being looped through)>`}</p>
          <p>{`timer after hiting start`}</p>
          <p>{`Click on <randomly selected area>`}</p>
        <button>{`Start button`}</button>
          {/* How its played:
              1. Each area intitially starts out same color representing not gussed yet. (green)
              2. After a 1st CORRECT guess the area turns white.
              3. After a 2nd-4th CORRECT guess the area turns blue.
              4. After a 5th+ CORRECT guess the area turns red.
              5. When 5 incorrect guesses are made in a row area flashes showing the correct area
              6. A name appears over the area if it is incorrectly guessed, showings its name.
              7. The name that needs to be guessed follows the cursor.
              8. After every area has been given a guess a popover(modal?) appears and shows the score
                 and ranking.
          */}
          <ul>
          {this.state.regionsClicked.map((name,index)=>{
            return <li>{name}</li>
          })}
          </ul>
        </div>
      </div>
      );
  }
}
 
export default App;
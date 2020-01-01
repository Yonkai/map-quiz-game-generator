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
      <h1 className>Hong Kong Geography Quiz Game</h1>
        {/* {this.state.map()} */}
        <CheckboxSVGMap map={PlainMapTest} onChange={(e) => this.handleClick(e)}/>
          <h2>{`Click on <randomly selected area>`}</h2>
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
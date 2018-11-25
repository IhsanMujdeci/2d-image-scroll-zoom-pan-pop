import React, { Component } from 'react';
import './App.css';
import CanvasComponent from "./components/konva-canvas";

class App extends Component {
  render() {
    return (
      <div className="App">
        <CanvasComponent/>
      </div>
    );
  }
}

export default App;

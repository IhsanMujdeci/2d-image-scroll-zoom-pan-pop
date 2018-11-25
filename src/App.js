import React, { Component } from 'react';
import './App.css';
import CanvasComponent from "./components/2d-stitch-canvas";
import { getImagePaths } from "./services/image";

class App extends Component {
  constructor(props){
      super(props)
      const imageUri = "/images/tiled";
      const imageMimeType = 'jpg';
      this.imageGroup = getImagePaths(imageUri, 4, imageMimeType)
  }
  render() {
    return (
      <div className="App">
        <CanvasComponent imageGroup={this.imageGroup} scaleBy={1.05}/>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.scss';
import CanvasComponent from "./containers/stitch-canvas/stitch-canvas";
import { getImagePaths } from "./services/image";
import { Header } from "./components/header/header";

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
          <Header/>
          <CanvasComponent
              className='stitch-canvas'
              imageGroup={this.imageGroup} scaleBy={1.05}
          />
      </div>
    );
  }
}

export default App;

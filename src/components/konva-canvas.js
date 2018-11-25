import React, { Component } from 'react';
import { Stage, Layer, Image } from 'react-konva';
//import Konva from 'konva'

function imagePaths(uri, layers, mimeType){
    let imageGroup = [];

    for(let layer = 0; layer < layers; layer++){
        imageGroup.push([]);
        let rows = Math.pow(2,layer);
        for(let y = 0; y < rows; y++){
            imageGroup[layer].push([]);
            for(let x = 0; x < rows; x++){
                imageGroup[layer][y].push(
                    {path: `${uri}/${layer}/${y}/${x}.${mimeType}`, image: null}
                )
            }
        }
    }

    return imageGroup
}

const imageUri = "/images/tiled";
const imagesImproved = imagePaths(imageUri, 4, 'jpg');

class CanvasComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            image: null,
            layers: imagesImproved,
            stage: this.refs.stage,
            scaleBy: 1.1,
            lastDist: 0,
            scale: 1,
            x:0,
            y:0,
            baseImageWidth:0,
            baseImageHeight:0,
            layer0Visible: true,
            layer1Visible: false,
            loadedImages: [new Array(2), new Array(2)]
        }
    }
    componentDidMount() {
        this.initImage();
    }
    initImage(){
        const image = new window.Image();

        // init the first image
        image.src = imagesImproved[0][0][0].path;
        image.onload = ()=> {
            this.setState({
                image:  image,
                baseImageWidth: image.width,
                baseImageHeight: image.hegith,
            })
        };

        this.state.layers.forEach((layer, l)=>{
            layer.forEach((images, y)=>{
                images.forEach((image, x)=>{
                    const i = new window.Image();
                    i.src = image.path;
                    i.onload = () => {
                        let layers = this.state.layers;
                        layers[l][y][x].image = i;
                        this.setState({
                            layers: layers
                        })
                    }
                })
            })
        })
    }
    getDimension(layer){
        return this.state.baseImageWidth/(layer+1)
    }
    getPosition(layer, position){
        return (this.state.baseImageWidth / (layer+1)) * position
    }
    wheel({evt}){
        evt.preventDefault();

        const stage = this.refs.stage;
        const oldScale = this.state.scale;

        const mousePointX = stage.getPointerPosition().x / oldScale - stage.x() / oldScale;
        const mousePointY = stage.getPointerPosition().y / oldScale - stage.y() / oldScale;

        const newScale = evt.deltaY < 0 ? oldScale * this.state.scaleBy : oldScale / this.state.scaleBy;

        // we can refactor this to its own function
        if(newScale > 2.1 && !this.state.layer1Visible){
            this.setState({
                layer0Visible: false,
                layer1Visible: true,
            })
        }
        if(newScale < 2.1 && !this.state.layer0Visible){
            this.setState({
                layer0Visible: true,
                layer1Visible: false,
            })
        }

        this.setState({
            scale: newScale,
            x: -(mousePointX - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointY - stage.getPointerPosition().y / newScale) * newScale
        });

        stage.batchDraw();
    }
    render() {
        return (
            <>
                <p>Zoom: {this.state.scale}</p>
                <Stage
                    ref="stage"
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onWheel = {(e) => this.wheel(e)}
                    draggable={true}
                    scaleX={this.state.scale}
                    scaleY={this.state.scale}
                    x={this.state.x}
                    y={this.state.y}
                >

                    <Layer ref="layer"
                           width={this.state.baseImageWidth}
                           height={this.state.baseImageHeight}
                           visible={this.state.layer0Visible}
                           listening={false}

                    >
                        <Image
                            image={this.state.image}
                            height={this.state.baseImageWidth}
                            width={this.state.baseImageHeight}
                            x={0}
                            y={0}
                            strokeEnabled={false}
                            strokeScaleEnabled={false}
                            shadowForStrokeEnabled={false}
                            shadowEnabled={false}
                            dashEnabled={false}
                            listening={false}
                            transformsEnabled={'position'}
                        />
                    </Layer>

                    <Layer
                        ref="layer"
                        width={this.state.baseImageWidth}
                        height={this.state.baseImageHeight}
                        visible={this.state.layer1Visible}
                    >
                        <Image
                            image={this.state.layers[1][0][0].image}
                            height={this.getDimension(1)}
                            width={this.getDimension(1)}
                            x={this.getPosition(1, 0)}
                            y={this.getPosition(1,0)}
                        />
                        <Image
                            image={this.state.layers[1][1][0].image}
                            height={this.getDimension(1)}
                            width={this.getDimension(1)}
                            x={this.getPosition(1, 1)}
                            y={this.getPosition(1, 0)}
                        />
                        <Image
                            image={this.state.layers[1][0][1].image}
                            height={this.getDimension(1)}
                            width={this.getDimension(1)}
                            x={this.getPosition(1, 0)}
                            y={this.getPosition(1, 1)}
                        />
                        <Image
                            image={this.state.layers[1][1][1].image}
                            height={this.getDimension(1)}
                            width={this.getDimension(1)}
                            x={this.getPosition(1, 1)}
                            y={this.getPosition(1, 1)}
                        />
                    </Layer>
                </Stage>
            </>
        );
    }
    renderz() {
        return (
            <>
                <p>Zoom: {this.state.scale}</p>
                <Stage
                    ref="stage"
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onWheel = {(e) => this.wheel(e)}
                    draggable={true}
                    scaleX={this.state.scale}
                    scaleY={this.state.scale}
                    x={this.state.x}
                    y={this.state.y}
                >
                    {this.state.imageGroup.map((group, layer) =>
                        <Layer>
                            {group.map((images, y) =>
                                images.map((image, x)=>
                                    <Image
                                        height={this.getDimension(layer)}
                                        width={this.getDimension(layer)}
                                        x={this.getPosition(layer, x)}
                                        y={this.getPosition(layer, y)}
                                        image={this.state.layers[layer][y][x].image}
                                    />
                                )
                            )}
                        </Layer>
                    )}

                </Stage>
            </>
        );
    }
}

export default CanvasComponent
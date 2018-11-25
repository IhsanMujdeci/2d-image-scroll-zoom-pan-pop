import React, { Component } from 'react';
import { Stage, Layer, Image } from 'react-konva';

class CanvasComponent extends Component {
    constructor({imageGroup, scaleBy = 1.1}){
        super({imageGroup, scaleBy});
        this.state = {
            imageGroup: imageGroup,
            stage: this.refs.stage,
            scaleBy: scaleBy,
            lastDist: 0,
            scale: 1,
            x:0,
            y:0,
            baseImageWidth:0,
            baseImageHeight:0,
            visibleLayer:0,
            layersLoaded:{}
        }
    }
    componentDidMount() {
        this.initImage();
    }
    async initImage(){
        const image = await this.loadImage(this.state.imageGroup[0][0][0].path);
        const imageGroup = this.state.imageGroup;
        imageGroup[0][0][0].image = image;
        imageGroup[0][0][0].height = image.height;
        imageGroup[0][0][0].width = image.width;
        imageGroup[0][0][0].x = 0;
        imageGroup[0][0][0].y = 0;

        this.setState({
            imageGroup: imageGroup,
            baseImageWidth: image.width,
            baseImageHeight: image.height,
            layersLoaded: {0: true}
        })
    }
    loadImage(src){
        return new Promise(resolve=>{
            const i = new window.Image();
            i.src = src;
            i.onload = () =>{
                return resolve(i)
            }
        })
    }
    loadLayer(layerNumber){
        this.state.imageGroup[layerNumber].forEach((images, y)=>{
            images.forEach(async (image, x)=>{
                const loadedImage = await this.loadImage(image.path)
                const imageGroup = this.state.imageGroup;
                imageGroup[layerNumber][y][x].image = loadedImage;
                imageGroup[layerNumber][y][x].height = this.getImageHeight(layerNumber);
                imageGroup[layerNumber][y][x].width = this.getImageWidth(layerNumber);
                imageGroup[layerNumber][y][x].x = this.getImageX(layerNumber, y);
                imageGroup[layerNumber][y][x].y = this.getImageY(layerNumber, x);
                this.setState({
                    imageGroup: imageGroup
                })
            })
        });
        this.setState({
            layersLoaded: {...this.state.layersLoaded, [layerNumber]: true}
        })
    }
    isLayerLoaded(layerNumber){
        return this.state.layersLoaded[layerNumber]
    }
    getImageWidth(layer){
        return this.state.baseImageWidth/(layer+1)
    }
    getImageHeight(layer){
        return this.state.baseImageHeight/(layer+1)
    }
    getImageX(layer, position){
        return (this.state.baseImageWidth/(layer+1))*position
    }
    getImageY(layer, position){
        return (this.state.baseImageHeight/(layer+1))*position
    }
    wheel({evt}){
        evt.preventDefault();

        const stage = this.refs.stage;
        const oldScale = this.state.scale;

        const mousePointX = stage.getPointerPosition().x / oldScale - stage.x() / oldScale;
        const mousePointY = stage.getPointerPosition().y / oldScale - stage.y() / oldScale;

        const newScale = evt.deltaY < 0 ? oldScale * this.state.scaleBy : oldScale / this.state.scaleBy;
        let visibleLayer = this.calcVisibleLayer(newScale);

        if(!this.isLayerLoaded(visibleLayer)){
            this.loadLayer(visibleLayer)
        }

        this.setState({
            scale: newScale,
            x: -(mousePointX - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointY - stage.getPointerPosition().y / newScale) * newScale,
            visibleLayer: visibleLayer
        });

        stage.batchDraw();
    }
    calcVisibleLayer(newScale = 1){
        let visibleLayer = Math.floor(newScale)-1;
        if(visibleLayer < 0){
            visibleLayer = 0
        }
        else if(this.state.imageGroup.length-1 < visibleLayer){
            visibleLayer = this.state.imageGroup.length-1
        }
        return visibleLayer

    }
    layerIsVisible(layer){
        return this.state.visibleLayer === layer
    }
    render() {
        return (
            <>
                <p>Zoom: {this.state.scale}</p>
                <Stage
                    ref="stage"
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onWheel={(e) => this.wheel(e)}
                    draggable={true}
                    scaleX={this.state.scale}
                    scaleY={this.state.scale}
                    x={this.state.x}
                    y={this.state.y}
                >
                    {this.state.imageGroup.map((group, layer) =>
                        <Layer
                            visible={this.layerIsVisible(layer)}
                        >
                            {group.map((images, x) =>
                                images.map((image, y)=>
                                    <Image
                                        height={this.state.imageGroup[layer][x][y].height}
                                        width={this.state.imageGroup[layer][x][y].width}
                                        x={this.state.imageGroup[layer][x][y].x}
                                        y={this.state.imageGroup[layer][x][y].y}
                                        image={this.state.imageGroup[layer][x][y].image}
                                        ref={'image'+x+x}
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
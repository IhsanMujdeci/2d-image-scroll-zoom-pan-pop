import React, { Component } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import {loadImage, getImageHeight, getImageWidth, getImageX, getImageY} from "../../services/image";

class CanvasComponent extends Component {
    constructor({imageGroup, scaleBy = 1.1, eagerLoad = false, className}){
        super({imageGroup, scaleBy, eagerLoad});
        this.state = {
            imageGroup: imageGroup,
            stage: this.refs.stage,
            eagerLoad: eagerLoad,
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
        const image = await loadImage(this.state.imageGroup[0][0][0].path);
        const imageGroup = this.state.imageGroup;
        imageGroup[0][0][0].image = image;
        imageGroup[0][0][0].height = image.height;
        imageGroup[0][0][0].width = image.width;
        imageGroup[0][0][0].x = 0;
        imageGroup[0][0][0].y = 0;

        if(this.shouldEagerLoad()){
            this.loadLayer(this.limitToMaxLayer(1))
        }

        this.setState({
            imageGroup: imageGroup,
            baseImageWidth: image.width,
            baseImageHeight: image.height,
            layersLoaded: {0: true}
        });
    }
    // extract to own class
    loadLayer(layerNumber){
        this.state.imageGroup[layerNumber].forEach((images, y)=>{
            images.forEach(async (image, x)=>{
                const loadedImage = await loadImage(image.path);
                const imageGroup = this.state.imageGroup;
                imageGroup[layerNumber][y][x].image = loadedImage;
                imageGroup[layerNumber][y][x].height = getImageHeight(this.state.baseImageHeight, layerNumber);
                imageGroup[layerNumber][y][x].width = getImageWidth(this.state.baseImageWidth, layerNumber);
                imageGroup[layerNumber][y][x].x = getImageX(this.state.baseImageWidth, layerNumber, y);
                imageGroup[layerNumber][y][x].y = getImageY(this.state.baseImageHeight, layerNumber, x);
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
    handleWheel({evt}){
        evt.preventDefault();

        const stage = this.refs.stage;
        const oldScale = this.state.scale;

        const mousePointX = stage.getPointerPosition().x / oldScale - stage.x() / oldScale;
        const mousePointY = stage.getPointerPosition().y / oldScale - stage.y() / oldScale;

        const newScale = evt.deltaY < 0 ? oldScale * this.state.scaleBy : oldScale / this.state.scaleBy;
        let visibleLayer = this.calcVisibleLayer(newScale);

        if(!this.isLayerLoaded(visibleLayer)){
            this.loadLayer(visibleLayer);
        }
        if(this.shouldEagerLoad(visibleLayer)){
            this.loadLayer(this.limitToMaxLayer(visibleLayer + 1))
        }

        this.setState({
            scale: newScale,
            x: -(mousePointX - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointY - stage.getPointerPosition().y / newScale) * newScale,
            visibleLayer: visibleLayer
        });

        stage.batchDraw();
    }
    shouldEagerLoad(visibleLayer){
        return this.state.eagerLoad && !this.isLayerLoaded(this.limitToMaxLayer(visibleLayer + 1));
    }
    calcVisibleLayer(newScale){
        let visibleLayer = Math.floor(newScale)-1;
        if(visibleLayer < 0){
            visibleLayer = 0
        }
        return this.limitToMaxLayer(visibleLayer)
    }
    limitToMaxLayer(layer){
        if(layer > this.state.imageGroup.length-1){
            return this.state.imageGroup.length-1
        }
        return layer
    }
    layerIsVisible(layer){
        return this.state.visibleLayer === layer
    }
    render() {
        return (
            <div className={this.props.className}>
                {/*<p>Zoom: {this.state.scale}</p>*/}
                <Stage
                    ref="stage"
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onWheel={(e) => this.handleWheel(e)}
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
                                    />
                                )
                            )}
                        </Layer>
                    )}
                </Stage>
            </div>
        );
    }
}

export default CanvasComponent
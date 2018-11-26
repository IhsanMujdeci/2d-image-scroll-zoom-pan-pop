import React, { Component } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import {loadImage, getImageSideLength, getImageCoordinate, centerImagePosition} from "../../services/images/image";
import {Button} from "../../components/button/button";
import "./stitch-canvas.scss";
import { faUndo, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

class CanvasComponent extends Component {
    constructor({ imageGroup, scaleBy = 1.1, eagerLoad = false }){
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
            clickZoomDelta:500,
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

        const stageX = centerImagePosition(this.refs.container.clientWidth, image.width);
        const stageY = centerImagePosition(this.refs.container.clientHeight, image.height);

        if(this.shouldEagerLoad()){
            this.loadLayer(this.limitToActualLayer(1))
        }

        this.setState({
            imageGroup: imageGroup,
            baseImageWidth: image.width,
            baseImageHeight: image.height,
            layersLoaded: {0: true},
            x: stageX,
            y: stageY
        });
    }
    loadLayer(layerNumber){
        // TODO consider putting actualLayer function here
        this.state.imageGroup[layerNumber].forEach((images, y)=>{
            images.forEach(async (image, x)=>{
                const loadedImage = await loadImage(image.path);
                const imageGroup = this.state.imageGroup;
                imageGroup[layerNumber][y][x].image = loadedImage;
                imageGroup[layerNumber][y][x].height = getImageSideLength(this.state.baseImageHeight, layerNumber);
                imageGroup[layerNumber][y][x].width = getImageSideLength(this.state.baseImageWidth, layerNumber);
                imageGroup[layerNumber][y][x].x = getImageCoordinate(this.state.baseImageWidth, layerNumber, y);
                imageGroup[layerNumber][y][x].y = getImageCoordinate(this.state.baseImageHeight, layerNumber, x);
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

        const newScale = this.calcScale(evt.deltaY, oldScale);
        let visibleLayer = this.calcVisibleLayer(newScale);

        this.shouldLoadLayer(visibleLayer);

        this.setState({
            scale: newScale,
            x: -(mousePointX - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointY - stage.getPointerPosition().y / newScale) * newScale,
            visibleLayer: visibleLayer
        });

        stage.batchDraw();
    }
    shouldLoadLayer(layer){
        if(!this.isLayerLoaded(layer)){
            this.loadLayer(layer);
        }
        if(this.shouldEagerLoad(layer)){
            this.loadLayer(this.limitToActualLayer(layer + 1))
        }
    }
    calcScale(delta, oldScale){
        return delta < 0 ? oldScale * this.state.scaleBy : oldScale / this.state.scaleBy;
    }
    zoom(delta){
        const newScale = this.calcScale(delta, this.state.scale);
        const visibleLayer = this.calcVisibleLayer(newScale);
        this.shouldLoadLayer(visibleLayer);
        this.setState({
            scale: newScale,
            visibleLayer: visibleLayer
        })
    }
    shouldEagerLoad(visibleLayer){
        return this.state.eagerLoad && !this.isLayerLoaded(this.limitToActualLayer(visibleLayer + 1));
    }
    calcVisibleLayer(newScale){
        let visibleLayer = Math.floor(newScale)-1;
        return this.limitToActualLayer(visibleLayer)
    }
    limitToActualLayer(layer){
        if(layer < 0){
            return 0
        }
        if(layer > this.state.imageGroup.length-1){
            return this.state.imageGroup.length-1
        }
        return layer
    }
    layerIsVisible(layer){
        return this.state.visibleLayer === layer
    }
    resetImage(){
        const stageX = centerImagePosition(this.refs.container.clientWidth, this.state.baseImageWidth);
        const stageY = centerImagePosition(this.refs.container.clientHeight, this.state.baseImageWidth);

        this.setState({
            x: stageX,
            y: stageY,
            scale: 1,
            visibleLayer: 0
        })
    }
    dragBoundFunc(pos){
        if(!pos){
            return
        }
        this.setState({
            x: pos.x,
            y: pos.y
        });
        return{
            x:pos.x,
            y:pos.y
        }
    }
    render() {
        return (
            <div className={this.props.className} ref="container">
                <h3 className="zoom">x {this.state.scale.toFixed(2)}</h3>
                <Button
                    className="reset"
                    text='reset'
                    onClick={this.resetImage.bind(this)}
                    icon={faUndo}
                />

                <div className="zoom-group">
                    <Button
                        onClick={this.zoom.bind(this, -this.state.clickZoomDelta)}
                        icon={faPlus}
                    />
                    <Button
                        onClick={this.zoom.bind(this, this.state.clickZoomDelta)}
                        icon={faMinus}
                    />
                </div>
                <Stage
                    ref="stage"
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onWheel={(e) => this.handleWheel(e)}
                    draggable={true}
                    dragBoundFunc={this.dragBoundFunc.bind(this)}
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
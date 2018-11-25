import React, { Component } from 'react';
import { Stage, Layer, Image } from 'react-konva';
//import Konva from 'konva'

const imagePath = "/images/tiled/";
const images = [
    [
        [imagePath+'/0/0/0.jpg']
    ],
    [
        [imagePath+'/1/0/0.jpg', imagePath+'/1/0/1.jpg'],
        [imagePath+'/1/1/0.jpg', imagePath+'/1/1/1.jpg']
    ],
    [
        [imagePath+'/2/0/0.jpg', imagePath+'/2/0/1.jpg', imagePath+'/2/0/2.jpg',imagePath+'/2/0/3.jpg'],
        [imagePath+'/2/1/0.jpg', imagePath+'/2/1/1.jpg', imagePath+'/2/1/2.jpg',imagePath+'/2/1/3.jpg'],
        [imagePath+'/2/2/0.jpg', imagePath+'/2/2/1.jpg', imagePath+'/2/2/2.jpg',imagePath+'/2/2/3.jpg'],
        [imagePath+'/2/3/0.jpg', imagePath+'/2/3/1.jpg', imagePath+'/2/3/2.jpg',imagePath+'/2/3/3.jpg']
    ],
    [
        [
            imagePath+'/3/0/0.jpg', imagePath+'/3/0/1.jpg', imagePath+'/3/0/2.jpg',imagePath+'/3/0/3.jpg',
            imagePath+'/3/0/4.jpg', imagePath+'/3/0/5.jpg', imagePath+'/3/0/5.jpg',imagePath+'/3/0/6.jpg'
        ],
        [
            imagePath+'/3/1/0.jpg', imagePath+'/3/1/1.jpg', imagePath+'/3/1/2.jpg',imagePath+'/3/1/3.jpg',
            imagePath+'/3/1/4.jpg', imagePath+'/3/1/5.jpg', imagePath+'/3/1/5.jpg',imagePath+'/3/1/6.jpg'
        ],
        [
            imagePath+'/3/2/0.jpg', imagePath+'/3/2/1.jpg', imagePath+'/3/2/2.jpg',imagePath+'/3/2/3.jpg',
            imagePath+'/3/2/4.jpg', imagePath+'/3/2/5.jpg', imagePath+'/3/2/5.jpg',imagePath+'/3/2/6.jpg'
        ],
        [
            imagePath+'/3/3/0.jpg', imagePath+'/3/3/1.jpg', imagePath+'/3/3/2.jpg',imagePath+'/3/3/3.jpg',
            imagePath+'/3/3/4.jpg', imagePath+'/3/3/5.jpg', imagePath+'/3/3/5.jpg',imagePath+'/3/3/6.jpg'
        ],
        [
            imagePath+'/3/4/0.jpg', imagePath+'/3/4/1.jpg', imagePath+'/3/4/2.jpg',imagePath+'/3/4/3.jpg',
            imagePath+'/3/4/4.jpg', imagePath+'/3/4/5.jpg', imagePath+'/3/4/5.jpg',imagePath+'/3/4/6.jpg'
        ],
        [
            imagePath+'/3/5/0.jpg', imagePath+'/3/5/1.jpg', imagePath+'/3/5/2.jpg',imagePath+'/3/5/3.jpg',
            imagePath+'/3/5/4.jpg', imagePath+'/3/5/5.jpg', imagePath+'/3/5/5.jpg',imagePath+'/3/5/6.jpg'
        ],
        [
            imagePath+'/3/6/0.jpg', imagePath+'/3/6/1.jpg', imagePath+'/3/6/2.jpg',imagePath+'/3/6/3.jpg',
            imagePath+'/3/6/4.jpg', imagePath+'/3/6/5.jpg', imagePath+'/3/6/5.jpg',imagePath+'/3/6/6.jpg'
        ],
        [
            imagePath+'/3/7/0.jpg', imagePath+'/3/7/1.jpg', imagePath+'/3/7/2.jpg',imagePath+'/3/7/3.jpg',
            imagePath+'/3/7/4.jpg', imagePath+'/3/7/5.jpg', imagePath+'/3/7/5.jpg',imagePath+'/3/7/6.jpg'
        ]
    ]
];

class CanvasComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            image: null,
            imageGroup: images,
            stage: this.refs.stage,
            scaleBy: 1.1,
            lastDist: 0,
            scale: 1,
            x:0,
            y:0,
            baseImageWidth:0,
            baseImageHeight:0,
            img0: null,
            img1: null,
            img2: null,
            img3: null,
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
        image.src = images[0][0];
        image.onload = ()=> {
            console.log(image.width)
            console.log(image.height)
            this.setState({
                image:  image,
                baseImageWidth: image.width,
                baseImageHeight: image.hegith,
            })
        };

        images[1].forEach((images, y)=>{
            images.forEach((image, x)=>{
                const i = new window.Image();
                i.src = image
                i.onload = () => {
                    let loadedImages = this.state.loadedImages;
                    loadedImages[y][x] = i
                    this.setState({
                        loadedImages: loadedImages
                    })
                }
            })
        })

        console.log(this.state.loadedImages)

        const img0 = new window.Image();
        img0.src = images[1][0][0];
        img0.onload = () => {
            this.setState({
                img0: img0
            })
        }

        const img1 = new window.Image();
        img1.src =  images[1][1][0];
        img1.onload = () => {
            this.setState({
                img2: img2
            })
        };

        const img2 = new window.Image();
        img2.src = images[1][0][1];
        img2.onload = () => {
            this.setState({
                img1: img1
            })
        };

        const img3 = new window.Image();
        img3.src =  images[1][1][1];
        img3.onload = () => {
            this.setState({
                img3: img3
            })
        }
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
                <p>Zoom: {this.state.scale} {this.getDimension(1)}</p>
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
                            image={this.state.loadedImages[0][0]}
                            height={this.getDimension(1)}
                            width={this.getDimension(1)}
                            x={this.getPosition(1, 0)}
                            y={this.getPosition(1,0)}
                        />
                        <Image
                            image={this.state.loadedImages[1][0]}
                            height={this.getDimension(1)}
                            width={this.getDimension(1)}
                            x={this.getPosition(1, 1)}
                            y={this.getPosition(1, 0)}
                        />
                        <Image
                            image={this.state.loadedImages[0][1]}
                            height={this.getDimension(1)}
                            width={this.getDimension(1)}
                            x={this.getPosition(1, 0)}
                            y={this.getPosition(1, 1)}
                        />
                        <Image
                            image={this.state.loadedImages[1][1]}
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
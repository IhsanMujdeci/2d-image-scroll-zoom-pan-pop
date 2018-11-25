// import React, { Component } from 'react';
//
// class CanvasComponent extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             scaleFactor: 1.1,
//             image: '/images/tiled/0/0/0.jpg',
//             lastX: this.refs.canvas.width/2,
//             lastY: this.refs.canvas.height/2
//         };
//
//         this.updateState = this.updateState.bind(this)
//     }
//     componentDidMount() {
//         this.updateCanvas();
//     }
//     zoom(clicks, ctx){
//         const pt = ctx.transformedPoint(this.state.lastX,this.state.lastY);
//         ctx.translate(pt.x,pt.y);
//         const factor = Math.pow(this.state.scaleFactor,clicks);
//         ctx.scale(factor,factor);
//         ctx.translate(-pt.x,-pt.y);
//         this.redraw();
//     }
//     redraw(ctx, canvas){
//         // Clear the entire canvas
//         const p1 = ctx.transformedPoint(0,0);
//         const p2 = ctx.transformedPoint(canvas.width,canvas.height);
//         ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
//
//         ctx.save();
//         ctx.setTransform(1,0,0,1,0,0);
//         ctx.clearRect(0,0,canvas.width,canvas.height);
//         ctx.restore();
//
//         ctx.drawImage(this.state.image,0,0);
//     }
//     updateCanvas() {
//         const ctx = this.refs.canvas.getContext('2d');
//         const img = new Image();
//         img.src = '/images/tiled/0/0/0.jpg';
//         img.onload = () => {
//             ctx.drawImage(img, 0, 0, this.refs.canvas.width, this.refs.canvas.height);
//         };
//     }
//     render() {
//         return (
//             <canvas ref="canvas" width={300} height={300}/>
//         );
//     }
// }
//
// export default CanvasComponent
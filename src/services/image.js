export function getImagePaths(uri, layers, mimeType){
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

export function getImageWidth(baseImageWidth, layer){
    return baseImageWidth/Math.pow(2, layer)
}

export function getImageHeight(baseImageHeight, layer){
    return baseImageHeight/Math.pow(2, layer)
}

export function getImageX(baseImageWidth, layer, position){
    return baseImageWidth/Math.pow(2, layer)*position
}

export function getImageY(baseImageHeight, layer, position){
    return baseImageHeight/Math.pow(2, layer)*position
}

export function loadImage(src){
    return new Promise(resolve=>{
        const i = new Image();
        i.src = src;
        i.onload = () =>{
            return resolve(i)
        }
    })
}

export function centerImagePosition(containerAxis, imageAxis){
    return containerAxis/2 - imageAxis/2
}

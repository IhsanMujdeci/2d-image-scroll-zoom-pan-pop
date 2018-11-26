import {expect} from 'chai';
import * as imageService from './image';

describe('Image service', function(){


    describe('get image length', function(){
        const imageWidth = 100;
        const imageHeight = 200;
        const layer0 = 0;
        const layer1 = 1;
        const layer2 = 2;
        const layer3 = 3;
        const layer10 = 10;


        it('base layer', () => {
            expect(imageService.getImageSideLength(imageWidth, layer0)).equal(imageWidth)
        });

        it('shouldnt return image height', () => {
            expect(imageService.getImageSideLength(imageWidth, layer0)).not.equal(imageHeight)
        });

        it('first layer', () => {
            expect(imageService.getImageSideLength(imageWidth, layer1)).equal(imageWidth/2)
        });
        it('second layer', () => {
            expect(imageService.getImageSideLength(imageWidth, layer2)).equal(imageWidth/4)
        });
        it('third layer', () => {
            expect(imageService.getImageSideLength(imageWidth, layer3)).equal(imageWidth/8)
        });

        it('10th layer', () => {
            expect(imageService.getImageSideLength(imageHeight, layer10)).equal(imageHeight/1024)
        });
    })


});



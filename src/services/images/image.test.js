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

        it('shouldn\'t return image height', () => {
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

    describe('get image coordinate', function(){
        const imageWidth = 100;
        const imageHeight = 200;
        const layer0 = 0;
        const layer1 = 1;
        const layer2 = 2;
        const layer3 = 3;
        const layer10 = 10;


        it('base layer', () => {
            expect(imageService.getImageCoordinate(imageWidth, layer0, 0)).equal(0)
        });

        it('first layer pos 0 ', () => {
            expect(imageService.getImageCoordinate(imageWidth, layer1, 0)).equal(0)
        });
        it('second layer pos 0', () => {
            expect(imageService.getImageCoordinate(imageWidth, layer2, 0)).equal(0)
        });
        it('third layer pos 0', () => {
            expect(imageService.getImageCoordinate(imageWidth, layer3, 0)).equal(0)
        });
        it('10th layer pos 0', () => {
            expect(imageService.getImageCoordinate(imageWidth, layer10, 0)).equal(0)
        });

        it('second layer pos 0 ', () => {
            expect(imageService.getImageCoordinate(imageWidth, layer1, 0)).equal(0)
        });
        it('second layer pos 1', () => {
            expect(imageService.getImageCoordinate(imageWidth, layer1, 1)).equal(imageWidth/2)
        });


        it('third layer pos 0 ', () => {
            expect(imageService.getImageCoordinate(imageHeight, layer1, 0)).equal(0)
        });
        it('third layer pos 1', () => {
            expect(imageService.getImageCoordinate(imageHeight, layer1, 1)).equal(imageHeight/2)
        });
        it('third layer pos 2 ', () => {
            expect(imageService.getImageCoordinate(imageHeight, layer1, 2)).equal(200)
        });
        it('third layer pos 3', () => {
            expect(imageService.getImageCoordinate(imageHeight, layer1, 3)).equal(300)
        });
    })

});



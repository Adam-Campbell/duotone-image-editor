import {  rgbToGrayscale, mapGrayscaleToGradient } from './utilities.js';

export default class CanvasHandler {
    constructor(canvasElement) {
        this.canvasElement = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.originalImageData = null;
    }

    prepareCanvas(img, lengthLimit=null) {
        const { width, height } = img;
        if (lengthLimit) {
            const maxDimension = Math.max(width, height);
            const scale = Math.min(lengthLimit / maxDimension, 1);
            this.canvasElement.width = width * scale;
            this.canvasElement.height = height * scale;
            this.ctx.drawImage(img, 0, 0, width, height, 0, 0, width * scale, height * scale);
        } else {
            this.canvasElement.width = width;
            this.canvasElement.height = height;
            this.ctx.drawImage(img, 0, 0);
        }
        this.ctx.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
        this.originalImageData = this.ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    applyDuotoneEffect(rgbDark, rgbLight) {
        if (this.originalImageData) {
            this.ctx.putImageData(this.originalImageData, 0, 0);
        }
        const map = mapGrayscaleToGradient(rgbDark, rgbLight);
        const imageData = this.ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
        const pixelArray = imageData.data;
        const start = performance.now();
        for (let i = 0; i < pixelArray.length; i += 4) {
            const red = pixelArray[i];
            const green = pixelArray[i + 1];
            const blue = pixelArray[i + 2];
            const grayscale = rgbToGrayscale(red, green, blue);
            const [r, g, b] = map[grayscale];
            pixelArray[i] = r;
            pixelArray[i + 1] = g;
            pixelArray[i + 2] = b;
        }
        this.ctx.putImageData(imageData, 0, 0);
        const end = performance.now();
        console.log(`Time to process all pixels: ${end - start}ms`);
    }
}
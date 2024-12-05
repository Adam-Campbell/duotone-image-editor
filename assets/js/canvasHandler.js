import {  rgbToGrayscale, mapGrayscaleToGradient } from './utilities.js';

/**
 * CanvasHandler class.
 * This class corresponds to a canvas element in the UI, and handles image processing and rendering.
 */
export default class CanvasHandler {
    /**
     * Constructor for CanvasHandler class.
     * @param {*} canvasElement - the canvas HTML element
     */
    constructor(canvasElement) {
        this.canvasElement = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.originalImageData = null;
    }

    /**
     * Prepares the canvas once it has an image ready to be displayed, scaling it if necessary.
     * @param {*} img - the image HTML element to be displayed on the canvas 
     * @param {number} lengthLimit - the maximum length that either the width or height of the canvas should be
     */
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

    /**
     * Applies duotone effect to the image currently displayed on the canvas, based on the provided colors.
     * @param {number[]} rgbDark - rgb values for dark end of gradient
     * @param {number[]} rgbLight - rgb values for light end of gradient
     */
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
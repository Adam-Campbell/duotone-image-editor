import ColorPicker from './colorPicker.js';
import CanvasHandler from './canvasHandler.js';
import {  hexToRgb, rgbToHex } from './utilities.js';


class App {
    constructor(colorPicker1Element, colorPicker2Element, previewCanvasElement, fileInputElement) {
        this.colorPicker1 = new ColorPicker(colorPicker1Element, (value) => {
            this.rgbDark = hexToRgb(value);
            this.updateCanvas();
        });
        this.colorPicker2 = new ColorPicker(colorPicker2Element, (value) => {
            this.rgbLight = hexToRgb(value);
            this.updateCanvas();
        });
        this.previewCanvas = new CanvasHandler(previewCanvasElement);
        this.offscreenCanvas = new CanvasHandler(document.createElement('canvas'));
        this.fileInput = fileInputElement;
        this.rgbDark = [78, 5, 112];
        this.rgbLight = [226, 178, 3];
        this.init();
    }

    init() {
        this.fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
        this.colorPicker1.init(rgbToHex(...this.rgbDark));
        this.colorPicker2.init(rgbToHex(...this.rgbLight));
    }

    handleFileUpload(e) {
        const imageFile = e.target.files[0];
        if (imageFile) {
            const imageURL = URL.createObjectURL(imageFile);
            const img = new Image();
            img.src = imageURL;
            img.onload = () => {
                this.previewCanvas.prepareCanvas(img, 500);
                this.offscreenCanvas.prepareCanvas(img);
            };
        }
    }

    updateCanvas() {    
        this.previewCanvas.applyDuotoneEffect(this.rgbDark, this.rgbLight);
    }
}

const app = new App(
    document.getElementById('color-picker-1'),
    document.getElementById('color-picker-2'),
    document.getElementById('preview-canvas'),
    document.getElementById('file-input')
);
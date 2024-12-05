import ColorPicker from './colorPicker.js';
import CanvasHandler from './canvasHandler.js';
import {  hexToRgb, rgbToHex } from './utilities.js';

/**
 * App class.
 * This class initializes the color pickers, canvas, and file input elements, and handles the main application logic.
 */
class App {
    /**
     * Constructor for App class.
     * @param {*} colorPicker1Element - the first color picker HTML element
     * @param {*} colorPicker2Element - the second color picker HTML element
     * @param {*} previewCanvasElement - the preview canvas HTML element
     * @param {*} fileInputElement - the file input HTML element
     * @param {*} downloadButtonElement - the download button HTML element
     */
    constructor(colorPicker1Element, colorPicker2Element, previewCanvasElement, fileInputElement, downloadButtonElement) {
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
        this.downloadButton = downloadButtonElement;
        this.rgbDark = [78, 5, 112];
        this.rgbLight = [226, 178, 3];
        this.init();
    }

    /**
     * Initialize the file input element and color pickers.
     */
    init() {
        this.fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
        this.colorPicker1.init(rgbToHex(...this.rgbDark));
        this.colorPicker2.init(rgbToHex(...this.rgbLight));
        this.downloadButton.addEventListener('click', () => {
            this.saveImage();
        });
    }

    /**
     * Handles file upload event, preparing the canvases with the uploaded image.
     * @param {*} e - event object from file input change event
     */
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

    /**
     * Updates the preview canvas by applying duotone effect with the current color values.
     */
    updateCanvas() {    
        this.previewCanvas.applyDuotoneEffect(this.rgbDark, this.rgbLight);
    }

    saveImage(format = 'image/webp') {
        // Create a link element to download the image
        const link = document.createElement('a');
        // Date.now() is used to generate a unique filename, format.splt('/')[1] extracts the file extension
        link.download = `duotone-image-${Date.now()}.${format.split('/')[1]}`;
        // Process the image at full size on offscreen canvas
        this.offscreenCanvas.applyDuotoneEffect(this.rgbDark, this.rgbLight);
        // Set the href attribute of the link element to the image data URL
        link.href = this.offscreenCanvas.canvasElement.toDataURL(format);
        // Trigger download
        link.click();
    }
}

// Initialize the app
const app = new App(
    document.getElementById('color-picker-1'),
    document.getElementById('color-picker-2'),
    document.getElementById('preview-canvas'),
    document.getElementById('file-input'),
    document.getElementById('download-button')
);

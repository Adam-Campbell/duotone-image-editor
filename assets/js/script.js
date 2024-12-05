// Utility functions
function rgbToHex(r, g, b) {
    // (1 << 24) added to ensure that resulting number has enough bits. The resulting
    // leading 1 is then removed with slice(1) to give the correct hex value.
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

/**
 * Basic grayscale conversion - possibly enhance in future.
 */
function rgbToGrayscale(r, g, b) {
    return Math.round((r + g + b) / 3);
}

/**
 * Creates a map of grayscale values to a gradient between two colors.
 * @param {*} rgbDark 
 * @param {*} rgbLight 
 * @returns array of rgb values
 */
function mapGrayscaleToGradient(rgbDark, rgbLight) {
    const gradient = [];
    for (let i = 0; i < 256; i++) {
        const r = Math.round(rgbDark[0] + ( (rgbLight[0] - rgbDark[0]) * (i / 255) ) );
        const g = Math.round(rgbDark[1] + ( (rgbLight[1] - rgbDark[1]) * (i / 255) ) );
        const b = Math.round(rgbDark[2] + ( (rgbLight[2] - rgbDark[2]) * (i / 255) ));
        gradient.push([r, g, b]);
    }
    return gradient;
}


class ColorPicker {
    constructor(element, onChangeCallback) {
        this.element = element;
        this.onChangeCallback = onChangeCallback;
        this.debounceTimeout = null;
        this.init();
    }

    init(initialValue='#000000') {
        this.element.value = initialValue;
        this.element.addEventListener('input', e => {
            this.handleInput(e);
        });
    }

    handleInput(e) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.debounceTimeout = setTimeout(() => {
            this.onChangeCallback(e.target.value);
        }, 100);
    }
}


class CanvasHandler {
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



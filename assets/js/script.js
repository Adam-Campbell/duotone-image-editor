// Elements
const fileInput = document.getElementById('file-input');
const previewCanvas = document.getElementById('preview-canvas');
const previewCtx = previewCanvas.getContext('2d');
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');
//const colorPicker1 = document.getElementById('color-picker-1');
//const colorPicker2 = document.getElementById('color-picker-2');

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

    init() {
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

const colorPicker1 = new ColorPicker(document.getElementById('color-picker-1'), (value) => {
    console.log(`Color picker 1 callback called with value: ${value}`);
});

const colorPicker2 = new ColorPicker(document.getElementById('color-picker-2'), (value) => {
    console.log(`Color picker 2 callback called with value: ${value}`);
});










// colorPicker1.addEventListener('input', (e) => {
//     console.log(e.target.value);
// });

const rgbDark = [78, 5, 112];
//const rgbLight = [255, 235, 10];

// 226 178 3
const rgbLight = [226, 178, 3];


function preparePreviewCanvas(img, lengthLimit) {
    const {  width, height } = img;
    const maxDimension = Math.max(width, height);
    const scale = Math.min(lengthLimit / maxDimension, 1);
    console.log(scale);
    previewCanvas.width = width * scale;
    previewCanvas.height = height * scale;
    previewCtx.drawImage(img, 0, 0, width, height, 0, 0, width * scale, height * scale);
} 

function prepareOffscreenCanvas(img) {
    offscreenCanvas.width = img.width;
    offscreenCanvas.height = img.height;
    offscreenCtx.drawImage(img, 0, 0);
}


function applyDuotoneEffect(canvas, rgbDark, rgbLight) {
    const canvasCtx = canvas.getContext('2d');
    const map = mapGrayscaleToGradient(rgbDark, rgbLight);
    const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
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
    canvasCtx.putImageData(imageData, 0, 0);
    const end = performance.now();
    console.log(`Time to process all pixels: ${end - start}ms`);    
}





// When the user uploads an image, display it on the canvas
fileInput.addEventListener('change', (e) => {
    // Grab the first File object from FileList
    const imageFile = e.target.files[0];
    if (imageFile) {
        const imageURL = URL.createObjectURL(imageFile);
        const img = new Image();
        img.src = imageURL;
        img.onload = () => {
            preparePreviewCanvas(img, 500);
            prepareOffscreenCanvas(img);
            applyDuotoneEffect(previewCanvas, rgbDark, rgbLight);
        };
    }
    
 });




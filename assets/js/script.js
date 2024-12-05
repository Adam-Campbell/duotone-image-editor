
const fileInput = document.getElementById('file-input');
const previewCanvas = document.getElementById('preview-canvas');
const previewCtx = previewCanvas.getContext('2d');
const colorPicker1 = document.getElementById('color-picker-1');
const colorPicker2 = document.getElementById('color-picker-2');


colorPicker1.addEventListener('input', (e) => {
    console.log(e.target.value);
});

const rgbDark = [78, 5, 112];
//const rgbLight = [255, 235, 10];

// 226 178 3
const rgbLight = [226, 178, 3];


const rgbToHex = (r, g, b) => {
    // (1 << 24) added to ensure that resulting number has enough bits. The resulting
    // leading 1 is then removed with slice(1) to give the correct hex value.
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

/**
 * Basic grayscale conversion - possibly enhance in future.
 */
const rgbToGrayscale = (r, g, b) => {
    return Math.round((r + g + b) / 3);
};


/**
 * Creates a map of grayscale values to a gradient between two colors.
 * @param {*} rgbDark 
 * @param {*} rgbLight 
 * @returns array of rgb values
 */
const mapGrayscaleToGradient = (rgbDark, rgbLight) => {
    const gradient = [];
    for (let i = 0; i < 256; i++) {
        const r = Math.round(rgbDark[0] + ( (rgbLight[0] - rgbDark[0]) * (i / 255) ) );
        const g = Math.round(rgbDark[1] + ( (rgbLight[1] - rgbDark[1]) * (i / 255) ) );
        const b = Math.round(rgbDark[2] + ( (rgbLight[2] - rgbDark[2]) * (i / 255) ));
        gradient.push([r, g, b]);
    }
    return gradient;
};




// When the user uploads an image, display it on the canvas
fileInput.addEventListener('change', (e) => {
    // Grab the first File object from FileList
    const imageFile = e.target.files[0];
    if (imageFile) {
        const imageURL = URL.createObjectURL(imageFile);
        const img = new Image();
        img.src = imageURL;
        img.onload = () => {
            // todo: instead of using images natural width and height, scale so that max(width, height) is
            // below some threshold.
            previewCanvas.width = img.width;
            previewCanvas.height = img.height;
            previewCtx.drawImage(img, 0, 0);
            // todo: add full size image into offscreen canvas, then call URL.revokeObjectURL(imageURL) to clean up
            const map = mapGrayscaleToGradient(rgbDark, rgbLight);
            const imageData = previewCtx.getImageData(0, 0, img.width, img.height);
            console.log(imageData);
            
            const pixelArray = imageData.data;
            // Each four elements in the pixelArray represent the RGBA values of a single pixel.
            // So, to process one pixel at a time, we move in increments of 4, accessing the rgb values
            // relative to the current index (red = idx, green = idx + 1, blue = idx + 2).
            
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
                //console.log([ red, green, blue ]);
            }
            
            previewCtx.putImageData(imageData, 0, 0);
            const end = performance.now();
            console.log(`Time to process all pixels: ${end - start}ms`);
        };
    }
    
 });




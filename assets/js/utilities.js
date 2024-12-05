/**
 * Takes red, green, and blue values and returns a hex string representation.
 * @param {number} r - red value
 * @param {number} g - green value
 * @param {number} b - blue value
 * @returns hex string representation of rgb values
 */
export function rgbToHex(r, g, b) {
    // (1 << 24) added to ensure that resulting number has enough bits. The resulting
    // leading 1 is then removed with slice(1) to give the correct hex value.
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Takes a hex string and returns an array of red, green, and blue values.
 * @param {string} hex - hex representation of color 
 * @returns {number[]} - red, green, and blue values in an array
 */
export function hexToRgb(hex) {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

/**
 * Takes red, green, and blue values and returns a corresponding grayscale value.
 * @param {number} r - red value 
 * @param {number} g - green value
 * @param {number} b - blue value
 * @returns {number} - grayscale value
 */
export function rgbToGrayscale(r, g, b) {
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

/**
 * Creates an array of [r,g,b] color values used to map grayscale values to a gradient.
 * @param {number[]} rgbDark - rgb values for dark end of gradient 
 * @param {number[]} rgbLight - rgb values for light end of gradient 
 * @returns {number[][]} - array of rgb values
 */
export function mapGrayscaleToGradient(rgbDark, rgbLight) {
    const gradient = [];
    for (let i = 0; i < 256; i++) {
        const r = Math.round(rgbDark[0] + ( (rgbLight[0] - rgbDark[0]) * (i / 255) ) );
        const g = Math.round(rgbDark[1] + ( (rgbLight[1] - rgbDark[1]) * (i / 255) ) );
        const b = Math.round(rgbDark[2] + ( (rgbLight[2] - rgbDark[2]) * (i / 255) ));
        gradient.push([r, g, b]);
    }
    return gradient;
}

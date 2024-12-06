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

export const colorPresets = [
    { name: "Sunset Glow", darker: [88, 24, 69], lighter: [255, 176, 59] },
    { name: "Ocean Wave", darker: [0, 48, 73], lighter: [137, 196, 244] },
    { name: "Midnight", darker: [12, 12, 48], lighter: [102, 126, 234] },
    { name: "Forest Retreat", darker: [25, 51, 33], lighter: [152, 203, 137] },
    { name: "Autumn Blaze", darker: [97, 37, 21], lighter: [255, 122, 89] },
    { name: "Candyfloss", darker: [73, 24, 104], lighter: [255, 153, 240] },
    { name: "Retro Vibe", darker: [48, 33, 33], lighter: [255, 209, 102] },
    { name: "Citrus Punch", darker: [55, 41, 7], lighter: [247, 183, 51] },
    { name: "Icy Blue", darker: [15, 48, 87], lighter: [180, 228, 255] },
    { name: "Crimson Rose", darker: [79, 14, 14], lighter: [255, 102, 102] },
    { name: "Golden Hour", darker: [61, 40, 1], lighter: [255, 204, 112] },
    { name: "Lavender Dreams", darker: [47, 36, 74], lighter: [203, 153, 255] },
    { name: "Tropical Paradise", darker: [7, 48, 46], lighter: [122, 237, 201] },
    { name: "Frosted Berry", darker: [63, 14, 34], lighter: [255, 153, 204] },
    { name: "Smoky Charcoal", darker: [33, 33, 33], lighter: [200, 200, 200] },
    { name: "Sunrise Sky", darker: [73, 0, 106], lighter: [255, 200, 124] },
    { name: "Electric Neon", darker: [10, 10, 55], lighter: [102, 255, 102] },
    { name: "Peach Sorbet", darker: [112, 28, 60], lighter: [255, 177, 153] },
    { name: "Velvet Night", darker: [14, 0, 38], lighter: [131, 77, 232] },
    { name: "Golden Forest", darker: [35, 30, 13], lighter: [184, 198, 115] }
];

import { extractDominantColorsWu } from './wu/index.js';
import { extractDominantColorsKMeans } from './kmeans/index.js';
import { extractDominantColorsCelebi } from './celebi/index.js';
import { floatArrayToHex } from './utils/color_utils.js';

/**
 * Extracts dominant colors from an image source using WebGPU API with Wu algorithm.
 * @param {ImageBitmapSource} imageSource - The image source to process.
 * @param {number} colorCount - The number of colors to extract.
 * @returns {Array} An array of dominant colors.
 */
export {
    extractDominantColorsWu,
};

/**
 * Extracts dominant colors from an image source using WebGPU API with K-Means algorithm.
 * @param {ImageBitmapSource} imageSource - The image source to process.
 * @param {number} colorCount - The number of colors to extract.
 * @returns {Array} An array of dominant colors.
 */
export {
    extractDominantColorsKMeans,
};

/**
 * Extracts dominant colors from an image source using WebGPU API with Celebi algorithm.
 * @param {ImageBitmapSource} imageSource - The image source to process.
 * @param {number} colorCount - The number of colors to extract.
 * @returns {Array} An array of dominant colors.
 */
export {
    extractDominantColorsCelebi,
};

/**
 * Converts a float array to a hex color string.
 * @param {Float32Array} floatArray - The float array to convert.
 * @returns {string} The hex color string.
 */
export {
    floatArrayToHex,
};

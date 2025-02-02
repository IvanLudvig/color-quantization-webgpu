[![Published on NPM](https://img.shields.io/npm/v/image-palette-webgpu.svg)](https://npmjs.com/package/image-palette-webgpu)

A tiny zero-dependency browser package that extracts dominant color or color palette from an image using WebGPU API with various algorithms.

# Live demo

https://ivanludvig.github.io/color-quantization-webgpu/

# Install

```sh
npm i image-palette-webgpu
```

# Import

## Local

### JS

```js
import {
  extractDominantColorsWu,
  extractDominantColorsKMeans,
  extractDominantColorsCelebi,
  floatArrayToHex
} from './node_modules/image-palette-webgpu/index.js';
```

### HTML

```html
<script type="module">
  import {
    extractDominantColorsWu,
    extractDominantColorsKMeans,
    extractDominantColorsCelebi,
    floatArrayToHex
  } from './node_modules/image-palette-webgpu/index.js';
</script>
```

### Import maps

```html
<script type="importmap">
  {
    "imports": {
      "image-palette-webgpu": "./node_modules/image-palette-webgpu/index.js",
      "image-palette-webgpu/wu": "./node_modules/image-palette-webgpu/wu/index.js",
      "image-palette-webgpu/kmeans": "./node_modules/image-palette-webgpu/kmeans/index.js",
      "image-palette-webgpu/celebi": "./node_modules/image-palette-webgpu/celebi/index.js",
      "image-palette-webgpu/utils": "./node_modules/image-palette-webgpu/utils/color_utils.js"
    }
  }
</script>
```

#### JS

```js
// Always prefer importing individual exports

import { extractDominantColorsWu } from 'image-palette-webgpu/wu';
import { extractDominantColorsKMeans } from 'image-palette-webgpu/wu';
import { extractDominantColorsCelebi } from 'image-palette-webgpu/wu';
import { floatArrayToHex } from 'image-palette-webgpu/wu';

// Only if you have three-shaking

import {
  extractDominantColorsWu,
  extractDominantColorsKMeans,
  extractDominantColorsCelebi,
  floatArrayToHex
} from 'image-palette-webgpu';
```

#### HTML

### Dev Servers / Builders

#### JS
#### HTML

### CDN

#### UNPKG
##### JS
##### HTML

#### ESM CDN
##### JS
##### HTML

#### Skypack
##### JS
##### HTML

# Use

## HTML

## JS

```js
const image = new Image();
image.src = './image.png';
const colorsCount = 5;
const dominantColors = await extractDominantColorsCelebi(image, colorsCount);
console.log(dominantColors); // ['#d65a58', '#c84c52', '#d65a59', '#bb464b', '#e3dbaa']
```

<h1 align="center">hugo-lunr-ml</h1>
<p align="center">Package for multilingual (or not) hugo site</p>
<p align="center">Generates <b>ready to use</b> by lunr.js `lunr-index.json` file.</p>

<p align="center">
  <img src="https://github.com/romankurnovskii/hugo-lunr-ml/raw/main/img/hugo-lunr-ml.png" alt="Hugo Lunr Multilanguage package">
</p>

[![NPM version][npm-image]][npm-url]
![npm-typescript]
[![License][github-license]][github-license-url]
[![Install size][install-size]][install-size-url]


`hugo-lunr-ml` npm package designed to enhance your Hugo site with powerful, multilingual search capabilities. This package automatically generates a `lunr-index.json` file that is ready to integrate with lunr.js, providing a seamless search experience for your Hugo site, whether it's multilingual or not.

## Quick Start

```sh
npx hugo-lunr-ml -i content/ -o static/search/index.json -l en
```

## CLI Usage Examples

- Generate index for default language:
  ```sh
  npx hugo-lunr-ml -l en
  ```
- Specify input/output:
  ```sh
  npx hugo-lunr-ml -i content/posts -o static/search/index.json
  ```

## Troubleshooting
- Ensure your content directory exists and contains markdown or HTML files.
- If you see permission errors, check your output directory permissions.

## Contributing
Pull requests are welcome! Please open an issue first to discuss major changes.

## Features
- **Multilingual Support**: Generate search indexes in multiple languages for your Hugo site.
- **Easy Integration**: Directly integrates with lunr.js for a powerful search experience.
- **Customizable**: Offers options for custom input paths, output paths, and default languages to fit your site's structure.

## Getting Started

### Installation

Install the hugo-lunr-ml utility via [npm](https://www.npmjs.com/package/hugo-lunr-ml):

```
npm install hugo-lunr-ml
```
### Adding to Your Project

Add the following scripts to your `package.json` file. This script simplifies the generation of your search index.

**package.json**
```json
  "scripts": {
    "create-index": "hugo-lunr-ml"
  },
```

**Configuration Options**

`hugo-lunr-ml` can be customized through various command-line options to suit your project's needs:

- `-i`: Set the input path to parse (default: `content/**`)
- `-o`: Set the output path for the index file (default: `/static/search/index.json`)
- `-l`: Set the default language. Utilizes language codes (e.g., [`.en`, `.ru`, etc] in the `index.json` (default: system language) )
- `-ol`: Set the output path for the lunr index file (default: `/static/seacrh/lunr-index.json`)

### Generating the Index

To generate your site's search index, execute the npm script you've added:

```sh
npm run create-index
```

### Integrating with lunr.js

After generating the `lunr-index.json`, you can easily integrate it with lunr.js by either installing lunr via npm:

```sh
npm install lunr
```

or including lunr.js in your Hugo template:

```html
<script src="https://unpkg.com/lunr/lunr.js"></script>
```

Use the following JavaScript snippet to fetch and utilize the `lunr-index.json` for search:

```js
let pagesStore = {}; // Mapping for titles and URIs, e.g., {"/local-href": "post title"}
const getIndexData = async () => {
  let response = await fetch(`/search/lunr-index.json`);
  if (response.status !== 200) {
    throw new Error("Server Error");
  }
  let textData = await response.text();
  const idxData = JSON.parse(textData);
  const lngIdx = idxData[languageMode];
  const idx = lunr.Index.load(lngIdx);
  pagesStore = idxData['contentMap'][languageMode];
  return idx;
}

const idx = await getIndexData();
const results = idx.search('my search query');

// Example: Retrieve the first found page title
const foundUri = results[0].ref;
const foundPageTitle = pagesStore[foundUri];
```

[npm-url]: https://www.npmjs.com/package/hugo-lunr-ml
[npm-image]: https://img.shields.io/npm/v/hugo-lunr-ml
[github-license]: https://img.shields.io/github/license/romankurnovskii/hugo-lunr-ml
[github-license-url]: https://github.com/romankurnovskii/hugo-lunr-ml/blob/main/LICENSE
[npm-typescript]: https://img.shields.io/npm/types/hugo-lunr-ml
[install-size]: https://packagephobia.com/badge?p=hugo-lunr-ml
[install-size-url]: https://packagephobia.com/result?p=hugo-lunr-ml

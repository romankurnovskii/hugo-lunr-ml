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

## Installation

Install the hugo-lunr-ml utility via [npm](https://www.npmjs.com/package/hugo-lunr-ml):

```
$ npm install hugo-lunr-ml
```

## Usage

The easiest way to use hugo-lunr is via npm scripts:

**package.json**
```json
  "scripts": {
    "create-index": "hugo-lunr-ml",
    "create-index-io": "hugo-lunr-ml -i "content/**" -o static/my-index.json"
  },
```

### Options

By default module will read the `content` directory of you and output the lunr index to `lunr-index.json`. 

```
-i  set input path to parse (default: content/**)
-o  set output index file path (default: /static/seacrh/index.json')
-l  set default language. Will use this code ( [.en, .ru etc] in the index.json(default: system language) )
-ol  set output lunr index file path (default: /static/seacrh/lunr-index.json')
```

### Execute

```sh
$ npm run create-index
```


**Example of result `lunr-index.json` file:**

```json
{
  "ru": { ...some lunr staff... },
  "en": { ...some lunr staff... },
  "contentMap": {
    "ru": { "/posts/post-sub01": "Test post 01 Ru" },
    "en": { "/posts/post-sub01": "Test post 01 Eng" }
  }
}
```

**Example of result `index.json` file:**

```json
{
    "ru": [
        {
            "uri": "/posts/post-1",
            "title": "Test post 01 Ru",
            "content": "\nTest post",
            "tags": [],
            "lang": "ru"
        },
        {
            "uri": "/posts/post-2",
            "title": "Test post 02 Ru",
            "content": "\nTest post",
            "tags": [],
            "lang": "ru"
        }
    ],
    "en": [
        {
            "uri": "/posts/post-1",
            "title": "Test post 01 Eng",
            "content": "\nTest post",
            "tags": [],
            "lang": "en"
        }
    ]
}
```

## How to connect with [lunr.js](https://lunrjs.com/)


1. Import/Fetch lunr-index.json
2. Search

How to use this `lunr-index.json` witn lunr.js

```sh
npm install lunr
```

or in the Hugo template:

```html
<script src="https://unpkg.com/lunr/lunr.js"></script>
```

```javascript
const pagesStore = {} // need to map later title and uri Ex: {"/local-href": "post title"}
const getIndexData = async () => {
	let response = await fetch(`/search/lunr-index.json`)
	if (response.status != 200) {
		throw new Error("Server Error");
	}
	// read response stream as text
	let text_data = await response.text();
	const idxData = JSON.parse(text_data)
	const lngIdx = idxData[languageMode]
	const idx = lunr.Index.load(lngIdx)
	pagesStore = idxData['contentMap'][languageMode]
	return idx
}

const idx = await getIndexData()
const results = idx.search('my search query');

// get first found page title
const foundUri = searchResultRu[0].ref;
const foundPageTitle = pagesStore[foundUri];
```




[npm-url]: https://www.npmjs.com/package/hugo-lunr-ml
[npm-image]: https://img.shields.io/npm/v/hugo-lunr-ml
[github-license]: https://img.shields.io/github/license/romankurnovskii/hugo-lunr-ml
[github-license-url]: https://github.com/romankurnovskii/hugo-lunr-ml/blob/main/LICENSE
[npm-typescript]: https://img.shields.io/npm/types/hugo-lunr-ml
[install-size]: https://packagephobia.com/badge?p=hugo-lunr-ml
[install-size-url]: https://packagephobia.com/result?p=hugo-lunr-ml

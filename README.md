<h1 align="center">hugo-lunr-ml</h1>
<p align="center">Package for multilingual or not hugo site</p>
<p align="center">Generates `search-index.json` file in the `public` folder. Ready to use by lunr.js</p>

<p align="center">
  <img src="https://github.com/romankurnovskii/hugo-lunr-ml/raw/main/img/hugo-lunr-ml.png" alt="Hugo Lunr Multilanguage package">
</p>

## Installation

Install the hugo-lunr-ml utility via [npm](https://www.npmjs.com/package/hugo-lunr-ml):

```
$ npm install hugo-lunr-ml
```

## Usage

The easiest way to use hugo-lunr is via npm scripts:

```
  "scripts": {
    "create-index": "hugo-lunr-ml",
    "create-index-io": "hugo-lunr-ml -i "content/**" -o public/my-index.json"
  },
```

### Options

By default module will read the `content` directory of you and output the lunr index to `search-index.json`. 

```
-i  set input path to parse (default: content/**)
-o  set output index file path (default: /public/search-index.json')
-l  set default language. Will use this code ( [.en, .ru etc] in the search-index.json(default: system language) )
```

### Execute

```
$ npm run create-index
```

**Example of result `.json` file:**
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

How to use this `.json` witn lunr.js

[How I use this index](https://romankurnovskii.com/en/posts/hugo-add-search-lunr-popup/#connect-searchresult-forms-with-lunrjs-search)

```javascript
npm install lunr
```

or in the Hugo template:

```html
<script src="https://unpkg.com/lunr/lunr.js"></script>
```

```javascript
const filePath = 'public/search-index.json'
const data = readFileSync(filePath);
const fileData = JSON.parse(data)
// fileData = { "en": [...], "otherLang": []}

const engDocs = fileData['en']
const ruDocs = fileData['ru']
// ...

// lunr.js index
let idxEng = lunr(function () {
  this.ref('name')
  this.field('text')

  engDocs.forEach(function (doc) {
    this.add(doc)
  }, this)
})
// same for other lang

// search
idxEng.search("my word request")
```

> Initial project was hugo-lunr, last time updated 6 years ago. Current package skips not needed files(images, etc) and creates separate index data for each language.
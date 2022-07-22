#!/usr/bin/env node
import { readFileSync } from 'fs'
import assert from 'assert'

import { OUTPUT_INDEX_FILE, HugoIndexer } from './index.js'

const index = new HugoIndexer()
index._setOutput(OUTPUT_INDEX_FILE)
index.createIndex()

const expected = {
    "ru": [
        {
            "uri": "/posts/post-sub01",
            "title": "Test post 01 Ru",
            "content": "\nTest post",
            "tags": [],
            "lang": "ru"
        }
    ],
    "en": [
        {
            "uri": "/posts/post-sub01",
            "title": "Test post 01 Eng",
            "content": "\nTest post",
            "tags": [],
            "lang": "en"
        }
    ]
}

setTimeout(() => {
    const data = readFileSync(OUTPUT_INDEX_FILE);
    const fileData = JSON.parse(data)
    assert.equal(JSON.stringify(fileData), JSON.stringify(expected))
}, 2000)


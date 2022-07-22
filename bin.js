#!/usr/bin/env node
import { HugoIndexer } from './index.js'

if (process.argv.indexOf("--help") != -1) {
    // help
    const help = `
Creates lunr index file for multilingual hugo static site

Usage:

    hugo-lunr-ml [arguments]
    or
    ./module_path/index.js

Arguments:

    -i  set input path to parse (default: content/**)
    -o  set output index file path (default: /public/search-index.json')
    -l  set default language. will use this code ([.en, .ru etc] in the search json) (default: ru)
`
    console.log(help)
} else {
    new HugoIndexer().createIndex()
}



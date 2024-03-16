#!/usr/bin/env node
import process from 'node:process';
import {HugoIndexer} from './index.js';

const help = `
Creates lunr index file for multilingual hugo static site

Usage:

    hugo-lunr-ml [arguments]
    or
    ./module_path/index.js

Arguments:

    -i  set input path to parse (default: content/**)
    -o  set output index file path (default: /static/search/index.json')
    -ol set output lunr index file path (default: /static/search/lunr-index.json')
    -l  set default language. will use this code ([.en, .ru etc] in the search json) (default: ru)
`;

if (process.argv.includes('--help')) {
	console.info(help);
} else {
	new HugoIndexer().createIndex();
}
